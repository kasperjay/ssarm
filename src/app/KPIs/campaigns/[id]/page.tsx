export const dynamic = "force-dynamic";
import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { format } from "date-fns";

type Props = {
  params: Promise<{ id: string }>;
};

const typeLabels: Record<string, string> = {
  NEW_RELEASES: "New Releases",
  VENUE_BOOKING: "Venue Booking",
  COLLABORATION: "Collaboration",
  REENGAGEMENT: "Re-engagement",
  RECRUITMENT: "Recruitment",
  PORTFOLIO_BUILDING: "Portfolio Building"
};

const channelLabels: Record<string, string> = {
  EMAIL: "Email",
  INSTAGRAM_DM: "Instagram DM",
  PHONE: "Phone",
  IN_PERSON: "In Person",
  OTHER: "Other"
};

const responseTypeLabels: Record<string, string> = {
  YES: "Positive Response",
  NO: "No Response",
  FOLLOW_UP: "Follow-up Requested",
  NO_RESPONSE: "No Response"
};

export default async function CampaignPage({ params }: Props) {
  const resolvedParams = await params;
  const campaign = await prisma.outreachCampaign.findUnique({
    where: { id: resolvedParams.id },
    include: {
      attempts: {
        orderBy: { sentAt: "desc" },
        include: {
          lead: {
            include: {
              artist: true
            }
          }
        }
      }
    }
  });

  if (!campaign) {
    return (
      <div className="relative min-h-screen bg-background pt-32 pb-20 selection:bg-accent/30 selection:text-white">
        <div className="relative mx-auto flex max-w-4xl flex-col gap-16 px-6">
          <header>
            <Link 
              href="/KPIs/campaigns" 
              className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all"
            >
              ← Back to Campaigns
            </Link>
          </header>
          <GlassCard className="p-12 text-center">
            <p className="text-white/40 font-bold">Campaign not found</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  const LOW_FOLLOWER_THRESHOLD = 5000;
  const isPortfolioCampaign = campaign.type === "PORTFOLIO_BUILDING";

  const prioritizedAttempts = isPortfolioCampaign
    ? [...campaign.attempts].sort((a, b) => {
        const aFollowers = a.lead?.artist?.followerCount ?? Infinity;
        const bFollowers = b.lead?.artist?.followerCount ?? Infinity;
        const aLow = aFollowers < LOW_FOLLOWER_THRESHOLD;
        const bLow = bFollowers < LOW_FOLLOWER_THRESHOLD;
        if (aLow && !bLow) return -1;
        if (!aLow && bLow) return 1;
        // Within each band, sort by follower count ascending (smallest first)
        return aFollowers - bFollowers;
      })
    : [...campaign.attempts].sort(
        (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
      );

  const totalAttempts = campaign.attempts.length;
  const respondedAttempts = campaign.attempts.filter(a => a.responseType);
  const positiveResponses = campaign.attempts.filter(a => a.responseType === "YES");
  const successRate = totalAttempts > 0 
    ? Math.round((positiveResponses.length / totalAttempts) * 100) 
    : 0;
  const responseRate = totalAttempts > 0 
    ? Math.round((respondedAttempts.length / totalAttempts) * 100) 
    : 0;

  return (
    <div className="relative min-h-screen bg-background pt-32 pb-20 selection:bg-accent/30 selection:text-white">
      <div className="relative mx-auto flex max-w-4xl flex-col gap-16 px-6">
        {/* Header */}
        <header className="flex flex-col gap-10 border-b border-white/5 pb-12">
          <Link 
            href="/KPIs/campaigns" 
            className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all"
          >
            ← Back to Campaigns
          </Link>
          
          <div className="space-y-4">
            <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight premium-gradient-text">
              {campaign.name}
            </h1>
            <div className="flex items-center gap-4 text-white/50 text-sm">
              <span className="font-bold text-white/70">Type:</span>
              <span>{typeLabels[campaign.type] || campaign.type}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="font-bold text-white/70">Channel:</span>
              <span>{channelLabels[campaign.channel] || campaign.channel}</span>
            </div>
          </div>
        </header>

        {/* Campaign Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-6 text-center">
            <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">
              Total Attempts
            </div>
            <div className="text-3xl font-bold text-white">
              {totalAttempts}
            </div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">
              Response Rate
            </div>
            <div className="text-3xl font-bold text-accent">
              {responseRate}%
            </div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">
              Success Rate
            </div>
            <div className="text-3xl font-bold text-accent-secondary">
              {successRate}%
            </div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="text-xs font-bold text-white/30 uppercase tracking-widest mb-2">
              Positive Responses
            </div>
            <div className="text-3xl font-bold text-white">
              {positiveResponses.length}
            </div>
          </GlassCard>
        </div>

        {/* Attempts List */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Outreach Attempts</h3>
            {isPortfolioCampaign && (
              <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                ★ &lt;5k followers first
              </span>
            )}
          </div>
          
          {campaign.attempts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40 font-bold">No attempts recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {prioritizedAttempts.map((attempt) => {
                const firstAttempt = attempt.sentAt;
                const respondedAt = attempt.respondedAt;
                const responseTime = respondedAt && firstAttempt 
                  ? Math.round((new Date(respondedAt).getTime() - new Date(firstAttempt).getTime()) / (1000 * 60 * 60))
                  : null;
                const followerCount = attempt.lead?.artist?.followerCount ?? null;
                const isPriority = isPortfolioCampaign && followerCount !== null && followerCount < LOW_FOLLOWER_THRESHOLD;
                
                return (
                  <div
                    key={attempt.id}
                    className={`rounded-xl p-4 border transition-colors ${
                      isPriority
                        ? "bg-accent/5 border-accent/25"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white">
                            {attempt.lead?.artist?.name || "Unknown Artist"}
                          </p>
                          {isPriority && (
                            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                              Priority
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/40">
                          Sent: {format(new Date(attempt.sentAt), "MMM d, yyyy 'at' HH:mm")}
                          {responseTime != null && ` • Replied in ${responseTime}h`}
                          {isPortfolioCampaign && followerCount !== null && (
                            <span className={`ml-2 tabular-nums ${isPriority ? "text-accent/70" : "text-white/30"}`}>
                              • {followerCount.toLocaleString()} followers
                            </span>
                          )}
                        </p>
                      </div>
                      {attempt.responseType && (
                        <span className="text-xs font-bold uppercase px-2 py-1 rounded-full bg-accent/20 text-accent">
                          {responseTypeLabels[attempt.responseType] || attempt.responseType}
                        </span>
                      )}
                    </div>
                    {attempt.notes && (
                      <p className="text-sm text-white/60 italic mt-2">&ldquo;{attempt.notes}&rdquo;</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}