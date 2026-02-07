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

  console.log("✅ inbound /ig/send", new Date().toISOString());
  console.log(`Payload saved: ${payloadFile}`);

  const scriptPath = path.join(BOT_ROOT, "run_ig_send.sh");
  const child = spawn("/bin/bash", [scriptPath], {
    env: { ...process.env, HOOK_: payloadFile },
    stdio: "ignore",
    detached: true,
  });

  child.unref();

  return res.status(202).json({ ok: true, queued: true, payloadFile });
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

app.listen(PORT, () => {
  console.log(`🚀 Local webhook server listening on http://localhost:${PORT}`);
});
