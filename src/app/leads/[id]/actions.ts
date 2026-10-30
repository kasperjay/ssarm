"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "local-prisma-client";
import { generateReachoutDrafts } from "@/lib/reachout";
import { getBestShowContext, formatPostWithTimestamp } from "@/lib/show-parser";
import { scoreLead } from "@/lib/scoring";
import { ensureBotRunning, isBotLoggedIn } from "@/lib/instagram-bot";
import { sendEmail } from "@/lib/email-sender";
import { appendContactRow, inferContactMethod } from "@/lib/google-sheets";
import { buildBookingUrl, buildBookingMessage } from "@/lib/google-calendar";
import { parseLocationString } from "@/lib/location-parser";
import { fetchSpotifyArtistProfile, fetchSpotifyReleases } from "@/lib/spotify";
import { extractAccentFromImage } from "@/lib/accent-palette";

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
  tone?: string;
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

  revalidatePath("/leads");
  revalidatePath("/");
  revalidatePath("/operations");
  revalidatePath(`/leads/${state.leadId}`);
}

export async function markContacted(state: LeadActionState) {
  const lead = await prisma.lead.findUnique({
    where: { id: state.leadId },
    include: { artist: true },
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

  const contactMethod = inferContactMethod({ hasEmail: (lead.artist.emails?.length ?? 0) > 0 });
  appendContactRow({
    artistName: lead.artist.name,
    contactMethod,
    instagramHandle: lead.artist.instagramHandle,
    email: lead.artist.emails?.[0],
    website: lead.artist.officialSiteUrl,
    dateContacted: new Date(),
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
  const isEmail = state.tone?.toLowerCase().includes("email") || false;
  let sendOk = false;
  let errorMessage: string | undefined;

  if (isEmail) {
    const to = lead.artist.emails?.[0];
    if (!to) {
      return { ok: false, error: "Artist does not have an email address on file." };
    }
    try {
      let subject = `Inquiry regarding ${lead.artist.name}`;
      let bodyText = trimmed;
      const subjectMatch = trimmed.match(/^Subject:\s*(.+?)(?:\r?\n\r?\n|\r?\n)/i);
      if (subjectMatch) {
        subject = subjectMatch[1].trim();
        bodyText = trimmed.slice(subjectMatch[0].length).trim();
      }
      await sendEmail(to, subject, bodyText.replace(/\n/g, "<br>"));
      sendOk = true;
    } catch (error) {
      sendOk = false;
      errorMessage = error instanceof Error ? error.message : "SMTP email delivery failed";
    }
  } else {
    // IG DM Channel
    const webhookUrl = process.env.IG_DM_WEBHOOK_URL;
    if (!webhookUrl) {
      return { ok: false, error: "Instagram DM bot webhook is not configured." };
    }
    if (!lead.artist.instagramHandle) {
      return { ok: false, error: "Artist does not have an Instagram handle on file." };
    }

    // Ensure the bot is running before attempting to send
    await ensureBotRunning();

    // Verify bot login session before queueing
    const botLogin = await isBotLoggedIn();
    if (!botLogin.loggedIn) {
      return {
        ok: false,
        error: botLogin.error || "Instagram DM bot is not logged in. Instagram session cookies have expired.",
      };
    }

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
        try {
          const json = JSON.parse(text);
          errorMessage = json.error || `Bot server error (${response.status})`;
        } catch {
          errorMessage = `Bot server error (${response.status}): ${text.slice(0, 100)}`;
        }
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
        selected: false,
        ...(state.tone ? { tone: state.tone } : {}),
      },
    });

    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: "NOTE",
        note: `Send failed via ${isEmail ? "Email" : "IG webhook"}: ${errorMessage}`,
      },
    });

    return { ok: false, error: errorMessage ?? `Failed to send via ${isEmail ? "Email" : "IG webhook"}.` };
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
      ...(state.tone ? { tone: state.tone } : {}),
    },
  });

  await prisma.messageDraft.deleteMany({
    where: {
      leadId: lead.id,
      source: "reachout",
      ...(state.tone ? { tone: state.tone } : {}),
    },
  });

  const contactMethod = inferContactMethod({ hasEmail: (lead.artist.emails?.length ?? 0) > 0 });
  appendContactRow({
    artistName: lead.artist.name,
    contactMethod,
    instagramHandle: lead.artist.instagramHandle,
    email: lead.artist.emails?.[0],
    website: lead.artist.officialSiteUrl,
    messageText: trimmed,
    dateContacted: new Date(),
  });

  revalidatePath(`/leads/${lead.id}`);
  revalidatePath("/leads");
  redirect("/leads");
}

