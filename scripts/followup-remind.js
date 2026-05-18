#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../src/generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Load .env
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) {
      const value = rawValue.replace(/^['"]|['"]$/g, "");
      process.env[key] = value;
    }
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Configuration
const FOLLOW_UP_DAYS = parseInt(process.env.FOLLOW_UP_DAYS || "7", 10);
const ESCALATION_DAYS = 14;
const ACTIVE_STATUSES = ["CONTACTED", "FOLLOW_UP"];

function suggestTone(daysSinceContact) {
  if (daysSinceContact <= 3) return "warm";
  if (daysSinceContact <= 7) return "check-in";
  if (daysSinceContact <= 14) return "escalation";
  return "final-attempt";
}

async function checkDuplicateOutreach(leadId, daysSinceContact = 1) {
  // Check if we've already sent a message in the last N days
  const recentMessages = await prisma.activity.findMany({
    where: {
      leadId,
      type: "MESSAGE_SENT",
      occurredAt: {
        gte: new Date(Date.now() - daysSinceContact * 24 * 60 * 60 * 1000),
      },
    },
  });

  return recentMessages.length > 0;
}

async function analyzeFollowUpCandidates() {
  // Find leads that are CONTACTED or FOLLOW_UP and have a nextActionAt in the past
  const candidates = await prisma.lead.findMany({
    where: {
      status: { in: ACTIVE_STATUSES },
      nextActionAt: { lte: new Date() },
    },
    include: {
      artist: true,
      activities: {
        where: { type: "MESSAGE_SENT" },
        orderBy: { occurredAt: "desc" },
        take: 1,
      },
    },
    orderBy: { nextActionAt: "asc" },
  });

  const followUpItems = [];

  for (const lead of candidates) {
    const lastMessage = lead.activities[0];
    const daysSinceContact = lastMessage
      ? Math.floor((Date.now() - new Date(lastMessage.occurredAt).getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    // Check for duplicate outreach
    const isDuplicate = await checkDuplicateOutreach(lead.id, 1);

    if (!isDuplicate) {
      followUpItems.push({
        leadId: lead.id,
        artistName: lead.artist.name,
        lastContactedDaysAgo: daysSinceContact,
        tone: suggestTone(daysSinceContact),
        priority: daysSinceContact > ESCALATION_DAYS ? "high" : "normal",
        nextActionAt: lead.nextActionAt,
      });
    }
  }

  return followUpItems;
}

async function logFollowUpReminder(lead, tone, dryRun = false) {
  if (!dryRun) {
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: "NOTE",
        note: `[AUTO-REMINDER] Follow-up due. Suggested tone: ${tone}`,
      },
    });
  }
}

async function detectStatusTransitions(dryRun = false) {
  // Find leads that should transition based on time
  const transitions = [];

  // FOLLOW_UP → LOST if no activity for 30 days
  const staleFollowUps = await prisma.lead.findMany({
    where: {
      status: "FOLLOW_UP",
      lastContactedAt: {
        lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    },
    include: { artist: true },
  });

  for (const lead of staleFollowUps) {
    transitions.push({
      leadId: lead.id,
      artistName: lead.artist.name,
      from: "FOLLOW_UP",
      to: "LOST",
      reason: "No activity for 30 days",
    });

    if (!dryRun) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { status: "LOST" },
      });

      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: "STATUS_CHANGE",
          note: "[AUTO-TRANSITION] Status: FOLLOW_UP → LOST (no activity)",
        },
      });
    }
  }

  return transitions;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  console.log("🎯 Follow-Up Reminder & Sequencing Agent");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log();

  // Analyze follow-up candidates
  const followUpItems = await analyzeFollowUpCandidates();

  if (followUpItems.length === 0) {
    console.log("✓ No follow-ups due");
  } else {
    console.log(`📋 Follow-ups Due: ${followUpItems.length}`);
    console.log();

    const highPriority = followUpItems.filter(i => i.priority === "high");
    const normal = followUpItems.filter(i => i.priority === "normal");

    if (highPriority.length > 0) {
      console.log(`⚠️  HIGH PRIORITY (${highPriority.length}):`);
      highPriority.slice(0, 3).forEach(item => {
        console.log(`   ${item.artistName} - ${item.lastContactedDaysAgo}d ago → ${item.tone}`);
      });
      console.log();
    }

    if (normal.length > 0) {
      console.log(`📨 NORMAL (${normal.length}):`);
      normal.slice(0, 3).forEach(item => {
        console.log(`   ${item.artistName} - ${item.lastContactedDaysAgo}d ago → ${item.tone}`);
      });
      console.log();
    }

    // Log reminders
    for (const item of followUpItems) {
      const lead = await prisma.lead.findUnique({
        where: { id: item.leadId },
        include: { artist: true },
      });
      await logFollowUpReminder(lead, item.tone, dryRun);
    }
  }

  // Check for status transitions
  const transitions = await detectStatusTransitions(dryRun);

  if (transitions.length > 0) {
    console.log("↪️  Status Transitions:");
    transitions.forEach(t => {
      console.log(`   ${t.artistName}: ${t.from} → ${t.to} (${t.reason})`);
    });
  }

  console.log();
  console.log("📊 Summary:");
  console.log(`  Follow-ups due: ${followUpItems.length}`);
  console.log(`  Status transitions: ${transitions.length}`);
  console.log(`  Duplicate checks: passed`);

  if (dryRun) {
    console.log();
    console.log("⚠️  DRY RUN: No activities logged");
  }

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
