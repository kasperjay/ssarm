#!/usr/bin/env node
/**
 * send-messages.js — Message Send & Delivery Agent
 *
 * Finds MessageDraft records marked selected=true with no MESSAGE_SENT activity
 * and delivers them via IG DM webhook (for IG drafts).
 *
 * CLI flags:
 *   --dry-run          Preview without sending
 *   --list             Print pending queue as a compact table, then exit
 *   --limit N          Process at most N leads (default: all)
 *   --channel ig       Only send IG drafts (default)
 *   --channel email    Only send email drafts (not yet implemented)
 *   --channel all      Both channels
 *   --force            Re-send even if MESSAGE_SENT activity already exists
 */

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
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const rawValue = trimmed.slice(idx + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
    }
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/* ─── CLI args ──────────────────────────────────────────────── */
const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const LIST = args.includes("--list");
const FORCE = args.includes("--force");
const limitIdx = args.indexOf("--limit");
const LIMIT = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : Infinity;
const channelIdx = args.indexOf("--channel");
const CHANNEL = channelIdx !== -1 ? args[channelIdx + 1] : "ig";

/* ─── Config ────────────────────────────────────────────────── */
const WEBHOOK_URL = process.env.IG_DM_WEBHOOK_URL || "";
const WEBHOOK_SECRET = process.env.IG_DM_WEBHOOK_SECRET || "";
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT || "12", 10);
const FOLLOW_UP_DAYS = parseInt(process.env.FOLLOW_UP_DAYS || "7", 10);

/* ─── Color helpers ─────────────────────────────────────────── */
const green = "\x1b[32m";
const red = "\x1b[31m";
const yellow = "\x1b[33m";
const cyan = "\x1b[36m";
const grey = "\x1b[90m";
const bold = "\x1b[1m";
const reset = "\x1b[0m";
const dim = "\x1b[2m";

const log = (msg) => console.log(msg);
const ok = (msg) => log(`${green}✔${reset}  ${msg}`);
const warn = (msg) => log(`${yellow}⚠${reset}  ${msg}`);
const fail = (msg) => log(`${red}✖${reset}  ${msg}`);
const info = (msg) => log(`${cyan}ℹ${reset}  ${msg}`);
const dimLog = (msg) => log(`${grey}${msg}${reset}`);

/* ─── Helpers ───────────────────────────────────────────────── */
function getFollowUpDate() {
  if (!FOLLOW_UP_DAYS || FOLLOW_UP_DAYS <= 0) return undefined;
  const d = new Date();
  d.setDate(d.getDate() + FOLLOW_UP_DAYS);
  return d;
}

function isEmailTone(tone) {
  if (!tone) return false;
  return tone.toLowerCase().startsWith("email");
}

