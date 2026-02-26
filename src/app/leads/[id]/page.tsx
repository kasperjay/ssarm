import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@/generated/prisma";
import DraftCopy from "./DraftCopy";
import SendMessageModal from "./SendMessageModal";
import {
  generateDraftsForLead,
  markContacted,
  refreshLeadData,
  regenerateDraft,
  updateArtistHandle,
  updateLeadStatus,
} from "./actions";

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const formatRelativeDate = (date: Date | null | undefined) => {
  if (!date) return "Unknown";
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (Math.abs(diffDays) < 7) {
    return formatter.format(diffDays, "day");
  }
  const diffWeeks = Math.round(diffDays / 7);
  if (Math.abs(diffWeeks) < 5) {
    return formatter.format(diffWeeks, "week");
  }
  const diffMonths = Math.round(diffDays / 30);
  return formatter.format(diffMonths, "month");
};

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

const formatLocation = (
  location: string | null,
  city: string | null,
  state: string | null,
  country: string | null
) => {
  if (location) return location;
  const parts = [city, state, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown";
};

const proxiedHelper = (url: string | null) => {
  if (!url) return undefined;
  if (
    url.includes("fbcdn.net") ||
    url.includes("instagram.com") ||
    url.includes("scdn.co") ||
    url.includes("spotifycdn.com")
  ) {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }
  return url;
};

const hexToRgb = (hex?: string | null) => {
  if (!hex) return null;
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return null;
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) return null;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const statusOptions: LeadStatus[] = [
  "NEW",
  "QUALIFIED",
  "CONTACTED",
  "FOLLOW_UP",
  "WON",
  "LOST",
];

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ rPage?: string; pPage?: string }>;
};

