export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeDate, formatLocation, clampScore } from "@/lib/utils";
import { GlassCard } from "@/components/GlassCard";
import { StatusPill } from "@/components/StatusPill";
import { NeonButton } from "@/components/NeonButton";
import { Navbar } from "@/components/Navbar";

export default async function LeadsPage() {
  const leadRows = await prisma.lead.findMany({
    include: {
      artist: {
        include: {
          releases: {
            orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
            take: 1,
          },
        },
      },
    },
    where: {
      status: {
        not: "CONTACTED",
      },
    },
    orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
  });

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
    <div className="relative min-h-screen bg-background pt-32 pb-20 selection:bg-accent/30 selection:text-white">
      <Navbar />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6">
        
        {/* Header Section */}
        <header className="flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-12 border-b border-white/5 pb-12">
            <div className="space-y-6">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all"
              >
                <span className="transition-transform group-hover:-translate-x-1">←</span>                 <span>Dashboard</span>
              </Link>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-accent/40" />
                  <p className="text-xs uppercase tracking-[0.3em] text-accent/60 font-bold">
                    Lead Directory
                  </p>
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight premium-gradient-text pr-4">
                  Inbox
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-8 pb-2">
              <GlassCard className="px-6! py-4! flex items-center gap-6 bg-white/2 border-white/5 shadow-xl">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Total Leads</span>
                  <span className="text-3xl font-bold tracking-tighter text-white">{leads.length}</span>
                </div>
                <div className="h-10 w-px bg-white/5" />
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent neon-glow" />
                  <span className="text-[9px] font-bold text-accent/60 uppercase tracking-widest">Auto-Sync</span>
                </div>
              </GlassCard>

              <Link href="/leads/discover">
                <NeonButton variant="outline" size="md">
                  + New Search
                </NeonButton>
              </Link>
            </div>
          </div>
        </header>

        <main>
          <div className="flex flex-col gap-6">
            {leads.length === 0 ? (
              <GlassCard className="text-center py-32 bg-white/2 border-white/5 border-dashed">
                <p className="text-white/30 uppercase tracking-[0.2em] font-bold text-xs">
                  No leads found in this view
                </p>
              </GlassCard>
            ) : (
              <div className="grid gap-8 pb-12">
                {leads.map((lead) => (
                  <GlassCard
                    key={lead.id}
                    className="group relative border-white/5 hover:border-white/10 transition-all hover:translate-x-1 active:scale-[0.995] shadow-2xl overflow-hidden"
                  >
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 h-32 w-32 bg-accent/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="flex flex-wrap items-center justify-between gap-8 mb-10">
                      <div className="space-y-3">
                        <h3 className="text-3xl font-bold tracking-tighter">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="hover:text-accent transition-colors premium-gradient-text"
                          >
                            {lead.name}
                          </Link>
                        </h3>
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">
                           {lead.location && <>{lead.location} <span className="mx-4 text-white/10">•</span></>} {lead.genre}
                        </p>
                      </div>
                      <div className="flex items-center gap-8">
                        <StatusPill status={lead.status} />
                        <div className="flex flex-col items-end min-w-[80px]">
                          <span className="text-2xl font-bold premium-gradient-text">
                            {lead.score}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest text-white/20">Lead Score</span>
                        </div>
                      </div>
                    </div>

                  <div className="space-y-8">
                    <p className="text-sm text-white/60 leading-relaxed max-w-3xl border-l border-white/10 pl-6 py-1 italic font-medium">
                      &quot;{lead.summary}&quot;
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-8 pt-6 border-t border-white/5">
                      <div className="flex items-center gap-3 text-xs font-bold text-white/30 uppercase tracking-[0.2em]">
                        <span className="h-1.5 w-1.5 bg-accent-secondary neon-glow-amber rounded-full" />
                        {lead.lastRelease}
                      </div>
                      <div className="flex w-64 items-center gap-4">
                        <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden border border-white/5 relative">
                          <div
                            className="h-full bg-accent neon-glow transition-all duration-1000 relative z-10"
                            style={{ width: `${lead.score}%` }}
                          />
                          <div className="absolute inset-0 bg-accent/20 blur-md" style={{ width: `${lead.score}%` }} />
                        </div>
                        <span className="text-xs font-bold text-accent tracking-tighter">{lead.score}%</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
