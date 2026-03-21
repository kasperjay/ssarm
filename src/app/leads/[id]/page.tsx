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
import { EditableArtistName } from "@/components/EditableArtistName";
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
              <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-white/40 hover:text-accent transition-colors">
                 <span>← Back to Feed</span>
              </Link>
              <EditableArtistName artistId={lead.artist.id} initialName={lead.artist.name} />
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-white/30">
                {lead.artist.location && (
                  <>
                    <span>{lead.artist.location}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
                  </>
                )}
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
              {(() => {
                const rawBio = lead.artist.bio;
                if (!rawBio) {
                  return (
                    <>
                      <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">Social Bio</h2>
                      <div className="text-xl text-white/30 leading-relaxed font-medium italic">No bio available.</div>
                    </>
                  );
                }
                // Detect external bio attribution suffix (e.g., "\n\n— [Last.fm]")
                const attributionMatch = rawBio.match(/\n\n—\s*(\[Last\.fm\]|\[Discogs\])$/);
                const attribution = attributionMatch?.[1] ?? null;
                const bioContent = attribution ? rawBio.replace(/\n\n—\s*(\[Last\.fm\]|\[Discogs\])$/, "").trim() : rawBio.trim();
                const isExternal = !!attribution;
                const sourceLabel = attribution?.replace(/[\[\]]/g, "") ?? null;

                return (
                  <>
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">
                      {isExternal ? `Artist Bio` : "Social Bio"}
                    </h2>
                    {isExternal ? (
                      <div className="space-y-3">
                        <p className="text-base text-white/60 leading-relaxed">{bioContent}</p>
                        {sourceLabel && (
                          <p className="text-xs font-bold uppercase tracking-widest text-accent/50">
                            via {sourceLabel}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="text-xl text-white/70 leading-relaxed font-medium italic">
                        &quot;{bioContent}&quot;
                      </div>
                    )}
                  </>
                );
              })()}
            </section>

            {/* Social Presence Section */}
            <section className="space-y-8">
               <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">Social Presence</h2>
               
               {/* Top Stats Row */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <GlassCard className="p-8! bg-white/2 border-white/5 flex items-center gap-6">
                        <div className="h-16 w-16 rounded-full border border-white/10 overflow-hidden relative shrink-0">
                           {instagramAvatar ? (
                               <img src={instagramAvatar} alt="Avatar" className="object-cover w-full h-full" />
                           ) : (
                               <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                               </div>
                           )}
                        </div>
                        <div>
                           <p className="text-xl font-bold text-white tracking-tight">@{lead.artist.instagramHandle || "unknown"}</p>
                           <p className="text-xs font-bold text-accent uppercase tracking-widest mt-1">{lead.artist.followerCount?.toLocaleString() || "0"} Followers</p>
                        </div>
                  </GlassCard>

                  <GlassCard className="p-8! bg-white/2 border-white/5 flex flex-col justify-center items-center text-center space-y-2">
                      <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Activity Status</p>
                     <div className="text-3xl font-bold text-white tracking-tighter">
                        {lead.artist.lastPostAt ? "ACTIVE" : "STALE"}
                     </div>
                     <p className="text-xs font-bold text-accent uppercase tracking-widest">
                        LAST POST: {formatRelativeDate(lead.artist.lastPostAt)}
                     </p>
                  </GlassCard>
               </div>

               {/* Recent Posts Grid */}
               {postRows.length > 0 ? (
                 <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                   {postRows.map(post => (
                     <div key={post.id} className="group relative aspect-square rounded-[32px] overflow-hidden border border-white/10 bg-white/5">
                        {post.imageUrl ? (
                           <img src={proxiedHelper(post.imageUrl)} alt="Instagram Post" className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                           <div className="w-full h-full flex items-center justify-center bg-white/5">
                               <p className="text-xs uppercase tracking-widest text-white/30 font-bold">No Image</p>
                           </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                           <p className="text-xs text-white/80 line-clamp-3 italic mb-4">&quot;{post.caption}&quot;</p>
                           <div className="flex items-center justify-between mt-auto">
                              <p className="text-xs font-bold uppercase tracking-widest text-accent">{formatRelativeDate(post.postedAt)}</p>
                              {post.url && (
                                 <Link href={post.url} target="_blank" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-accent hover:text-black transition-colors shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                                 </Link>
                              )}
                           </div>
                        </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-12 border border-dashed border-white/10 rounded-[32px] text-center">
                     <p className="text-xs font-bold uppercase text-white/20 tracking-widest">No Instagram posts found</p>
                 </div>
               )}
            </section>

            {/* Top Releases Section */}
            <section className="space-y-8">
               <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">Top Releases</h2>
               {featuredRelease ? (
                  <GlassCard className="p-8! bg-white/2 border-white/5">
                     <div className="flex flex-col md:flex-row gap-8 items-center">
                        <div className="h-40 w-40 rounded-3xl border border-white/10 overflow-hidden shrink-0 shadow-2xl">
                           <img src={proxiedHelper(featuredRelease.imageUrl)} alt={featuredRelease.title} className="object-cover w-full h-full" />
                        </div>
                        <div className="flex-1 space-y-4 text-center md:text-left">
                           <div>
                              <h3 className="text-2xl font-bold text-white uppercase tracking-tight">{featuredRelease.title}</h3>
                              <p className="text-xs font-bold text-accent uppercase tracking-[0.2em] mt-1">{featuredRelease.releaseType || "Single"}</p>
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
                      <p className="text-xs font-bold uppercase text-white/20 tracking-widest">No releases found</p>
                  </div>
               )}
            </section>

            {/* Message Drafts Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                 <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20">Draft Messages</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {lead.messages.filter(m => !m.selected).map((message) => (
                  <GlassCard key={message.id} className="p-8! bg-white/2 border-white/5 hover:border-accent/20">
                     <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                           <span className="px-3 py-1 rounded-full bg-accent/10 text-xs font-bold text-accent uppercase tracking-widest border border-accent/20">
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
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/20">Lead Score</p>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-bold text-accent tracking-tighter">{score}%</span>
                     <span className="text-xs font-bold text-accent/40 uppercase tracking-widest mb-1">Relevance</span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/20">Lead Status</p>
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
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white/70 focus:border-accent focus:outline-none appearance-none cursor-pointer hover:bg-white/10"
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
               <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">Activity Timeline</h3>
               {lead.activities.slice(0, 5).map((activity) => (
                 <div key={activity.id} className="flex gap-4 group">
                    <div className="h-2 w-2 rounded-full bg-white/10 mt-1.5 group-hover:bg-accent transition-colors shrink-0" />
                    <div className="space-y-1">
                       <p className="text-xs font-bold text-white/60 leading-tight">{activity.note}</p>
                       <p className="text-xs font-bold text-white/20 uppercase tracking-widest">{formatRelativeDate(activity.occurredAt)}</p>
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
