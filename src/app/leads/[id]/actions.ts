"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@/generated/prisma";
import { generateReachoutDrafts } from "@/lib/reachout";
import { scoreLead } from "@/lib/scoring";
import { ensureBotRunning } from "@/lib/instagram-bot";

type UpdateStatusState = {
  leadId: string;
  status: LeadStatus;
};

type LeadActionState = {
  leadId: string;
  nextActionAt?: Date;
};

type SendMessageState = {
  leadId: string;
  body: string;
  source?: string;
};

const formatPrettyDate = (date?: Date | null) => {
  if (!date) return null;
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return formatter.format(date);
};

const formatLocation = (
  location?: string | null,
  city?: string | null,
  state?: string | null,
  country?: string | null
) => {
  if (location) return location;
  const parts = [city, state, country].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
};

const getFollowUpDate = () => {
  const days = Number.parseInt(process.env.FOLLOW_UP_DAYS ?? "7", 10);
  if (Number.isNaN(days) || days <= 0) return undefined;
  const next = new Date();
  next.setDate(next.getDate() + days);
  return next;
};

export async function updateLeadStatus(state: UpdateStatusState) {
  const lead = await prisma.lead.findUnique({
    where: { id: state.leadId },
  });

  if (!lead || lead.status === state.status) {
    return;
  }

  await prisma.lead.update({
    where: { id: state.leadId },
    data: { status: state.status },
  });

  await prisma.activity.create({
    data: {
      leadId: state.leadId,
      type: "STATUS_CHANGE",
      note: `Status changed to ${state.status}`,
    },
  });
}

export async function markContacted(state: LeadActionState) {
  const lead = await prisma.lead.findUnique({
    where: { id: state.leadId },
  });

  if (!lead) return;

  await prisma.lead.update({
    where: { id: state.leadId },
    data: {
      status: "CONTACTED",
      lastContactedAt: new Date(),
      nextActionAt: state.nextActionAt,
    },
  });

  await prisma.activity.create({
    data: {
      leadId: state.leadId,
      type: "MESSAGE_SENT",
      note: "Marked contacted",
    },
  });
}

export async function sendMessage(state: SendMessageState) {
  const trimmed = state.body.trim();
  if (!trimmed) return { ok: false, error: "Message body is empty." };

  const lead = await prisma.lead.findUnique({
    where: { id: state.leadId },
    include: { artist: true },
  });

  if (!lead) return { ok: false, error: "Lead not found." };

  const nextActionAt = getFollowUpDate();
  const webhookUrl = process.env.IG_DM_WEBHOOK_URL;
  let sendOk = !webhookUrl;
  let errorMessage: string | undefined;

  if (webhookUrl) {
    // Ensure the bot is running before attempting to send
    await ensureBotRunning();

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.IG_DM_WEBHOOK_SECRET
            ? { "X-Webhook-Secret": process.env.IG_DM_WEBHOOK_SECRET }
            : {}),
        },
        body: JSON.stringify({
          leadId: lead.id,
          artist: {
            name: lead.artist.name,
            instagramHandle: lead.artist.instagramHandle,
            instagramProfileUrl: lead.artist.instagramProfileUrl,
          },
          message: {
            body: trimmed,
            source: state.source ?? "sent",
          },
          followUpAt: nextActionAt?.toISOString() ?? null,
        }),
      });
      sendOk = response.ok;
      if (!response.ok) {
        const text = await response.text().catch(() => "No response body");
        console.error("IG DM webhook failed", response.status, text);
        errorMessage = `Bot server error (${response.status}): ${text.slice(0, 100)}`;
      }
    } catch (error) {
      console.error("Failed to call IG DM webhook", error);
      sendOk = false;
      errorMessage = error instanceof Error ? error.message : "Network error calling bot server";
    }
  }

  if (!sendOk) {
    await prisma.messageDraft.create({
      data: {
        leadId: lead.id,
        body: trimmed,
        source: state.source ?? "failed",
        selected: true, // Mark as selected so the background agent can retry it
      },
    });

    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: "NOTE",
        note: `Send failed via IG webhook: ${errorMessage}`,
      },
    });

    return { ok: false, error: errorMessage ?? "Failed to send via IG webhook." };
  }

  await prisma.lead.update({
    where: { id: state.leadId },
    data: {
      status: "CONTACTED",
      lastContactedAt: new Date(),
      nextActionAt,
    },
  });

  await prisma.activity.create({
    data: {
      leadId: lead.id,
      type: "MESSAGE_SENT",
      note: trimmed,
    },
  });

  await prisma.messageDraft.create({
    data: {
      leadId: lead.id,
      body: trimmed,
      source: state.source ?? "sent",
      selected: true,
    },
  });

  await prisma.messageDraft.deleteMany({
    where: {
      leadId: lead.id,
      source: "reachout",
    },
  });

  revalidatePath(`/leads/${lead.id}`);
}

