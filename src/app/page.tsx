import Link from "next/link";
import { prisma } from "@/lib/prisma";

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

const formatStatus = (status: string) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");

const formatLocation = (location: string | null, city: string | null, state: string | null, country: string | null) => {
  if (location) return location;
  const parts = [city, state, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown";
};

const clampScore = (score: number | null) => {
  if (score === null || Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
};

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
          orderBy: { createdAt: "desc" },
          take: 2,
        },
      },
      orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
      take: 3,
    }),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.messageDraft.count(),
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
  const spotlightRelease = spotlight?.artist.releases[0];
  const spotlightCaption =
    spotlight?.artist.instagramPosts[0]?.caption ??
    spotlight?.artist.bio ??
    "No recent post data yet.";

  const messageCount = spotlight?.messages.length ?? 0;

  const messages = messageCount
    ? spotlight.messages.map((message) => ({
        id: message.id,
        tone: message.tone ?? "Draft",
        body: message.body,
      }))
    : [
        {
          id: "empty",
          tone: "Draft",
          body:
            "No outreach drafts yet. Run the LLM generator to create personalized intros.",
        },
      ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(35,211,255,0.18),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(139,92,246,0.2),_transparent_45%),linear-gradient(180deg,_rgba(5,7,10,0.95),_rgba(5,7,10,1))]">
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-[color:var(--surface)] p-8 shadow-[0_30px_80px_-60px_rgba(35,211,255,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">
                Spectral Soundworks
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-[color:var(--foreground)] md:text-5xl">
                Lead Desk
              </h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-[color:var(--accent)] px-5 py-2 text-sm font-semibold text-[color:var(--accent-strong)] transition hover:bg-[color:var(--accent)] hover:text-white">
                Import Fresh Leads
              </button>
              <button className="rounded-full bg-[color:var(--foreground)] px-5 py-2 text-sm font-semibold text-[color:var(--surface)] transition hover:bg-white/80">
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
              ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-[color:var(--surface-strong)] p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                  {stat.label}
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold text-[color:var(--foreground)]">
                    {stat.value}
                  </span>
                  <span className="text-sm text-[color:var(--muted)]">{stat.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </header>

        <main className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] p-6 shadow-[0_40px_90px_-70px_rgba(139,92,246,0.35)]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
                  Lead Inbox
                </h2>
                <p className="text-sm text-[color:var(--muted)]">
                  Prioritized by proximity, momentum, and release activity.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[color:var(--surface)] px-3 py-1 text-xs text-[color:var(--muted)]">
                  <span>Filter:</span>
                  <span className="rounded-full bg-[color:var(--highlight)] px-2 py-0.5 text-[color:var(--foreground)]">
                    Austin radius
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5">Score 70+</span>
                </div>
                <Link
                  href="/leads"
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
                >
                  View all leads
                </Link>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              {leads.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/20 bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)]">
                  No leads yet. Run your import pipeline to populate the inbox.
                </div>
              ) : (
                leads.map((lead) => (
                  <article
                    key={lead.id}
                    className="rounded-2xl border border-white/10 bg-[color:var(--surface)] p-4 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_-30px_rgba(35,211,255,0.35)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                      <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="transition hover:text-[color:var(--accent-strong)]"
                        >
                          {lead.name}
                        </Link>
                      </h3>
                        <p className="text-sm text-[color:var(--muted)]">
                          {lead.location} · {lead.genre}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-[color:var(--surface-strong)] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                          {lead.status}
                        </span>
                        <span className="rounded-full bg-[color:var(--accent)] px-3 py-1 text-xs font-semibold text-white">
                          {lead.score}
                        </span>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[color:var(--foreground)]">
                      {lead.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--muted)]">
                      <span>{lead.lastRelease}</span>
                      <div className="flex w-36 items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-white/10">
                          <div
                            className="h-1.5 rounded-full bg-[color:var(--accent)]"
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

          <section className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] p-6">
              <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
                Spotlight Lead
              </h2>
              <p className="text-sm text-[color:var(--muted)]">
                {spotlight
                  ? `${spotlight.artist.name} · ${spotlight.artist.genre ?? "Unknown"} · ${formatLocation(
                      spotlight.artist.location,
                      spotlight.artist.city,
                      spotlight.artist.state,
                      spotlight.artist.country
                    )}`
                  : "No leads yet"}
              </p>
              <div className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-[color:var(--surface)] p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--muted)]">Latest release</span>
                  <span className="font-semibold">
                    {spotlightRelease
                      ? `${spotlightRelease.title} - ${formatRelativeDate(
                          spotlightRelease.releaseDate ?? spotlightRelease.createdAt
                        )}`
                      : "No release data"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--muted)]">Instagram activity</span>
                  <span className="font-semibold">
                    {spotlight?.artist.lastPostAt
                      ? `Last post ${formatRelativeDate(spotlight.artist.lastPostAt)}`
                      : "No recent post"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[color:var(--muted)]">Followers</span>
                  <span className="font-semibold">
                    {spotlight?.artist.followerCount?.toLocaleString() ?? "Unknown"}
                  </span>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[color:var(--foreground)]">
                {spotlightCaption}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
                  Outreach Drafts
                </h2>
                <span className="text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
                  {messageCount} drafts
                </span>
              </div>
              <div className="mt-4 flex flex-col gap-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className="rounded-2xl border border-white/10 bg-[color:var(--surface)] p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
                      {message.tone}
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--foreground)]">
                      {message.body}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="rounded-full bg-[color:var(--accent)] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[color:var(--accent-strong)]">
                        Use Draft
                      </button>
                      <button className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-semibold text-[color:var(--muted)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
