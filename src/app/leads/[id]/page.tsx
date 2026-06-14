export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { LeadStatus } from "local-prisma-client";
import DraftCopy from "./DraftCopy";
import SendMessageModal from "./SendMessageModal";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { StatusPill } from "@/components/StatusPill";
import { DynamicThemeShell } from "@/components/DynamicThemeShell";
import { EditableArtistName } from "@/components/EditableArtistName";
import {
  generateDraftsForLead,
  refreshLeadData,
  regenerateDraft,
  updateLeadStatus,
  trashLeadAction,
} from "./actions";

const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

const formatRelativeDate = (date: Date | null | undefined) => {
  if (!date) return "Unknown";
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (Math.abs(diffDays) < 7) return formatter.format(diffDays, "day");
  const diffWeeks = Math.round(diffDays / 7);
  if (Math.abs(diffWeeks) < 5) return formatter.format(diffWeeks, "week");
  const diffMonths = Math.round(diffDays / 30);
  return formatter.format(diffMonths, "month");
};

const formatStatusLabel = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

const proxiedHelper = (url: string | null) => {
  if (!url) return undefined;
  // Proxy Instagram through the server since the server can reach Instagram CDN
  // even when browsers get blocked. Always proxy Instagram URLs.
  const isInstagram = url.includes("cdninstagram.com") || url.includes("instagram.com") || url.includes("fbcdn.net");
  if (isInstagram) {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }
  // Spotify and other CDNs go through proxy for CORS / header handling
  const needsProxy = [
    "fbcdn.net", "instagram.com", "fbsbx.com", "cdninstagram.com",
    "scdn.co", "spotifycdn.com", "i.scdn.co",
  ].some((d) => url.includes(d));
  if (needsProxy) {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
  }
  return undefined;
};

const normalizeHex = (value?: string | null) => {
  if (!value) return null;
  const cleaned = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(cleaned)) return `#${cleaned}`;
  if (/^[0-9a-fA-F]{6}$/.test(cleaned)) return `#${cleaned}`;
  return null;
};

const statusOptions: LeadStatus[] = ["NEW", "QUALIFIED", "CONTACTED", "FOLLOW_UP", "WON", "LOST"];

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ rPage?: string; pPage?: string; igPage?: string; emailPage?: string }>;
};

const parsePage = (value?: string) => {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isNaN(parsed) || parsed < 1 ? 1 : parsed;
};

function hrefWith(params: {
  rPage: number;
  pPage: number;
  igPage: number;
  emailPage: number;
}) {
  const search = new URLSearchParams({
    rPage: String(params.rPage),
    pPage: String(params.pPage),
    igPage: String(params.igPage),
    emailPage: String(params.emailPage),
  });
  return `?${search.toString()}`;
}