type SendCalendarLinkState = {
  leadId: string;
  channel?: "ig" | "copy";
};

export async function sendCalendarLink(state: SendCalendarLinkState) {
  const channel = state.channel ?? "ig";
  const lead = await prisma.lead.findUnique({
    where: { id: state.leadId },
    include: { artist: true },
  });

  if (!lead) return { ok: false, error: "Lead not found." };

  const bookingUrl = buildBookingUrl({
    artistName: lead.artist.name,
    artistEmail: lead.artist.emails?.[0] ?? null,
    artistHandle: lead.artist.instagramHandle,
  });

  const messageBody = buildBookingMessage({
    artistName: lead.artist.name,
    bookingUrl,
  });

  if (channel === "ig") {
    const webhookUrl = process.env.IG_DM_WEBHOOK_URL;
    if (webhookUrl) {
      await ensureBotRunning();
      const botLogin = await isBotLoggedIn();
      if (!botLogin.loggedIn) {
        return {
          ok: false,
          bookingUrl,
          error: botLogin.error || "Instagram DM bot is not logged in. Session cookies have expired.",
        };
      }
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
              body: messageBody,
              source: "calendar_link",
            },
            followUpAt: null,
          }),
        });

        if (!response.ok) {
          const text = await response.text().catch(() => "No response body");
          console.error("Calendar link IG DM failed", response.status, text);
          return {
            ok: false,
            bookingUrl,
            error: `Bot server error (${response.status}): ${text.slice(0, 100)}`,
          };
        }
      } catch (error) {
        console.error("Failed to call IG DM webhook for calendar link", error);
        return {
          ok: false,
          bookingUrl,
          error: error instanceof Error ? error.message : "Network error",
        };
      }
    }
  }

  const nextActionAt = getFollowUpDate();

  await prisma.lead.update({
    where: { id: lead.id },
    data: {
      status: "CONTACTED",
      lastContactedAt: new Date(),
      ...(nextActionAt ? { nextActionAt } : {}),
    },
  });

  await prisma.activity.create({
    data: {
      leadId: lead.id,
      type: "MESSAGE_SENT",
      note: channel === "ig"
        ? `Sent Google Calendar booking link via IG DM: ${bookingUrl}`
        : `Generated Google Calendar booking link: ${bookingUrl}`,
    },
  });

  await prisma.messageDraft.create({
    data: {
      leadId: lead.id,
      body: messageBody,
      source: "calendar_link",
      selected: true,
    },
  });

  const contactMethod = inferContactMethod({
    hasEmail: (lead.artist.emails?.length ?? 0) > 0,
  });
  appendContactRow({
    artistName: lead.artist.name,
    contactMethod,
    instagramHandle: lead.artist.instagramHandle,
    email: lead.artist.emails?.[0],
    website: lead.artist.officialSiteUrl,
    messageText: messageBody,
    dateContacted: new Date(),
  });

  revalidatePath(`/leads/${lead.id}`);
  revalidatePath("/leads");

  return { ok: true, bookingUrl };
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
      activities: { orderBy: { occurredAt: "desc" } },
    },
  });

  if (!lead) return;

  const now = new Date();
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
    ? Math.floor((now.getTime() - releaseDate.getTime()) / 86400000)
    : null;
  const isRecentRelease =
    daysSinceRelease !== null && daysSinceRelease >= -2 && daysSinceRelease <= 90;
  const releaseTiming = daysSinceRelease !== null
    ? (daysSinceRelease < 0
        ? `Upcoming release scheduled for ${formatPrettyDate(releaseDate)}`
        : `Released on ${formatPrettyDate(releaseDate)} (${daysSinceRelease === 0 ? "today" : `${daysSinceRelease} days ago`})`)
    : null;

  const recentPosts = instagramPosts
    .map((post) => formatPostWithTimestamp(post, now))
    .filter(Boolean)
    .join(" | ");

  const personalHook =
    lead.scoreRationale && lead.scoreRationale.length <= 160
      ? lead.scoreRationale
      : null;

  const { upcomingShow, recentPastShow } = getBestShowContext(lead.activities, now);

  const evidenceList = Array.isArray(lead.productionNeedEvidence)
    ? (lead.productionNeedEvidence as string[])
    : typeof lead.productionNeedEvidence === "string"
      ? [lead.productionNeedEvidence]
      : [];

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
    releaseTiming,
    isRecentRelease,
    personalHook,
    recentPosts,
    upcomingShow: upcomingShow
      ? {
          title: upcomingShow.title,
          venue: upcomingShow.venue,
          datePretty: upcomingShow.dateStr,
          daysUntil: upcomingShow.daysDiff,
        }
      : null,
    recentPastShow: recentPastShow
      ? {
          title: recentPastShow.title,
          venue: recentPastShow.venue,
          datePretty: recentPastShow.dateStr,
          daysAgo: Math.abs(recentPastShow.daysDiff),
        }
      : null,
    bio: lead.artist.bio,
    hasEmail: (lead.artist.emails?.length ?? 0) > 0,
    portfolioOffer: true,
    styleHint: styleHint ?? undefined,
    productionNeedLevel: lead.productionNeedLevel,
    productionNeedEvidence: evidenceList,
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
      activities: { orderBy: { occurredAt: "desc" } },
    },
  });

  if (!lead) return;

  const now = new Date();
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
    ? Math.floor((now.getTime() - releaseDate.getTime()) / 86400000)
    : null;
  const isRecentRelease =
    daysSinceRelease !== null && daysSinceRelease >= -2 && daysSinceRelease <= 90;
  const releaseTiming = daysSinceRelease !== null
    ? (daysSinceRelease < 0
        ? `Upcoming release scheduled for ${formatPrettyDate(releaseDate)}`
        : `Released on ${formatPrettyDate(releaseDate)} (${daysSinceRelease === 0 ? "today" : `${daysSinceRelease} days ago`})`)
    : null;

  const recentPosts = instagramPosts
    .map((post) => formatPostWithTimestamp(post, now))
    .filter(Boolean)
    .join(" | ");

  const personalHook =
    lead.scoreRationale && lead.scoreRationale.length <= 160
      ? lead.scoreRationale
      : null;

  const styleHint = typeof styleHintRaw === "string" ? styleHintRaw : undefined;

  const { upcomingShow, recentPastShow } = getBestShowContext(lead.activities, now);

  const evidenceList = Array.isArray(lead.productionNeedEvidence)
    ? (lead.productionNeedEvidence as string[])
    : typeof lead.productionNeedEvidence === "string"
      ? [lead.productionNeedEvidence]
      : [];

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
    releaseTiming,
    isRecentRelease,
    personalHook,
    recentPosts,
    upcomingShow: upcomingShow
      ? {
          title: upcomingShow.title,
          venue: upcomingShow.venue,
          datePretty: upcomingShow.dateStr,
          daysUntil: upcomingShow.daysDiff,
        }
      : null,
    recentPastShow: recentPastShow
      ? {
          title: recentPastShow.title,
          venue: recentPastShow.venue,
          datePretty: recentPastShow.dateStr,
          daysAgo: Math.abs(recentPastShow.daysDiff),
        }
      : null,
    bio: lead.artist.bio,
    hasEmail: (lead.artist.emails?.length ?? 0) > 0,
    portfolioOffer: true,
    styleHint,
    productionNeedLevel: lead.productionNeedLevel,
    productionNeedEvidence: evidenceList,
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

