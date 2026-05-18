"use client";

import Link from "next/link";
import { formatRelativeDate, formatLocation } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

interface OverdueLead {
  id: string;
  artist: {
    name: string;
    location: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
  };
  nextActionAt: Date | null;
}

interface ActionRequiredQueueProps {
  initialLeads: OverdueLead[];
}

export function ActionRequiredQueue({ initialLeads }: ActionRequiredQueueProps) {
  return (
    <aside className="space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <div className="h-1.5 w-1.5 bg-accent-warm rounded-full" />
        <h2 className="text-xs font-bold tracking-[0.3em] uppercase text-white/40">
          Action Required
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        {initialLeads.length === 0 ? (
          <GlassCard variant="strong" className="text-center py-12 bg-white/2 border-white/5 border-dashed">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
              No pending actions
            </p>
          </GlassCard>
        ) : (
          initialLeads.map((lead) => {
            return (
              <GlassCard
                key={lead.id}
                className="group relative border-l-2 border-l-accent-warm/50 hover:border-l-accent-warm transition-all overflow-hidden p-5"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold tracking-tighter text-white group-hover:text-accent-warm transition-colors truncate max-w-[200px] text-lg">
                        <Link href={`/leads/${lead.id}`}>
                          {lead.artist.name}
                        </Link>
                      </h3>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">
                        {formatLocation(
                          lead.artist.location,
                          lead.artist.city,
                          lead.artist.state,
                          lead.artist.country
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs uppercase tracking-widest font-bold text-accent-warm/80">
                        Overdue
                      </span>
                      <span className="text-xs font-sans font-bold text-accent-warm">
                        {lead.nextActionAt ? formatRelativeDate(lead.nextActionAt) : "Unknown"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 max-w-[180px] truncate italic">
                      Follow-up Due
                    </p>
                    <Link
                      href={`/leads/${lead.id}`}
                      className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 hover:text-accent-warm transition-all flex items-center gap-1"
                    >
                      View Profile <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>
    </aside>
  );
}
