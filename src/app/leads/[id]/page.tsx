import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "@/generated/prisma";
import DraftCopy from "./DraftCopy";
import SendMessageModal from "./SendMessageModal";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { StatusPill } from "@/components/StatusPill";
import { DynamicThemeShell } from "@/components/DynamicThemeShell";
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

const formatStatusLabel = (status: string) =>
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
  const parts = [city, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Remote Record";
};

const proxiedHelper = (url: string | null) => {
  if (!url) return undefined;
  if (
    url.includes("fbcdn.net") ||
    url.includes("instagram.com") ||
    url.includes("fbsbx.com") ||
    url.includes("cdninstagram.com") ||
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
  const canGenerateDrafts = lead.status === "NEW" || lead.status === "QUALIFIED";
  if (!hasReachoutDraft && canGenerateDrafts) {
    await generateDraftsForLead(lead.id, { shouldRevalidate: false });
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
  // Use proxied URL for canvas extraction (avoids CORS on direct CDN URLs)
  const themeImageUrl = spotifyImageUrl
    ? `/api/proxy?url=${encodeURIComponent(spotifyImageUrl)}`
    : null;

  const postWhere = {
    artistId: lead.artist.id,
    imageUrl: { not: "" },
    OR: [
      { caption: { not: "" } },
      { url: { not: "" } },
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
  const instagramBio = lead.artist.bio ?? "No telemetry found.";

  return (
    <DynamicThemeShell
      imageUrl={themeImageUrl}
      artistName={lead.artist.name}
      genre={lead.artist.genre}
    >
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
        <header className="relative w-full">
          <div className="flex flex-wrap items-end justify-between gap-8 pb-8 border-b border-white/10">
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 group text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors">
                <span className="transition-transform group-hover:-translate-x-1">←</span> Lead Desk
              </Link>
              <div className="flex items-center gap-6">
                <div className="h-20 w-20 overflow-hidden rounded-2xl border border-white/10 bg-white/5 relative shadow-2xl">
                  {spotifyImageUrl ? (
                    <Image
                      src={spotifyImageUrl}
                      alt={lead.artist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted uppercase tracking-[0.2em]">ART</div>
                  )}
                </div>
                <div className="space-y-1">
                  <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                    {lead.artist.name}
                  </h1>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted flex items-center gap-2">
                    <span className="h-px w-4 bg-accent/40" />
                    {formatLocation(lead.artist.location, lead.artist.city, lead.artist.state, lead.artist.country)}
                    <span className="text-accent/30">//</span>
                    {lead.artist.genre || "Universal Sound"}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <GlassCard className="p-4! border-accent/20">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-muted mb-1">Status</span>
                    <StatusPill status={lead.status} />
                  </div>
                  <div className="h-8 w-px bg-white/10" />
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-bold uppercase tracking-widest text-muted mb-1">Index Score</span>
                    <span className="text-2xl font-mono text-accent">{lead.score?.toFixed(0) || "0"}</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-6 bg-white/5 rounded-2xl p-4 border border-white/5 backdrop-blur-sm">
            <div className="flex flex-wrap items-center gap-3">
              <form
                action={async (formData) => {
                  "use server";
                  const status = formData.get("status");
                  if (typeof status === "string" && statusOptions.includes(status as LeadStatus)) {
                    await updateLeadStatus({ leadId: lead.id, status: status as LeadStatus });
                  }
                }}
                className="flex items-center gap-2"
              >
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="rounded-xl border border-white/10 bg-surface px-4 py-2 text-xs font-bold uppercase tracking-widest text-foreground focus:border-accent focus:outline-none appearance-none cursor-pointer"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {formatStatusLabel(status)}
                    </option>
                  ))}
                </select>
                <NeonButton variant="outline" size="sm" type="submit">Update</NeonButton>
              </form>
              <div className="h-6 w-px bg-white/10 mx-2" />
              <form
                action={async () => {
                  "use server";
                  await markContacted({ leadId: lead.id });
                }}
              >
                <NeonButton type="submit" variant="outline" size="sm">Mark Contacted</NeonButton>
              </form>
              <div className="flex items-center gap-1">
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
                      className="rounded-lg border border-white/5 px-2 py-1.5 text-[8px] font-bold uppercase tracking-widest text-muted transition hover:bg-white/10 hover:text-accent"
                    >
                      +{days}d
                    </button>
                  </form>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <SendMessageModal
                leadId={lead.id}
                label="Compose Direct"
                source="custom"
                variant="primary"
              />
              <form action={refreshLeadData}>
                <input type="hidden" name="leadId" value={lead.id} />
                <button
                  type="submit"
                  className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-muted hover:text-accent hover:border-accent transition-all"
                  title="Refresh Intelligence"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-500"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="grid gap-10">
          <section className="grid gap-10 lg:grid-cols-3">
            <GlassCard className="justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted mb-4">Latest Transmission</p>
                {featuredRelease?.url ? (
                  <Link
                    href={featuredRelease.url}
                    target="_blank"
                    className="text-xl font-bold text-foreground transition hover:text-accent block truncate"
                  >
                    {featuredRelease.title}
                  </Link>
                ) : (
                  <p className="text-xl font-bold text-foreground truncate">
                    {featuredRelease?.title ?? "Offline"}
                  </p>
                )}
                <p className="mt-1 text-[10px] font-mono text-muted uppercase">
                  {featuredRelease?.releaseDate
                    ? formatRelativeDate(featuredRelease.releaseDate)
                    : "Date Unknown"}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-accent neon-glow" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted font-mono">Signal Active</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted mb-4">Social Momentum</p>
                <p className="text-3xl font-mono font-bold text-foreground">
                  {lead.artist.followerCount?.toLocaleString() ?? "0"}
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-muted">
                  {lead.artist.lastPostAt
                    ? `Last Pulse: ${formatRelativeDate(lead.artist.lastPostAt)}`
                    : "Activity Void"}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <Link href={lead.artist.instagramProfileUrl || "#"} target="_blank" className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-highlight transition-colors flex items-center gap-2">
                  Open Instagram Interface <span className="translate-y-px">→</span>
                </Link>
              </div>
            </GlassCard>

            <GlassCard className="justify-between border-accent/20" variant="strong">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Analysis</p>
                  <div className="h-1 lg:h-px flex-1 mx-4 bg-accent/20" />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic">
                  &quot;{lead.scoreRationale ?? "Analysis pending verification."}&quot;
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                <span className="text-[8px] font-bold uppercase tracking-tighter text-muted">AIG-SYSTEM // THREAT_LEVEL_LOW</span>
              </div>
            </GlassCard>
          </section>

          <section className="grid gap-10 lg:grid-cols-2">
            <GlassCard className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-lg font-bold tracking-tight text-foreground">Instagram Intelligence</h2>
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{postCount} NODES</span>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="h-14 w-14 overflow-hidden rounded-full border border-white/10 bg-surface relative shadow-xl">
                    {instagramAvatar ? (
                      <img
                        src={instagramAvatar}
                        alt={lead.artist.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[8px] font-bold text-muted uppercase tracking-widest">IG</div>
                    )}
                  </div>
                  <div className="flex-1">
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
                      className="flex items-center gap-2 group"
                    >
                      <span className="text-sm font-mono text-accent">@</span>
                      <input
                        name="handle"
                        defaultValue={lead.artist.instagramHandle || ""}
                        placeholder="handle_id"
                        className="w-full bg-transparent border-b border-white/5 focus:border-accent text-sm font-bold tracking-tight text-foreground outline-none transition-colors"
                      />
                      <button type="submit" className="text-[8px] font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors">SAVE</button>
                    </form>
                    <p className="mt-1 text-[10px] text-muted font-mono leading-none">
                      SYNC_INTERVAL: {lead.artist.lastPostAt ? formatRelativeDate(lead.artist.lastPostAt) : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-foreground/70 leading-relaxed font-serif italic max-h-24 overflow-y-auto pr-2 scrollbar-hide">
                  {instagramBio}
                </div>

                {featuredPost ? (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Latest Deployment</span>
                      <Link href={featuredPost.url || "#"} target="_blank" className="text-[10px] font-bold uppercase tracking-widest text-accent hover:underline">EXTERNAL_UPLINK</Link>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-[0.4fr_0.6fr]">
                      <div className="aspect-square overflow-hidden rounded-xl border border-white/10 relative group">
                        {featuredPost.imageUrl ? (
                          <img
                            src={proxiedHelper(featuredPost.imageUrl)}
                            alt="Deployment Media"
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted uppercase tracking-widest">MEDIA_MISSING</div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex flex-col justify-between py-1">
                        <p className="text-xs text-foreground/80 leading-relaxed line-clamp-6">
                          {featuredPost.caption || "Metadata body empty."}
                        </p>
                        <p className="text-[8px] font-mono text-muted uppercase mt-4">
                          TIMESTAMP: {formatRelativeDate(featuredPost.postedAt || featuredPost.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 rounded-2xl border border-dashed border-white/10 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">No media logs found.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <Link
                  href={`/leads/${lead.id}?rPage=${releasePage}&pPage=${Math.max(1, postPage - 1)}`}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${postPage === 1 ? "pointer-events-none opacity-20" : "text-muted hover:text-accent"}`}
                >
                  PREV_NODE
                </Link>
                <span className="text-[10px] font-mono text-accent/50">{postPage} / {postTotalPages}</span>
                <Link
                  href={`/leads/${lead.id}?rPage=${releasePage}&pPage=${Math.min(postTotalPages, postPage + 1)}`}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${postPage === postTotalPages ? "pointer-events-none opacity-20" : "text-muted hover:text-accent"}`}
                >
                  NEXT_NODE
                </Link>
              </div>
            </GlassCard>

            <GlassCard className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-lg font-bold tracking-tight text-foreground">Acoustic Inventory</h2>
                <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{releaseCount} DATA_POINTS</span>
              </div>

              <div className="space-y-6">
                {featuredRelease ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative h-44 w-44 sm:h-52 sm:w-52 group">
                        <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                          {featuredRelease.imageUrl ? (
                            <img
                              src={proxiedHelper(featuredRelease.imageUrl)}
                              alt={featuredRelease.title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-muted uppercase tracking-widest">DATA_ENV_VOID</div>
                          )}
                        </div>
                      </div>

                      <div className="w-full space-y-4">
                        {featuredRelease.url ? (
                          <iframe
                            key={featuredRelease.url}
                            src={featuredRelease.url.includes("/embed/")
                              ? featuredRelease.url
                              : featuredRelease.url.replace("open.spotify.com/", "open.spotify.com/embed/")}
                            width="100%"
                            height="152"
                            allow="encrypted-media; clipboard-write; fullscreen; picture-in-picture"
                            className="rounded-2xl border border-white/10 bg-black/40 shadow-inner"
                            title="Acoustic Player"
                          />
                        ) : (
                          <div className="h-32 w-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 text-center p-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted text-center">Acoustic payload missing</p>
                          </div>
                        )}

                        <div className="text-center space-y-2">
                          <h3 className="text-xl font-bold tracking-tight text-foreground">{featuredRelease.title}</h3>
                          <p className="text-[10px] font-mono text-muted uppercase tracking-[0.2em]">
                            TIMESTAMP: {formatRelativeDate(featuredRelease.releaseDate || featuredRelease.createdAt)}
                          </p>
                          <div className="flex flex-wrap justify-center gap-2 pt-2">
                            {featuredRelease.releaseType && (
                              <span className="rounded-lg bg-white/5 border border-white/5 px-2 py-1 text-[8px] font-bold text-muted uppercase tracking-widest">{featuredRelease.releaseType}</span>
                            )}
                            <StatusPill status="IDENTIFIED" className="bg-white/5! border-white/5! text-muted!" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl border border-dashed border-white/10 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">No acoustic assets detected.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                <Link
                  href={`/leads/${lead.id}?rPage=${Math.max(1, releasePage - 1)}&pPage=${postPage}`}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${releasePage === 1 ? "pointer-events-none opacity-20" : "text-muted hover:text-accent"}`}
                >
                  PREV_POINT
                </Link>
                <span className="text-[10px] font-mono text-accent/50">{releasePage} / {releaseTotalPages}</span>
                <Link
                  href={`/leads/${lead.id}?rPage=${Math.min(releaseTotalPages, releasePage + 1)}&pPage=${postPage}`}
                  className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${releasePage === releaseTotalPages ? "pointer-events-none opacity-20" : "text-muted hover:text-accent"}`}
                >
                  NEXT_POINT
                </Link>
              </div>
            </GlassCard>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent neon-glow" />
                <h2 className="text-xl font-bold tracking-tight text-foreground">Strategic Outreach Drafts</h2>
              </div>
              <span className="text-[10px] font-mono text-muted uppercase tracking-[0.3em]">
                {lead.messages.filter(m => !m.selected).length} PREVIEW_NODES
              </span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {lead.messages.filter(m => !m.selected).length === 0 ? (
                <div className="col-span-full py-12 rounded-3xl border border-dashed border-white/10 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">No neural drafts generated.</p>
                </div>
              ) : (
                lead.messages
                  .filter((m) => !m.selected)
                  .map((message) => (
                    <GlassCard
                      key={message.id}
                      className="group flex flex-col justify-between p-6!"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-accent/60">
                            MODE_{message.tone || "GENERAL"}
                          </span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <DraftCopy text={message.body} />
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed font-serif italic">
                          &quot;{message.body}&quot;
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                        <details className="relative group/details">
                          <summary className="list-none cursor-pointer flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-foreground transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6 6-6" /></svg>
                            TUNE_VARIANT
                          </summary>
                          <div className="absolute left-0 bottom-full mb-4 z-20 w-48 rounded-2xl border border-white/10 bg-surface-strong p-2 shadow-2xl backdrop-blur-xl">
                            <div className="group/tone relative">
                              <div className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent hover:bg-white/5 transition-colors cursor-default">
                                Change Tone
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                              </div>
                              <div className="hidden group-hover/tone:block absolute left-full bottom-0 ml-2 w-48 rounded-2xl border border-white/10 bg-surface-strong p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-left-2 transition-all">
                                {["professional", "casual"].map((hint) => (
                                  <form key={hint} action={regenerateDraft}>
                                    <input type="hidden" name="leadId" value={lead.id} />
                                    <input type="hidden" name="draftId" value={message.id} />
                                    <input type="hidden" name="tone" value={message.tone || "Draft"} />
                                    <input type="hidden" name="styleHint" value={`more ${hint}`} />
                                    <button type="submit" className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent hover:bg-white/5 transition-colors">
                                      more {hint}
                                    </button>
                                  </form>
                                ))}
                              </div>
                            </div>

                            <div className="group/style relative mt-1">
                              <div className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent hover:bg-white/5 transition-colors cursor-default">
                                Change Style
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                              </div>
                              <div className="hidden group-hover/style:block absolute left-full bottom-0 ml-2 w-48 rounded-2xl border border-white/10 bg-surface-strong p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-left-2 transition-all">
                                {["boring", "fun"].map((hint) => (
                                  <form key={hint} action={regenerateDraft}>
                                    <input type="hidden" name="leadId" value={lead.id} />
                                    <input type="hidden" name="draftId" value={message.id} />
                                    <input type="hidden" name="tone" value={message.tone || "Draft"} />
                                    <input type="hidden" name="styleHint" value={`more ${hint}`} />
                                    <button type="submit" className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent hover:bg-white/5 transition-colors">
                                      more {hint}
                                    </button>
                                  </form>
                                ))}
                              </div>
                            </div>

                            <div className="mt-1 border-t border-white/10 pt-1">
                              <form action={regenerateDraft}>
                                <input type="hidden" name="leadId" value={lead.id} />
                                <input type="hidden" name="draftId" value={message.id} />
                                <input type="hidden" name="tone" value={message.tone || "Draft"} />
                                <input type="hidden" name="styleHint" value="more random" />
                                <button type="submit" className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent hover:bg-white/5 transition-colors">
                                  randomize
                                </button>
                              </form>
                              <SendMessageModal
                                leadId={lead.id}
                                label="CUSTOM_OVERRIDE"
                                defaultBody={message.body}
                                source="draft-edit"
                              />
                            </div>
                          </div>
                        </details>

                        <SendMessageModal
                          leadId={lead.id}
                          label="EXECUTE_UPLINK"
                          defaultBody={message.body}
                          source="draft"
                          variant="primary"
                        />
                      </div>
                    </GlassCard>
                  ))
              )}
            </div>
          </section>

          <section className="mt-10">
            <GlassCard className="p-8!">
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                <h2 className="text-xl font-bold tracking-tight text-foreground">Operational History Timeline</h2>
                <span className="text-[10px] font-mono text-muted uppercase tracking-[0.3em]">
                  {lead.activities.length} EVENTS_LOGGED
                </span>
              </div>

              <div className="space-y-4">
                {lead.activities.length === 0 ? (
                  <div className="py-8 text-center rounded-2xl border border-dashed border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted">No historical data recorded.</p>
                  </div>
                ) : (
                  lead.activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex gap-4 group"
                    >
                      <div className="flex flex-col items-center">
                        <div className="h-3 w-3 rounded-full border-2 border-accent bg-background z-10" />
                        <div className="w-px flex-1 bg-white/10" />
                      </div>
                      <div className="flex-1 pb-8 group-last:pb-2">
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
                          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                            {formatStatusLabel(activity.type)}
                          </p>
                          <p className="text-[8px] font-mono text-muted uppercase">
                            {formatRelativeDate(activity.occurredAt)}
                          </p>
                        </div>
                        {activity.note && (
                          <p className="text-xs text-foreground/70 font-serif italic max-w-2xl leading-relaxed">
                            &quot;{activity.note}&quot;
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>
          </section>
        </main>
      </div>
    </DynamicThemeShell>
  );
}
