import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

/**
 * IG DM Bot (Local Runner)
 * - LOGIN_MODE=true: manual login to refresh cookies
 * - Normal mode: reads IG_USERNAME + IG_MESSAGE and sends exactly 1 DM
 *
 * Required env:
 *   IG_USERNAME
 *   IG_MESSAGE
 *
 * Optional:
 *   HEADLESS=true/false
 *   DAILY_LIMIT, MIN_DELAY_SECONDS, MAX_JITTER_SECONDS
 */

const CONFIG = {
  loginMode: process.env.LOGIN_MODE === "true",
  headless: process.env.HEADLESS !== "false",
  maxWaitSeconds: Number(process.env.MAX_WAIT_SECONDS || 120),

  dailyLimit: Number(process.env.DAILY_LIMIT || 12),
  minDelaySeconds: Number(process.env.MIN_DELAY_SECONDS || 90),
  maxJitterSeconds: Number(process.env.MAX_JITTER_SECONDS || 90),

  dryRun: process.env.DRY_RUN === "true",

  igUsername: (process.env.IG_USERNAME || "").trim(),
  igMessage: (process.env.IG_MESSAGE || "").trim(),

  cookiesPath: "./data/cookies.json",
  statePath: "./data/state.json",
  logsDir: "./logs",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const cleanUsername = (u) => String(u || "").replace(/^@/, "").trim();
const cleanMessage = (m) => String(m || "").trim();

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* =========================
 * State Manager (lock + rate)
 * ========================= */
class StateManager {
  constructor(statePath) {
    this.statePath = statePath;
    this.state = null;
  }

  async load() {
    try {
      const data = await fs.readFile(this.statePath, "utf-8");
      this.state = JSON.parse(data);
    } catch {
      this.state = { dmCounts: {}, lastSent: 0, locks: {} };
    }
    return this.state;
  }

  async save() {
    await fs.mkdir(path.dirname(this.statePath), { recursive: true });
    await fs.writeFile(this.statePath, JSON.stringify(this.state, null, 2));
  }

  async acquireLock(lockKey, ttlMs = 5 * 60 * 1000) {
    await this.load();
    const now = Date.now();
    const existingMs = this.state.locks[lockKey] || 0;

    if (existingMs && now < existingMs) {
      const waitSec = Math.ceil((existingMs - now) / 1000);
      throw new Error(`Lock "${lockKey}" is active. Try again in ~${waitSec}s.`);
    }

    const expiresAt = now + ttlMs;
    this.state.locks[lockKey] = expiresAt;
    await this.save();
    return expiresAt;
  }

  async releaseLock(lockKey) {
    await this.load();
    this.state.locks[lockKey] = 0;
    await this.save();
  }

  async enforceRateLimit(dailyLimit, minDelaySeconds, maxJitterSeconds) {
    await this.load();
    const day = todayKey();
    const count = this.state.dmCounts[day] || 0;

    if (count >= dailyLimit) {
      throw new Error(
        `Daily DM limit reached (${count}/${dailyLimit}). Try again tomorrow.`
      );
    }

    const now = Date.now();
    const lastSent = this.state.lastSent || 0;

    const baseWaitMs = Math.max(0, minDelaySeconds * 1000 - (now - lastSent));
    const jitterMs = Math.floor(Math.random() * (maxJitterSeconds * 1000));
    const waitMs = baseWaitMs + jitterMs;

    if (waitMs > 0) {
      console.log(`⏳ Rate limit: waiting ${(waitMs / 1000).toFixed(1)}s`);
      await sleep(waitMs);
    }

    this.state.dmCounts[day] = count + 1;
    this.state.lastSent = Date.now();
    await this.save();
  }
}

/* =========================
 * Cookies
 * ========================= */
async function loadCookies(cookiesPath) {
  try {
    const data = await fs.readFile(cookiesPath, "utf-8");
    const cookies = JSON.parse(data);
    console.log(`✓ Loaded ${cookies.length} cookies`);
    return cookies;
  } catch {
    console.log("No saved cookies found.");
    return [];
  }
}

async function saveCookies(context, cookiesPath) {
  const cookies = await context.cookies();
  await fs.mkdir(path.dirname(cookiesPath), { recursive: true });
  await fs.writeFile(cookiesPath, JSON.stringify(cookies, null, 2));
  console.log(`✓ Saved ${cookies.length} cookies`);
  return cookies.length;
}

/* =========================
 * Modal-only popup dismissal
 * (DO NOT nuke DM search UI)
 * ========================= */
async function dismissModalPopups(page) {
  const labels = [
    "OK",
    "Ok",
    "Okay",
    "Not Now",
    "Not now",
    "Cancel",
    "Later",
    "Don't Allow",
    "Don't allow",
    "Allow all cookies",
    "Accept all",
    "Allow essential and optional cookies",
    "Save Info",
    "Save info",
    "Turn On",
    "Turn on",
    "Turn on notifications",
    "Turn On Notifications",
  ];

  const modalRoot = page.locator('[role="dialog"], div[aria-modal="true"]').first();
  if ((await modalRoot.count()) === 0) return;

  for (const name of labels) {
    try {
      const btn = modalRoot.getByRole("button", { name }).first();
      if (await btn.count()) {
        await btn.click({ timeout: 1500 }).catch(() => {});
        await page.waitForTimeout(250);
        console.log(`✓ Dismissed modal: ${name}`);
      }
    } catch {
      // ignore
    }
  }
}

async function dismissModalPopupsAggressive(page, attempts = 3) {
  for (let i = 0; i < attempts; i++) {
    await dismissModalPopups(page);
    await page.waitForTimeout(250);
  }
}

/* =========================
 * Login detection
 * ========================= */
async function waitForLoggedInSignal(page) {
  const deadline = Date.now() + 10 * 60 * 1000;
  console.log("⏳ Waiting for logged-in state (up to 10 minutes)...");

  while (Date.now() < deadline) {
    const url = page.url();
    const hasNav = (await page.locator("nav").count()) > 0;
    const hasDirectLink =
      (await page.locator('a[href*="/direct/"]').count()) > 0;
    const notOnLoginPage = !url.includes("/accounts/login");

    if (notOnLoginPage && hasNav && hasDirectLink) {
      console.log("✓ Detected logged-in state");
      await dismissModalPopupsAggressive(page, 5);
      return true;
    }
    await sleep(2000);
  }

  console.log("⚠ Timed out waiting for logged-in state.");
  return false;
}

async function openInstagramWithCookies(page, cookiesPath) {
  console.log("🌐 Opening Instagram...");
  await page.goto("https://www.instagram.com/", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });

  await dismissModalPopupsAggressive(page, 2);

  const cookies = await loadCookies(cookiesPath);
  if (cookies.length > 0) {
    await page.context().addCookies(cookies);
    console.log("🔄 Reloading with cookies...");
    await page.reload({ waitUntil: "domcontentloaded" });
    await dismissModalPopupsAggressive(page, 2);
  }
}

