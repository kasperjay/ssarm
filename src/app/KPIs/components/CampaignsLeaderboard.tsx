import React from "react";
import Link from "next/link";
import type { CampaignLeaderboardItem } from "../types";

interface CampaignsLeaderboardProps {
  campaigns: CampaignLeaderboardItem[];
}

export function CampaignsLeaderboard({ campaigns }: CampaignsLeaderboardProps) {
  return (
    <div className="rounded-[28px] bg-[#12121a]/60 backdrop-blur-xl border border-white/[0.08] p-7">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/80 block mb-1">
            Studio Business Development
          </span>
          <h3 className="font-display text-xl font-bold text-white">
            Active Outreach Campaigns
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/KPIs/campaigns"
            className="text-xs font-bold uppercase tracking-wider text-accent hover:text-white transition-colors"
          >
            View All Campaigns →
          </Link>
        </div>
      </div>

      {campaigns.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">
                <th className="pb-3 pr-4">Campaign</th>
                <th className="pb-3 px-3">Type & Rail</th>
                <th className="pb-3 px-3 text-center">Status</th>
                <th className="pb-3 px-3 text-right">Target Progress</th>
                <th className="pb-3 px-3 text-right">Response Rate</th>
                <th className="pb-3 px-3 text-right">Won Bookings</th>
                <th className="pb-3 pl-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {campaigns.map((camp) => {
                const targetPct = camp.targetCount > 0 ? Math.round((camp.attemptsCount / camp.targetCount) * 100) : 0;
                const statusStyles: Record<string, string> = {
                  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  COMPLETED: "bg-accent/10 text-accent border-accent/20",
                  PAUSED: "bg-amber-400/10 text-amber-400 border-amber-400/20",
                };

                return (
                  <tr key={camp.id} className="group hover:bg-white/[0.02] transition-colors">
                    {/* Name & Date */}
                    <td className="py-4 pr-4">
                      <Link
                        href={`/KPIs/campaigns/${camp.id}`}
                        className="font-bold text-white group-hover:text-accent transition-colors block text-sm"
                      >
                        {camp.name}
                      </Link>
                      <span className="text-[11px] text-white/40">
                        Launched {camp.startDate}
                      </span>
                    </td>

                    {/* Type & Channel */}
                    <td className="py-4 px-3">
                      <div className="text-white/80 font-medium">
                        {camp.type}
                      </div>
                      <div className="text-[11px] text-white/40">
                        {camp.channel}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          statusStyles[camp.status] || "bg-white/5 text-white/60 border-white/10"
                        }`}
                      >
                        {camp.status}
                      </span>
                    </td>

                    {/* Target Progress */}
                    <td className="py-4 px-3 text-right">
                      <div className="font-display text-sm font-semibold text-white tabular-nums">
                        {camp.attemptsCount}{" "}
                        <span className="text-xs text-white/40 font-sans">
                          / {camp.targetCount || "∞"}
                        </span>
                      </div>
                      {camp.targetCount > 0 && (
                        <div className="w-24 ml-auto bg-white/[0.06] rounded-full h-1 mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-accent rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, targetPct)}%` }}
                          />
                        </div>
                      )}
                    </td>

                    {/* Response Rate */}
                    <td className="py-4 px-3 text-right">
                      <div className="font-display text-sm font-bold text-accent tabular-nums">
                        {camp.responseRatePct}%
                      </div>
                      <div className="text-[11px] text-white/40 tabular-nums">
                        {camp.responsesCount} responses
                      </div>
                    </td>

                    {/* Won Bookings */}
                    <td className="py-4 px-3 text-right">
                      <div className="font-display text-sm font-bold text-emerald-400 tabular-nums">
                        {camp.wonBookingsCount || 0}{" "}
                        <span className="text-xs text-emerald-400/60 font-sans">
                          ({camp.successRatePct}%)
                        </span>
                      </div>
                      <div className="text-[11px] text-white/40 tabular-nums">
                        Est: {camp.billingsFormatted}
                      </div>
                    </td>

                    {/* Action link */}
                    <td className="py-4 pl-4 text-right">
                      <Link
                        href={`/KPIs/campaigns/${camp.id}`}
                        className="inline-flex items-center px-3 py-1 rounded-xl bg-white/[0.04] text-[11px] font-bold uppercase tracking-wider text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.08] transition-all"
                      >
                        Details →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-10 text-center">
          <p className="text-sm text-white/60 font-medium mb-1">
            No active outreach campaigns created yet
          </p>
          <p className="text-xs text-white/40 max-w-md mx-auto mb-6">
            Create an outreach campaign targeted at Austin venue lineups or newly dropped Spotify singles to kickstart the acquisition funnel.
          </p>
          <Link
            href="/KPIs/campaigns/new"
            className="inline-flex items-center px-5 py-2.5 rounded-xl bg-accent text-black font-bold uppercase tracking-wider text-xs hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            + Create First Campaign
          </Link>
        </div>
      )}
    </div>
  );
}
