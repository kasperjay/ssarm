"use client";

import React, { useState } from "react";
import type { KpiDashboardData } from "../types";
import { DiscoveryIntentSection } from "./DiscoveryIntentSection";
import { OutreachEfficiencySection } from "./OutreachEfficiencySection";
import { CommercialRevenueSection } from "./CommercialRevenueSection";
import { RetentionQualitySection } from "./RetentionQualitySection";

interface FunnelTabsProps {
  data: KpiDashboardData;
}

type TabKey = "ALL" | "DISCOVERY" | "OUTREACH" | "REVENUE" | "RETENTION";

const TABS: { id: TabKey; label: string; badge?: string }[] = [
  { id: "ALL", label: "Full Funnel Overview" },
  { id: "DISCOVERY", label: "1. Discovery & Intent" },
  { id: "OUTREACH", label: "2. Outreach & Pitch" },
  { id: "REVENUE", label: "3. Commercial Revenue" },
  { id: "RETENTION", label: "4. Quality & Retention" },
];

export function FunnelTabs({ data }: FunnelTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("ALL");

  return (
    <div className="space-y-8">
      {/* Tab Navigation Switcher */}
      <div
        role="tablist"
        aria-label="Acquisition Funnel Stages"
        className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/[0.08] no-scrollbar"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-bold tracking-wider uppercase transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                ${
                  isActive
                    ? "bg-white/[0.08] text-white border border-white/[0.15] shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.03] border border-transparent"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      <div className="space-y-12">
        {(activeTab === "ALL" || activeTab === "DISCOVERY") && (
          <section aria-labelledby="heading-discovery" className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <h2 id="heading-discovery" className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                1. Discovery & Intent Signals
              </h2>
            </div>
            <DiscoveryIntentSection discovery={data.discovery} />
          </section>
        )}

        {(activeTab === "ALL" || activeTab === "OUTREACH") && (
          <section aria-labelledby="heading-outreach" className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-accent-secondary" />
              <h2 id="heading-outreach" className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                2. Outreach & Pitch Efficiency
              </h2>
            </div>
            <OutreachEfficiencySection outreach={data.outreach} />
          </section>
        )}

        {(activeTab === "ALL" || activeTab === "REVENUE") && (
          <section aria-labelledby="heading-revenue" className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <h2 id="heading-revenue" className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                3. Commercial Conversion & Revenue
              </h2>
            </div>
            <CommercialRevenueSection revenue={data.revenue} />
          </section>
        )}

        {(activeTab === "ALL" || activeTab === "RETENTION") && (
          <section aria-labelledby="heading-retention" className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <h2 id="heading-retention" className="text-xs font-bold uppercase tracking-[0.25em] text-white/50">
                4. Studio Client Retention & Mix Quality
              </h2>
            </div>
            <RetentionQualitySection retention={data.retention} />
          </section>
        )}
      </div>
    </div>
  );
}
