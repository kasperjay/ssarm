export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { formatRelativeDate, formatLocation, clampScore } from "@/lib/utils";
import { StatusPill } from "@/components/StatusPill";

const STATUS_OPTIONS = ["ALL", "NEW", "QUALIFIED", "CONTACTED", "FOLLOW_UP", "WON", "LOST"] as const;
const CONTACT_OPTIONS = ["ALL", "WITH_CONTACT", "NO_CONTACT"] as const;
const SORT_OPTIONS = ["score_desc", "score_asc", "updated_desc", "updated_asc", "name_asc", "name_desc", "created_desc", "created_asc"] as const;

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function asSingle(value: string | string[] | undefined, fallback: string) {
  if (Array.isArray(value)) return value[0] ?? fallback;
  return value ?? fallback;
}

export default async function ContactManagementPage(props: PageProps) {
  const params = await props.searchParams;

  const status = asSingle(params.status, "ALL").toUpperCase();
  const contact = asSingle(params.contact, "ALL").toUpperCase();
  const sort = asSingle(params.sort, "score_desc").toLowerCase();
  const q = asSingle(params.q, "").trim();

  const safeStatus = STATUS_OPTIONS.includes(status as (typeof STATUS_OPTIONS)[number]) ? status : "ALL";
  const safeContact = CONTACT_OPTIONS.includes(contact as (typeof CONTACT_OPTIONS)[number]) ? contact : "ALL";
  const safeSort = SORT_OPTIONS.includes(sort as (typeof SORT_OPTIONS)[number]) ? sort : "score_desc";

  const where: {
    status?: "NEW" | "QUALIFIED" | "CONTACTED" | "FOLLOW_UP" | "WON" | "LOST";
    OR?: Array<{
      artist?: {
        name?: { contains: string; mode: "insensitive" };
        genre?: { contains: string; mode: "insensitive" };
        city?: { contains: string; mode: "insensitive" };
        state?: { contains: string; mode: "insensitive" };
        country?: { contains: string; mode: "insensitive" };
      };
      scoreRationale?: { contains: string; mode: "insensitive" };
    }>;
    artist?: {
      OR?: Array<
        | { emails: { isEmpty: boolean } }
        | { instagramHandle: { not: null } }
        | { officialSiteUrl: { not: null } }
      >;
      AND?: Array<
        | { emails: { isEmpty: boolean } }
        | { instagramHandle: null }
        | { officialSiteUrl: null }
      >;
    };
  } = {};

  if (safeStatus !== "ALL") {
    where.status = safeStatus as "NEW" | "QUALIFIED" | "CONTACTED" | "FOLLOW_UP" | "WON" | "LOST";
  }

  if (safeContact === "WITH_CONTACT") {
    where.artist = {
      OR: [
        { emails: { isEmpty: false } },
        { instagramHandle: { not: null } },
        { officialSiteUrl: { not: null } },
      ],
    };
  }

  if (safeContact === "NO_CONTACT") {
    where.artist = {
      AND: [
        { emails: { isEmpty: true } },
        { instagramHandle: null },
        { officialSiteUrl: null },
      ],
    };
  }

  if (q) {
    where.OR = [
      { artist: { name: { contains: q, mode: "insensitive" } } },
      { artist: { genre: { contains: q, mode: "insensitive" } } },
      { artist: { city: { contains: q, mode: "insensitive" } } },
      { artist: { state: { contains: q, mode: "insensitive" } } },
      { artist: { country: { contains: q, mode: "insensitive" } } },
      { scoreRationale: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy =
    safeSort === "score_asc"
      ? [{ score: "asc" as const }, { updatedAt: "desc" as const }]
      : safeSort === "updated_desc"
        ? [{ updatedAt: "desc" as const }]
        : safeSort === "updated_asc"
          ? [{ updatedAt: "asc" as const }]
          : safeSort === "name_asc"
            ? [{ artist: { name: "asc" as const } }]
            : safeSort === "name_desc"
              ? [{ artist: { name: "desc" as const } }]
              : safeSort === "created_asc"
                ? [{ createdAt: "asc" as const }]
                : safeSort === "created_desc"
                  ? [{ createdAt: "desc" as const }]
                  : [{ score: "desc" as const }, { updatedAt: "desc" as const }];

  const leads = await prisma.lead.findMany({
    where,
    include: {
      artist: true,
      messages: {
        where: { selected: false },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      activities: {
        orderBy: { occurredAt: "desc" },
        take: 1,
      },
    },
    orderBy,
  });

  return (
    <div className="relative min-h-screen bg-transparent">
      <div className="mx-auto max-w-7xl space-y-12 px-6 py-24">
        <header className="flex flex-col gap-8 relative">
          <div className="absolute -top-24 -right-24 h-96 w-96 bg-accent-warm/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="flex flex-wrap items-end justify-between gap-8 pb-10 border-b border-white/5 relative z-10">
            <div className="space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all">
                <span className="transition-transform group-hover:-translate-x-1 text-lg leading-none">←</span>
                Dashboard
              </Link>
              <h1 className="font-display text-5xl font-bold tracking-tighter md:text-6xl lg:text-7xl">
                Artist / <span className="premium-gradient-text-warm italic">Contact Management</span>
              </h1>
              <p className="text-white/40 text-sm max-w-2xl font-medium leading-relaxed">
                Central view of all generated leads with smart scoring, contact readiness, and outreach context.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 bg-white/2 backdrop-blur-sm border border-white/5 p-6 rounded-[32px]">
              <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Lead Records</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-sans font-extrabold text-accent-warm">{leads.length}</span>
                <span className="text-xs font-bold text-white/10 uppercase tracking-widest">Visible</span>
              </div>
            </div>
          </div>
        </header>

        <section className="relative z-10">
          <GlassCard className="p-6! border-white/5 bg-white/2">
            <form method="GET" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 items-end">
              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Search</span>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Artist, genre, location..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Status</span>
                <select name="status" defaultValue={safeStatus} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/30">
                  <option value="ALL">All Statuses</option>
                  <option value="NEW">New</option>
                  <option value="QUALIFIED">Qualified</option>
                  <option value="CONTACTED">Contacted</option>
                  <option value="FOLLOW_UP">Follow Up</option>
                  <option value="WON">Won</option>
                  <option value="LOST">Lost</option>
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Contact Readiness</span>
                <select name="contact" defaultValue={safeContact} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/30">
                  <option value="ALL">All</option>
                  <option value="WITH_CONTACT">Has Contact Signals</option>
                  <option value="NO_CONTACT">Missing Contact Signals</option>
                </select>
              </label>

              <label className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Sort</span>
                <select name="sort" defaultValue={safeSort} className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-accent/30">
                  <option value="score_desc">Smart Score (High → Low)</option>
                  <option value="score_asc">Smart Score (Low → High)</option>
                  <option value="updated_desc">Last Updated (Newest)</option>
                  <option value="updated_asc">Last Updated (Oldest)</option>
                  <option value="name_asc">Artist Name (A → Z)</option>
                  <option value="name_desc">Artist Name (Z → A)</option>
                  <option value="created_desc">Created (Newest)</option>
                  <option value="created_asc">Created (Oldest)</option>
                </select>
              </label>

              <div className="flex items-center gap-3">
                <NeonButton variant="purple" size="lg" className="w-full text-xs! tracking-[0.2em]! font-bold!">
                  Apply Filters
                </NeonButton>
                <Link href="/leads/drafts" className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white whitespace-nowrap">
                  Reset
                </Link>
              </div>
            </form>
          </GlassCard>
        </section>

        <main className="space-y-6 relative z-10">
          {leads.length === 0 ? (
            <GlassCard className="py-20 text-center p-12!">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 max-w-sm mx-auto leading-relaxed">
                No leads match this filter set.
              </p>
              <div className="mt-8">
                <Link href="/leads/discover">
                  <NeonButton variant="purple" size="lg" className="px-10! text-xs! tracking-[0.2em]! font-bold!">
                    Add More Leads
                  </NeonButton>
                </Link>
              </div>
            </GlassCard>
          ) : (
            <div className="grid gap-6">
              {leads.map((lead) => {
                const score = clampScore(lead.score);
                const hasEmail = (lead.artist.emails?.length ?? 0) > 0;
                const hasIg = Boolean(lead.artist.instagramHandle);
                const hasSite = Boolean(lead.artist.officialSiteUrl);
                const hasContactSignals = hasEmail || hasIg || hasSite;
                const latestActivity = lead.activities[0];
                const pendingDraft = lead.messages[0];

                return (
                  <GlassCard
                    key={lead.id}
                    className="group p-8! transition-all hover:bg-white/4 border-white/5 hover:border-accent-warm/30 shadow-2xl"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-8 mb-8 border-b border-white/5 pb-8">
                      <div className="space-y-3">
                        <h3 className="text-3xl font-bold tracking-tighter">
                          <Link
                            href={`/leads/${lead.id}`}
                            className="premium-gradient-text-warm hover:brightness-125 transition-all decoration-accent-warm/20 underline underline-offset-8 decoration-1"
                          >
                            {lead.artist.name}
                          </Link>
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-white/25 uppercase tracking-[0.2em]">
                          <span>{formatLocation(lead.artist.location, lead.artist.city, lead.artist.state, lead.artist.country) || "Location Unknown"}</span>
                          <span className="h-1 w-1 rounded-full bg-white/10" />
                          <span>{lead.artist.genre || "Genre Unknown"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <StatusPill status={lead.status} />
                        <div className="px-4 py-2 rounded-xl bg-accent-warm/5 border border-accent-warm/20 text-xs font-bold uppercase tracking-[0.2em] text-accent-warm">
                          Smart {score}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="rounded-2xl bg-white/3 border border-white/8 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-2">Contact Signals</p>
                        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${hasContactSignals ? "text-accent" : "text-white/35"}`}>
                          {hasContactSignals ? "Ready" : "Missing"}
                        </p>
                        <p className="text-xs text-white/45 mt-2 leading-relaxed">
                          {hasEmail ? `${lead.artist.emails.length} email${lead.artist.emails.length > 1 ? "s" : ""}` : "No email"}
                          {hasIg ? " • IG" : ""}
                          {hasSite ? " • Site" : ""}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/3 border border-white/8 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-2">Latest Activity</p>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                          {latestActivity ? latestActivity.type.replaceAll("_", " ") : "No activity"}
                        </p>
                        <p className="text-xs text-white/45 mt-2">
                          {latestActivity ? formatRelativeDate(latestActivity.occurredAt) : "—"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white/3 border border-white/8 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-2">Draft Status</p>
                        <p className={`text-xs font-bold uppercase tracking-[0.2em] ${pendingDraft ? "text-accent-secondary" : "text-white/35"}`}>
                          {pendingDraft ? "Pending Draft" : "No Pending Draft"}
                        </p>
                        <p className="text-xs text-white/45 mt-2">
                          {pendingDraft ? formatRelativeDate(pendingDraft.createdAt) : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <div className="text-xs text-white/40 font-bold uppercase tracking-[0.2em]">
                        Created {formatRelativeDate(lead.createdAt)} • Updated {formatRelativeDate(lead.updatedAt)}
                      </div>
                      <Link href={`/leads/${lead.id}`}>
                        <NeonButton variant="pink" size="lg" className="text-xs! tracking-[0.2em]! font-bold! px-8!">
                          Open Lead →
                        </NeonButton>
                      </Link>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
