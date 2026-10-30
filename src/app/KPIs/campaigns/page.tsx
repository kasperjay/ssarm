import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  const campaigns = await prisma.outreachCampaign.findMany({
    include: {
      attempts: {
        where: { responseType: { not: null } }
      },
      _count: {
        select: { attempts: true }
      }
    },
    orderBy: { startDate: "desc" }
  });

  const statusColors = {
    ACTIVE: "bg-green-500/20 text-green-400",
    COMPLETED: "bg-blue-500/20 text-blue-400",
    PAUSED: "bg-orange-500/20 text-orange-400"
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

  return (
    <div className="relative min-h-screen bg-background pt-32 pb-20 selection:bg-accent/30 selection:text-white">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6">
        {/* Header Section */}
        <header className="flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-12 border-b border-white/5 pb-12">
            <div className="space-y-6">
              <Link 
                href="/KPIs" 
                className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all"
              >
                <span className="transition-transform group-hover:-translate-x-1">←</span>                 <span>KPIs</span>
              </Link>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-accent/40" />
                  <p className="text-xs uppercase tracking-[0.3em] text-accent/60 font-bold">
                    Campaign Management
                  </p>
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight premium-gradient-text pr-4">
                  Outreach Campaigns
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-8 pb-2">
              <Link href="/KPIs/campaigns/new">
                <NeonButton variant="lime" size="md">
                  + New Campaign
                </NeonButton>
              </Link>
            </div>
          </div>
        </header>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {campaigns.length === 0 ? (
            <div className="col-span-2">
              <GlassCard className="p-12 text-center">
                <p className="text-white/40 font-bold uppercase tracking-widest mb-4">
                  No campaigns created yet
                </p>
                <Link href="/KPIs/campaigns/new">
                  <NeonButton variant="outline" size="md">
                    Create Your First Campaign
                  </NeonButton>
                </Link>
              </GlassCard>
            </div>
          ) : (
            campaigns.map((campaign) => {
              const totalAttempts = campaign._count.attempts;
              const responded = campaign.attempts.length;
              const successRate = totalAttempts > 0 
                ? Math.round((responded / totalAttempts) * 100) 
                : 0;
              
              const startDate = format(new Date(campaign.startDate), "MMM d, yyyy");
              const endDate = campaign.endDate ? format(new Date(campaign.endDate), " MMM d, yyyy") : "Ongoing";

              return (
                <Link key={campaign.id} href={`/KPIs/campaigns/${campaign.id}`}>
                  <GlassCard className="p-6 group hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                        {campaign.name}
                      </h3>
                      <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${statusColors[campaign.status as keyof typeof statusColors]}`}>
                        {campaign.status}
                      </span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="text-sm text-white/50">
                        <span className="font-bold text-white/70">Type:</span> {typeLabels[campaign.type] || campaign.type}
                      </div>
                      <div className="text-sm text-white/50">
                        <span className="font-bold text-white/70">Channel:</span> {channelLabels[campaign.channel] || campaign.channel}
                      </div>
                      <div className="text-sm text-white/50">
                        <span className="font-bold text-white/70">Period:</span> {startDate} - {endDate}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-white/40">
                        <span className="font-bold text-white/60">{totalAttempts}</span> attempts
                      </div>
                      <div className="text-xs text-white/40">
                        <span className="font-bold text-white/60">{successRate}%</span> response
                      </div>
                    </div>
                    
                    <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${successRate}%` }}
                      />
                    </div>
                  </GlassCard>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}