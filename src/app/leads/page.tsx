import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeDate, formatLocation, formatStatus, clampScore } from "@/lib/utils";

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
      status: formatStatus(lead.status),
      score,
      summary: lead.scoreRationale ?? "No notes yet.",
      lastRelease: latestRelease
        ? `${formatRelativeDate(latestRelease.releaseDate ?? latestRelease.createdAt)} - "${latestRelease.title}"`
        : "No recent release",
    };
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(35,211,255,0.18),transparent_55%),radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.2),transparent_45%),linear-gradient(180deg,rgba(5,7,10,0.95),rgba(5,7,10,1))]">
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-(--surface) p-8 shadow-[0_30px_80px_-60px_rgba(35,211,255,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <Link href="/" className="text-xs uppercase tracking-[0.35em] text-(--muted) hover:text-(--accent-strong) transition">
                ← Back to Dashboard
              </Link>
              <h1 className="mt-2 font-display text-4xl leading-tight text-foreground md:text-5xl">
                All Leads
              </h1>
            </div>
          </div>
        </header>

        <main>
          <section className="rounded-3xl border border-white/10 bg-(--surface-strong) p-6 shadow-[0_40px_90px_-70px_rgba(139,92,246,0.35)]">
            <div className="flex flex-col gap-4">
              {leads.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/20 bg-(--surface) p-6 text-sm text-(--muted)">
                  No leads found.
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
        </main>
      </div>
    </div>
  );
}
