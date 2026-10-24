import React from "react";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

export const dynamic = "force-dynamic";

// Helper to calculate conversion rate
function getConversionRate(total: number, converted: number): number {
  if (total === 0) return 0;
  return Math.round((converted / total) * 100);
}

type StatusDistributionItem = {
  status: string;
  _count: { _all: number };
};

type ChannelStat = {
  channel: string;
  _count: { _all: number; responseType: number };
};

type RecentCampaign = {
  id: string;
  name: string;
  type: string;
  channel: string;
  status: string;
  _count: { attempts: number };
  attempts: { responseType: string | null }[];
};

export default async function KPIsPage() {
  // Fetch KPI data
  const [
    totalCampaigns,
    totalAttempts,
    successfulAttempts,
    avgResponseTime,
    recentCampaigns,
    channelStats,
    statusDistribution
  ] = await Promise.all([
    // Total campaigns
    prisma.outreachCampaign.count(),
    
    // Total outreach attempts
    prisma.outreachAttempt.count(),
    
    // Successful responses
    prisma.outreachAttempt.count({
      where: { responseType: { in: ["YES", "FOLLOW_UP"] } }
    }),
    
    // Average response time (in hours)
    prisma.$queryRaw<{ avgHours: number }[]>`
      SELECT AVG(EXTRACT(EPOCH FROM (("respondedAt" - "sentAt") / 3600))) as "avgHours"
      FROM "OutreachAttempt"
      WHERE "respondedAt" IS NOT NULL
    `.then(results => results[0]?.avgHours || 0),
    
    // Recent campaigns with their stats
    prisma.outreachCampaign.findMany({
      include: {
        attempts: true,
        _count: {
          select: { attempts: true }
        }
      },
      orderBy: { startDate: "desc" },
      take: 5
    }),
    
    // Channel performance
    prisma.outreachAttempt.groupBy({
      by: ["channel"],
      _count: { _all: true, responseType: true },
      where: { responseType: { not: null } }
    }),
    
    // Lead status distribution
    prisma.lead.groupBy({
      by: ["status"],
      _count: { _all: true }
    })
  ]);

  // Calculate metrics
  const successRate = totalAttempts > 0 ? getConversionRate(totalAttempts, successfulAttempts) : 0;

  // Status distribution for display
  const statusMap: Record<string, { label: string; color: string }> = {
    NEW: { label: "New", color: "bg-blue-500" },
    QUALIFIED: { label: "Qualified", color: "bg-yellow-500" },
    CONTACTED: { label: "Contacted", color: "bg-purple-500" },
    FOLLOW_UP: { label: "Follow-up", color: "bg-orange-500" },
    WON: { label: "Won", color: "bg-green-500" },
    LOST: { label: "Lost", color: "bg-red-500" }
  };

  return (
    <div className="relative min-h-screen bg-background pt-32 pb-20 selection:bg-accent/30 selection:text-white">
      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6">
        {/* Header Section */}
        <header className="flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-12 border-b border-white/5 pb-12">
            <div className="space-y-6">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all"
              >
                <span className="transition-transform group-hover:-translate-x-1">←</span>                 <span>Dashboard</span>
              </Link>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-px w-8 bg-accent/40" />
                  <p className="text-xs uppercase tracking-[0.3em] text-accent/60 font-bold">
                    KPI Tracking
                  </p>
                </div>
                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight premium-gradient-text pr-4">
                  Outreach Success
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

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6">
            <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2">
              Total Campaigns
            </div>
            <div className="text-3xl font-bold text-white">
              {totalCampaigns}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2">
              Outreach Attempts
            </div>
            <div className="text-3xl font-bold text-accent">
              {totalAttempts}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2">
              Conversion Rate
            </div>
            <div className="text-3xl font-bold text-accent-secondary">
              {successRate}%
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2">
              Avg Response Time
            </div>
            <div className="text-3xl font-bold text-white">
              {typeof avgResponseTime === 'number' ? Math.round(avgResponseTime * 10) / 10 : '0'}h
            </div>
          </GlassCard>
        </div>

        {/* Status Distribution Chart */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Lead Status Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {statusDistribution.map((item: StatusDistributionItem) => {
              const statusInfo = statusMap[item.status] || { label: item.status, color: "bg-gray-500" };
              const count = item._count._all;
              const total = statusDistribution.reduce((sum: number, i: StatusDistributionItem) => sum + i._count._all, 0);
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              
              return (
                <div key={item.status} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`h-2 w-2 rounded-full ${statusInfo.color}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-white/40">
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white">{count}</div>
                  <div className="text-xs text-white/30">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Channel Performance */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-white mb-6">Channel Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channelStats.length > 0 ? (
              channelStats.map((stat: ChannelStat) => (
                <div key={stat.channel} className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <div className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">
                    {stat.channel.replace('_', ' ')}
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">
                    {stat._count._all}
                  </div>
                  <div className="text-xs text-white/30">
                    Responses: {stat._count.responseType}
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                    <div 
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, stat._count.responseType * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-white/40">
                No outreach attempts recorded yet
              </div>
            )}
          </div>
        </GlassCard>

        {/* Recent Campaigns */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Campaigns</h3>
            <Link href="/KPIs/campaigns">
              <span className="text-xs font-bold uppercase tracking-wider text-accent hover:underline">
                View All →
              </span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentCampaigns.length > 0 ? (
              recentCampaigns.map((campaign: RecentCampaign) => {
                const totalAttemptsCount = campaign._count.attempts;
                const successful = campaign.attempts.filter((a) =>
                  a.responseType === "YES" || a.responseType === "FOLLOW_UP"
                ).length;
                const rate = totalAttemptsCount > 0 
                  ? Math.round((successful / totalAttemptsCount) * 100) 
                  : 0;
                
                return (
                  <Link key={campaign.id} href={`/KPIs/campaigns/${campaign.id}`}>
                    <GlassCard className="p-5 group hover:scale-[1.02] transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg text-white group-hover:text-accent transition-colors">
                          {campaign.name}
                        </h4>
                        <span className="text-xs bg-accent/20 px-2 py-1 rounded-full text-accent">
                          {campaign.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 mb-4">
                        {campaign.type.replace('_', ' ')} • {campaign.channel.replace('_', ' ')}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-white/30">
                          <span className="font-bold text-white">{totalAttemptsCount}</span> attempts
                        </div>
                        <div className="text-xs text-white/30">
                          <span className="font-bold text-white">{rate}%</span> success
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-3">
                        <div 
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </GlassCard>
                  </Link>
                );
              })
            ) : (
              <div className="text-center py-8 text-white/40">
                No campaigns created yet
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}