export async function generateDraftsForLead(
  leadId: string,
  options?: { styleHint?: string | null; shouldRevalidate?: boolean }
) {
  if (!leadId) return;
  const { styleHint, shouldRevalidate = true } = options ?? {};

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      artist: true,
      messages: true,
      activities: { orderBy: { occurredAt: "desc" }, take: 1 },
    },
  });

  if (!lead) return;

  const [latestRelease, instagramPosts] = await Promise.all([
    prisma.release.findFirst({
      where: { artistId: lead.artistId },
      orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
    }),
    prisma.instagramPost.findMany({
      where: { artistId: lead.artistId },
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
      take: 4,
    }),
  ]);

  const releaseDate = latestRelease?.releaseDate ?? latestRelease?.createdAt ?? null;
  const daysSinceRelease = releaseDate
    ? Math.floor((Date.now() - releaseDate.getTime()) / 86400000)
    : null;
  const isRecentRelease =
    daysSinceRelease !== null && daysSinceRelease >= -2 && daysSinceRelease <= 90;

  const recentPosts = instagramPosts
    .map((post) => post.caption)
    .filter(Boolean)
    .join(" | ");

  const personalHook =
    lead.scoreRationale && lead.scoreRationale.length <= 160
      ? lead.scoreRationale
      : null;

  const output = await generateReachoutDrafts({
    artist: lead.artist.name,
    genreText: lead.artist.genre,
    location: formatLocation(
      lead.artist.location,
      lead.artist.city,
      lead.artist.state,
      lead.artist.country
    ),
    releaseTitle: latestRelease?.title ?? null,
    releaseDatePretty: formatPrettyDate(releaseDate),
    isRecentRelease,
    personalHook,
    recentPosts,
    bio: lead.artist.bio,
    hasEmail: (lead.artist.emails?.length ?? 0) > 0,
    styleHint: styleHint ?? undefined,
  });

  await prisma.messageDraft.deleteMany({
    where: { leadId: lead.id, source: "reachout" },
  });

  const drafts = [
    { tone: "IG A", body: output.IG_A },
    { tone: "IG B", body: output.IG_B },
  ];

  if (output.EMAIL_A && output.EMAIL_B) {
    drafts.push(
      { tone: "Email A", body: output.EMAIL_A },
      { tone: "Email B", body: output.EMAIL_B }
    );
  }

  await prisma.messageDraft.createMany({
    data: drafts.map((draft) => ({
      leadId: lead.id,
      body: draft.body.trim(),
      tone: draft.tone,
      source: "reachout",
      selected: false,
    })),
  });

  await prisma.activity.create({
    data: {
      leadId: lead.id,
      type: "NOTE",
      note: styleHint ? `Generated outreach drafts (${styleHint}).` : "Generated outreach drafts.",
    },
  });

  if (shouldRevalidate) {
    revalidatePath(`/leads/${lead.id}`);
  }
}

export async function generateDrafts(formData: FormData) {
  const leadId = formData.get("leadId");
  if (typeof leadId !== "string" || !leadId.trim()) return;
  const styleHintRaw = formData.get("status") || formData.get("styleHint");
  const styleHint = typeof styleHintRaw === "string" ? styleHintRaw : undefined;
  await generateDraftsForLead(leadId, { styleHint });
}

type DraftKey = "IG_A" | "IG_B" | "EMAIL_A" | "EMAIL_B";

const toneToKey = (tone: string, hasEmail: boolean): DraftKey => {
  const lower = tone.toLowerCase();
  if (lower.includes("email")) {
    return lower.includes("b") && hasEmail ? "EMAIL_B" : "EMAIL_A";
  }
  if (lower.includes("b")) return "IG_B";
  return "IG_A";
};

