import React from "react";
import type { OutreachEfficiencyMetrics } from "../types";
import { formatHours } from "../kpi-math";

interface OutreachEfficiencySectionProps {
  outreach: OutreachEfficiencyMetrics;
}

const CHANNEL_BENCHMARKS: Record<string, string> = {
  INSTAGRAM_DM: "≥ 25% target",
  EMAIL: "≥ 18% target",
  PHONE: "≥ 35% target",
  IN_PERSON: "≥ 60% target",
};

export function OutreachEfficiencySection({ outreach }: OutreachEfficiencySectionProps) {
  return (
    <div className="space-y-6">
      {/* Top Outreach Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40 mb-1">
            Outreach Volume
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tabular-nums">
              {outreach.totalAttempts}
            </span>
            <span className="text-xs text-white/40">dispatched attempts</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Studio Target: 40–80 outbound touches / mo
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Overall Response Rate
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 tabular-nums">
              Target: ≥ 25%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-accent tabular-nums">
              {outreach.overallResponseRatePct}%
            </span>
            <span className="text-xs text-white/40">replied</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Combined response yield across all channels
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Artist Response Latency
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tabular-nums">
              Target: &lt; 12h
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tabular-nums">
              {formatHours(outreach.avgResponseHours)}
            </span>
            <span className="text-xs text-white/40">average reply time</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Fast replies strongly correlate with active studio demand
          </p>
        </div>
      </div>

      {/* Main Grid: Channel Delivery Matrix + Sentiment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel 1: Channel Delivery Matrix (Span 2 cols) */}
        <div className="lg:col-span-2 rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/80 block mb-1">
                Communication Rail Efficacy
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                Channel Delivery Matrix
              </h3>
            </div>
            <span className="text-xs text-white/40 hidden sm:inline-block">
              Multi-channel studio acquisition
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                  <th className="pb-3 pr-4">Channel Rail</th>
                  <th className="pb-3 px-3 text-right">Sent</th>
                  <th className="pb-3 px-3 text-right">Replied</th>
                  <th className="pb-3 px-3 text-right">Yield Rate</th>
                  <th className="pb-3 px-3 text-right">Positive</th>
                  <th className="pb-3 pl-4 text-right">Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {outreach.channels.map((ch) => {
                  const benchmark = CHANNEL_BENCHMARKS[ch.channel] || "≥ 20%";
                  const isHealthy = ch.attemptsCount > 0 && ch.responseRatePct >= 20;

                  return (
                    <tr key={ch.channel} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 pr-4">
                        <div className="font-semibold text-white/90 group-hover:text-accent transition-colors">
                          {ch.label}
                        </div>
                        <div className="w-28 bg-white/[0.06] rounded-full h-1.5 mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isHealthy ? "bg-accent" : "bg-white/30"
                            }`}
                            style={{ width: `${Math.min(100, ch.responseRatePct)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-3 text-right font-display text-sm text-white/70 tabular-nums">
                        {ch.attemptsCount}
                      </td>
                      <td className="py-4 px-3 text-right font-display text-sm text-white/90 tabular-nums">
                        {ch.responsesCount}
                      </td>
                      <td className="py-4 px-3 text-right font-display text-sm font-bold text-accent tabular-nums">
                        {ch.responseRatePct}%
                      </td>
                      <td className="py-4 px-3 text-right font-display text-sm text-emerald-400 tabular-nums">
                        {ch.positiveCount} ({ch.positiveRatePct}%)
                      </td>
                      <td className="py-4 pl-4 text-right text-white/40 tabular-nums">
                        {benchmark}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Panel 2: Net Positive Sentiment Breakdown */}
        <div className="rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/80 block mb-1">
              Response Classification
            </span>
            <h3 className="font-display text-xl font-bold text-white mb-2">
              Sentiment Breakdown
            </h3>
            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Distribution of intent signals returned by contacted artists.
            </p>

            {/* Segmented bar */}
            <div className="h-3 w-full rounded-full bg-white/[0.06] overflow-hidden flex mb-6 p-0.5">
              {outreach.sentimentBreakdown.map((item) => (
                <div
                  key={item.type}
                  style={{ width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%`, backgroundColor: item.color }}
                  className="h-full rounded-full transition-all duration-700"
                  title={`${item.label}: ${item.pct}% (${item.count})`}
                />
              ))}
            </div>

            {/* Sentiment cards */}
            <div className="space-y-3">
              {outreach.sentimentBreakdown.map((item) => (
                <div
                  key={item.type}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs font-semibold text-white/80">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="text-xs text-white/40 font-medium">
                      ({item.count})
                    </span>
                    <span className="font-display text-xs font-bold text-white">
                      {item.pct}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-[11px] text-white/40">
            Positive replies trigger booking consultations & studio calendar holds.
          </div>
        </div>
      </div>
    </div>
  );
}
