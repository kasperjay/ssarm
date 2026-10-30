import React from "react";
import type { CommercialRevenueMetrics } from "../types";

interface CommercialRevenueSectionProps {
  revenue: CommercialRevenueMetrics;
}

export function CommercialRevenueSection({ revenue }: CommercialRevenueSectionProps) {
  return (
    <div className="space-y-6">
      {/* Top Revenue KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40 mb-1">
            Paid Billings
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-emerald-400 tabular-nums">
              {revenue.paidBillingsFormatted}
            </span>
            <span className="text-xs text-white/40 tabular-nums">
              ({revenue.paidInvoicesCount} invoices settled)
            </span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            100% deposit or final balance cleared in portal
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Average Project Value (APV)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20 tabular-nums">
              Target: $450–$1,800
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tabular-nums">
              {revenue.averageProjectValueFormatted}
            </span>
            <span className="text-xs text-white/40">/ client project</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Blended average of single tracking, EP mix, and rush masters
          </p>
        </div>

        <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/40">
              Sales Cycle Velocity
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30 tabular-nums">
              Target: 7–14 days
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tabular-nums">
              {revenue.salesCycleMedianDays > 0 ? `${revenue.salesCycleMedianDays}d` : "--"}
            </span>
            <span className="text-xs text-white/40">median duration</span>
          </div>
          <p className="text-[11px] text-white/40 mt-2">
            Duration from first artist discovery to deposit settlement
          </p>
        </div>
      </div>

      {/* Main Grid: Funnel Waterfall + Invoicing Rails */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Full Funnel Waterfall */}
        <div className="rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/80 block mb-1">
                Conversion Velocity
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                Studio Acquisition Waterfall
              </h3>
            </div>
            <span className="text-xs text-white/40 hidden sm:inline-block">
              Stage drop-off analysis
            </span>
          </div>

          <p className="text-xs text-white/50 mb-6 leading-relaxed">
            Progression from initial venue calendar scraping to signed studio agreement and invoice settlement.
          </p>

          <div className="space-y-4">
            {revenue.funnelStages.map((stage, idx) => {
              const colors = ["bg-accent/40", "bg-accent-secondary", "bg-amber-400", "bg-emerald-400"];
              const stageColor = colors[idx] || "bg-accent";

              return (
                <div key={stage.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white/90">
                      {idx + 1}. {stage.stage}
                    </span>
                    <div className="flex items-center gap-2 tabular-nums">
                      <span className="text-white/40 font-medium">({stage.count})</span>
                      <span className="font-bold text-white">{stage.conversionPct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${stageColor}`}
                      style={{ width: `${Math.max(stage.conversionPct, stage.count > 0 ? 3 : 0)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs text-white/40">
            <span>Client Conversion Benchmark: 15–25%</span>
            <span className="text-emerald-400 font-medium">Gated stem downloads enforce 100% pay rate</span>
          </div>
        </div>

        {/* Panel 2: Invoicing Rails Distribution */}
        <div className="rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/80 block mb-1">
                  Settlement Rails
                </span>
                <h3 className="font-display text-xl font-bold text-white">
                  Payment Method Distribution
                </h3>
              </div>
              <span className="text-xs text-white/40 hidden sm:inline-block">
                Indie payment flexibility
              </span>
            </div>

            <p className="text-xs text-white/50 mb-6 leading-relaxed">
              Revenue broken down by client settlement channel (Stripe, Apple Pay, Venmo, Cash App, Wire).
            </p>

            {revenue.paymentRailBreakdown.length > 0 ? (
              <div className="space-y-3">
                {revenue.paymentRailBreakdown.map((item) => (
                  <div
                    key={item.method}
                    className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white mb-0.5">
                        {item.method}
                      </div>
                      <div className="text-[11px] text-white/40 tabular-nums">
                        {item.amountFormatted}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-display text-base font-bold text-accent tabular-nums">
                        {item.pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8 text-center text-xs text-white/40">
                <p className="mb-2">No paid invoices recorded in this timeframe.</p>
                <p className="text-[11px] text-white/30">
                  Invoices settle automatically when artists pay deposits or balance fees in the client portal.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-xs text-white/40">
            Multi-rail checkout reduces billing friction for independent musicians and touring acts.
          </div>
        </div>
      </div>
    </div>
  );
}