export default async function LeadDetailPage({ params, searchParams }: LeadDetailPageProps) {
  const { id } = await params;
  const { rPage, pPage, igPage, emailPage } = await searchParams;

  const releasePage = parsePage(rPage);
  const postPage = parsePage(pPage);
  const igDraftPage = parsePage(igPage);
  const emailDraftPage = parsePage(emailPage);

  const releasePageSize = 1;
  const postPageSize = 10;
  const draftPageSize = 2;

  let lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      artist: true,
      messages: { orderBy: { createdAt: "desc" } },
      activities: { orderBy: { occurredAt: "desc" } },
    },
  });

  if (!lead) notFound();

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
  const themeImageUrl = spotifyImageUrl ? `/api/proxy?url=${encodeURIComponent(spotifyImageUrl)}` : null;

  const postWhere = {
    artistId: lead.artist.id,
    imageUrl: { notIn: ["", " "] },
  };

  const releaseWhere = {
    artistId: lead.artist.id,
    OR: [
      { spotifyTrackId: { not: null } },
      { spotifyReleaseId: { not: null } },
      { url: { not: null } },
    ],
  };

  const [releaseRows, postRows, releaseCount, postCount] = await Promise.all([
    prisma.release.findMany({
      where: releaseWhere,
      orderBy: [
        { spotifyTrackId: { sort: "desc", nulls: "last" } },
        { spotifyReleaseId: { sort: "desc", nulls: "last" } },
        { releaseDate: "desc" },
        { createdAt: "desc" },
      ],
      skip: (releasePage - 1) * releasePageSize,
      take: releasePageSize,
    }),
    prisma.instagramPost.findMany({
      where: postWhere,
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
      skip: (postPage - 1) * postPageSize,
      take: postPageSize,
    }),
    prisma.release.count({ where: releaseWhere }),
    prisma.instagramPost.count({ where: postWhere }),
  ]);

  const releaseTotalPages = Math.max(1, Math.ceil(releaseCount / releasePageSize));
  const postTotalPages = Math.max(1, Math.ceil(postCount / postPageSize));
  const featuredRelease = releaseRows[0] ?? null;

  const instagramAvatar = proxiedHelper(lead.artist.instagramProfileImageUrl ?? postRows[0]?.imageUrl ?? null);
  const releaseDate = featuredRelease?.releaseDate ?? featuredRelease?.createdAt ?? null;

  const reachoutDrafts = lead.messages.filter((m) => !m.selected && m.source === "reachout");
  const igDrafts = reachoutDrafts.filter((m) => !m.tone?.toLowerCase().includes("email"));
  const emailDrafts = reachoutDrafts.filter((m) => m.tone?.toLowerCase().includes("email"));

  const igDraftTotalPages = Math.max(1, Math.ceil(igDrafts.length / draftPageSize));
  const emailDraftTotalPages = Math.max(1, Math.ceil(emailDrafts.length / draftPageSize));

  const igDraftSlice = igDrafts.slice((igDraftPage - 1) * draftPageSize, igDraftPage * draftPageSize);
  const emailDraftSlice = emailDrafts.slice((emailDraftPage - 1) * draftPageSize, emailDraftPage * draftPageSize);

  const score = lead.score?.toFixed(0) || "0";
  const palette = [
    normalizeHex(lead.artist.spotifyAccent),
    normalizeHex(lead.artist.spotifyAccentStrong),
    normalizeHex(lead.artist.spotifyHighlight),
  ].filter((v, i, arr): v is string => Boolean(v) && arr.indexOf(v) === i);

  const accentColors = {
    accent: lead.artist.spotifyAccent ?? "#00f2ff",
    accentStrong: lead.artist.spotifyAccentStrong ?? "#7000ff",
    highlight: lead.artist.spotifyHighlight ?? "#ffffff",
  };

  const renderDraftCard = (message: (typeof reachoutDrafts)[number]) => (
    <GlassCard key={message.id} className="p-6! bg-white/2 border-white/5 hover:border-accent/20">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-accent/10 text-xs font-bold text-accent uppercase tracking-widest border border-accent/20">
            {message.tone || "Draft"}
          </span>
          <DraftCopy text={message.body} />
        </div>

        <p className="text-base text-white/80 leading-relaxed font-serif italic pl-4 border-l-2 border-accent/30">
          &quot;{message.body}&quot;
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
          <details className="relative group/details">
            <summary className="list-none cursor-pointer flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6 6-6" /></svg>
              Tune Variant
            </summary>
            <div className="absolute left-0 bottom-full mb-4 z-20 w-56 rounded-2xl border border-white/10 bg-[#0f0f13] p-2 shadow-2xl">
              <div className="group/tone relative">
                <div className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-accent hover:bg-white/5 transition-colors cursor-default">
                  Change Tone
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </div>
                <div className="hidden group-hover/tone:block absolute left-full bottom-0 ml-2 w-48 rounded-2xl border border-white/10 bg-[#0f0f13] p-2 shadow-2xl animate-in fade-in slide-in-from-left-2 transition-all">
                  {["professional", "casual"].map((hint) => (
                    <form key={hint} action={regenerateDraft}>
                      <input type="hidden" name="leadId" value={lead.id} />
                      <input type="hidden" name="draftId" value={message.id} />
                      <input type="hidden" name="tone" value={message.tone || "Draft"} />
                      <input type="hidden" name="styleHint" value={`more ${hint}`} />
                      <button type="submit" className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-accent hover:bg-white/5 transition-colors">
                        more {hint}
                      </button>
                    </form>
                  ))}
                </div>
              </div>

              <div className="group/style relative mt-1">
                <div className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-accent hover:bg-white/5 transition-colors cursor-default">
                  Change Style
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </div>
                <div className="hidden group-hover/style:block absolute left-full bottom-0 ml-2 w-48 rounded-2xl border border-white/10 bg-[#0f0f13] p-2 shadow-2xl animate-in fade-in slide-in-from-left-2 transition-all">
                  {["boring", "fun"].map((hint) => (
                    <form key={hint} action={regenerateDraft}>
                      <input type="hidden" name="leadId" value={lead.id} />
                      <input type="hidden" name="draftId" value={message.id} />
                      <input type="hidden" name="tone" value={message.tone || "Draft"} />
                      <input type="hidden" name="styleHint" value={`more ${hint}`} />
                      <button type="submit" className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-accent hover:bg-white/5 transition-colors">
                        more {hint}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            </div>
          </details>

          <SendMessageModal
            leadId={lead.id}
            label="Review + Send"
            defaultBody={message.body}
            source="draft"
            variant="primary"
          />
        </div>
      </div>
    </GlassCard>
  );

  return (
    <DynamicThemeShell imageUrl={themeImageUrl} artistName={lead.artist.name} genre={lead.artist.genre} accentColors={accentColors}>
      <div className="relative min-h-screen pb-20 selection:bg-accent/30 selection:text-white">
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 pt-12">
          <div className="relative h-[400px] w-full rounded-[40px] overflow-hidden group shadow-2xl">
            {themeImageUrl && (
              <img
                src={themeImageUrl}
                alt={lead.artist.name}
                className="absolute"
                style={{ top: '0', left: '0', width: '100%', height: '340px', objectFit: 'cover', objectPosition: 'center center' }}
                loading="eager"
              />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
            <div
              className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-8 p-8"
              style={{ height: '180px', background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="space-y-1 max-w-[75%]">
                <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-white/50 hover:text-accent transition-colors mb-3">
                  <span>← Back</span>
                </Link>
                <div className="text-[2.5rem] leading-[1] font-black tracking-tight text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  <EditableArtistName artistId={lead.artist.id} initialName={lead.artist.name} />
                </div>
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-white/50">
                  {lead.artist.location && <span>{lead.artist.location}</span>}
                  <span>{lead.artist.genre || "Social Profile"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-3">
              <form
                action={async (formData) => {
                  "use server";
                  const status = formData.get("status");
                  if (typeof status === "string" && statusOptions.includes(status as LeadStatus)) {
                    await updateLeadStatus({ leadId: lead.id, status: status as LeadStatus });
                  }
                }}
                className="flex flex-wrap items-center gap-3"
              >
                <select
                  name="status"
                  defaultValue={lead.status}
                  className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70 focus:border-accent focus:outline-none"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status} className="bg-[#0f0f0f] text-white">
                      {formatStatusLabel(status)}
                    </option>
                  ))}
                </select>
                <NeonButton variant="outline" size="sm" type="submit">Update Status</NeonButton>
              </form>

              <form action={refreshLeadData}>
                <input type="hidden" name="leadId" value={lead.id} />
                <NeonButton type="submit" variant="outline" size="sm">Update Profile</NeonButton>
              </form>

              <div className="ml-auto">
                <StatusPill status={lead.status} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassCard className="p-6! bg-white/2 border-white/5">
                <div className="flex items-start gap-4 mb-6">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden border border-white/10 bg-black/30 shrink-0">
                    {instagramAvatar ? (
                      <img src={instagramAvatar} alt={lead.artist.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white/20 text-xs font-bold">IG</div>
                    )}
                  </div>
                  <div className="space-y-2 min-w-0">
                    <p className="text-sm font-bold text-white truncate">@{(lead.artist.instagramHandle || "unknown").replace(/^@/, "")}</p>
                    <p className="text-xs text-white/55 leading-relaxed line-clamp-3">{lead.artist.bio || "No Instagram bio available."}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">
                      <span>{lead.artist.followerCount?.toLocaleString() || "0"} followers</span>
                      <span>Last post {formatRelativeDate(lead.artist.lastPostAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">Latest Posts</h3>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/35">
                      <Link
                        href={hrefWith({ rPage: releasePage, pPage: Math.max(1, postPage - 1), igPage: igDraftPage, emailPage: emailDraftPage })}
                        className={`px-2 py-1 rounded border ${postPage > 1 ? "border-white/20 hover:border-accent/40" : "border-white/5 opacity-40 pointer-events-none"}`}
                      >
                        Prev
                      </Link>
                      <span>{postPage}/{postTotalPages}</span>
                      <Link
                        href={hrefWith({ rPage: releasePage, pPage: Math.min(postTotalPages, postPage + 1), igPage: igDraftPage, emailPage: emailDraftPage })}
                        className={`px-2 py-1 rounded border ${postPage < postTotalPages ? "border-white/20 hover:border-accent/40" : "border-white/5 opacity-40 pointer-events-none"}`}
                      >
                        Next
                      </Link>
                    </div>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory custom-scrollbar">
                    {postRows.length === 0 ? (
                      <div className="text-xs text-white/35 py-8">No Instagram posts available.</div>
                    ) : (
                      postRows.map((post) => (
                        <a
                          key={post.id}
                          href={post.url || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className="snap-start shrink-0 w-[220px] rounded-2xl border border-white/10 bg-black/30 overflow-hidden hover:border-accent/30 transition-all"
                        >
                          <div className="h-[150px] w-full bg-black/30">
                            {post.imageUrl ? (
                              <img src={proxiedHelper(post.imageUrl)} alt="Instagram post" className="h-full w-full object-cover" />
                            ) : null}
                          </div>
                          <div className="p-3 space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{formatRelativeDate(post.postedAt || post.createdAt)}</p>
                            <p className="text-xs text-white/70 line-clamp-2">{post.caption || "No caption"}</p>
                          </div>
                        </a>
                      ))
                    )}
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6! bg-white/2 border-white/5">
                <div className="space-y-5">
                  <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-white/35">Spotify</h3>

                  {featuredRelease ? (
                    <iframe
                      style={{ borderRadius: '12px' }}
                      src={
                        featuredRelease.spotifyTrackId
                          ? `https://open.spotify.com/embed/track/${featuredRelease.spotifyTrackId}`
                          : featuredRelease.spotifyReleaseId
                          ? `https://open.spotify.com/embed/album/${featuredRelease.spotifyReleaseId}`
                          : featuredRelease.url
                          ? `https://open.spotify.com/embed${featuredRelease.url.split('spotify.com')[1]}`
                          : ""
                      }
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    />
                  ) : (
                    <p className="text-xs text-white/35">No releases available.</p>
                  )}
                </div>
              </GlassCard>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/25">Generated Replies</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassCard className="p-5! bg-white/2 border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">IG DM</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/35">
                      <Link
                        href={hrefWith({ rPage: releasePage, pPage: postPage, igPage: Math.max(1, igDraftPage - 1), emailPage: emailDraftPage })}
                        className={`px-2 py-1 rounded border ${igDraftPage > 1 ? "border-white/20 hover:border-accent/40" : "border-white/5 opacity-40 pointer-events-none"}`}
                      >
                        Prev
                      </Link>
                      <span>{igDraftPage}/{igDraftTotalPages}</span>
                      <Link
                        href={hrefWith({ rPage: releasePage, pPage: postPage, igPage: Math.min(igDraftTotalPages, igDraftPage + 1), emailPage: emailDraftPage })}
                        className={`px-2 py-1 rounded border ${igDraftPage < igDraftTotalPages ? "border-white/20 hover:border-accent/40" : "border-white/5 opacity-40 pointer-events-none"}`}
                      >
                        Next
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {igDraftSlice.length === 0 ? <p className="text-xs text-white/35">No IG drafts yet.</p> : igDraftSlice.map(renderDraftCard)}
                  </div>
                </GlassCard>

                <GlassCard className="p-5! bg-white/2 border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">Email</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-white/35">
                      <Link
                        href={hrefWith({ rPage: releasePage, pPage: postPage, igPage: igDraftPage, emailPage: Math.max(1, emailDraftPage - 1) })}
                        className={`px-2 py-1 rounded border ${emailDraftPage > 1 ? "border-white/20 hover:border-accent/40" : "border-white/5 opacity-40 pointer-events-none"}`}
                      >
                        Prev
                      </Link>
                      <span>{emailDraftPage}/{emailDraftTotalPages}</span>
                      <Link
                        href={hrefWith({ rPage: releasePage, pPage: postPage, igPage: igDraftPage, emailPage: Math.min(emailDraftTotalPages, emailDraftPage + 1) })}
                        className={`px-2 py-1 rounded border ${emailDraftPage < emailDraftTotalPages ? "border-white/20 hover:border-accent/40" : "border-white/5 opacity-40 pointer-events-none"}`}
                      >
                        Next
                      </Link>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {emailDraftSlice.length === 0 ? <p className="text-xs text-white/35">No email drafts for this lead.</p> : emailDraftSlice.map(renderDraftCard)}
                  </div>
                </GlassCard>
              </div>
            </div>

            <GlassCard className="p-4! bg-white/2 border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">Activity History</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{lead.activities.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {lead.activities.slice(0, 6).map((activity) => {
                  const isEmailDiscovery = activity.note?.startsWith("[AUTO-DISCOVER]");
                  if (isEmailDiscovery && activity.note) {
                    const detailStr = activity.note.replace(/^\[AUTO-DISCOVER\] Found contact\(s\):\s*/, "");
                    const entries = detailStr.split("; ").map(entry => {
                      const match = entry.match(/^(.+?)\s+\((\w+),\s*(\d+)%,\s*via\s+(\S+)\s+→\s+(\S+)\)$/);
                      if (match) {
                        return { email: match[1], confidence: match[2], score: match[3], sourceType: match[4], sourceUrl: match[5] };
                      }
                      return null;
                    }).filter(Boolean);

                    return (
                      <div key={activity.id} className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 px-3 py-2">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-400/70">📧 Email Discovered</span>
                        </div>
                        {entries.map((entry, idx) => (
                          <div key={idx} className="mt-1">
                            <p className="text-xs font-semibold text-white/90 font-mono">{entry!.email}</p>
                            <p className="text-[10px] text-white/45 mt-0.5">
                              <span className="text-emerald-400/60">{entry!.confidence}</span> · {entry!.score}% confidence
                            </p>
                            <p className="text-[10px] text-white/35 mt-0.5 truncate">
                              via <span className="text-white/50">{entry!.sourceType}</span> → <span className="text-accent/60">{entry!.sourceUrl}</span>
                            </p>
                          </div>
                        ))}
                        {entries.length === 0 && (
                          <p className="text-xs text-white/60 line-clamp-2">{activity.note}</p>
                        )}
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mt-1.5">{formatRelativeDate(activity.occurredAt)}</p>
                      </div>
                    );
                  }

                  return (
                    <div key={activity.id} className="rounded-xl border border-white/8 bg-black/20 px-3 py-2">
                      <p className="text-xs text-white/60 line-clamp-2">{activity.note || "Activity"}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mt-1">{formatRelativeDate(activity.occurredAt)}</p>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DynamicThemeShell>
  );
}