export async function regenerateAllDrafts(formData: FormData) {
  const leadId = formData.get("leadId");
  if (typeof leadId !== "string" || !leadId.trim()) return;
  await generateDraftsForLead(leadId, { shouldRevalidate: true });
  await prisma.activity.create({
    data: {
      leadId,
      type: "NOTE",
      note: "Regenerated all reachout drafts.",
    },
  });
}

export async function refreshLeadData(formData: FormData) {
  const leadId = formData.get("leadId");
  if (typeof leadId !== "string" || !leadId.trim()) return;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { artist: true },
  });

  if (!lead) return;

  const ingestUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/ingest`
    : "http://localhost:3000/api/ingest";

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

export async function trashLeadAction(formData: FormData) {
  const leadId = formData.get("leadId");
  if (typeof leadId !== "string") return;

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    select: { artistId: true },
  });

  if (!lead) return;

  // First delete the lead (and its messages/activities via cascade)
  await prisma.lead.delete({
    where: { id: leadId },
  });

  // Then attempt to delete the artist to completely scrub them.
  try {
    await prisma.artist.delete({
      where: { id: lead.artistId },
    });
  } catch (err) {
    console.error(`[trashLeadAction] Failed to delete artist:`, err);
  }

  revalidatePath("/leads/desk");
  redirect("/");
}

export async function updateArtistName(state: {
  artistId: string;
  name: string;
}) {
  const artist = await prisma.artist.findUnique({
    where: { id: state.artistId },
    include: { leads: true },
  });

  if (!artist || !state.name.trim()) return;

  const newName = state.name.trim();

  await prisma.artist.update({
    where: { id: artist.id },
    data: { name: newName },
  });

  // Log activity on all leads associated with this artist
  if (artist.leads.length > 0) {
    await prisma.activity.createMany({
       data: artist.leads.map(lead => ({
          leadId: lead.id,
          type: "STATUS_CHANGE",
          note: `Artist name updated from '${artist.name}' to '${newName}'`,
       }))
    });
  }

  // Revalidate paths
  revalidatePath("/");
  revalidatePath("/leads/desk");
  for (const lead of artist.leads) {
    revalidatePath(`/leads/${lead.id}`);
  }
}

export async function updateArtistLocation(state: {
  artistId: string;
  location: string;
}) {
  const artist = await prisma.artist.findUnique({
    where: { id: state.artistId },
    include: { leads: true },
  });

  if (!artist) return;

  const rawLocation = state.location?.trim() || "";
  const parsed = rawLocation ? parseLocationString(rawLocation) : null;

  const finalLocation = parsed?.formatted ?? (rawLocation || null);
  const finalCity = parsed?.city ?? null;
  const finalState = parsed?.state ?? null;
  const finalCountry = parsed?.country ?? null;

  await prisma.artist.update({
    where: { id: artist.id },
    data: {
      location: finalLocation,
      city: finalCity,
      state: finalState,
      country: finalCountry,
    },
  });

  // Re-score leads and record audit note
  for (const lead of artist.leads) {
    try {
      await scoreLead(lead.id);
    } catch (e) {
      console.error(`Failed to rescore lead ${lead.id}:`, e);
    }

    await prisma.activity.create({
      data: {
        leadId: lead.id,
        type: "STATUS_CHANGE",
        note: `Artist location updated from '${artist.location || "None"}' to '${finalLocation || "None"}'`,
      },
    });
    revalidatePath(`/leads/${lead.id}`);
  }

  revalidatePath("/");
  revalidatePath("/leads/desk");
}

/**
 * Parses a Spotify artist ID from a URL like:
 *   https://open.spotify.com/artist/3WrFJ7ztbogyGnTHbHJFl2
 * or a bare ID.
 */
function parseSpotifyArtistInput(input: string): { id: string; url: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  // Full URL
  const urlMatch = trimmed.match(/spotify\.com\/artist\/([A-Za-z0-9]+)/);
  if (urlMatch) {
    return {
      id: urlMatch[1],
      url: `https://open.spotify.com/artist/${urlMatch[1]}`,
    };
  }

  // Bare ID (alphanumeric, 22 chars typical)
  if (/^[A-Za-z0-9]{10,30}$/.test(trimmed)) {
    return {
      id: trimmed,
      url: `https://open.spotify.com/artist/${trimmed}`,
    };
  }

  return null;
}

