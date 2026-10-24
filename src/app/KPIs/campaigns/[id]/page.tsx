export const dynamic = "force-dynamic";
import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { format } from "date-fns";

type Props = {
  params: { id: string };
};

const typeLabels: Record<string, string> = {
  NEW_RELEASES: "New Releases",
  VENUE_BOOKING: "Venue Booking",
  COLLABORATION: "Collaboration",
  REENGAGEMENT: "Re-engagement",
  RECRUITMENT: "Recruitment"
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

export async function generateStaticParams() {
  // This would be called at build time, but we'll return empty for now
  return [];
}

export default async function CampaignPage({ params }: Props) {
  const campaign = await prisma.outreachCampaign.findUnique({
    where: { id: params.id },
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

  const totalAttempts = campaign.attempts.length;
  const respondedAttempts = campaign.attempts.filter(a => a.responseType);
  const positiveResponses = campaign.attempts.filter(a => a.responseType === "YES");
  const followUpRequests = campaign.attempts.filter(a => a.responseType === "FOLLOW_UP");
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
          <h3 className="text-xl font-bold text-white mb-6">Outreach Attempts</h3>
          
          {campaign.attempts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/40 font-bold">No attempts recorded yet</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {campaign.attempts.map((attempt) => {
                const firstAttempt = attempt.sentAt;
                const respondedAt = attempt.respondedAt;
                const responseTime = respondedAt && firstAttempt 
                  ? Math.round((new Date(respondedAt).getTime() - new Date(firstAttempt).getTime()) / (1000 * 60 * 60))
                  : null;
                
                return (
                  <div key={attempt.id} className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-bold text-white">
                          {attempt.lead?.artist?.name || "Unknown Artist"}
                        </p>
                        <p className="text-xs text-white/40">
                          Sent: {format(new Date(attempt.sentAt), "MMM d, yyyy 'at' HH:mm")}
                        </p>
                      </div>
                      {attempt.responseType && (
                        <span className="text-xs font-bold uppercase px-2 py-1 rounded-full bg-accent/20 text-accent">
                          {responseTypeLabels[attempt.responseType] || attempt.responseType}
                        </span>
                      )}
                    </div>
                    {attempt.notes && (
                      <p className="text-sm text-white/60 italic mt-2">"{attempt.notes}"</p>
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