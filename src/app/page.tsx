import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeDate, formatLocation, formatStatus, clampScore } from "@/lib/utils";
import { SpotlightSection } from "@/components/SpotlightSection";

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
      status: formatStatus(lead.status),
      score,
      summary: lead.scoreRationale ?? "No notes yet.",
      lastRelease: latestRelease
        ? `${formatRelativeDate(latestRelease.releaseDate ?? latestRelease.createdAt)} - "${latestRelease.title}"`
        : "No recent release",
    };
  });

  const spotlight = leadRows[0];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(35,211,255,0.18),transparent_55%),radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.2),transparent_45%),linear-gradient(180deg,rgba(5,7,10,0.95),rgba(5,7,10,1))]">
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-(--surface) p-8 shadow-[0_30px_80px_-60px_rgba(35,211,255,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-(--muted)">
                Spectral Soundworks
              </p>
              <h1 className="font-display text-4xl leading-tight text-foreground md:text-5xl">
                Lead Desk
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/leads/discover"
                className="rounded-full border border-(--accent) px-5 py-2 text-sm font-semibold text-(--accent-strong) transition hover:bg-(--accent) hover:text-white"
              >
                Discover Leads
              </Link>
              <button className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-(--surface) transition hover:bg-white/80">
                New Outreach Note
              </button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "New leads",
                value: String(newCount),
                detail: "Newest arrivals",
              },
              {
                label: "Messages queued",
                value: String(draftCount),
                detail: "Drafts ready",
              },
              {
                label: "Follow-ups due",
                value: String(followUpCount),
                detail: "Needs a nudge",
              },
            ].map((stat) => {
              const isDrafts = stat.label === "Messages queued";
              return isDrafts ? (
                <Link
                  key={stat.label}
                  href="/leads/drafts"
                  className="block rounded-2xl border border-white/10 bg-(--surface-strong) p-4 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-30px_rgba(35,211,255,0.35)]"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-(--muted) group-hover:text-(--accent-strong) transition">
                    {stat.label} <span className="text-(--accent-strong)">→</span>
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-foreground">
                      {stat.value}
                    </span>
                    <span className="text-sm text-(--muted)">{stat.detail}</span>
                  </div>
                </Link>
              ) : (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-(--surface-strong) p-4"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-(--muted)">
                    {stat.label}
                  </p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-foreground">
                      {stat.value}
                    </span>
                    <span className="text-sm text-(--muted)">{stat.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        <main className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-white/10 bg-(--surface-strong) p-6 shadow-[0_40px_90px_-70px_rgba(139,92,246,0.35)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-baseline justify-between mb-1 w-full sm:w-auto">
                <h2 className="text-xl font-semibold text-foreground">
                  Lead Inbox
                </h2>
                <Link
                  href="/leads"
                  className="text-xs font-semibold uppercase tracking-wider text-(--accent-strong) hover:text-(--accent) transition-colors ml-4"
                >
                  View All Leads →
                </Link>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-(--surface) px-3 py-1 text-xs text-(--muted)">
                <span>Filter:</span>
                <span className="rounded-full bg-(--highlight) px-2 py-0.5 text-foreground">
                  Austin radius
                </span>
                <span className="rounded-full bg-white/10 px-2 py-0.5">Score 70+</span>
              </div>
            </div>
            <p className="text-sm text-(--muted) mb-6">
              Prioritized by proximity, momentum, and release activity.
            </p>

            <div className="flex flex-col gap-4">
              {leads.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/20 bg-(--surface) p-6 text-sm text-(--muted)">
                  No leads yet. Run your import pipeline to populate the inbox.
                </div>
              ) : (
                leads.map((lead) => (
                  <article
                    key={lead.id}
                    className="rounded-2xl border border-white/10 bg-(--surface) p-4 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-30px_rgba(35,211,255,0.35)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="transition hover:text-(--accent-strong)"
                          >
                            {lead.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-(--muted)">
                          {lead.location} · {lead.genre}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-(--surface-strong) px-3 py-1 text-xs uppercase tracking-[0.2em] text-(--muted)">
                          {lead.status}
                        </span>
                        <span className="rounded-full bg-(--accent) px-3 py-1 text-xs font-semibold text-white">
                          {lead.score}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-foreground">
                      {lead.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-(--muted)">
                      <span>{lead.lastRelease}</span>
                      <div className="flex w-36 items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-white/10">
                          <div
                            className="h-1.5 rounded-full bg-(--accent)"
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                        <span>{lead.score}%</span>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>

          <SpotlightSection initialLead={spotlight} />
        </main>
      </div>
    </div>
  );
}