export async function updateArtistSpotifyProfile(state: {
  artistId: string;
  leadId: string;
  spotifyInput: string;
}): Promise<{ ok: boolean; error?: string }> {
  const parsed = parseSpotifyArtistInput(state.spotifyInput);
  if (!parsed) {
    return { ok: false, error: "Invalid Spotify artist URL or ID." };
  }

  const artist = await prisma.artist.findUnique({
    where: { id: state.artistId },
    include: { leads: true },
  });
  if (!artist) return { ok: false, error: "Artist not found." };

  const spotifyOwner = await prisma.artist.findUnique({
    where: { spotifyArtistId: parsed.id },
    select: { id: true, name: true },
  });
  if (spotifyOwner && spotifyOwner.id !== artist.id) {
    return {
      ok: false,
      error: `That Spotify profile is already linked to ${spotifyOwner.name}. Choose a different artist profile.`,
    };
  }

  // Fetch new Spotify artist profile
  const profile = await fetchSpotifyArtistProfile(parsed.id);
  if (!profile) {
    return { ok: false, error: "Could not fetch Spotify artist data. Check the ID and try again." };
  }

  // Fetch releases for the new artist
  const releases = await fetchSpotifyReleases(parsed.id, 6);

  // Compute accent colors from the new image
  const newImageUrl = profile.imageUrl ?? null;
  const accent = newImageUrl ? await extractAccentFromImage(newImageUrl).catch(() => null) : null;

  await prisma.$transaction(async (tx) => {
    await tx.release.deleteMany({
      where: {
        artistId: artist.id,
        OR: [
          { spotifyReleaseId: { not: null } },
          { spotifyTrackId: { not: null } },
        ],
      },
    });

    await tx.artist.update({
      where: { id: artist.id },
      data: {
        spotifyArtistId: parsed.id,
        spotifyArtistUrl: profile.url ?? parsed.url,
        spotifyImageUrl: newImageUrl,
        spotifyAccent: accent?.accent ?? null,
        spotifyAccentStrong: accent?.accentStrong ?? null,
        spotifyHighlight: accent?.highlight ?? null,
        ...(profile.genres?.length ? { genre: profile.genres[0] } : {}),
      },
    });

    for (const release of releases) {
      const releaseData = {
        artistId: artist.id,
        title: release.title,
        releaseDate: release.releaseDate ? new Date(release.releaseDate) : undefined,
        imageUrl: release.imageUrl ?? undefined,
        url: release.url ?? undefined,
        releaseType: release.releaseType ?? undefined,
      };
      await tx.release.upsert({
        where: { spotifyReleaseId: release.spotifyReleaseId },
        update: releaseData,
        create: { ...releaseData, spotifyReleaseId: release.spotifyReleaseId },
      });
    }
  });

  // Log activity
  await prisma.activity.create({
    data: {
      leadId: state.leadId,
      type: "NOTE",
      note: `Spotify profile corrected → ${profile.name ?? parsed.id} (${parsed.url})`,
    },
  });

  // Re-score
  await scoreLead(state.leadId);

  revalidatePath(`/leads/${state.leadId}`);
  return { ok: true };
}


