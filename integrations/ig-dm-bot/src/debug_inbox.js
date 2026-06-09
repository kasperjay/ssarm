import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });
  const page = await context.newPage();
  
  try {
    const data = await fs.readFile("./data/cookies.json", "utf-8");
    await context.addCookies(JSON.parse(data));
  } catch {}

  await page.goto("https://www.instagram.com/direct/inbox/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: "./logs/debug_inbox.png" });
  
  console.log("URL:", page.url());
  const aTags = await page.locator('a').allInnerTexts();
  console.log("Total a tags:", aTags.length);
  
  const directLinks = await page.locator('a[href*="/direct/"]').count();
  console.log("Direct links:", directLinks);

  await browser.close();
}

main().catch(console.error);
