import React from "react";
import type { RetentionQualityMetrics } from "../types";

interface RetentionQualitySectionProps {
  retention: RetentionQualityMetrics;
}

export function RetentionQualitySection({ retention }: RetentionQualitySectionProps) {
  const totalRatingsCount = retention.ratingDistribution.reduce((acc, curr) => acc + curr.count, 0) || 1;

  return (
    <div className="space-y-6">
      {/* Top Retention Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Mix Approval Velocity
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 tabular-nums">
              Target: &lt; 48h
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tabular-nums">
              {retention.mixApprovalVelocityFormatted}
            </span>
            <span className="text-xs text-white/40">upload to sign-off</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Elapsed duration from rough mix upload to master approval
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Revision Drag Factor
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 tabular-nums">
              Target: &lt; 3.5 notes
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-accent tabular-nums">
              {retention.averageRevisionFeedbackCount}
            </span>
            <span className="text-xs text-white/40">notes / project</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Low drag reflects aligned sonic references upfront
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Repeat Booking Rate
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30 tabular-nums">
              Target: ≥ 30%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-accent-secondary tabular-nums">
              {retention.repeatArtistRatePct}%
            </span>
            <span className="text-xs text-white/40 tabular-nums">
              ({retention.repeatArtistsCount} of {retention.totalClientCount})
            </span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Bands returning for additional singles, EPs, or albums
          </p>
        </div>
      </div>

      {/* Main Grid: CSAT Star Distribution & Studio Retention Moat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: CSAT Star Distribution */}
        <div className="rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/80 block mb-1">
                Post-Delivery Feedback
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                Client Rating Distribution
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-white/40 block">Average CSAT</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="font-display text-2xl font-bold text-amber-400 tabular-nums">
                  {retention.averageRating > 0 ? retention.averageRating.toFixed(1) : "--"}
                </span>
                <span className="text-amber-400 text-sm">★</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/50 mb-6 leading-relaxed">
            Ratings collected at the portal deliverable gate before high-resolution stems (WAV 24-bit/96kHz) are released.
          </p>

          <div className="space-y-3.5">
            {retention.ratingDistribution.map((row) => {
              const pct = Math.round((row.count / totalRatingsCount) * 100);

              return (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-14 font-semibold text-white/80 tabular-nums">
                    <span>{row.stars}</span>
                    <span className="text-amber-400 text-xs">★</span>
                  </div>

                  <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        row.stars >= 4 ? "bg-amber-400" : row.stars === 3 ? "bg-white/40" : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.max(pct, row.count > 0 ? 4 : 0)}%` }}
                    />
                  </div>

                  <div className="w-12 text-right font-display text-xs text-white/60 tabular-nums">
                    {row.count}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
            <span>Studio Benchmark: ≥ 4.8 / 5.0 Stars</span>
            <span className="text-amber-400/80 font-medium">Exceptional mix polish drives referral loops</span>
          </div>
        </div>

        {/* Panel 2: Studio Quality Guardrails */}
        <div className="rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/80 block mb-1">
                  Studio Governance
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Audio Quality Guardrails
                </h3>
              </div>
              <span className="text-xs text-white/40 hidden sm:inline-block">
                Acoustic & Process Controls
              </span>
            </div>

            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Standard operating benchmarks protecting engineer time and room profitability.
            </p>

            <div className="space-y-3.5">
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Revision Round Cap</span>
                  <span className="text-xs text-emerald-400 font-bold tabular-nums">Max 3 Rounds</span>
                </div>
                <p className="text-[11px] text-white/40">
                  Included in standard contract; additional passes bill at $75/hr to prevent scope creep.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Stem Paywall Gate</span>
                  <span className="text-xs text-accent font-bold tabular-nums">100% Gated</span>
                </div>
                <p className="text-[11px] text-white/40">
                  Deliverables automatically lock until invoice status transitions to PAID.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Local Repeat Velocity</span>
                  <span className="text-xs text-accent-secondary font-bold tabular-nums">90-Day Cycle</span>
                </div>
                <p className="text-[11px] text-white/40">
                  Austin acts average 2.4 releases per year, creating stable pipeline floor.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-xs text-white/40">
            Engineered acoustic precision + firm financial milestones safeguard studio margins.
          </div>
        </div>
      </div>
    </div>
  );
}