async function postToWebhook(lead, draft) {
  if (!WEBHOOK_URL) throw new Error("IG_DM_WEBHOOK_URL is not set in .env");

  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(WEBHOOK_SECRET ? { "X-Webhook-Secret": WEBHOOK_SECRET } : {}),
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
        source: draft.tone || "sent",
      },
      followUpAt: getFollowUpDate()?.toISOString() ?? null,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Webhook ${response.status}: ${text.slice(0, 200)}`);
  }

  return await response.json();
}

async function recordSuccess(lead, draft) {
  const nextActionAt = getFollowUpDate();
  await prisma.$transaction([
    prisma.lead.update({
      where: { id: lead.id },
      data: { status: "CONTACTED", lastContactedAt: new Date(), nextActionAt },
    }),
    prisma.activity.create({
      data: { leadId: lead.id, type: "MESSAGE_SENT", note: draft.body },
    }),
    prisma.messageDraft.update({
      where: { id: draft.id },
      data: { source: "sent" },
    }),
  ]);
}

/* ─── Main ──────────────────────────────────────────────────── */
async function main() {
  log("");
  log(`${bold}📤 Message Send & Delivery Agent${reset}`);
  log(`${dim}Mode: ${DRY_RUN ? "DRY RUN" : LIST ? "LIST" : "LIVE"} | Channel: ${CHANNEL} | Limit: ${LIMIT === Infinity ? "all" : LIMIT} | Force: ${FORCE}${reset}`);
  log("");

  if (!DRY_RUN && !LIST && CHANNEL !== "email" && !WEBHOOK_URL) {
    fail("IG_DM_WEBHOOK_URL is not set. Cannot send IG DMs.");
    fail("Set IG_DM_WEBHOOK_URL in .env, or use --dry-run.");
    process.exit(1);
  }

  const leads = await prisma.lead.findMany({
    where: { messages: { some: { selected: true } } },
    include: {
      artist: true,
      messages: { where: { selected: true }, orderBy: { createdAt: "desc" } },
      activities: {
        where: { type: "MESSAGE_SENT" },
        orderBy: { occurredAt: "desc" },
        take: 1,
      },
    },
  });

  const toSend = leads.filter((lead) => FORCE || lead.activities.length === 0);

  if (toSend.length === 0) {
    info("No pending messages found.");
    info("All selected drafts already have a MESSAGE_SENT activity.");
    info("Use --force to re-send anyway.");
    return;
  }

  info(`Found ${toSend.length} lead(s) with unsent selected drafts.`);
  log("");

  // --list: compact table view, then exit
  if (LIST) {
    const col = (s, w) => String(s ?? "").slice(0, w).padEnd(w);
    log(`${bold}${col("Artist", 24)} ${col("Handle", 22)} ${col("Tone", 14)} Preview${reset}`);
    log("─".repeat(92));
    for (const lead of toSend) {
      const draft = lead.messages[0];
      if (!draft) continue;
      const handle = lead.artist.instagramHandle ? `@${lead.artist.instagramHandle}` : "—";
      const preview = draft.body.replace(/\n/g, " ").slice(0, 38);
      log(`${col(lead.artist.name, 24)} ${grey}${col(handle, 22)}${reset} ${cyan}${col(draft.tone || "—", 14)}${reset} ${dim}${preview}…${reset}`);
    }
    log("");
    info(`${toSend.length} draft(s) pending.  Run without --list to send.`);
    return;
  }

  // Separate by channel
  const igQueue = [];
  const emailQueue = [];
  for (const lead of toSend) {
    const draft = lead.messages[0];
    if (!draft) continue;
    (isEmailTone(draft.tone) ? emailQueue : igQueue).push({ lead, draft });
  }

  const toProcess = [];
  if (CHANNEL === "ig" || CHANNEL === "all") toProcess.push(...igQueue);
  if (CHANNEL === "email" || CHANNEL === "all") toProcess.push(...emailQueue);

  const sliced = LIMIT < Infinity ? toProcess.slice(0, LIMIT) : toProcess;

  if (sliced.length === 0) {
    info(`No drafts match channel filter: ${CHANNEL}`);
    return;
  }

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  log("─".repeat(72));

  for (const { lead, draft } of sliced) {
    const handle = lead.artist.instagramHandle ? `@${lead.artist.instagramHandle}` : "(no handle)";
    const channel = isEmailTone(draft.tone) ? "📧 email" : "📱 IG DM";

    log(`${bold}${lead.artist.name}${reset}  ${grey}${handle}${reset}  ${dim}[${draft.tone || "no tone"}]${reset}`);
    log(`  ${channel}`);
    dimLog(`  ${draft.body.slice(0, 120).replace(/\n/g, " ")}…`);

    if (sent >= DAILY_LIMIT) {
      warn(`Daily send limit (${DAILY_LIMIT}) reached. Stopping.`);
      skipped++;
      log("");
      continue;
    }

    if (DRY_RUN) {
      dimLog("  [DRY RUN — would send]");
      log("");
      continue;
    }

    if (isEmailTone(draft.tone)) {
      warn("  Email send not yet implemented. Skipping.");
      skipped++;
      log("");
      continue;
    }

    if (!lead.artist.instagramHandle) {
      warn("  Skipped — no Instagram handle on record.");
      skipped++;
      log("");
      continue;
    }

    try {
      await postToWebhook(lead, draft);
      await recordSuccess(lead, draft);
      ok("  Queued via IG DM webhook ✓");
      sent++;
    } catch (e) {
      fail(`  Failed: ${e.message}`);
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: "NOTE",
          note: `Auto-send failed (IG DM): ${e.message.slice(0, 200)}`,
        },
      });
      failed++;
    }

    log("");
  }

  log("─".repeat(72));
  log(`${bold}Summary${reset}`);
  if (DRY_RUN) {
    info(`${sliced.length} draft(s) would be sent (dry run — no changes made).`);
  } else {
    if (sent > 0) ok(`${sent} message(s) queued for delivery.`);
    if (failed > 0) fail(`${failed} message(s) failed.`);
    if (skipped > 0) warn(`${skipped} message(s) skipped.`);
    if (igQueue.length > 0 && CHANNEL !== "email") {
      log("");
      info(`IG DM bot server must be running at: ${WEBHOOK_URL || "(IG_DM_WEBHOOK_URL not set)"}`);
      info(`Start it with:  cd integrations/ig-dm-bot && npm start`);
    }
  }
  log("");
}

main()
  .catch((e) => {
    console.error("Fatal error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
