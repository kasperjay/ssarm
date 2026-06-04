import { Novu } from "@novu/api";

if (!process.env.NOVU_SECRET_KEY) {
  console.warn(
    "[novu] NOVU_SECRET_KEY is not set — server-side notification triggers will be skipped."
  );
}

export const novu = new Novu({ secretKey: process.env.NOVU_SECRET_KEY ?? "" });

/**
 * The workflow identifier you created in the Novu dashboard.
 * Must match the "Workflow Identifier" field exactly (case-sensitive).
 * Default: "ig-reply-received"
 */
export const IG_REPLY_WORKFLOW_ID =
  process.env.NOVU_IG_REPLY_WORKFLOW_ID ?? "ig-reply-received";

/**
 * The subscriber ID that receives in-app notifications.
 * This should be your own user ID (the logged-in operator, not the artist).
 * Defaults to the same fallback ID used in NotificationInbox.tsx.
 */
export const OPERATOR_SUBSCRIBER_ID =
  process.env.NOVU_OPERATOR_SUBSCRIBER_ID ?? "69f9702caca4539eeab8f6bc";

/**
 * Trigger an in-app notification when an artist replies to an IG DM.
 */
let subscriberIdentified = false;

export async function triggerIgReplyNotification({
  artistName,
  instagramHandle,
  leadId,
  messageSnippet,
}: {
  artistName: string;
  instagramHandle?: string | null;
  leadId?: string | null;
  messageSnippet?: string | null;
}) {
  if (!process.env.NOVU_SECRET_KEY) {
    console.warn("[novu] Skipping notification trigger — NOVU_SECRET_KEY not set.");
    return;
  }

  try {
    if (!subscriberIdentified) {
      await novu.subscribers.create({
        subscriberId: OPERATOR_SUBSCRIBER_ID,
        firstName: "Operator",
      }).catch(err => {
        // Ignore if subscriber already exists
        if (err?.message?.includes("already exists")) return;
        console.warn("[novu] Non-fatal error creating subscriber:", err.message);
      });
      subscriberIdentified = true;
    }

    const response = await novu.trigger({
      workflowId: IG_REPLY_WORKFLOW_ID,
      to: OPERATOR_SUBSCRIBER_ID,
      payload: {
        artistName,
        instagramHandle: instagramHandle ?? "",
        leadId: leadId ?? "",
        messageSnippet: messageSnippet ?? "They replied to your message.",
        leadUrl: leadId ? `/leads/${leadId}` : "/leads",
      },
    });
    console.log(`[novu] ✅ Triggered IG reply notification for ${artistName}. Status: ${response?.result?.acknowledged ? "acknowledged" : "unknown"}`);
  } catch (err: any) {
    console.error("[novu] Failed to trigger notification:", err?.message || err);
  }
}
