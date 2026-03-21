"use client";

import { useState } from "react";
import { getRandomLead } from "@/app/actions";
import { formatRelativeDate, formatLocation } from "@/lib/utils";
import { GlassCard } from "./GlassCard";
import { NeonButton } from "./NeonButton";

interface SpotlightSectionProps {
  initialLead: any;
}

export function SpotlightSection({ initialLead }: SpotlightSectionProps) {
  const [lead, setLead] = useState(initialLead);
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const newLead = await getRandomLead();
      if (newLead) {
        setLead(newLead);
      }
    } catch (error) {
      console.error("Failed to refresh spotlight:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!lead) {
    return (
      <aside className="space-y-8">
        <GlassCard variant="strong">
          <h2 className="text-xl font-bold tracking-tight uppercase">Spotlight</h2>
          <p className="mt-4 text-xs text-muted/60 uppercase tracking-widest font-bold">[ No Signal Detected ]</p>
        </GlassCard>
      </aside>
    );
  }

  const spotlightRelease = lead.artist?.releases?.[0];
  const spotlightCaption =
    lead.artist?.instagramPosts?.[0]?.caption ??
    lead.artist?.bio ??
    "No telemetry data available for this entity.";

  const messageCount = lead.messages?.length ?? 0;
  const messages = messageCount
    ? lead.messages.map((m: any) => ({
      id: m.id,
      tone: m.tone ?? "Draft",
      body: m.body,
    }))
    : [
      {
        id: "empty",
        tone: "Pending",
        body: "Awaiting outreach sequence initialization. Run generator to proceed.",
      },
    ];

  return (
    <aside className="space-y-10">
      {/* Spotlight Profile */}
      <GlassCard variant="strong" className="relative group overflow-hidden border-t-accent/20 border-t">
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`p-2 rounded-lg bg-white/5 border border-white/10 text-muted hover:text-accent hover:border-accent/40 transition-all ${loading ? "animate-spin" : ""}`}
            title="Refresh Uplink"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold tracking-tight uppercase flex items-center gap-2">
            Spotlight <span className="text-xs text-accent/40 font-mono tracking-widest">ID:{lead.id.slice(-6).toUpperCase()}</span>
          </h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-accent/80">
            {lead.artist.name} <span className="mx-2 text-white/10">//</span> {formatLocation(
              lead.artist.location,
              lead.artist.city,
              lead.artist.state,
              lead.artist.country
            )}
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {[
            { label: "Recent Release", value: spotlightRelease ? spotlightRelease.title : "None", meta: spotlightRelease ? formatRelativeDate(spotlightRelease.releaseDate ?? spotlightRelease.createdAt) : "" },
            { label: "Social Momentum", value: lead.artist.followerCount?.toLocaleString() ?? "N/A", meta: "Followers" },
            { label: "Last Transmission", value: lead.artist.lastPostAt ? formatRelativeDate(lead.artist.lastPostAt) : "Unknown", meta: "Sync Signal" }
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <span className="text-xs uppercase tracking-widest text-muted font-bold">{item.label}</span>
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-foreground tracking-tight">{item.value}</span>
                {item.meta && <span className="text-xs uppercase tracking-tighter text-muted/60">{item.meta}</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 relative">
          <div className="absolute -left-3 top-0 bottom-0 w-[2px] bg-accent/20" />
          <p className="text-xs text-foreground/70 leading-relaxed italic pl-3 line-clamp-4">
            "{spotlightCaption}"
          </p>
        </div>
      </GlassCard>

      {/* Drafts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 bg-accent-secondary neon-glow-purple rounded-full" />
            <h3 className="text-lg font-bold tracking-tight uppercase">Outreach Drafts</h3>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted/60">
            {messageCount} Active
          </span>
        </div>

        <div className="flex flex-col gap-6">
          {messages.map((message: any) => (
            <GlassCard
              key={message.id}
              className="group relative border-l border-l-white/10 hover:border-l-accent-secondary transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-secondary">
                  [{message.tone}]
                </span>
                <div className="h-1 w-8 bg-white/5 rounded-full" />
              </div>
              <p className="text-xs text-foreground/80 leading-relaxed">
                {message.body}
              </p>
              <div className="mt-6 flex gap-3">
                <NeonButton variant="purple" size="sm" className="flex-1">
                  Deploy
                </NeonButton>
                <NeonButton variant="outline" size="sm">
                  Refine
                </NeonButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </aside>
  );
}
