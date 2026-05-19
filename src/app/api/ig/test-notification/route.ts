import { NextRequest, NextResponse } from "next/server";
import { triggerIgReplyNotification } from "@/lib/novu";

/**
 * POST /api/ig/test-notification
 *
 * Fires a test Novu in-app notification to verify the full pipeline works.
 * Only usable when NOVU_SECRET_KEY is configured.
 *
 * Usage:
 *   curl -X POST http://localhost:3000/api/ig/test-notification \
 *     -H "Content-Type: application/json" \
 *     -d '{"artistName":"Test Artist","instagramHandle":"testartist","messageSnippet":"Hey, love what you sent!"}'
 */
export async function POST(req: NextRequest) {
  // Block in production — this is a dev/testing-only endpoint
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  let body: { artistName?: string; instagramHandle?: string; messageSnippet?: string } = {};
  try {
    body = await req.json();
  } catch {
    // allow empty body — use defaults
  }

  const artistName = body.artistName ?? "Test Artist";
  const instagramHandle = body.instagramHandle ?? "testartist";
  const messageSnippet = body.messageSnippet ?? "Hey, love what you sent! Would love to chat more.";

  await triggerIgReplyNotification({
    artistName,
    instagramHandle,
    leadId: null,
    messageSnippet,
  });

  return NextResponse.json({
    ok: true,
    message: `Test notification triggered for "${artistName}"`,
    note: "Check your Novu Inbox bell icon in the sidebar.",
  });
}
