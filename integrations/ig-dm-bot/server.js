import "dotenv/config";

import express from "express";
import fs from "fs/promises";
import path from "path";
import { spawn } from "child_process";

const app = express();
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 8787;
const INBOUND_SECRET = process.env.INBOUND_SECRET || "";
const PAYLOAD_DIR = process.env.PAYLOAD_DIR || "./logs";
const BOT_ROOT = process.env.BOT_ROOT || process.cwd();

const getInstagramHandle = (payload) => {
  if (payload?.artist?.instagramHandle) return payload.artist.instagramHandle;
  const profile = payload?.artist?.instagramProfileUrl;
  if (profile) {
    const parts = profile.split("/").filter(Boolean);
    return parts[parts.length - 1] || "";
  }
  return payload?.igUsername || "";
};

/* ─── Send Queue ─────────────────────────────────────────────
 * All /ig/send requests are added to this queue and processed
 * one at a time. This prevents the dm-send-lock contention that
 * occurs when multiple sends are triggered simultaneously.
 * ─────────────────────────────────────────────────────────── */
const sendQueue = [];
let queueRunning = false;

function runQueue() {
  if (queueRunning || sendQueue.length === 0) return;
  queueRunning = true;

  const { payloadFile, resolve } = sendQueue.shift();
  const scriptPath = path.join(BOT_ROOT, "run_ig_send.sh");

  console.log(`▶ Queue processing: ${payloadFile} (${sendQueue.length} remaining)`);

  const child = spawn("/bin/bash", [scriptPath], {
    env: { ...process.env, HOOK_: payloadFile },
    stdio: "inherit", // pipe output to server console for visibility
  });

  child.on("exit", (code) => {
    console.log(`■ Queue item done (exit ${code}): ${payloadFile}`);
    queueRunning = false;
    resolve(code);
    // Process next item after a short breath
    setTimeout(runQueue, 500);
  });

  child.on("error", (err) => {
    console.error("Queue runner error:", err);
    queueRunning = false;
    resolve(1);
    setTimeout(runQueue, 500);
  });
}

app.post("/ig/send", async (req, res) => {
  const secret = req.header("x-webhook-secret") || req.header("x-secret") || "";
  if (!INBOUND_SECRET || secret !== INBOUND_SECRET) {
    return res.status(401).json({ ok: false, error: "bad secret" });
  }

  const payload = req.body || {};
  const igHandle = getInstagramHandle(payload);
  const messageBody = payload?.message?.body || payload?.message || "";

  if (!igHandle || !messageBody) {
    return res.status(400).json({
      ok: false,
      error: "Missing artist.instagramHandle and/or message.body",
    });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const payloadFile = path.join(PAYLOAD_DIR, `webhook-${timestamp}.json`);

  try {
    await fs.mkdir(PAYLOAD_DIR, { recursive: true });
    await fs.writeFile(payloadFile, JSON.stringify(payload, null, 2));
  } catch (error) {
    console.error("Failed to write payload file", error);
    return res.status(500).json({ ok: false, error: "failed to persist payload" });
  }

  const queuePos = sendQueue.length + (queueRunning ? 1 : 0);
  console.log(`✅ inbound /ig/send → @${igHandle} (queue position: ${queuePos})`);

  const itemDone = new Promise((resolve) => {
    sendQueue.push({ payloadFile, resolve });
  });

  // Kick off queue processing (no-op if already running)
  runQueue();

  return res.status(202).json({
    ok: true,
    queued: true,
    queuePosition: queuePos,
    payloadFile,
  });
});

app.get("/ig/status", async (req, res) => {
  const secret = req.header("x-webhook-secret") || req.header("x-secret") || "";
  if (!INBOUND_SECRET || secret !== INBOUND_SECRET) {
    return res.status(401).json({ ok: false, error: "bad secret" });
  }

  const timeoutSeconds = Number(process.env.STATUS_TIMEOUT_SECONDS || 25);
  const scriptPath = path.join(BOT_ROOT, "src", "check_login.js");

  const child = spawn("node", [scriptPath], {
    env: { ...process.env },
    stdio: "ignore",
  });

  const timeout = setTimeout(() => {
    child.kill("SIGKILL");
  }, timeoutSeconds * 1000);

  child.on("exit", (code) => {
    clearTimeout(timeout);
    if (code === 0) {
      return res.json({ ok: true, loggedIn: true });
    }
    return res.status(503).json({ ok: false, loggedIn: false });
  });
});

app.post("/ig/refresh-login", async (req, res) => {
  const secret = req.header("x-webhook-secret") || req.header("x-secret") || "";
  if (!INBOUND_SECRET || secret !== INBOUND_SECRET) {
    return res.status(401).json({ ok: false, error: "bad secret" });
  }

  const scriptPath = path.join(BOT_ROOT, "src", "main.js");

  const child = spawn("node", [scriptPath], {
    env: {
      ...process.env,
      LOGIN_MODE: "true",
      HEADLESS: "false",
    },
    stdio: "ignore",
    detached: true,
  });

  child.unref();

  return res.status(202).json({ ok: true, login: "started" });
});

app.get("/health", (_, res) => res.json({ ok: true }));

/* ─── Reply Polling ──────────────────────────────────────────
 * Poll for replies every 20 minutes + 1-300s of random jitter
 * ─────────────────────────────────────────────────────────── */
function startReplyChecker() {
  const baseIntervalMs = 20 * 60 * 1000; // 20 minutes
  const maxJitterMs = 300 * 1000; // 5 minutes

  async function checkLoop() {
    const scriptPath = path.join(BOT_ROOT, "src", "check_replies.js");
    console.log("🕒 Spawning reply checker...");

    const child = spawn("node", [scriptPath], {
      env: { ...process.env },
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      console.log(`■ Reply checker finished with code ${code}`);
      scheduleNext();
    });

    child.on("error", (err) => {
      console.error("❌ Reply checker spawn error:", err);
      scheduleNext();
    });
  }

  function scheduleNext() {
    const jitter = Math.floor(Math.random() * maxJitterMs) + 1000;
    const nextWait = baseIntervalMs + jitter;
    console.log(`⏱️ Next reply check in ${(nextWait / 1000 / 60).toFixed(2)} minutes...`);
    setTimeout(checkLoop, nextWait);
  }

  // Start the first check after a short initial delay (e.g., 30s) so the server can fully boot
  setTimeout(checkLoop, 30000);
}

startReplyChecker();

app.listen(PORT, () => {
  console.log(`🚀 Local webhook server listening on http://localhost:${PORT}`);
});
