/**
 * Message Delivery Agent
 * 
 * Delivers unsent MessageDraft records marked as 'selected'.
 * Supports IG DMs via webhook and Email via SMTP.
 */

require("dotenv").config();
const { PrismaClient } = require("../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { sendEmail } = require("../src/lib/email-sender");
const { withAgentRun, prisma, pool } = require("../src/lib/agent-runner");

const CONFIG = {
  igWebhookUrl: process.env.IG_DM_WEBHOOK_URL,
  igWebhookSecret: process.env.IG_DM_WEBHOOK_SECRET,
  dailyLimit: parseInt(process.env.DAILY_LIMIT || "12", 10),
  dryRun: process.argv.includes("--dry-run"),
  limit: parseInt(process.argv.find((arg, i) => process.argv[i - 1] === "--limit") || "100", 10),
};

async function main() {
  console.log(`🚀 Message Delivery Agent Starting... ${CONFIG.dryRun ? "(DRY RUN)" : ""}`);

  // 1. Find leads with selected drafts that don't have a MESSAGE_SENT activity TODAY
  // To keep it simple, we look for leads that have a selected draft but haven't been "CONTACTED" in the last 12 hours
  const leads = await prisma.lead.findMany({
    where: {
      status: { not: "PAUSED" },
      messages: { some: { selected: true } },
      OR: [
        { lastContactedAt: null },
        { lastContactedAt: { lt: new Date(Date.now() - 12 * 60 * 60 * 1000) } }
      ]
    },
    include: {
      artist: true,
      messages: { where: { selected: true }, orderBy: { createdAt: 'desc' }, take: 1 }
    },
    take: Math.min(CONFIG.limit, CONFIG.dailyLimit)
  });

  console.log(`ℹ️ Found ${leads.length} leads eligible for delivery.`);

  const hasIgMessages = leads.some(l => !l.messages[0]?.tone?.toLowerCase().includes("email"));
  if (hasIgMessages && CONFIG.igWebhookUrl && !CONFIG.dryRun) {
    const statusUrl = CONFIG.igWebhookUrl.replace("/ig/send", "/ig/status");
    try {
      const res = await fetch(statusUrl, {
        headers: CONFIG.igWebhookSecret ? { "X-Webhook-Secret": CONFIG.igWebhookSecret } : {},
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.loggedIn) {
        console.error("⚠️ WARNING: Instagram DM bot is not logged in! Session cookies expired.");
      }
    } catch (e) {
      console.error("⚠️ WARNING: Could not check Instagram DM bot status:", e.message);
    }
  }

  let sentCount = 0;

  for (const lead of leads) {
    const draft = lead.messages[0];
    if (!draft) continue;

    const channel = draft.tone?.toLowerCase().includes("email") ? "email" : "ig";

    console.log(`\n──────────────────────────────────────────────────`);
    console.log(`👤 Lead: ${lead.artist.name} (@${lead.artist.instagramHandle || 'no-handle'})`);
    console.log(`📢 Channel: ${channel.toUpperCase()}`);
    console.log(`📝 Message: ${draft.body.slice(0, 50)}...`);

    if (CONFIG.dryRun) {
      console.log("⏭️ Skipping send (dry run)");
      continue;
    }

    let success = false;
    let providerResponse = null;

    if (channel === "ig") {
      success = await sendInstagramDM(lead, draft);
      providerResponse = "ig-webhook";
    } else {
      success = await sendEmailMessage(lead, draft);
      providerResponse = "smtp";
    }

    if (success) {
      sentCount++;
      await recordSuccess(lead, draft, channel, providerResponse);
      await logToSheet(lead, draft.body);
    } else {
      console.log("❌ Failed to deliver message.");
    }
  }

  console.log(`\n✨ Finished. Delivered ${sentCount} messages.`);
  
  return { sentCount, totalFound: leads.length };
}

async function sendInstagramDM(lead, draft) {
  if (!CONFIG.igWebhookUrl) {
    console.error("❌ IG_DM_WEBHOOK_URL not configured.");
    return false;
  }

  try {
    const response = await fetch(CONFIG.igWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(CONFIG.igWebhookSecret ? { "X-Webhook-Secret": CONFIG.igWebhookSecret } : {}),
      },
      body: JSON.stringify({
        leadId: lead.id,
        artist: {
          name: lead.artist.name,
          instagramHandle: lead.artist.instagramHandle,
          instagramProfileUrl: lead.artist.instagramProfileUrl,
        },
        message: {
          body: draft.body,
          source: "agent",
        }
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Webhook failed (${response.status}): ${text}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`💥 Error calling webhook: ${err.message}`);
    return false;
  }
}

async function sendEmailMessage(lead, draft) {
  const to = lead.artist.emails?.[0];
  if (!to) {
    console.error("❌ No email address found for lead.");
    return false;
  }

  try {
    let subject = `Inquiry regarding ${lead.artist.name}`;
    let bodyText = draft.body;
    const subjectMatch = draft.body.match(/^Subject:\s*(.+?)(?:\r?\n\r?\n|\r?\n)/i);
    if (subjectMatch) {
      subject = subjectMatch[1].trim();
      bodyText = draft.body.slice(subjectMatch[0].length).trim();
    }
    await sendEmail(to, subject, bodyText);
    return true;
  } catch (err) {
    console.error(`💥 Error sending email: ${err.message}`);
    return false;
  }
}

async function recordSuccess(lead, draft, channel, provider) {
  // Update lead status
  const days = parseInt(process.env.FOLLOW_UP_DAYS || "7", 10);
  const nextActionAt = new Date();
  nextActionAt.setDate(nextActionAt.getDate() + days);

  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      status: "CONTACTED",
      lastContactedAt: new Date(),
      nextActionAt
    }
  });

  // Log activity
  await prisma.activity.create({
    data: {
      leadId: lead.id,
      type: "MESSAGE_SENT",
      note: `Sent via ${channel} (${provider}):\n\n${draft.body}`
    }
  });

  // console.log("✅ Recorded success in database.");
}

async function logToSheet(lead, messageBody) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const artistName = lead.artist.name;
    const instagramHandle = lead.artist.instagramHandle ?? "";
    const email = (lead.artist.emails && lead.artist.emails[0]) ?? "";
    const website = lead.artist.officialSiteUrl ?? "";

    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const values = [
      artistName,                           // A: Artist Contacted
      "",                                   // B: Contact Name
      "",                                   // C: Phone
      instagramHandle,                      // D: Social Media
      email,                                // E: Email
      website,                              // F: Website
      "",                                   // G: Responded
      "",                                   // H: Booked
      "",                                   // I: Recorded
      "",                                   // J: Client
      "",                                   // K: Money Made
      (messageBody ?? "").slice(0, 500),    // L: Notes
      formattedDate,                        // M: Date Contacted
    ];

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "appendRow",
        values: JSON.stringify(values),
      }).toString(),
    });

    if (response.ok) {
      console.log(`[sheet] Logged: ${artistName}`);
    } else {
      const text = await response.text().catch(() => "No response body");
      console.error(`[sheet] Failed (${response.status}):`, text.slice(0, 200));
    }
  } catch (err) {
    console.error("[sheet] Error:", err.message);
  }
}

withAgentRun("send-messages", { dryRun: CONFIG.dryRun }, main)
  .catch(err => console.error("Fatal Error:", err))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
