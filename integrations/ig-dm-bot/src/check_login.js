import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

const CONFIG = {
  headless: process.env.HEADLESS !== "false",
  maxWaitSeconds: Number(process.env.MAX_WAIT_SECONDS || 120),
  cookiesPath: "./data/cookies.json",
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function loadCookies(cookiesPath) {
  try {
    const data = await fs.readFile(cookiesPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

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

async function waitForLoggedInSignal(page) {
  const deadline = Date.now() + 2 * 60 * 1000;

  while (Date.now() < deadline) {
    const url = page.url();
    const hasNav = (await page.locator("nav").count()) > 0;
    const hasDirectLink =
      (await page.locator('a[href*="/direct/"]').count()) > 0;
    const notOnLoginPage = !url.includes("/accounts/login");

    if (notOnLoginPage && hasNav && hasDirectLink) {
      return true;
    }
    await sleep(2000);
  }

  return false;
}

async function main() {
  const browser = await chromium.launch({
    headless: CONFIG.headless,
    args: ["--disable-blink-features=AutomationControlled", "--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();
  page.setDefaultTimeout(CONFIG.maxWaitSeconds * 1000);

  try {
    await page.goto("https://www.instagram.com/", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await dismissModalPopupsAggressive(page, 2);

    const cookies = await loadCookies(CONFIG.cookiesPath);
    if (cookies.length > 0) {
      await page.context().addCookies(cookies);
      await page.reload({ waitUntil: "domcontentloaded" });
      await dismissModalPopupsAggressive(page, 2);
    }

    const ok = await waitForLoggedInSignal(page);
    if (!ok) {
      process.exit(2);
    }
  } catch (error) {
    console.error("Login check failed", error);
    process.exit(2);
  } finally {
    await browser.close().catch(() => {});
  }
}

main().catch(() => process.exit(2));
