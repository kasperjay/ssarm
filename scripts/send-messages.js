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

  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  // 1. Find leads with selected drafts that don't have a MESSAGE_SENT activity
  // Added safety: Only pick up drafts created in the last 14 days to prevent ancient accidental sends
  const leads = await prisma.lead.findMany({
    where: {
      messages: { 
        some: { 
          selected: true,
          createdAt: { gte: fourteenDaysAgo } 
        } 
      },
      // Must be NEW or QUALIFIED to be eligible
      status: { in: ["NEW", "QUALIFIED"] },
      // AND must NOT have a MESSAGE_SENT activity already
      activities: { none: { type: "MESSAGE_SENT" } }
    },
    include: {
      artist: true,
      messages: { 
        where: { 
          selected: true,
          createdAt: { gte: fourteenDaysAgo }
        }, 
        orderBy: { createdAt: 'desc' }, 
        take: 1 
      }
    },
    take: Math.min(CONFIG.limit, CONFIG.dailyLimit)
  });

  console.log(`ℹ️ Found ${leads.length} leads eligible for delivery.`);

  let sentCount = 0;

  for (const lead of leads) {
    const draft = lead.messages[0];
    if (!draft) continue;

    // Final Safety Guard: Double check activities one last time before hitting the trigger
    const sentCheck = await prisma.activity.findFirst({
      where: {
        leadId: lead.id,
        type: "MESSAGE_SENT"
      }
    });

    if (sentCheck) {
      console.log(`⚠️ SKIP: Lead ${lead.artist.name} already has a MESSAGE_SENT activity. Cleaning up draft...`);
      await prisma.messageDraft.update({
        where: { id: draft.id },
        data: { selected: false }
      });
      continue;
    }

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
    const subject = `Inquiry regarding ${lead.artist.name}`;
    await sendEmail(to, subject, draft.body);
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

  // 1. Mark draft as no longer selected (Send Guard)
  await prisma.messageDraft.update({
    where: { id: draft.id },
    data: { selected: false }
  });

  // 2. Update lead status
  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      status: "CONTACTED",
      lastContactedAt: new Date(),
      nextActionAt
    }
  });

  // 3. Log activity
  await prisma.activity.create({
    data: {
      leadId: lead.id,
      type: "MESSAGE_SENT",
      note: `Sent via ${channel} (${provider}):\n\n${draft.body}`
    }
  });

  // 4. Log to Google Sheets (if configured)
  await logToGoogleSheets(lead, draft, channel, draft.body);

  console.log(`✅ Recorded success and deselected draft ${draft.id}`);
}

async function logToGoogleSheets(lead, draft, channel, messageText) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log("⚠️ GOOGLE_SHEETS_WEBHOOK_URL not configured - skipping sheet log");
    return;
  }

  try {
    // Map to your 13-column sheet structure:
    // 1. Artist Contacted, 2. Contact Name, 3. Phone, 4. Social Media, 
    // 5. Email, 6. Website, 7. Responded, 8. Booked, 9. Recorded, 
    // 10. Client, 11. Money Made, 12. Notes, 13. Date Contacted
    
    const row = [
      lead.artist.name || "",                    // 1. Artist Contacted
      lead.artist.contactName || "",             // 2. Contact Name
      lead.artist.phone || "",                   // 3. Phone
      lead.artist.instagramHandle || "",         // 4. Social Media (IG handle)
      lead.emails?.[0]?.email || "",             // 5. Email (first email)
      lead.artist.website || "",                 // 6. Website
      "FALSE",                                   // 7. Responded (default false)
      "FALSE",                                   // 8. Booked (default false)
      "FALSE",                                   // 9. Recorded (default false)
      "FALSE",                                   // 10. Client (default false)
      "",                                        // 11. Money Made (empty)
      `Sent via ${channel}: ${messageText}`,     // 12. Notes (includes full message)
      new Date().toISOString().split('T')[0]     // 13. Date Contacted (YYYY-MM-DD)
    ];

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        action: "appendRow",
        values: JSON.stringify(row)
      })
    });

    if (!response.ok) {
      throw new Error(`Sheet log failed: ${response.status} ${response.statusText}`);
    }

    console.log("📊 Logged to Google Sheets");
  } catch (err) {
    console.error(`❌ Failed to log to Google Sheets: ${err.message}`);
    // Don't fail the whole send if sheet logging fails
  }
}

withAgentRun("send-messages", { dryRun: CONFIG.dryRun }, main)
  .catch(err => console.error("Fatal Error:", err))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