const parsePage = (value?: string) => {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

export default async function LeadDetailPage({
  params,
  searchParams,
}: LeadDetailPageProps) {
  const { id } = await params;
  const { rPage, pPage } = await searchParams;
  const releasePage = parsePage(rPage);
  const postPage = parsePage(pPage);
  const pageSize = 1;

  let lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      artist: true,
      messages: { orderBy: { createdAt: "desc" } },
      activities: { orderBy: { occurredAt: "desc" } },
    },
  });

  if (!lead) {
    notFound();
  }

  const hasReachoutDraft = lead.messages.some((message) => message.source === "reachout");
  if (!hasReachoutDraft) {
    await generateDraftsForLead(lead.id);
    lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        artist: true,
        messages: { orderBy: { createdAt: "desc" } },
        activities: { orderBy: { occurredAt: "desc" } },
      },
    });
    if (!lead) notFound();
  }

  const spotifyImageUrl = lead.artist.spotifyImageUrl;
  const accentStyle = lead.artist.spotifyAccent
    ? ({
        "--accent": lead.artist.spotifyAccent,
        "--accent-strong": lead.artist.spotifyAccentStrong ?? lead.artist.spotifyAccent,
        "--highlight": lead.artist.spotifyHighlight ?? lead.artist.spotifyAccent,
      } as CSSProperties)
    : undefined;
  const accentRgb = hexToRgb(lead.artist.spotifyAccent);
  const accentOverlay = accentRgb
    ? `radial-gradient(circle_at_top, rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.25), transparent 60%)`
    : "radial-gradient(circle_at_top, rgba(35,211,255,0.2), transparent 60%)";
  const headerStyle = spotifyImageUrl
    ? undefined
    : {
        backgroundImage: `${accentOverlay}, radial-gradient(circle_at_20%_20%, rgba(139,92,246,0.22), transparent 45%), linear-gradient(180deg, rgba(5,7,10,0.95), rgba(5,7,10,1))`,
      };

  const postWhere = {
    artistId: lead.artist.id,
    OR: [
      { caption: { not: null } },
      { imageUrl: { not: null } },
      { url: { not: null } },
    ],
  };

  const [releaseRows, postRows, releaseCount, postCount] = await Promise.all([
    prisma.release.findMany({
      where: { artistId: lead.artist.id },
      orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
      skip: (releasePage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.instagramPost.findMany({
      where: postWhere,
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
      skip: (postPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.release.count({ where: { artistId: lead.artist.id } }),
    prisma.instagramPost.count({ where: postWhere }),
  ]);
  const releaseTotalPages = Math.max(1, Math.ceil(releaseCount / pageSize));
  const postTotalPages = Math.max(1, Math.ceil(postCount / pageSize));
  const featuredRelease = releaseRows[0] ?? null;
  const featuredPost = postRows[0] ?? null;
  const instagramAvatar = proxiedHelper(
    lead.artist.instagramProfileImageUrl ?? featuredPost?.imageUrl ?? null
  );
  const instagramBio = lead.artist.bio ?? "No bio yet.";

  return (
    <div
      className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(35,211,255,0.18),transparent_55%),radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.2),transparent_45%),linear-gradient(180deg,rgba(5,7,10,0.95),rgba(5,7,10,1))]"
      style={accentStyle}
    >
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
        <header
          className="relative flex flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--surface)] bg-cover bg-center p-8 shadow-[0_30px_80px_-60px_rgba(35,211,255,0.35)]"
          style={headerStyle}
        >
          {spotifyImageUrl ? (
            <div className="pointer-events-none absolute inset-0 z-0">
              <Image
                src={spotifyImageUrl}
                alt={`${lead.artist.name} banner`}
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
            <div className="rounded-2xl border border-white/15 bg-[color:var(--surface-glass)] p-4 shadow-[0_20px_60px_-45px_rgba(5,7,10,0.8)] backdrop-blur-lg">
              <Link
                href="/"
                className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]"
              >
                Back to Lead Desk
              </Link>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl leading-tight text-[color:var(--foreground)] md:text-5xl">
                {lead.artist.name}
              </h1>
              <p className="text-sm text-[color:var(--muted)]">
                {formatLocation(
                  lead.artist.location,
                  lead.artist.city,
                  lead.artist.state,
                  lead.artist.country
                )}
                {lead.artist.genre ? ` · ${lead.artist.genre}` : ""}
              </p>
            </div>
            <div className="flex flex-1 flex-col gap-3 rounded-2xl border border-white/15 bg-[color:var(--surface-glass-strong)] p-4 shadow-[0_20px_60px_-45px_rgba(5,7,10,0.8)] backdrop-blur-lg">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <form
                  action={async (formData) => {
                    "use server";
                    const status = formData.get("status");
                    if (typeof status === "string" && statusOptions.includes(status as LeadStatus)) {
                      await updateLeadStatus({ leadId: lead.id, status: status as LeadStatus });
                    }
                  }}
                  className="flex flex-wrap items-center gap-2"
                >
                  <label className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={lead.status}
                    className="rounded-full border border-white/10 bg-[color:var(--surface-strong)] px-3 py-2 text-xs font-semibold text-[color:var(--foreground)]"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {formatStatus(status)}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-full bg-[color:var(--foreground)] px-4 py-2 text-xs font-semibold text-[color:var(--surface)] transition hover:bg-white/80"
                  >
                    Update
                  </button>
                </form>
                <form action={refreshLeadData} className="flex justify-end">
                  <input type="hidden" name="leadId" value={lead.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
                  >
                    Refresh data
                  </button>
                </form>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <form
                  action={async () => {
                    "use server";
                    await markContacted({ leadId: lead.id });
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-full border border-white/10 bg-[color:var(--surface-strong)] px-3 py-2 text-xs font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)]"
                  >
                    Mark contacted
                  </button>
                </form>
                {[3, 7, 14].map((days) => (
                  <form
                    key={days}
                    action={async () => {
                      "use server";
                      const nextActionAt = new Date();
                      nextActionAt.setDate(nextActionAt.getDate() + days);
                      await markContacted({ leadId: lead.id, nextActionAt });
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-full border border-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
                    >
                      +{days} days
                    </button>
                  </form>
                ))}
                <SendMessageModal
                  leadId={lead.id}
                  label="Send custom"
                  source="custom"
                  variant="primary"
                />
              </div>
            </div>
          </div>
          <div className="relative z-20 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Latest release
              </p>
              {featuredRelease?.url ? (
                <Link
                  href={featuredRelease.url}
                  target="_blank"
                  className="mt-2 inline-flex text-lg font-semibold text-[color:var(--foreground)] transition hover:text-[color:var(--accent)]"
                >
                  {featuredRelease.title}
                </Link>
              ) : (
                <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">
                  {featuredRelease?.title ?? "No release data"}
                </p>
              )}
              <p className="text-xs text-[color:var(--muted)]">
                {featuredRelease?.releaseDate
                  ? formatRelativeDate(featuredRelease.releaseDate)
                  : "Unknown"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Instagram
              </p>
              <p className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">
                {lead.artist.followerCount?.toLocaleString() ?? "Unknown"} followers
              </p>
              <p className="text-xs text-[color:var(--muted)]">
                {lead.artist.lastPostAt
                  ? `Last post ${formatRelativeDate(lead.artist.lastPostAt)}`
                  : "No recent post"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                  Lead notes
                </p>
                <div className="rounded-xl border border-white/10 bg-[color:var(--surface)] px-3 py-2 text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    Lead Score
                  </p>
                  <p className="text-lg font-semibold text-[color:var(--foreground)]">
                    {lead.score?.toFixed(0) ?? "-"}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-[color:var(--foreground)]">
                {lead.scoreRationale ?? "No rationale added yet."}
              </p>
            </div>
          </div>
        </header>

        <main className="flex flex-col gap-8">
          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] p-6 shadow-[0_40px_90px_-70px_rgba(35,211,255,0.3)]">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
                  Instagram Posts
                </h2>
                <span className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                  {postCount} total
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)] p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-[color:var(--surface-strong)]">
                      {instagramAvatar ? (
                        <img
                          src={instagramAvatar}
                          alt={`${lead.artist.name} avatar`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                          IG
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <form
                        action={async (formData) => {
                          "use server";
                          const handle = formData.get("handle");
                          if (typeof handle === "string") {
                            await updateArtistHandle({
                              leadId: lead.id,
                              instagramHandle: handle,
                            });
                          }
                        }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-sm font-semibold text-[color:var(--muted)]">@</span>
                        <input
                          name="handle"
                          defaultValue={lead.artist.instagramHandle ?? ""}
                          placeholder="handle"
                          className="w-full rounded-md border border-white/10 bg-transparent px-2 py-0.5 text-sm font-semibold text-[color:var(--foreground)] focus:border-(--accent) focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="rounded-lg border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-(--muted) hover:bg-white/10 hover:text-foreground"
                        >
                          Save
                        </button>
                      </form>
                      <p className="mt-1 text-xs text-[color:var(--muted)]">
                        {lead.artist.followerCount?.toLocaleString() ?? "Unknown"} followers ·
                        {" "}
                        {lead.artist.lastPostAt
                          ? `Last post ${formatRelativeDate(lead.artist.lastPostAt)}`
                          : "No recent post"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 max-h-28 overflow-y-auto text-sm text-[color:var(--foreground)] pr-1">
                    {instagramBio}
                  </div>
                </div>
                {featuredPost ? (
                  <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                        {formatRelativeDate(featuredPost.postedAt ?? featuredPost.createdAt)}
                        </p>
                      {featuredPost.url ? (
                        <Link
                          href={featuredPost.url}
                          className="text-xs text-[color:var(--accent-strong)]"
                          target="_blank"
                        >
                          Open post
                        </Link>
                      ) : null}
                    </div>
                      <div className="mt-4 grid gap-4 lg:grid-cols-[0.45fr_0.55fr]">
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[color:var(--surface-strong)]">
                          {featuredPost.imageUrl ? (
                            <img
                              src={proxiedHelper(featuredPost.imageUrl)}
                            alt="Instagram post"
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          ) : (
                              <div className="flex h-full min-h-[160px] items-center justify-center text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                                No image
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col justify-between gap-3">
                            <div className="text-sm text-[color:var(--foreground)] max-h-40 overflow-y-auto pr-1">
                              {featuredPost.caption ?? "No caption."}
                            </div>
                            {featuredPost.url ? (
                              <Link
                                href={featuredPost.url}
                                className="inline-flex items-center text-xs font-semibold text-[color:var(--accent)]"
                                target="_blank"
                              >
                                View on Instagram
                              </Link>
                            ) : null}
                          </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/20 bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)]">
                      No Instagram posts yet.
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-[color:var(--muted)]">
                <Link
                  href={`/leads/${lead.id}?rPage=${releasePage}&pPage=${Math.max(1, postPage - 1)}`}
                  className={`rounded-full border border-white/10 px-3 py-1 ${
                    postPage === 1 ? "pointer-events-none opacity-50" : "hover:border-[color:var(--accent)]"
                  }`}
                >
                  Previous
                </Link>
                <span>
                  Page {postPage} of {postTotalPages}
                </span>
                <Link
                  href={`/leads/${lead.id}?rPage=${releasePage}&pPage=${Math.min(postTotalPages, postPage + 1)}`}
                  className={`rounded-full border border-white/10 px-3 py-1 ${
                    postPage === postTotalPages
                      ? "pointer-events-none opacity-50"
                      : "hover:border-[color:var(--accent)]"
                  }`}
                >
                  Next
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] p-6">
              <div className="grid h-full grid-rows-[auto_1fr_auto] gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
                    Recent Releases
                  </h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                    {releaseCount} total
                  </span>
                </div>
                <div className="flex flex-col gap-4">
                  {featuredRelease ? (
                    <div className="rounded-2xl border border-white/10 bg-[color:var(--surface)] p-5 sm:p-6">
                      <div className="flex flex-col items-center gap-4">
                        <div className="h-48 w-48 overflow-hidden rounded-[32px] border border-white/10 bg-[color:var(--surface-strong)] sm:h-56 sm:w-56">
                          {featuredRelease.imageUrl ? (
                            <img
                              src={proxiedHelper(featuredRelease.imageUrl)}
                              alt={`${featuredRelease.title} cover`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                              Art
                            </div>
                          )}
                        </div>
                        {featuredRelease.url ? (
                          <iframe
                            src={featuredRelease.url.replace("open.spotify.com/", "open.spotify.com/embed/")}
                            width="100%"
                            height="232"
                            allow="encrypted-media; clipboard-write; fullscreen; picture-in-picture"
                            className="rounded-2xl border border-white/10 bg-[color:var(--surface-strong)]"
                            title="Spotify player"
                          />
                        ) : null}
                        <div className="flex w-full flex-col items-center gap-2 text-center">
                          {featuredRelease.url ? (
                            <Link
                              href={featuredRelease.url}
                              target="_blank"
                              className="text-xl font-semibold text-[color:var(--foreground)] underline decoration-[color:var(--accent)] decoration-2 underline-offset-4"
                            >
                              {featuredRelease.title}
                            </Link>
                          ) : (
                            <p className="text-xl font-semibold text-[color:var(--foreground)]">
                              {featuredRelease.title}
                            </p>
                          )}
                          <p className="text-sm text-[color:var(--muted)]">
                            {formatRelativeDate(featuredRelease.releaseDate ?? featuredRelease.createdAt)}
                          </p>
                          <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-[color:var(--muted)]">
                            {featuredRelease.releaseType ? (
                              <span className="rounded-full border border-white/10 bg-[color:var(--surface-strong)] px-3 py-1">
                                {featuredRelease.releaseType}
                              </span>
                            ) : null}
                            {lead.artist.genre ? (
                              <span className="rounded-full border border-white/10 bg-[color:var(--surface-strong)] px-3 py-1">
                                {lead.artist.genre}
                              </span>
                            ) : null}
                            {lead.artist.name ? (
                              <span className="rounded-full border border-white/10 bg-[color:var(--surface-strong)] px-3 py-1">
                                {lead.artist.name}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/20 bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)]">
                      No releases yet.
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-[color:var(--muted)]">
                  <Link
                    href={`/leads/${lead.id}?rPage=${Math.max(1, releasePage - 1)}&pPage=${postPage}`}
                    className={`rounded-full border border-white/10 px-3 py-1 ${
                      releasePage === 1 ? "pointer-events-none opacity-50" : "hover:border-[color:var(--accent)]"
                    }`}
                  >
                    Previous
                  </Link>
                  <span>
                    Page {releasePage} of {releaseTotalPages}
                  </span>
                  <Link
                    href={`/leads/${lead.id}?rPage=${Math.min(releaseTotalPages, releasePage + 1)}&pPage=${postPage}`}
                    className={`rounded-full border border-white/10 px-3 py-1 ${
                      releasePage === releaseTotalPages
                        ? "pointer-events-none opacity-50"
                        : "hover:border-[color:var(--accent)]"
                    }`}
                  >
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
                Outreach Drafts
              </h2>
              <span className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                {lead.messages.length} drafts
              </span>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {lead.messages.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/20 bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)] sm:col-span-2 xl:col-span-3">
                  No drafts yet.
                </div>
              ) : (
                lead.messages.map((message) => (
                  <div
                    key={message.id}
                    className="group relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-[color:var(--surface)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                        {message.tone ?? "Draft"}
                      </p>
                      <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                        <DraftCopy text={message.body} />
                        <details className="relative">
                          <summary className="list-none rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[color:var(--muted)] transition hover:border-[color:var(--accent)] cursor-pointer">
                            Edit
                          </summary>
                          <div className="absolute right-0 z-20 mt-2 w-48 rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] p-2 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.5)]">
                            <form action={regenerateDraft}>
                              <input type="hidden" name="leadId" value={lead.id} />
                              <input type="hidden" name="draftId" value={message.id} />
                              <input type="hidden" name="tone" value={message.tone ?? "Draft"} />
                              <input type="hidden" name="styleHint" value="more professional" />
                              <button type="submit" className="flex w-full items-center justify-between rounded-xl px-2 py-1 text-xs text-[color:var(--foreground)] transition hover:bg-white/5">
                                More professional
                              </button>
                            </form>
                            <form action={regenerateDraft}>
                              <input type="hidden" name="leadId" value={lead.id} />
                              <input type="hidden" name="draftId" value={message.id} />
                              <input type="hidden" name="tone" value={message.tone ?? "Draft"} />
                              <input type="hidden" name="styleHint" value="more casual" />
                              <button type="submit" className="flex w-full items-center justify-between rounded-xl px-2 py-1 text-xs text-[color:var(--foreground)] transition hover:bg-white/5">
                                More casual
                              </button>
                            </form>
                            <form action={regenerateDraft}>
                              <input type="hidden" name="leadId" value={lead.id} />
                              <input type="hidden" name="draftId" value={message.id} />
                              <input type="hidden" name="tone" value={message.tone ?? "Draft"} />
                              <input type="hidden" name="styleHint" value="more fun" />
                              <button type="submit" className="flex w-full items-center justify-between rounded-xl px-2 py-1 text-xs text-[color:var(--foreground)] transition hover:bg-white/5">
                                More fun
                              </button>
                            </form>
                            <form action={regenerateDraft}>
                              <input type="hidden" name="leadId" value={lead.id} />
                              <input type="hidden" name="draftId" value={message.id} />
                              <input type="hidden" name="tone" value={message.tone ?? "Draft"} />
                              <input type="hidden" name="styleHint" value="more boring" />
                              <button type="submit" className="flex w-full items-center justify-between rounded-xl px-2 py-1 text-xs text-[color:var(--foreground)] transition hover:bg-white/5">
                                More boring
                              </button>
                            </form>
                            <form action={regenerateDraft}>
                              <input type="hidden" name="leadId" value={lead.id} />
                              <input type="hidden" name="draftId" value={message.id} />
                              <input type="hidden" name="tone" value={message.tone ?? "Draft"} />
                              <input type="hidden" name="styleHint" value="random" />
                              <button type="submit" className="flex w-full items-center justify-between rounded-xl px-2 py-1 text-xs text-[color:var(--foreground)] transition hover:bg-white/5">
                                Random
                              </button>
                            </form>
                            <div className="mt-1 border-t border-white/10 pt-1">
                              <SendMessageModal
                                leadId={lead.id}
                                label="Customize"
                                defaultBody={message.body}
                                source="draft-edit"
                              />
                            </div>
                          </div>
                        </details>
                        <SendMessageModal
                          leadId={lead.id}
                          label="Send"
                          defaultBody={message.body}
                          source="draft"
                          variant="primary"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-[color:var(--foreground)]">{message.body}</p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[color:var(--surface)] p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[color:var(--foreground)]">
                Activity Timeline
              </h2>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--muted)]">
                {lead.activities.length} events
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {lead.activities.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/20 bg-[color:var(--surface-strong)] p-4 text-xs text-[color:var(--muted)]">
                  No activity yet.
                </div>
              ) : (
                lead.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted)]">
                        {formatStatus(activity.type)}
                      </p>
                      <p className="text-[10px] text-[color:var(--muted)]">
                        {formatRelativeDate(activity.occurredAt)}
                      </p>
                    </div>
                    {activity.note ? (
                      <p className="mt-2 text-xs text-[color:var(--foreground)]">
                        {activity.note}
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