/* =========================
 * DM send (STRICT exact username)
 * ========================= */
async function sendDmToUsername(page, targetUsername, message) {
  const target = cleanUsername(targetUsername);
  const msg = cleanMessage(message);

  if (!target) throw new Error("Missing target username.");
  if (!msg) throw new Error("Missing message.");

  console.log("📬 Navigating to DM composer...");
  await page.goto("https://www.instagram.com/direct/new/", {
    waitUntil: "domcontentloaded",
    timeout: 30000,
  });
  console.log(`🌐 NAV: ${page.url()}`);

  await page.waitForTimeout(800);
  await dismissModalPopupsAggressive(page, 2);

  if (page.url().includes("/accounts/login")) {
    throw new Error(
      "Not logged in (redirected to /accounts/login). Refresh cookies with LOGIN_MODE=true."
    );
  }

  console.log(`🔍 Searching for: @${target}`);

  const dialog2 = page
    .locator('[role="dialog"], div[aria-modal="true"]')
    .first();
  const scope2 = (await dialog2.count()) ? dialog2 : page;

  const toInput = scope2
    .locator(
      [
        'input[name="queryBox"]',
        'input[placeholder*="Search"]',
        'input[aria-label*="Search"]',
        'input[type="text"]',
      ].join(",")
    )
    .first();

  await toInput.waitFor({ timeout: 20000 });

  await toInput.fill("");
  await page.waitForTimeout(200);
  await toInput.type(target, { delay: 40 });

  await page.waitForTimeout(500);
  await page.keyboard.press("Enter").catch(() => {});
  await page.waitForTimeout(1200);

  const rows = scope2.locator('div[role="button"]');
  let rowCount = await rows.count();

  console.log(`📋 Results rows detected: ${rowCount}`);

  if (rowCount === 0) {
    const shot = `${CONFIG.logsDir}/no-results-${Date.now()}.png`;
    await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
    throw new Error(`No search results rendered for "${target}". Screenshot: ${shot}`);
  }

  const uname = target.replace(/^@/, "").trim();
  const reExact = new RegExp(`(^|\\s|@)${escapeRegExp(uname)}(\\s|$)`, "i");

  let pickIndex = -1;

  const maxScrollAttempts = 5;
  const maxProbePerAttempt = 15;

  console.log("🔎 Results preview (strict exact match required):");

  for (let attempt = 0; attempt < maxScrollAttempts && pickIndex === -1; attempt++) {
    rowCount = await rows.count();
    const probe = Math.min(rowCount, maxProbePerAttempt);

    for (let i = 0; i < probe; i++) {
      const txt = (await rows.nth(i).innerText().catch(() => ""))
        .trim()
        .replace(/\s+/g, " ");
      if (txt) console.log(`  [${attempt}:${i}] ${txt}`);

      if (txt && reExact.test(txt)) {
        pickIndex = i;
        break;
      }
    }

    if (pickIndex !== -1) break;

    try {
      await scope2.hover().catch(() => {});
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(800);
    } catch {
      // ignore
    }
  }

  if (pickIndex === -1) {
    const safe = uname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const shot = `${CONFIG.logsDir}/no-exact-match-${safe}-${Date.now()}.png`;
    await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
    throw new Error(
      `No EXACT username match for "${uname}" in search results. Screenshot: ${shot}`
    );
  }

  console.log(`👤 Selecting exact-match recipient row [${pickIndex}]...`);
  await rows.nth(pickIndex).click({ timeout: 8000 });

  // Wait briefly for Instagram to react — it may navigate directly to a thread
  // if there's an existing conversation, or stay in the composer (needs Next).
  await page.waitForTimeout(1200);
  await dismissModalPopupsAggressive(page, 1);

  const currentUrl = page.url();
  const alreadyInThread = currentUrl.includes("/direct/t/");

  if (alreadyInThread) {
    console.log(`💬 Already in thread (${currentUrl}) — skipping Next button`);
  } else {
    console.log("➡️ Clicking Next...");
    const nextBtn = page.getByRole("button", { name: /Next/i }).first();
    try {
      await nextBtn.waitFor({ timeout: 10000 });
      await nextBtn.click();
      await page.waitForTimeout(1000);
      await dismissModalPopupsAggressive(page, 2);
    } catch {
      // One more check: maybe it navigated to the thread while we waited
      const urlAfterWait = page.url();
      if (!urlAfterWait.includes("/direct/t/")) {
        const shot = `${CONFIG.logsDir}/next-btn-timeout-${Date.now()}.png`;
        await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
        throw new Error(`Next button not found and not in thread. Screenshot: ${shot}`);
      }
      console.log(`💬 Navigated to thread during Next wait — continuing`);
    }
  }

  await page.waitForTimeout(600);
  await dismissModalPopupsAggressive(page, 1);

  console.log("✍️ Typing message...");
  const dmComposer = page
    .locator('div[contenteditable="true"][role="textbox"]')
    .first();
  await dmComposer.waitFor({ timeout: 20000 });
  await dmComposer.click();
  await page.waitForTimeout(200);

  await dmComposer.fill(msg).catch(async () => {
    await page.keyboard.type(msg, { delay: 25 });
  });

  await page.waitForTimeout(400);

  console.log("📤 Sending...");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(1500);

  console.log("✅ Sent!");
}

