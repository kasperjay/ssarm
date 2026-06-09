import "dotenv/config";
import { novu, OPERATOR_SUBSCRIBER_ID, IG_REPLY_WORKFLOW_ID } from "../src/lib/novu";

async function main() {
  console.log("🚀 Testing Novu Notification Pipeline...");

  if (!process.env.NOVU_SECRET_KEY) {
    console.error("❌ NOVU_SECRET_KEY is not set in your .env file!");
    process.exit(1);
  }

  console.log("1️⃣ Ensuring subscriber exists...");
  try {
    await novu.subscribers.create({
      subscriberId: OPERATOR_SUBSCRIBER_ID,
      firstName: "Operator",
    });
    console.log("   ✅ Subscriber created.");
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    if (errMsg && errMsg.includes("already exists")) {
      console.log("   ✅ Subscriber already exists.");
    } else {
      console.warn("   ⚠️ Error creating subscriber (might be fine):", errMsg);
    }
  }

  console.log("\n2️⃣ Triggering notification...");
  try {
    const response = await novu.trigger({
      workflowId: IG_REPLY_WORKFLOW_ID,
      to: OPERATOR_SUBSCRIBER_ID,
      payload: {
        artistName: "Test Artist " + Date.now(),
        instagramHandle: "testartist",
        leadId: "",
        messageSnippet: "Hey, this is a test from the CLI script!",
        leadUrl: "/leads",
      },
    });
    
    if (response?.result?.acknowledged) {
      console.log("   ✅ Trigger acknowledged by Novu!");
      console.log("\n🎉 Test complete! Check your Next.js app's NotificationInbox.");
    } else {
      console.log("   ⚠️ Trigger returned success but wasn't acknowledged?", response.result);
    }
  } catch (err: unknown) {
    console.error("\n❌ Failed to trigger notification:");
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }
}

main().catch(console.error);