export async function regenerateDraft(formData: FormData) {
  const leadId = formData.get("leadId");
  const draftId = formData.get("draftId");
  const tone = formData.get("tone");
  const styleHintRaw = formData.get("styleHint");

  if (typeof leadId !== "string" || !leadId.trim()) return;
  if (typeof draftId !== "string" || !draftId.trim()) return;
  if (typeof tone !== "string" || !tone.trim()) return;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      artist: true,
      messages: true,
      activities: { orderBy: { occurredAt: "desc" }, take: 1 },
    },
  });

  if (!lead) return;

  const [latestRelease, instagramPosts] = await Promise.all([
    prisma.release.findFirst({
      where: { artistId: lead.artistId },
      orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
    }),
    prisma.instagramPost.findMany({
      where: { artistId: lead.artistId },
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
      take: 4,
    }),
  ]);

  const releaseDate = latestRelease?.releaseDate ?? latestRelease?.createdAt ?? null;
  const daysSinceRelease = releaseDate
    ? Math.floor((Date.now() - releaseDate.getTime()) / 86400000)
    : null;
  const isRecentRelease =
    daysSinceRelease !== null && daysSinceRelease >= -2 && daysSinceRelease <= 90;

  const recentPosts = instagramPosts
    .map((post) => post.caption)
    .filter(Boolean)
    .join(" | ");

  const personalHook =
    lead.scoreRationale && lead.scoreRationale.length <= 160
      ? lead.scoreRationale
      : null;

  const styleHint = typeof styleHintRaw === "string" ? styleHintRaw : undefined;

  const output = await generateReachoutDrafts({
    artist: lead.artist.name,
    genreText: lead.artist.genre,
    location: formatLocation(
      lead.artist.location,
      lead.artist.city,
      lead.artist.state,
      lead.artist.country
    ),
    releaseTitle: latestRelease?.title ?? null,
    releaseDatePretty: formatPrettyDate(releaseDate),
    isRecentRelease,
    personalHook,
    recentPosts,
    bio: lead.artist.bio,
    hasEmail: (lead.artist.emails?.length ?? 0) > 0,
    styleHint,
  });

  const key = toneToKey(tone, (lead.artist.emails?.length ?? 0) > 0);
  const nextBody = (output as Record<string, string | undefined>)[key]?.trim();
  if (nextBody) {
    await prisma.messageDraft.update({
      where: { id: draftId },
      data: { body: nextBody, tone },
    });
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: "NOTE",
        note: styleHint
          ? `Regenerated draft (${tone}) with style: ${styleHint}`
          : `Regenerated draft (${tone}).`,
      },
    });
    revalidatePath(`/leads/${lead.id}`);
  }
}

export async function refreshLeadData(formData: FormData) {
  const leadId = formData.get("leadId");
  if (typeof leadId !== "string" || !leadId.trim()) return;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { artist: true },
  });

  if (!lead) return;

  const ingestUrl = process.env.INGEST_URL || "http://localhost:3000/api/ingest";

  const payload = {
    lead: { id: leadId, status: lead.status },
    artist: {
      name: lead.artist.name,
      instagramHandle: lead.artist.instagramHandle ?? undefined,
      instagramProfileUrl: lead.artist.instagramProfileUrl ?? undefined,
      spotifyArtistId: lead.artist.spotifyArtistId ?? undefined,
      spotifyArtistUrl: lead.artist.spotifyArtistUrl ?? undefined,
      officialSiteUrl: lead.artist.officialSiteUrl ?? undefined,
    },
  };

  try {
    const response = await fetch(ingestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: "NOTE",
          note: `Refresh failed (${response.status}). ${text.slice(0, 120)}`,
        },
      });
      return;
    }

    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: "NOTE",
        note: "Refreshed Spotify/Instagram data.",
      },
    });
  } catch (error) {
    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: "NOTE",
        note: `Refresh failed. ${error instanceof Error ? error.message : "Unknown error"}`,
      },
    });
  }

  await scoreLead(leadId);
  revalidatePath(`/leads/${leadId}`);
}

export async function updateArtistHandle(state: {
  leadId: string;
  instagramHandle: string;
}) {
  const lead = await prisma.lead.findUnique({
    where: { id: state.leadId },
    include: { artist: true },
  });

  if (!lead) return;

  const normalized = state.instagramHandle.trim().replace("@", "");
  if (!normalized) return;

  await prisma.artist.update({
    where: { id: lead.artist.id },
    data: { instagramHandle: normalized },
  });

  await prisma.activity.create({
    data: {
      leadId: lead.id,
      type: "STATUS_CHANGE",
      note: `Instagram handle updated to @${normalized}`,
    },
  });

  revalidatePath(`/leads/${lead.id}`);
}
