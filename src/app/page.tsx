import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeDate, formatLocation, clampScore } from "@/lib/utils";
import { ActionRequiredQueue } from "@/components/ActionRequiredQueue";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { StatusPill } from "@/components/StatusPill";
import { RefreshInboxButton } from "@/components/RefreshInboxButton";
import { ClearDraftsButton } from "@/components/ClearDraftsButton";

export const dynamic = "force-dynamic";

export default async function Home(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.searchParams;
  const skip = parseInt((params?.skip as string) || "0", 10);
  const now = new Date();

  const [leadRows, newCount, draftCount, followUpCount, overdueLeads, totalInboxCount, projectCount] = await Promise.all([
    prisma.lead.findMany({
      include: {
        artist: {
          include: {
            releases: {
              orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
              take: 1,
            },
            instagramPosts: {
              where: {
                imageUrl: { not: "" },
                OR: [
                  { caption: { not: "" } },
                  { url: { not: "" } },
                ],
              },
              orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
              take: 1,
            },
          },
        },
        messages: {
          where: { selected: false },
          orderBy: { createdAt: "desc" },
          take: 2,
        },
      },
      where: {
        status: { in: ["NEW", "QUALIFIED", "FOLLOW_UP"] },
      },
      orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
      take: 3,
      skip: skip,
    }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.messageDraft.count({ where: { selected: false } }),
    prisma.lead.count({
      where: {
        status: "FOLLOW_UP",
        nextActionAt: { lte: now },
      },
    }),
    prisma.lead.findMany({
      where: {
        status: "FOLLOW_UP",
        nextActionAt: { lte: now },
      },
      include: {
        artist: true,
      },
      orderBy: { nextActionAt: "asc" },
      take: 5,
    }),
    prisma.lead.count({
      where: {
        status: { in: ["NEW", "QUALIFIED", "FOLLOW_UP"] },
      },
    }),
    prisma.project.count({ where: { status: "ACTIVE" } }),
  ]);

  const leads = leadRows.map((lead) => {
    const latestRelease = lead.artist.releases[0];
    const score = clampScore(lead.score);
    return {
      id: lead.id,
      name: lead.artist.name,
      location: formatLocation(
        lead.artist.location,
        lead.artist.city,
        lead.artist.state,
        lead.artist.country
      ),
      genre: lead.artist.genre ?? "Unknown",
      status: lead.status,
      score,
      summary: lead.scoreRationale ?? "Analysis pending...",
      lastRelease: latestRelease
        ? `${formatRelativeDate(latestRelease.releaseDate ?? latestRelease.createdAt)} - "${latestRelease.title}"`
        : "No recent activity",
    };
  });

  return (
    <div className="relative min-h-screen bg-transparent text-white pb-20 selection:bg-accent/30 selection:text-white">
      
      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8 md:gap-12 px-4 sm:px-6 md:px-12 pt-6 sm:pt-8 md:pt-12">
        {/* V2 Hero Banner */}
        <div className="relative h-[200px] sm:h-[280px] md:h-[320px] w-full rounded-2xl sm:rounded-3xl md:rounded-[48px] overflow-hidden group shadow-2xl bg-[#0d0d12] border border-white/5">
          {/* Premium CSS Hero Background */}
          <div className="absolute inset-0 bg-linear-to-br from-accent/20 via-transparent to-accent-secondary/20 transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 opacity-40" style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '24px 24px' 
          }} />
          
          {/* Animated Spectral Elements */}
          <div className="absolute right-4 sm:right-12 inset-y-0 flex items-center gap-1.5 opacity-20 group-hover:opacity-40 transition-opacity duration-700">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className="w-1.5 bg-accent rounded-full animate-pulse" 
                style={{ 
                  height: `${30 + (Math.sin(i * 0.5) * 40 + 40)}%`,
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: `${1.5 + Math.random()}s`
                }} 
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-linear-to-r from-[#0d0d12] via-[#0d0d12]/60 to-transparent" />
          <div className="absolute inset-x-4 sm:inset-x-12 bottom-6 sm:bottom-12 max-w-2xl space-y-2 sm:space-y-4">
             <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-md">
               <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
               Lead Intelligence Active
             </div>
             <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
               Dashboard: <br className="hidden sm:block" /> <span className="premium-gradient-text">Leads</span>
             </h1>
          </div>
        </div>

        {/* Featured Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/leads/discover" className="block">
            <GlassCard className="relative h-[240px] p-0! overflow-hidden group hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-linear-to-b from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent shadow-xl border border-white/5 group-hover:bg-accent/20 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2 2"/><path d="m7.8 16.2 2-2"/><path d="m14.5 14.5 2 2"/><path d="m9.5 9.5-2-2"/></svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Artist Search</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">Discover new talent and live events.</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-accent/10 blur-3xl rounded-full" />
            </GlassCard>
          </Link>

          <Link href="/leads/drafts" className="block">
            <GlassCard className="relative h-[240px] p-0! overflow-hidden group hover:scale-[1.02] transition-all duration-500">
               <div className="absolute inset-0 bg-linear-to-b from-accent-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent-secondary shadow-xl border border-white/5 group-hover:bg-accent-secondary/20 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6"/><path d="M23 11h-6"/></svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Artist / Contact Management</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">Filter and sort all generated leads.</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-accent-secondary/10 blur-3xl rounded-full" />
            </GlassCard>
          </Link>

          <Link href="/projects" className="block">
            <GlassCard className="relative h-[240px] p-0! overflow-hidden group hover:scale-[1.02] transition-all duration-500">
              <div className="absolute inset-0 bg-linear-to-b from-accent-warm/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-8 h-full flex flex-col justify-between relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-accent-warm shadow-xl border border-white/5 group-hover:bg-accent-warm/20 group-hover:text-white transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">Active Projects</h3>
                  <p className="text-sm text-white/40 leading-relaxed font-medium">Manage deliverables and workflows.</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-accent-warm/10 blur-3xl rounded-full" />
            </GlassCard>
          </Link>
        </div>

        {/* Main Dashboard Overhaul */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 mt-8">
          
          {/* Recent Leads Feed */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Recent Artists</h2>
               <div className="flex items-center gap-4">
                  <RefreshInboxButton totalCount={totalInboxCount} />
               </div>
            </div>

            <div className="space-y-6">
               {(leads.length === 0) ? (
                 <div className="p-12 border border-dashed border-white/10 rounded-[32px] text-center bg-white/2">
                   <p className="text-white/40 font-bold uppercase tracking-widest">No Active Leads</p>
                 </div>
               ) : (
                 leads.map((lead) => (
                   <div key={lead.id} className="group relative p-6 rounded-[32px] bg-white/2 border border-white/5 hover:bg-white/5 transition-all flex items-center gap-6">
                      <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-white/10 to-white/5 flex items-center justify-center text-xl font-bold text-white/20 group-hover:text-accent transition-colors">
                        {lead.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/leads/${lead.id}`} className="text-lg font-bold text-white truncate hover:text-accent transition-colors block leading-tight mb-1">
                          {lead.name}
                        </Link>
                        <p className="text-xs uppercase tracking-widest text-white/30 font-bold">{lead.location} // {lead.genre}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StatusPill status={lead.status} />
                        <span className="text-xs font-sans font-bold text-accent/60 uppercase tracking-tighter">Score: {lead.score}%</span>
                      </div>
                   </div>
                 ))
               )}
               <Link href="/leads" className="block text-center p-4 rounded-2xl bg-white/5 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                 View All Dashboard Records →
               </Link>
            </div>
          </section>

          {/* Right Sidebar: Active Queue & Stats */}
          <aside className="space-y-12">
            <div className="space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 border-b border-white/5 pb-4">
                Action Required
              </h3>
              <ActionRequiredQueue initialLeads={overdueLeads} />
            </div>

            <GlassCard className="bg-white/2 border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 mb-8 border-b border-white/5 pb-4">Quick Stats</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Leads</span>
                   <span className="text-xl font-bold text-white">{totalInboxCount}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-white/40 uppercase tracking-widest">New Artists</span>
                   <span className="text-xl font-bold text-accent">{newCount}</span>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Projects</span>
                   <span className="text-xl font-bold text-accent-secondary">{projectCount}</span>
                </div>
              </div>
            </GlassCard>
          </aside>

        </div>
      </div>
    </div>
  );
}
