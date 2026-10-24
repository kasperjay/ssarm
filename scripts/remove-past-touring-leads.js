#!/usr/bin/env node

/**
 * scripts/remove-past-touring-leads.js
 *
 * Audits all active leads in the database and removes non-local artists whose
 * gigs in Austin have already been played from the lead queue (marking them PAUSED).
 *
 * Usage:
 *   node scripts/remove-past-touring-leads.js --dry-run
 *   node scripts/remove-past-touring-leads.js --live
 */

const fs = require("fs");
const path = require("path");

// Load .env before initializing DB connection
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
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
    }
  }
}

const { withAgentRun, prisma, pool } = require("../src/lib/agent-runner");
const { isNonLocalWithPastGigOnly } = require("../src/lib/show-parser");

const args = process.argv.slice(2);
const isLive = args.includes("--live");
const isDryRun = !isLive || args.includes("--dry-run");

async function main() {
  console.log("=== Remove Past Touring Leads Agent ===");
  console.log(`Execution Mode: ${isDryRun ? "DRY RUN (No changes will be written)" : "LIVE (Writing to Database)"}\n`);

  const now = new Date();
  const leads = await prisma.lead.findMany({
    where: {
      status: { notIn: ["WON", "LOST", "PAUSED"] },
    },
    include: {
      artist: true,
      activities: {
        select: { type: true, note: true },
        orderBy: { occurredAt: "desc" },
      },
    },
  });

  console.log(`Checking ${leads.length} active leads...`);

  let removedCount = 0;
  const removedDetails = [];

  for (const lead of leads) {
    if (isNonLocalWithPastGigOnly(lead, now)) {
      removedCount++;
      removedDetails.push({
        id: lead.id,
        artist: lead.artist.name,
        location: lead.artist.city || lead.artist.location || "Non-local",
        oldStatus: lead.status,
      });

      if (!isDryRun) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: { status: "PAUSED" },
        });

        await prisma.activity.create({
          data: {
            leadId: lead.id,
            type: "NOTE",
            note: "[AUTO-PAUSE] Non-local artist whose Austin gigs have already been played. Removed from lead queue.",
          },
        });
      }
    }
  }

  console.log();
  console.log(`Found ${removedCount} non-local leads whose Austin gigs have already been played.`);

  if (removedDetails.length > 0) {
    console.log("\nSample removed leads (first 10):");
    removedDetails.slice(0, 10).forEach((item) => {
      console.log(`  - ${item.artist} (${item.location}) [${item.oldStatus} -> PAUSED]`);
    });
  }

  if (isDryRun && removedCount > 0) {
    console.log("\nDRY RUN: Run with --live to pause these leads and remove them from active queues.");
  } else if (!isDryRun) {
    console.log(`\nLIVE: Successfully removed ${removedCount} leads from the lead queue.`);
  }

  return { checked: leads.length, removed: removedCount, isDryRun };
}

withAgentRun("remove-past-touring-leads", { dryRun: isDryRun }, main)
  .catch((err) => {
    console.error("Fatal error:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
