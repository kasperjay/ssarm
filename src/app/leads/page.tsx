import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeDate, formatLocation, clampScore } from "@/lib/utils";
import { GlassCard } from "@/components/GlassCard";
import { StatusPill } from "@/components/StatusPill";
import { NeonButton } from "@/components/NeonButton";

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
    <div className="relative min-h-screen pb-20">
      <div className="relative mx-auto flex max-w-5xl flex-col gap-10 px-6 py-12">
        <header className="flex flex-col gap-6">
          <div className="flex flex-wrap items-end justify-between gap-6 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <Link href="/" className="inline-flex items-center gap-2 group text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors">
                <span className="transition-transform group-hover:-translate-x-1">←</span> Return Terminal
              </Link>
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                Master <span className="text-accent italic">Inbox</span>
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Active Records</span>
                <span className="text-2xl font-mono text-foreground">{leads.length}</span>
              </div>
              <div className="h-10 w-px bg-white/10 mx-2" />
              <Link href="/leads/discover">
                <NeonButton variant="cyan" size="sm">
                  Scan New Data
                </NeonButton>
              </Link>
            </div>
          </div>
        </header>

        <main>
          <div className="flex flex-col gap-6">
            {leads.length === 0 ? (
              <GlassCard className="text-center py-20">
                <p className="text-muted uppercase tracking-[0.3em] font-bold text-xs">[ No Records Found ]</p>
              </GlassCard>
            ) : (
              leads.map((lead) => (
                <GlassCard
                  key={lead.id}
                  className="group relative border-l-2 border-l-transparent hover:border-l-accent transition-all hover:translate-x-1"
                >
                  <div className="flex flex-wrap items-center justify-between gap-6">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold tracking-tight">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="hover:text-accent transition-colors"
                        >
                          {lead.name}
                        </Link>
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted/80">
                        {lead.location} <span className="mx-2 text-accent/30">//</span> {lead.genre}
                      </p>
                    </div>
                    <div className="flex items-center gap-6">
                      <StatusPill status={lead.status} />
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-accent font-mono tracking-tighter">
                          {lead.score}
                        </span>
                        <span className="text-[8px] uppercase tracking-tighter text-muted">INDEX</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4">
                    <p className="text-sm text-foreground/70 leading-relaxed border-l border-white/10 pl-4 py-1">
                      {lead.summary}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-[0.15em]">
                        <span className="h-1 w-4 bg-accent-secondary/40 rounded-full" />
                        {lead.lastRelease}
                      </div>
                      <div className="flex w-40 items-center gap-3">
                        <div className="h-1 flex-1 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-accent neon-glow transition-all duration-1000"
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-accent/70">{lead.score}%</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
