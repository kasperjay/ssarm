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

const formatLocation = (
  location: string | null,
  city: string | null,
  state: string | null,
  country: string | null
) => {
  if (location) return location;
  const parts = [city, state, country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown";
};

const clampScore = (score: number | null) => {
  if (score === null || Number.isNaN(score)) return 0;
  return Math.min(100, Math.max(0, Math.round(score)));
};

const parsePage = (value?: string) => {
  if (!value) return 1;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

type LeadsPageProps = {
  searchParams: Promise<{
    page?: string;
    q?: string;
    minScore?: string;
    genre?: string;
    sort?: string;
  }>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const { page, q, minScore, genre, sort } = await searchParams;
  const pageSize = 24;
  const currentPage = parsePage(page);
  const query = q?.trim() ?? "";
  const scoreFloor = Number.parseInt(minScore ?? "", 10);
  const minScoreValue = Number.isFinite(scoreFloor) ? Math.max(0, scoreFloor) : 0;
  const genreValue = genre?.trim() ?? "";
  const sortValue = sort?.trim() ?? "score";

  const orderBy =
    sortValue === "updated"
      ? [{ updatedAt: "desc" }, { score: "desc" }]
      : sortValue === "name"
        ? [{ artist: { name: "asc" } }]
        : [{ score: "desc" }, { updatedAt: "desc" }];

  const artistWhere: Record<string, unknown> = {};
  if (query) {
    artistWhere.name = { contains: query, mode: "insensitive" };
  }
  if (genreValue) {
    artistWhere.genre = { equals: genreValue };
  }

  const where = {
    ...(minScoreValue > 0 ? { score: { gte: minScoreValue } } : {}),
    ...(Object.keys(artistWhere).length ? { artist: artistWhere } : {}),
  };

  const [leadRows, totalCount, genreRows] = await Promise.all([
    prisma.lead.findMany({
      where,
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
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.lead.count({ where }),
    prisma.artist.findMany({
      select: { genre: true },
      distinct: ["genre"],
      orderBy: { genre: "asc" },
    }),
  ]);

  const genres = genreRows
    .map((row) => row.genre)
    .filter((value): value is string => Boolean(value));

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
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

  const buildQuery = (nextPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (minScoreValue > 0) params.set("minScore", String(minScoreValue));
    if (genreValue) params.set("genre", genreValue);
    if (sortValue) params.set("sort", sortValue);
    params.set("page", String(nextPage));
    return params.toString();
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(35,211,255,0.18),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(139,92,246,0.2),_transparent_45%),linear-gradient(180deg,_rgba(5,7,10,0.95),_rgba(5,7,10,1))]">
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-10">
        <header className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-white/10 bg-[color:var(--surface)] p-8 shadow-[0_30px_80px_-60px_rgba(35,211,255,0.35)]">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[color:var(--muted)]">
              Spectral Soundworks
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-[color:var(--foreground)] md:text-5xl">
              All Leads
            </h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              {totalCount} total leads · Page {currentPage} of {totalPages}
            </p>
          </div>
          <Link
            href="/"
            className="rounded-full border border-white/10 px-5 py-2 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
          >
            Back to Lead Desk
          </Link>
        </header>

        <section className="rounded-3xl border border-white/10 bg-[color:var(--surface-strong)] p-6 shadow-[0_40px_90px_-70px_rgba(35,211,255,0.3)]">
          <form
            className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-white/10 bg-[color:var(--surface)] p-4"
            action="/leads"
            method="get"
          >
            <label className="flex flex-1 min-w-[200px] flex-col gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Search
              <input
                name="q"
                defaultValue={query}
                placeholder="Artist name"
                className="rounded-xl border border-white/10 bg-[color:var(--surface-strong)] px-3 py-2 text-sm normal-case tracking-normal text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)]"
              />
            </label>
            <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Min Score
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  name="minScore"
                  defaultValue={minScoreValue}
                  className="h-2 w-40 cursor-pointer appearance-none rounded-full bg-white/10 accent-[color:var(--accent)]"
                />
                <span className="w-10 text-sm text-[color:var(--foreground)]">
                  {minScoreValue}
                </span>
              </div>
            </label>
            <label className="flex min-w-[180px] flex-col gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Genre
              <select
                name="genre"
                defaultValue={genreValue}
                className="rounded-xl border border-white/10 bg-[color:var(--surface-strong)] px-3 py-2 text-sm normal-case tracking-normal text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)]"
              >
                <option value="">All genres</option>
                {genres.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-w-[160px] flex-col gap-2 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Sort
              <select
                name="sort"
                defaultValue={sortValue}
                className="rounded-xl border border-white/10 bg-[color:var(--surface-strong)] px-3 py-2 text-sm normal-case tracking-normal text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)]"
              >
                <option value="score">Score</option>
                <option value="updated">Recently updated</option>
                <option value="name">Artist name</option>
              </select>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded-full bg-[color:var(--accent)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[color:var(--accent-strong)]"
              >
                Apply
              </button>
              <Link
                href="/leads"
                className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--foreground)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
              >
                Reset
              </Link>
            </div>
          </form>
          {leads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/20 bg-[color:var(--surface)] p-6 text-sm text-[color:var(--muted)]">
              No leads yet. Run your import pipeline to populate the list.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {leads.map((lead) => (
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
              ))}
            </div>
          )}
        </section>

        <nav className="flex items-center justify-between text-xs text-[color:var(--muted)]">
          <Link
            href={`/leads?${buildQuery(Math.max(1, currentPage - 1))}`}
            className={`rounded-full border border-white/10 px-3 py-1 ${
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "hover:border-[color:var(--accent)]"
            }`}
          >
            Previous
          </Link>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Link
            href={`/leads?${buildQuery(Math.min(totalPages, currentPage + 1))}`}
            className={`rounded-full border border-white/10 px-3 py-1 ${
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "hover:border-[color:var(--accent)]"
            }`}
          >
            Next
          </Link>
        </nav>
      </div>
    </div>
  );
}
