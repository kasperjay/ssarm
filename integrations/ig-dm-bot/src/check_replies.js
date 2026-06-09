import { chromium } from "playwright";
import fs from "fs/promises";
import path from "path";

const CONFIG = {
  headless: process.env.HEADLESS !== "false",
  cookiesPath: "./data/cookies.json",
  statePath: "./data/state.json",
  webhookUrl: process.env.APP_WEBHOOK_URL || "http://localhost:3000/api/ig/reply",
  webhookSecret: process.env.INBOUND_SECRET || "",
};

async function loadData(filePath, defaultData) {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return defaultData;
  }
}

async function saveData(filePath, data) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

async function main() {
  console.log("🔍 Checking for IG DM replies via API interception...");
  const browser = await chromium.launch({
    headless: CONFIG.headless,
    args: ["--disable-blink-features=AutomationControlled", "--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();
  const cookies = await loadData(CONFIG.cookiesPath, []);
  if (cookies.length > 0) {
    await context.addCookies(cookies);
  } else {
    console.log("⚠️ No cookies found. Please run login mode first.");
    await browser.close();
    return;
  }

  const state = await loadData(CONFIG.statePath, { processedReplies: {} });
  if (!state.processedReplies) state.processedReplies = {};

  let inboxData = null;
  let maxDataSize = 0;

  // Listen to network responses to grab the GraphQL inbox data
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/graphql') || url.includes('/graphql/query')) {
      try {
        const text = await response.text();
        if (text.includes('get_slide_mailbox_for_iris_subscription') && text.length > maxDataSize) {
          maxDataSize = text.length;
          inboxData = JSON.parse(text);
        }
      } catch (err) {
        // ignore incomplete/failed reads
      }
    }
  });

  try {
    console.log("🌐 Navigating to /direct/inbox/...");
    await page.goto("https://www.instagram.com/direct/inbox/", { waitUntil: "domcontentloaded", timeout: 45000 });
    
    // Wait for the inbox list and GraphQL queries to complete
    await page.waitForTimeout(10000);

    if (!inboxData) {
      console.log("⚠️ Failed to capture inbox GraphQL response.");
      return;
    }

    console.log(`📋 Captured inbox API data (${maxDataSize} bytes). Processing...`);
    const edges = inboxData.data?.get_slide_mailbox_for_iris_subscription?.threads_by_folder?.edges || [];
    const threads = edges.map(e => e.node.as_ig_direct_thread).filter(Boolean);

    for (const thread of threads) {
      const otherUser = thread.users?.[0];
      const lastMessage = thread.slide_messages?.edges?.[0]?.node;
      
      if (!otherUser || !lastMessage) continue;
      
      const isIncoming = lastMessage.sender_fbid === otherUser.interop_messaging_user_fbid || 
                         lastMessage.sender_fbid === otherUser.id;
      
      const username = otherUser.username;
      const msgText = lastMessage.text_body || "Attachments/Media";

      if (isIncoming) {
        // Use a combination of the msg id and timestamp to ensure uniqueness
        const replyId = lastMessage.id || `${username}_${lastMessage.timestamp_ms}`;
        
        if (!state.processedReplies[replyId]) {
           console.log(`📬 NEW REPLY from ${username}: "${msgText}"`);
           state.processedReplies[replyId] = new Date().toISOString();
           
           // Forward to our local API
           try {
              await fetch(CONFIG.webhookUrl, {
                 method: "POST",
                 headers: {
                   "Content-Type": "application/json",
                   "x-webhook-secret": CONFIG.webhookSecret
                 },
                 body: JSON.stringify({
                    igUsername: username,
                    artist: { instagramHandle: username },
                    message: { body: msgText }
                 })
              });
              console.log(`   ✅ Forwarded to ${CONFIG.webhookUrl}`);
           } catch (postErr) {
              console.error("   ❌ Failed to forward:", postErr.message);
           }
        } else {
           // console.log(`   (Already processed reply from ${username})`);
        }
      } else {
        // console.log(`   (Last message with ${username} was outgoing)`);
      }
    }
  } catch (err) {
    console.error("❌ Error checking replies:", err);
  } finally {
    await browser.close();
    await saveData(CONFIG.statePath, state);
    console.log("✅ Check complete.");
  }
}

main().catch(console.error);
