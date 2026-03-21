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
import { Navbar } from "@/components/Navbar";
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
  const score = lead.score?.toFixed(0) || "0";

  return (
    <DynamicThemeShell
      imageUrl={themeImageUrl}
      artistName={lead.artist.name}
      genre={lead.artist.genre}
    >
    <div className="relative min-h-screen bg-background text-foreground pb-20 selection:bg-accent/30 selection:text-white">
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-12 pt-12">
        
        {/* Cinematic Artist Header */}
        <div className="relative h-[400px] w-full rounded-[48px] overflow-hidden group shadow-2xl">
          {spotifyImageUrl && (
            <Image
              src={spotifyImageUrl}
              alt={lead.artist.name}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-[#0d0d12] via-[#0d0d12]/40 to-transparent" />
          <div className="absolute inset-x-12 bottom-12 flex items-end justify-between gap-12">
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 hover:text-accent transition-colors">
                 <span>← Back to Feed</span>
              </Link>
              <h1 className="text-6xl font-bold tracking-tight text-white leading-none capitalize">
                {lead.artist.name}
              </h1>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
                <span>{lead.artist.location}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                <span>{lead.artist.genre || "Social Profile"}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 pb-2">
              <a href={lead.artist.spotifyArtistUrl || "#"} target="_blank" className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-accent/20 hover:text-accent transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/></svg>
              </a>
              <a href={lead.artist.instagramProfileUrl || "#"} target="_blank" className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-accent-warm/20 hover:text-accent-warm transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
          
          {/* Main Content Column */}
          <div className="space-y-12">
            
            {/* Bio Section */}
            <section className="space-y-6">
               <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">Social Bio</h2>
              <div className="text-xl text-white/70 leading-relaxed font-medium italic">
                &quot;{instagramBio}&quot;
              </div>
            </section>

            {/* Social Presence Section */}
            <section className="space-y-8">
               <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">Social Presence</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GlassCard className="p-8! bg-white/2 border-white/5">
                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-full border border-white/10 overflow-hidden relative">
                              {instagramAvatar && <img src={instagramAvatar} alt="Avatar" className="object-cover" />}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-white">@{lead.artist.instagramHandle || "unknown"}</p>
                              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{lead.artist.followerCount?.toLocaleString()} Followers</p>
                           </div>
                        </div>
                        {featuredPost && (
                           <div className="space-y-4 pt-4 border-t border-white/5">
                              <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 relative group">
                                 <img src={proxiedHelper(featuredPost.imageUrl)} alt="Post" className="object-cover w-full h-full transition-transform group-hover:scale-105" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Link href={featuredPost.url || "#"} target="_blank" className="text-[10px] font-bold text-white uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">View Post</Link>
                                 </div>
                              </div>
                              <p className="text-xs text-white/50 line-clamp-2 italic">&quot;{featuredPost.caption}&quot;</p>
                           </div>
                        )}
                     </div>
                  </GlassCard>

                  <GlassCard className="p-8! bg-white/2 border-white/5 flex flex-col justify-center items-center text-center space-y-4">
                      <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Activity Status</p>
                     <div className="text-4xl font-bold text-accent tracking-tighter">
                        {lead.artist.lastPostAt ? "ACTIVE" : "STALE"}
                     </div>
                     <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        LAST POST: {formatRelativeDate(lead.artist.lastPostAt)}
                     </p>
                  </GlassCard>
               </div>
            </section>

            {/* Top Releases Section */}
            <section className="space-y-8">
               <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">Top Releases</h2>
               {featuredRelease ? (
                  <GlassCard className="p-8! bg-white/2 border-white/5">
                     <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="h-40 w-40 rounded-3xl border border-white/10 overflow-hidden shrink-0 shadow-2xl">
                           <img src={proxiedHelper(featuredRelease.imageUrl)} alt={featuredRelease.title} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                           <div>
                              <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{featuredRelease.title}</h3>
                              <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mt-1">{featuredRelease.releaseType || "Single"}</p>
                           </div>
                           {featuredRelease.url && (
                              <iframe
                                 src={featuredRelease.url.includes("/embed/") ? featuredRelease.url : featuredRelease.url.replace("open.spotify.com/", "open.spotify.com/embed/")}
                                 width="100%"
                                 height="80"
                                 allow="encrypted-media"
                                 className="rounded-xl border border-white/5"
                              />
                           )}
                        </div>
                     </div>
                  </GlassCard>
               ) : (
                  <div className="py-12 border border-dashed border-white/10 rounded-[32px] text-center">
                      <p className="text-[10px] font-bold uppercase text-white/20 tracking-widest">No releases found</p>
                  </div>
               )}
            </section>

            {/* Message Drafts Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Draft Messages</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {lead.messages.filter(m => !m.selected).map((message) => (
                  <GlassCard key={message.id} className="p-8! bg-white/2 border-white/5 hover:border-accent/20">
                     <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                           <span className="px-3 py-1 rounded-full bg-accent/10 text-[8px] font-bold text-accent uppercase tracking-widest border border-accent/20">
                             Tone: {message.tone || "Standard"}
                           </span>
                           <DraftCopy text={message.body} />
                        </div>
                        <p className="text-lg text-white/80 leading-relaxed font-serif italic pl-6 border-l-2 border-accent/30">
                          &quot;{message.body}&quot;
                        </p>
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                           <SendMessageModal
                              leadId={lead.id}
                               label="Send Message"
                              defaultBody={message.body}
                              source="draft"
                              variant="primary"
                            />
                        </div>
                     </div>
                  </GlassCard>
                ))}
              </div>
            </section>

          </div>

          {/* Right Sidebar Column */}
          <aside className="space-y-12">
            
            {/* Meta Actions Card */}
            <GlassCard className="p-8! bg-[#0d0d12] border-white/10" variant="strong">
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Lead Score</p>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-bold text-accent tracking-tighter">{score}%</span>
                     <span className="text-[10px] font-bold text-accent/40 uppercase tracking-widest mb-1">Relevance</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">Lead Status</p>
                   <form
                      action={async (formData) => {
                          "use server";
                          const status = formData.get("status");
                          if (typeof status === "string" && statusOptions.includes(status as LeadStatus)) {
                              await updateLeadStatus({ leadId: lead.id, status: status as LeadStatus });
                          }
                      }}
                      className="flex flex-col gap-3"
                  >
                      <select
                          name="status"
                          defaultValue={lead.status}
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 focus:border-accent focus:outline-none appearance-none cursor-pointer hover:bg-white/10"
                      >
                          {statusOptions.map((status) => (
                              <option key={status} value={status} className="bg-[#0f0f0f] text-white">
                                  {formatStatusLabel(status)}
                              </option>
                          ))}
                      </select>
                      <NeonButton variant="outline" size="sm" type="submit" className="w-full">Update Status</NeonButton>
                  </form>
                </div>

                <div className="pt-6 border-t border-white/5">
                   <form action={refreshLeadData} className="w-full">
                      <input type="hidden" name="leadId" value={lead.id} />
                      <NeonButton type="submit" variant="outline" size="sm" className="w-full justify-center! gap-3!">
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path><path d="M16 16h5v5"></path></svg>
                          Update Profile
                      </NeonButton>
                   </form>
                </div>
              </div>
            </GlassCard>

            {/* Social & Releases Previews */}
            <div className="space-y-6">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">Activity Timeline</h3>
               {lead.activities.slice(0, 5).map((activity) => (
                 <div key={activity.id} className="flex gap-4 group">
                    <div className="h-2 w-2 rounded-full bg-white/10 mt-1.5 group-hover:bg-accent transition-colors shrink-0" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-white/60 leading-tight">{activity.note}</p>
                       <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{formatRelativeDate(activity.occurredAt)}</p>
                    </div>
                 </div>
               ))}
            </div>

          </aside>
        </div>
      </div>
    </div>
  </DynamicThemeShell>
);
}
