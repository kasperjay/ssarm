import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeDate, formatLocation, clampScore } from "@/lib/utils";
import { SpotlightSection } from "@/components/SpotlightSection";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { StatusPill } from "@/components/StatusPill";

export default async function Home() {
  const now = new Date();

  const [leadRows, newCount, draftCount, followUpCount] = await Promise.all([
    prisma.lead.findMany({
      include: {
        artist: {
          include: {
            releases: {
              orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
              take: 1,
            },
            instagramPosts: {
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
    }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.messageDraft.count({ where: { selected: false } }),
    prisma.lead.count({
      where: {
        status: "FOLLOW_UP",
        nextActionAt: { lte: now },
      },
    }),
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

  const spotlight = leadRows[0];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Immersive Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <div className="absolute inset-0 scanlines pointer-events-none opacity-30" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[10%] -right-[5%] w-[40%] h-[40%] bg-accent-secondary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-6 py-12">
        {/* Header Section */}
        <header className="flex flex-col gap-8">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-accent" />
                <p className="text-[10px] uppercase tracking-[0.5em] text-accent/80 font-bold">
                  Terminal // Spectral Soundworks
                </p>
              </div>
              <h1 className="font-display text-5xl font-medium tracking-tight md:text-7xl">
                Lead <span className="text-accent underline decoration-accent/20 underline-offset-8">Desk</span>
              </h1>
            </div>
            <div className="flex flex-wrap gap-4 pb-1">
              <Link href="/leads/discover">
                <NeonButton variant="outline" size="md">
                  Discover Data
                </NeonButton>
              </Link>
              <NeonButton variant="cyan" size="md">
                + New Entry
              </NeonButton>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Priority Queue",
                value: String(newCount),
                detail: "Awaiting outreach",
                variant: 'cyan'
              },
              {
                label: "Draft Engine",
                value: String(draftCount),
                detail: "Messages pending",
                variant: 'purple'
              },
              {
                label: "Follow-up Cycle",
                value: String(followUpCount),
                detail: "Action required",
                variant: 'rose'
              },
            ].map((stat) => (
              <GlassCard key={stat.label} variant="strong" className="group border-l-2 border-l-transparent hover:border-l-accent transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted group-hover:text-accent/60 transition-colors">
                      {stat.label}
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-4xl font-bold tracking-tighter">
                        {stat.value}
                      </span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform`}>
                    <div className={`h-2 w-2 rounded-full ${stat.variant === 'cyan' ? 'bg-accent' : stat.variant === 'purple' ? 'bg-accent-secondary' : 'bg-accent-warm'}`} />
                  </div>
                </div>
                <p className="mt-4 text-xs text-muted/80 font-medium italic">
                  {stat.detail}
                </p>
              </GlassCard>
            ))}
          </div>
        </header>

        {/* Main Content Dashboard */}
        <main className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Inbox Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-accent neon-glow rounded-full" />
                <h2 className="text-xl font-bold tracking-tight uppercase">
                  Lead Inbox
                </h2>
              </div>
              <Link
                href="/leads"
                className="group text-[10px] font-bold uppercase tracking-[0.2em] text-accent/70 hover:text-accent transition-colors"
              >
                Execute Full Scan <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            <div className="flex flex-col gap-6">
              {leads.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
                  <p className="text-sm text-muted uppercase tracking-widest font-bold">
                    [ No Active Leads Detected ]
                  </p>
                  <p className="mt-2 text-xs text-muted/60">
                    Initialize discovery protocols to populate database.
                  </p>
                </div>
              ) : (
                leads.map((lead) => (
                  <GlassCard
                    key={lead.id}
                    className="group relative overflow-hidden transition-all hover:translate-x-1 active:scale-[0.99] border-l-2 border-l-accent/0 hover:border-l-accent"
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
                      <div className="flex items-center gap-4">
                        <StatusPill status={lead.status} />
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-accent">
                            {lead.score}
                          </span>
                          <span className="text-[8px] uppercase tracking-tighter text-muted">Match Index</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-4">
                      <p className="text-sm text-foreground/80 leading-relaxed max-w-2xl border-l border-white/10 pl-4 py-1 italic">
                        "{lead.summary}"
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
                          <span className="h-1.5 w-1.5 bg-accent-secondary rounded-full" />
                          {lead.lastRelease}
                        </div>
                        <div className="flex w-48 items-center gap-3">
                          <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden border border-white/5">
                            <div
                              className="h-full rounded-full bg-accent neon-glow transition-all duration-1000"
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-accent/80">{lead.score}%</span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>
          </section>

          {/* Spotlight Section */}
          <aside className="space-y-6">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="h-2 w-2 bg-accent-secondary neon-glow-purple rounded-full" />
              <h2 className="text-xl font-bold tracking-tight uppercase">
                Intelligence
              </h2>
            </div>
            <SpotlightSection initialLead={spotlight} />
          </aside>
        </main>
      </div>
    </div>
  );
}
