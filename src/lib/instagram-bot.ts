import { spawn } from "child_process";
import path from "path";

const BOT_URL = process.env.IG_DM_WEBHOOK_URL || "http://localhost:8787/ig/send";
const BOT_HEALTH_URL = BOT_URL.replace("/ig/send", "/health");
const BOT_DIR = process.env.IG_DM_BOT_PATH || path.resolve(process.cwd(), "integrations/ig-dm-bot");

export async function isBotHealthy(): Promise<boolean> {
    try {
        const res = await fetch(BOT_HEALTH_URL, { signal: AbortSignal.timeout(2000) });
        return res.ok;
    } catch {
        return false;
    }
}

export async function ensureBotRunning(): Promise<boolean> {
    console.log("Checking if IG DM bot is running...");

    if (await isBotHealthy()) {
        console.log("IG DM bot is already running.");
        return true;
    }

    console.log(`Starting IG DM bot in ${BOT_DIR}...`);

    try {
        const child = spawn("npm", ["start"], {
            cwd: BOT_DIR,
            detached: true,
            stdio: "ignore",
            env: { ...process.env, PORT: "8787" }
        });

        child.unref();

        // Wait for the bot to become healthy (up to 10 seconds)
        for (let i = 0; i < 10; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            if (await isBotHealthy()) {
                console.log("IG DM bot started successfully.");
                return true;
            }
        }

        console.error("IG DM bot failed to start within 10 seconds.");
        return false;
    } catch (error) {
        console.error("Failed to start IG DM bot:", error);
        return false;
    }
}