/* =========================
 * Main
 * ========================= */
async function main() {
  console.log("🚀 IG DM Bot (Local Runner)");
  console.log(`Mode: ${CONFIG.loginMode ? "LOGIN" : "SEND"}`);
  console.log(`Headless: ${CONFIG.headless}`);

  await fs.mkdir(CONFIG.logsDir, { recursive: true }).catch(() => {});

  const browser = await chromium.launch({
    headless: CONFIG.headless,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-dev-shm-usage",
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });
  console.log("Browser launched.");

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();
  page.setDefaultTimeout(CONFIG.maxWaitSeconds * 1000);

  page.on("dialog", async (dialog) => {
    console.log(`🔔 Auto-dismissing dialog: ${dialog.message()}`);
    await dialog.dismiss().catch(() => {});
  });

  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) console.log(`🌐 NAV: ${frame.url()}`);
  });

  const stateManager = new StateManager(CONFIG.statePath);

  try {
    await openInstagramWithCookies(page, CONFIG.cookiesPath);

    if (CONFIG.loginMode) {
      console.log("\n=== LOGIN MODE ===");
      console.log("📋 Please log in manually in the opened browser.");
      const ok = await waitForLoggedInSignal(page);
      await saveCookies(context, CONFIG.cookiesPath);
      if (ok) console.log("✅ Login confirmed and cookies saved.");
      else console.log("⚠ Login not confirmed, but cookies saved anyway.");
      return;
    }

    if (!CONFIG.igUsername || !CONFIG.igMessage) {
      throw new Error("Missing IG_USERNAME or IG_MESSAGE env.");
    }

    console.log("\n=== SINGLE SEND ===");
    const lockKey = "dm-send-lock";
    await stateManager.acquireLock(lockKey);
    try {
      await stateManager.enforceRateLimit(
        CONFIG.dailyLimit,
        CONFIG.minDelaySeconds,
        CONFIG.maxJitterSeconds
      );

      if (CONFIG.dryRun) {
        console.log("🧪 DRY_RUN enabled. Skipping send.");
        console.log(`Would send to @${CONFIG.igUsername}`);
        console.log(`Message: ${CONFIG.igMessage}`);
      } else {
        await sendDmToUsername(page, CONFIG.igUsername, CONFIG.igMessage);
      }
    } finally {
      await stateManager.releaseLock(lockKey);
    }
  } catch (error) {
    console.error("💥 Fatal error:", error);
    throw error;
  } finally {
    await browser.close().catch(() => {});
  }
}

main().catch(() => process.exit(1));
