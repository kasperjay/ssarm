import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";

// Helper to calculate days ago/due
function getDaysDifference(date: Date | null) {
  if (!date) return 0;
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default async function OperationsPage() {
  // 1. Due Follow-ups
  const dueFollowUps = await prisma.lead.findMany({
    where: {
      nextActionAt: { lt: new Date() },
      status: { notIn: ["WON", "LOST"] },
    },
    include: {
      artist: true,
      activities: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { nextActionAt: "asc" },
    take: 20,
  });

  // 2. High-score uncontacted leads
  const readyToMessage = await prisma.lead.findMany({
    where: {
      score: { gte: 60 },
      status: { in: ["NEW", "QUALIFIED"] },
      lastContactedAt: null,
    },
    include: {
      artist: true,
    },
    orderBy: { score: "desc" },
    take: 20,
  });

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12">
      <header>
        <h1 className="text-4xl font-bold mb-2">Operations Queue</h1>
        <p className="text-white/60">Action items and pipeline bottlenecks requiring manual review.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Due Follow-ups */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
              Due Follow-ups
            </h2>
            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">{dueFollowUps.length} items</span>
          </div>

          <div className="space-y-4">
            {dueFollowUps.length === 0 ? (
              <GlassCard className="p-6 text-center text-white/50">
                No due follow-ups right now. You're caught up!
              </GlassCard>
            ) : (
              dueFollowUps.map((lead) => {
                const daysOverdue = getDaysDifference(lead.nextActionAt);
                return (
                  <GlassCard key={lead.id} className="p-5 flex flex-col gap-3 hover:bg-white/[0.04] transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/leads/${lead.id}`} className="font-bold text-lg hover:text-[#00FF9D] transition-colors">
                          {lead.artist.name}
                        </Link>
                        <p className="text-sm text-white/60 mt-1">
                          Status: <span className="text-white/80">{lead.status}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${daysOverdue > 3 ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"}`}>
                          {daysOverdue} {daysOverdue === 1 ? "day" : "days"} overdue
                        </span>
                      </div>
                    </div>
                    {lead.activities[0] && (
                      <div className="text-sm bg-black/30 p-3 rounded text-white/70 italic border border-white/5">
                        <span className="block text-xs font-semibold mb-1 text-white/40">Last Activity:</span>
                        {lead.activities[0].note || "No notes."}
                      </div>
                    )}
                  </GlassCard>
                );
              })
            )}
          </div>
        </section>

        {/* Ready to Message */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-[#00FF9D]"></span>
              Ready to Message
            </h2>
            <span className="text-sm bg-white/10 px-3 py-1 rounded-full">{readyToMessage.length} items</span>
          </div>

          <div className="space-y-4">
            {readyToMessage.length === 0 ? (
              <GlassCard className="p-6 text-center text-white/50">
                No high-score uncontacted leads.
              </GlassCard>
            ) : (
              readyToMessage.map((lead) => (
                <GlassCard key={lead.id} className="p-5 flex flex-col gap-3 hover:bg-white/[0.04] transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/leads/${lead.id}`} className="font-bold text-lg hover:text-[#00FF9D] transition-colors">
                        {lead.artist.name}
                      </Link>
                      <p className="text-sm text-white/60 mt-1">
                        Genre: <span className="text-white/80">{lead.artist.genre || "Unknown"}</span>
                      </p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-[#00FF9D]">{Math.round(lead.score || 0)}</span>
                        <span className="text-xs text-white/40">/100</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
