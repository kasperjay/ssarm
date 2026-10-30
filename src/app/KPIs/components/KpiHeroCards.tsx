import React from "react";
import type { KpiHeroSummary } from "../types";

interface KpiHeroCardsProps {
  hero: KpiHeroSummary;
  timeframeLabel: string;
}

export function KpiHeroCards({ hero, timeframeLabel }: KpiHeroCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Billings Collected */}
      <div className="group relative rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7 transition-all duration-500 hover:border-accent/40 hover:shadow-[0_12px_40px_rgba(0,242,255,0.08)]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
            Billings Collected
          </span>
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums border ${
              hero.revenueDeltaPositive
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            <span>{hero.revenueDeltaPositive ? "↑" : "↓"}</span>
            <span>{hero.revenueDeltaPct}%</span>
          </div>
        </div>

        <div className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-white tabular-nums mb-3 group-hover:text-accent transition-colors">
          {hero.totalRevenueFormatted}
        </div>

        <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/[0.06] pt-3 mt-4">
          <span>vs prev {timeframeLabel}</span>
          <span className="text-white/60 font-medium">Settled via portal</span>
        </div>
      </div>

      {/* 2. Active Pipeline */}
      <div className="group relative rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7 transition-all duration-500 hover:border-accent-secondary/40 hover:shadow-[0_12px_40px_rgba(112,0,255,0.1)]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
            Booked Pipeline
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tabular-nums bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30">
            {hero.activeProjectsCount} Sessions
          </span>
        </div>

        <div className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-white tabular-nums mb-3 group-hover:text-accent-secondary transition-colors">
          {hero.activePipelineFormatted}
        </div>

        <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/[0.06] pt-3 mt-4">
          <span>Active in studio</span>
          <span className="text-white/60 font-medium">Issued balance</span>
        </div>
      </div>

      {/* 3. Lead-to-WON Win Rate */}
      <div className="group relative rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7 transition-all duration-500 hover:border-emerald-500/40 hover:shadow-[0_12px_40px_rgba(52,199,89,0.08)]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
            Lead Win Rate
          </span>
          <span className="text-[11px] font-bold text-white/40 tabular-nums">
            Target: 15–25%
          </span>
        </div>

        <div className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-emerald-400 tabular-nums mb-3">
          {hero.conversionRatePct}
          <span className="text-2xl text-emerald-400/60 font-sans ml-1">%</span>
        </div>

        <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/[0.06] pt-3 mt-4">
          <span className="tabular-nums">
            <strong className="text-white font-semibold">{hero.wonLeadsCount}</strong> Won
          </span>
          <span className="tabular-nums">
            from <strong className="text-white font-semibold">{hero.contactedLeadsCount}</strong> contacted
          </span>
        </div>
      </div>

      {/* 4. Client Satisfaction */}
      <div className="group relative rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7 transition-all duration-500 hover:border-amber-400/40 hover:shadow-[0_12px_40px_rgba(255,179,64,0.08)]">
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
            Client CSAT
          </span>
          <div className="flex items-center gap-0.5 text-amber-400 text-xs" aria-hidden="true">
            {"★".repeat(Math.round(hero.averageCsatRating) || 5)}
          </div>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-display text-4xl lg:text-5xl font-bold tracking-tight text-white tabular-nums group-hover:text-amber-400 transition-colors">
            {hero.averageCsatRating > 0 ? hero.averageCsatRating.toFixed(1) : "--"}
          </span>
          <span className="text-xl text-white/40 font-medium">/ 5.0</span>
        </div>

        <div className="flex items-center justify-between text-xs text-white/40 border-t border-white/[0.06] pt-3 mt-4">
          <span className="tabular-nums">
            <strong className="text-white font-semibold">{hero.ratingSubmissionsCount}</strong> ratings
          </span>
          <span className="text-white/60 font-medium">Master sign-offs</span>
        </div>
      </div>
    </div>
  );
}
