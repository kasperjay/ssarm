import React from "react";
import type { DiscoveryIntentMetrics } from "../types";

interface DiscoveryIntentSectionProps {
  discovery: DiscoveryIntentMetrics;
}

export function DiscoveryIntentSection({ discovery }: DiscoveryIntentSectionProps) {
  const highIntentSum = discovery.needLevelBreakdown
    .filter((n) => n.level === "CLEAR" || n.level === "PROBABLE")
    .reduce((sum, n) => sum + n.pct, 0);

  const austinTier = discovery.proximityTiers.find((t) => t.tier === "AUSTIN");
  const austinRatio = austinTier ? austinTier.pct : 0;

  return (
    <div className="space-y-6">
      {/* Top Velocity & Qualification KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40 mb-1">
            Total Discovered
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tabular-nums">
              {discovery.totalDiscovered}
            </span>
            <span className="text-xs text-white/40">artists ingested</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Target: 25–50 artists/month across venue calendars & IG
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Qualification Yield
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 tabular-nums">
              Target: ≥ 45%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-accent tabular-nums">
              {discovery.qualificationRatePct}%
            </span>
            <span className="text-xs text-white/40 tabular-nums">
              ({discovery.qualifiedCount} scored ≥ 60)
            </span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Verified activity proof and studio match score
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40 mb-1">
            Average Lead Score
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tabular-nums">
              {discovery.averageLeadScore}
            </span>
            <span className="text-xs text-white/40">/ 100 max</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Composite index of proximity, DIY focus, and releases
          </p>
        </div>
      </div>

      {/* Main Grid: Production Need Distribution + Market Proximity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Production Need Intensity */}
        <div className="rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/80 block mb-1">
                Active Demand Detection
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                Production Need Distribution
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/40 block">High Demand</span>
              <span className="font-display text-lg font-bold text-emerald-400 tabular-nums">
                {Math.round(highIntentSum * 10) / 10}%
              </span>
            </div>
          </div>

          <p className="text-xs text-white/50 mb-6 leading-relaxed">
            Measures artist bio and caption signals indicating need for tracking, mixing, mastering, or release production.
          </p>

          {/* Proportional Segmented Progress Bar */}
          <div className="h-3 w-full rounded-full bg-white/[0.06] overflow-hidden flex mb-6 p-0.5">
            {discovery.needLevelBreakdown.map((item) => (
              <div
                key={item.level}
                style={{ width: `${Math.max(item.pct, item.count > 0 ? 3 : 0)}%`, backgroundColor: item.color }}
                className="h-full rounded-full transition-all duration-700"
                title={`${item.level}: ${item.pct}% (${item.count})`}
              />
            ))}
          </div>

          {/* Breakdown Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {discovery.needLevelBreakdown.map((item) => {
              const descriptions: Record<string, string> = {
                CLEAR: "Explicit studio/mix search (+12pt)",
                PROBABLE: "Tracking or release signals (+12pt)",
                POSSIBLE: "Upcoming single drops (+8pt)",
                NONE: "Dormant / no active signals (0pt)",
              };

              return (
                <div
                  key={item.level}
                  className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-bold text-white/80">
                        {item.level}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-white tabular-nums">
                      {item.pct}%
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[11px] text-white/40">
                      {descriptions[item.level]}
                    </span>
                    <span className="font-display text-sm font-semibold text-white/70 tabular-nums">
                      {item.count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 2: Market Proximity & Geotargeting */}
        <div className="rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/80 block mb-1">
                Geotarget Segmentation
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                Market Proximity Ratio
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/40 block">Austin Local</span>
              <span className="font-display text-lg font-bold text-accent tabular-nums">
                {austinRatio}%
              </span>
            </div>
          </div>

          <p className="text-xs text-white/50 mb-6 leading-relaxed">
            Separates high-LTV local acts from urgent touring acts playing Austin music venues (Hotel Vegas, Mohawk, Continental Club).
          </p>

          {/* Proximity Tier Rows */}
          <div className="space-y-4">
            {discovery.proximityTiers.map((tier) => (
              <div key={tier.tier} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white/80">
                    {tier.label}
                  </span>
                  <div className="flex items-center gap-2 tabular-nums">
                    <span className="text-white/40">({tier.count})</span>
                    <span className="font-bold text-white">{tier.pct}%</span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      tier.tier === "AUSTIN"
                        ? "bg-accent"
                        : tier.tier === "TEXAS"
                        ? "bg-accent-secondary"
                        : tier.tier === "TOURING"
                        ? "bg-amber-400"
                        : "bg-white/20"
                    }`}
                    style={{ width: `${Math.max(tier.pct, tier.count > 0 ? 3 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
            <span>Studio Benchmark: ≥ 60% Austin Local</span>
            <span className="text-accent/80 font-medium">Local acts drive repeat multi-track bookings</span>
          </div>
        </div>
      </div>
    </div>
  );
}