// ---------------------------------------------------------------------------
// Production Need Management
// ---------------------------------------------------------------------------

export type ProductionNeedLevel = "NONE" | "POSSIBLE" | "PROBABLE" | "CLEAR";

export type UpdateProductionNeedState = {
  leadId: string;
  level: ProductionNeedLevel;
  evidence: string[];
  note?: string;
};

export async function updateProductionNeed(state: UpdateProductionNeedState) {
  const { leadId, level, evidence, note } = state;

  const data: Record<string, unknown> = {
    productionNeedLevel: level,
    productionNeedEvidence: evidence,
    productionNeedEvidenceNote: level === "NONE" ? null : (note?.trim() || null),
  };

  if (level === "NONE") {
    data.productionNeedEvidence = [];
    data.productionNeedApprovedAt = null;
  } else {
    data.productionNeedApprovedAt = new Date();
  }

  await prisma.lead.update({ where: { id: leadId }, data });

  const cleanNote = note?.trim();
  const activityNote =
    level === "NONE"
      ? "Production need cleared (reset to NONE)"
      : `Production need set to ${level}. Evidence: ${evidence.join("; ")}${cleanNote ? ` — ${cleanNote}` : ""}`;

  await prisma.activity.create({
    data: { leadId, type: "NOTE", note: activityNote },
  });

  await scoreLead(leadId);

  revalidatePath(`/leads/${leadId}`);
  revalidatePath(`/leads`);
  revalidatePath(`/operations`);
}
