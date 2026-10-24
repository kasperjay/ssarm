"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";

type QueueRow = {
  lead: {
    id: string;
    status: string;
    artist: { name: string; genre?: string | null };
  };
  priority: {
    score: number;
    components: { baseScore: number; productionNeed: number };
    reasons: string[];
    topReasons: string[];
    productionNeed: { expired: boolean; needsReview: boolean };
  };
  dueReason: string | null;
  eligibility: { cleanup: string[] };
};

type QueueData = {
  actionable: QueueRow[];
  cleanup: QueueRow[];
};

function QueueSection({ title, description, data, overdueLabel }: {
  title: string;
  description: string;
  data: QueueData;
  overdueLabel?: string;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-white/55">{description}</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1 text-sm">{data.actionable.length} actionable</span>
      </div>
      {overdueLabel && <p className="text-xs font-medium uppercase tracking-wider text-orange-300">{overdueLabel}</p>}
      {data.actionable.length === 0 ? (
        <GlassCard className="p-6 text-center text-white/50">Nothing actionable here right now.</GlassCard>
      ) : (
        <div className="space-y-4">
          {data.actionable.map((item) => {
            const isExpanded = expanded === item.lead.id;
            return (
              <GlassCard key={item.lead.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Link href={`/leads/${item.lead.id}`} className="text-lg font-bold hover:text-[#00FF9D]">
                      {item.lead.artist.name}
                    </Link>
                    <p className="mt-1 text-sm text-white/55">
                      {item.lead.status} · {item.lead.artist.genre || "Genre unknown"}
                    </p>
                    <p className="mt-3 text-sm text-white/75">{item.priority.topReasons.join(" · ")}</p>
                    {item.dueReason && <p className="mt-2 text-xs font-medium text-orange-300">{item.dueReason}</p>}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#00FF9D]">{Math.round(item.priority.score)}<span className="text-xs text-white/40">/100</span></div>
                    <Link href={`/leads/${item.lead.id}`} className="mt-2 inline-block text-xs text-white/50 hover:text-white">Open lead →</Link>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : item.lead.id)}
                  className="mt-4 text-xs font-medium text-white/60 underline decoration-white/20 underline-offset-4 hover:text-white"
                >
                  {isExpanded ? "Hide score details" : "Why this score?"}
                </button>
                {isExpanded && (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/65">
                    <p>Base lead score: {Math.round(item.priority.components.baseScore)} points</p>
                    <p>Production need: +{item.priority.components.productionNeed} points</p>
                    {item.priority.productionNeed.needsReview && <p className="mt-2 text-amber-300">Needs review: production-need evidence is incomplete.</p>}
                    {item.priority.productionNeed.expired && <p className="mt-2 text-amber-300">Production-need evidence is stale and contributes no points.</p>}
                    <ul className="mt-3 list-disc space-y-1 pl-5">
                      {item.priority.reasons.map((reason) => <li key={reason}>{reason}</li>)}
                    </ul>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      )}
      {data.cleanup.length > 0 && (
        <p className="text-xs text-white/45">{data.cleanup.length} other lead{data.cleanup.length === 1 ? "" : "s"} need cleanup before they can enter this queue.</p>
      )}
    </section>
  );
}

export default function OperationsQueue({ outreach, followUps, updatedAt }: {
  outreach: QueueData;
  followUps: QueueData;
  updatedAt: string;
}) {
  const [tab, setTab] = useState<"outreach" | "follow-ups">("outreach");
  const overdueCount = followUps.actionable.filter((item) => item.dueReason?.includes("overdue")).length;
  return (
    <div className="space-y-8">
      <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-2">
        <button type="button" onClick={() => setTab("outreach")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${tab === "outreach" ? "bg-[#00FF9D] text-black" : "text-white/60 hover:text-white"}`}>
          New Outreach ({outreach.actionable.length})
        </button>
        <button type="button" onClick={() => setTab("follow-ups")} className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold ${tab === "follow-ups" ? "bg-[#00FF9D] text-black" : "text-white/60 hover:text-white"}`}>
          Follow-ups ({followUps.actionable.length})
        </button>
      </div>
      {tab === "outreach" ? (
        <QueueSection title="New Outreach" description="Reachable leads ranked by booking likelihood and approved production need." data={outreach} />
      ) : (
        <QueueSection
          title="Follow-ups"
          description="Existing next actions ranked by booking likelihood, with overdue status visible."
          data={followUps}
          overdueLabel={overdueCount > 0 ? `${overdueCount} overdue` : undefined}
        />
      )}
      <p className="text-xs text-white/35">Last updated {updatedAt}</p>
    </div>
  );
}