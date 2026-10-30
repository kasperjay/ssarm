import React from "react";
import Link from "next/link";
import { NeonButton } from "@/components/NeonButton";
import { getKpiDashboardData } from "./data-loader";
import { TimeframeSelector } from "./components/TimeframeSelector";
import { KpiHeroCards } from "./components/KpiHeroCards";
import { FunnelTabs } from "./components/FunnelTabs";
import { CampaignsLeaderboard } from "./components/CampaignsLeaderboard";
import type { TimeframeOption } from "./types";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    timeframe?: string;
  }>;
}

export default async function KPIsPage(props: PageProps) {
  const resolvedSearchParams = await props.searchParams;
  const rawTimeframe = resolvedSearchParams?.timeframe?.toLowerCase();

  const validTimeframes: TimeframeOption[] = ["7d", "30d", "90d", "all"];
  const timeframe: TimeframeOption = validTimeframes.includes(rawTimeframe as TimeframeOption)
    ? (rawTimeframe as TimeframeOption)
    : "30d";

  const timeframeLabels: Record<TimeframeOption, string> = {
    "7d": "7 days",
    "30d": "30 days",
    "90d": "90 days",
    all: "all time",
  };

  const data = await getKpiDashboardData(timeframe);

  return (
    <div className="relative min-h-screen bg-[#08080c] pt-28 pb-24 selection:bg-accent/30 selection:text-white">
      {/* Background ambient accent glows */}
      <div
        className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-accent/5 blur-[120px] rounded-full"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-80 right-10 w-[500px] h-[300px] bg-accent-secondary/5 blur-[100px] rounded-full"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6">
        {/* Header Section */}
        <header className="flex flex-col gap-8 border-b border-white/[0.08] pb-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="space-y-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/40 hover:text-accent transition-colors"
              >
                <span className="transition-transform group-hover:-translate-x-1">←</span>
                <span>Dashboard</span>
              </Link>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(52,199,89,0.5)]" />
                  <p className="text-xs uppercase tracking-[0.25em] text-accent/80 font-bold">
                    Studio Telemetry & Revenue Intelligence
                  </p>
                </div>
                <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight text-white">
                  Acquisition Funnel
                </h1>
                <p className="text-xs text-white/50 max-w-xl leading-relaxed">
                  Real-time pipeline analytics for independent artist discovery, venue tour targeting, client conversion, and post-booking mix approval velocity.
                </p>
              </div>
            </div>

            {/* Timeframe Filter and Action Button */}
            <div className="flex flex-wrap items-center gap-4">
              <TimeframeSelector currentValue={timeframe} />

              <Link href="/KPIs/campaigns/new">
                <NeonButton variant="lime" size="md">
                  + New Campaign
                </NeonButton>
              </Link>
            </div>
          </div>
        </header>

        {/* 4 Hero Metric Cards */}
        <section aria-labelledby="heading-hero">
          <h2 id="heading-hero" className="sr-only">
            Key Studio Performance Indicators
          </h2>
          <KpiHeroCards hero={data.hero} timeframeLabel={timeframeLabels[timeframe]} />
        </section>

        {/* Interactive Funnel Modules */}
        <section aria-labelledby="heading-funnel" className="pt-2">
          <h2 id="heading-funnel" className="sr-only">
            Acquisition Funnel Telemetry
          </h2>
          <FunnelTabs data={data} />
        </section>

        {/* Active Campaigns Leaderboard */}
        <section aria-labelledby="heading-campaigns" className="pt-4">
          <h2 id="heading-campaigns" className="sr-only">
            Outreach Campaigns
          </h2>
          <CampaignsLeaderboard campaigns={data.campaigns} />
        </section>
      </div>
    </div>
  );
}