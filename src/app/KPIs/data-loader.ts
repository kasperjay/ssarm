import { prisma } from "@/lib/prisma";
import { getProximityTier } from "@/lib/scoring-core";
import {
  safeRate,
  safeDelta,
  safeCurrency,
  formatHours,
  getEmptyKpiData,
} from "./kpi-math";
import type {
  TimeframeOption,
  KpiDashboardData,
  KpiHeroSummary,
  DiscoveryIntentMetrics,
  OutreachEfficiencyMetrics,
  CampaignLeaderboardItem,
  ChannelPerformanceRow,
} from "./types";

export {
  safeRate,
  safeDelta,
  safeCurrency,
  formatHours,
  getEmptyKpiData,
};

// Main Aggregation Pipeline

export async function getKpiDashboardData(timeframe: TimeframeOption = "30d"): Promise<KpiDashboardData> {
  const now = new Date();
  let windowStart: Date;
  let prevWindowStart: Date;

  if (timeframe === "7d") {
    windowStart = new Date(now.getTime() - 7 * 86_400_000);
    prevWindowStart = new Date(now.getTime() - 14 * 86_400_000);
  } else if (timeframe === "90d") {
    windowStart = new Date(now.getTime() - 90 * 86_400_000);
    prevWindowStart = new Date(now.getTime() - 180 * 86_400_000);
  } else if (timeframe === "all") {
    windowStart = new Date(0);
    prevWindowStart = new Date(0);
  } else {
    // default 30d
    windowStart = new Date(now.getTime() - 30 * 86_400_000);
    prevWindowStart = new Date(now.getTime() - 60 * 86_400_000);
  }

  try {
    const [
      // 1. Top of Funnel: Discovery & Intent
      totalArtistsCount,
      artistsInWindow,
      leadsInWindow,
      leadsByProductionNeed,
      qualifiedLeadsCount,
      leadScoreAvgResult,

      // 2. Middle of Funnel: Outreach Efficiency
      totalAttemptsCount,
      attemptsInWindow,
      rawAvgHoursResult,

      // 3. Bottom of Funnel: Commercial Revenue & Conversion
      paidInvoicesAgg,
      prevPaidInvoicesAgg,
      issuedInvoicesAgg,
      activeProjectsCount,
      wonLeadsCount,
      contactedLeadsCount,
      paymentMethodDist,
      wonLeadsWithInvoices,

      // 4. Client Retention & Satisfaction
      ratingAgg,
      allRatings,
      mixApprovedProjects,
      distinctClientProjects,
      totalFeedbackCount,

      // 5. Active Campaigns
      campaignsList,
    ] = await Promise.all([
      // Total artists all-time
      prisma.artist.count(),

      // Artists created in window with location data
      prisma.artist.findMany({
        where: { createdAt: { gte: windowStart } },
        select: {
          id: true,
          name: true,
          location: true,
          city: true,
          state: true,
          country: true,
          bio: true,
          instagramHandle: true,
        },
      }),

      // Leads in window
      prisma.lead.count({
        where: { createdAt: { gte: windowStart } },
      }),

      // Leads by production need level in window
      prisma.lead.groupBy({
        by: ["productionNeedLevel"],
        _count: { _all: true },
        where: { createdAt: { gte: windowStart } },
      }),

      // Qualified leads in window (score >= 60)
      prisma.lead.count({
        where: {
          score: { gte: 60 },
          createdAt: { gte: windowStart },
        },
      }),

      // Lead score average in window
      prisma.lead.aggregate({
        _avg: { score: true },
        where: { createdAt: { gte: windowStart }, score: { not: null } },
      }),

      // Total outreach attempts all-time
      prisma.outreachAttempt.count(),

      // Attempts in window with full details
      prisma.outreachAttempt.findMany({
        where: { sentAt: { gte: windowStart } },
        select: {
          id: true,
          channel: true,
          sentAt: true,
          respondedAt: true,
          responseType: true,
        },
      }),

      // Average response time in hours (safe postgres raw query with graceful fallback)
      prisma.$queryRaw<{ avgHours: number | null }[]>`
        SELECT AVG(EXTRACT(EPOCH FROM ("respondedAt" - "sentAt")) / 3600)::float as "avgHours"
        FROM "OutreachAttempt"
        WHERE "respondedAt" IS NOT NULL
          AND "sentAt" >= ${windowStart}
      `.catch(() => [{ avgHours: null }]),

      // Paid Invoices (Revenue Collected in window)
      prisma.projectInvoice.aggregate({
        _sum: { totalCents: true },
        _count: { id: true },
        where: { status: "PAID", paidAt: { gte: windowStart } },
      }),

      // Paid Invoices in previous period (for trend badge)
      prisma.projectInvoice.aggregate({
        _sum: { totalCents: true },
        where: {
          status: "PAID",
          paidAt: { gte: prevWindowStart, lt: windowStart },
        },
      }),

      // Issued Invoices (Active Booked Pipeline Value)
      prisma.projectInvoice.aggregate({
        _sum: { totalCents: true },
        _count: { id: true },
        where: {
          status: "ISSUED",
          project: { status: "ACTIVE" },
        },
      }),

      // Active projects count
      prisma.project.count({
        where: { status: "ACTIVE" },
      }),

      // Won Leads in window
      prisma.lead.count({
        where: { status: "WON", updatedAt: { gte: windowStart } },
      }),

      // Total Contacted/Advanced Leads in window
      prisma.lead.count({
        where: {
          status: { in: ["CONTACTED", "FOLLOW_UP", "WON", "LOST"] },
          updatedAt: { gte: windowStart },
        },
      }),

      // Payment method distribution
      prisma.projectInvoice.groupBy({
        by: ["selectedPaymentMethod"],
        _sum: { totalCents: true },
        _count: { id: true },
        where: { status: "PAID", selectedPaymentMethod: { not: null } },
      }),

      // Won leads with invoices for sales cycle calculation
      prisma.lead.findMany({
        where: {
          status: "WON",
          updatedAt: { gte: windowStart },
        },
        select: {
          createdAt: true,
          artist: {
            select: {
              projects: {
                select: {
                  invoice: {
                    select: {
                      paidAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),

      // Client CSAT Rating aggregate
      prisma.project.aggregate({
        _avg: { rating: true },
        _count: { rating: true },
        where: { rating: { not: null }, ratingSubmittedAt: { gte: windowStart } },
      }),

      // All ratings in window for star breakdown
      prisma.project.findMany({
        where: { rating: { not: null }, ratingSubmittedAt: { gte: windowStart } },
        select: { rating: true },
      }),

      // Mix approved velocity data (projects approved in window)
      prisma.project.findMany({
        where: {
          mixApprovedForMastering: true,
          mixApprovedAt: { gte: windowStart },
        },
        select: {
          createdAt: true,
          mixApprovedAt: true,
        },
      }),

      // Distinct client projects grouped by artistId
      prisma.project.groupBy({
        by: ["artistId"],
        _count: { _all: true },
      }),

      // Total feedback notes count in window
      prisma.projectFeedback.count({
        where: { createdAt: { gte: windowStart } },
      }),

      // Campaigns with nested stats
      prisma.outreachCampaign.findMany({
        include: {
          attempts: {
            select: {
              id: true,
              respondedAt: true,
              responseType: true,
            },
          },
          _count: { select: { attempts: true } },
        },
        orderBy: { startDate: "desc" },
        take: 8,
      }),
    ]);

    // 1. Transform Discovery & Intent Signals
    const totalDiscovered = artistsInWindow.length > 0 ? artistsInWindow.length : totalArtistsCount;
    const effectiveLeadsCount = leadsInWindow > 0 ? leadsInWindow : totalDiscovered;
    const qualificationRatePct = safeRate(qualifiedLeadsCount, effectiveLeadsCount);
    const averageLeadScore = Math.round((leadScoreAvgResult._avg.score || 0) * 10) / 10;

    // Need level mapping
    const needCounts: Record<string, number> = { CLEAR: 0, PROBABLE: 0, POSSIBLE: 0, NONE: 0 };
    for (const group of leadsByProductionNeed) {
      if (group.productionNeedLevel in needCounts) {
        needCounts[group.productionNeedLevel] = group._count._all;
      }
    }
    const totalNeedReported = Object.values(needCounts).reduce((a, b) => a + b, 0);

    const needLevelBreakdown: DiscoveryIntentMetrics["needLevelBreakdown"] = [
      { level: "CLEAR", count: needCounts.CLEAR, pct: safeRate(needCounts.CLEAR, totalNeedReported), color: "#34c759" },
      { level: "PROBABLE", count: needCounts.PROBABLE, pct: safeRate(needCounts.PROBABLE, totalNeedReported), color: "#00f2ff" },
      { level: "POSSIBLE", count: needCounts.POSSIBLE, pct: safeRate(needCounts.POSSIBLE, totalNeedReported), color: "#ffb340" },
      { level: "NONE", count: needCounts.NONE, pct: safeRate(needCounts.NONE, totalNeedReported), color: "#8e8e93" },
    ];

    // Proximity tiers using getProximityTier
    const proximityCounts: Record<string, number> = { AUSTIN: 0, TEXAS: 0, TOURING: 0, OUTSIDE: 0 };
    for (const artist of artistsInWindow) {
      const tierInfo = getProximityTier(artist);
      if (tierInfo.tier === "AUSTIN") proximityCounts.AUSTIN++;
      else if (tierInfo.tier === "TEXAS") proximityCounts.TEXAS++;
      else if (tierInfo.tier === "TOURING") proximityCounts.TOURING++;
      else proximityCounts.OUTSIDE++;
    }
    const totalProximity = artistsInWindow.length || 1;

    const proximityTiers: DiscoveryIntentMetrics["proximityTiers"] = [
      { tier: "AUSTIN", label: "Austin Metro Area", count: proximityCounts.AUSTIN, pct: safeRate(proximityCounts.AUSTIN, totalProximity) },
      { tier: "TEXAS", label: "Texas Regional", count: proximityCounts.TEXAS, pct: safeRate(proximityCounts.TEXAS, totalProximity) },
      { tier: "TOURING", label: "Touring Austin Show", count: proximityCounts.TOURING, pct: safeRate(proximityCounts.TOURING, totalProximity) },
      { tier: "OUTSIDE", label: "Outside Texas", count: proximityCounts.OUTSIDE, pct: safeRate(proximityCounts.OUTSIDE, totalProximity) },
    ];

    // 2. Transform Outreach Efficiency
    const totalAttemptsInWindow = attemptsInWindow.length;
    const responsesInWindow = attemptsInWindow.filter((a) => a.respondedAt != null || a.responseType != null).length;
    const overallResponseRatePct = safeRate(responsesInWindow, totalAttemptsInWindow);

    // Latency
    let avgResponseHours = 0;
    if (rawAvgHoursResult?.[0]?.avgHours != null && Number.isFinite(rawAvgHoursResult[0].avgHours)) {
      avgResponseHours = Math.round(rawAvgHoursResult[0].avgHours * 10) / 10;
    } else {
      // Calculate from in-memory attempts if raw query was null
      const validDelays: number[] = [];
      for (const att of attemptsInWindow) {
        if (att.sentAt && att.respondedAt) {
          const diffHours = (new Date(att.respondedAt).getTime() - new Date(att.sentAt).getTime()) / 3_600_000;
          if (diffHours >= 0 && Number.isFinite(diffHours)) validDelays.push(diffHours);
        }
      }
      if (validDelays.length > 0) {
        avgResponseHours = Math.round((validDelays.reduce((a, b) => a + b, 0) / validDelays.length) * 10) / 10;
      }
    }

    // Channels matrix
    const channelMap: Record<string, { attempts: number; responses: number; positive: number; label: string }> = {
      INSTAGRAM_DM: { attempts: 0, responses: 0, positive: 0, label: "Instagram DM" },
      EMAIL: { attempts: 0, responses: 0, positive: 0, label: "Email (SMTP)" },
      PHONE: { attempts: 0, responses: 0, positive: 0, label: "Phone / SMS" },
      IN_PERSON: { attempts: 0, responses: 0, positive: 0, label: "In-Person Venue" },
    };

    const sentimentCounts: Record<string, number> = {
      YES: 0,
      FOLLOW_UP: 0,
      NO: 0,
      NO_RESPONSE: 0,
    };

    for (const att of attemptsInWindow) {
      const ch = att.channel || "OTHER";
      if (!channelMap[ch]) {
        channelMap[ch] = { attempts: 0, responses: 0, positive: 0, label: ch.replace("_", " ") };
      }
      channelMap[ch].attempts++;

      const isResponded = att.respondedAt != null || att.responseType != null;
      if (isResponded) {
        channelMap[ch].responses++;
      }

      if (att.responseType === "YES" || att.responseType === "FOLLOW_UP") {
        channelMap[ch].positive++;
      }

      if (att.responseType === "YES") sentimentCounts.YES++;
      else if (att.responseType === "FOLLOW_UP") sentimentCounts.FOLLOW_UP++;
      else if (att.responseType === "NO") sentimentCounts.NO++;
      else sentimentCounts.NO_RESPONSE++;
    }

    const channels: ChannelPerformanceRow[] = Object.entries(channelMap).map(([key, data]) => ({
      channel: key,
      label: data.label,
      attemptsCount: data.attempts,
      responsesCount: data.responses,
      responseRatePct: safeRate(data.responses, data.attempts),
      positiveCount: data.positive,
      positiveRatePct: safeRate(data.positive, data.attempts),
    }));

    const totalSentiment = Object.values(sentimentCounts).reduce((a, b) => a + b, 0) || 1;
    const sentimentBreakdown: OutreachEfficiencyMetrics["sentimentBreakdown"] = [
      { type: "YES", label: "Direct Booking (YES)", count: sentimentCounts.YES, pct: safeRate(sentimentCounts.YES, totalSentiment), color: "#34c759" },
      { type: "FOLLOW_UP", label: "Follow Up Later", count: sentimentCounts.FOLLOW_UP, pct: safeRate(sentimentCounts.FOLLOW_UP, totalSentiment), color: "#00f2ff" },
      { type: "NO", label: "Not Interested (NO)", count: sentimentCounts.NO, pct: safeRate(sentimentCounts.NO, totalSentiment), color: "#ff453a" },
      { type: "NO_RESPONSE", label: "Ghost / Unanswered", count: sentimentCounts.NO_RESPONSE, pct: safeRate(sentimentCounts.NO_RESPONSE, totalSentiment), color: "#8e8e93" },
    ];

    // 3. Transform Commercial Revenue & Conversion
    const paidBillingsCents = paidInvoicesAgg._sum.totalCents || 0;
    const paidInvoicesCount = paidInvoicesAgg._count.id || 0;
    const prevPaidBillingsCents = prevPaidInvoicesAgg._sum.totalCents || 0;
    const revenueDelta = safeDelta(paidBillingsCents, prevPaidBillingsCents);

    const averageProjectValueCents = paidInvoicesCount > 0 ? Math.round(paidBillingsCents / paidInvoicesCount) : 0;
    const activePipelineCents = issuedInvoicesAgg._sum.totalCents || 0;

    // Sales cycle days calculation
    const salesCycleDays: number[] = [];
    for (const lead of wonLeadsWithInvoices) {
      for (const proj of lead.artist?.projects || []) {
        if (proj.invoice?.paidAt && lead.createdAt) {
          const days = (new Date(proj.invoice.paidAt).getTime() - new Date(lead.createdAt).getTime()) / 86_400_000;
          if (days >= 0 && Number.isFinite(days)) salesCycleDays.push(days);
        }
      }
    }
    let salesCycleMedianDays = 0;
    if (salesCycleDays.length > 0) {
      salesCycleDays.sort((a, b) => a - b);
      const mid = Math.floor(salesCycleDays.length / 2);
      salesCycleMedianDays = salesCycleDays.length % 2 === 0
        ? Math.round(((salesCycleDays[mid - 1] + salesCycleDays[mid]) / 2) * 10) / 10
        : Math.round(salesCycleDays[mid] * 10) / 10;
    }

    // Payment Rail breakdown
    const paymentRailBreakdown = paymentMethodDist.map((item) => {
      const amountCents = item._sum.totalCents || 0;
      return {
        method: item.selectedPaymentMethod ? item.selectedPaymentMethod.replace("_", " ") : "Other",
        amountCents,
        amountFormatted: safeCurrency(amountCents),
        pct: safeRate(amountCents, paidBillingsCents),
      };
    });

    // Funnel stages
    const funnelStages = [
      { stage: "Discovered Leads", count: totalDiscovered, conversionPct: 100 },
      { stage: "Contacted Leads", count: contactedLeadsCount, conversionPct: safeRate(contactedLeadsCount, totalDiscovered) },
      { stage: "Replied / Engaged", count: responsesInWindow, conversionPct: safeRate(responsesInWindow, contactedLeadsCount || totalDiscovered) },
      { stage: "Won Studio Clients", count: wonLeadsCount, conversionPct: safeRate(wonLeadsCount, contactedLeadsCount || totalDiscovered) },
    ];

    // Conversion rate
    const conversionRatePct = safeRate(wonLeadsCount, contactedLeadsCount || totalDiscovered);

    // 4. Transform Client Retention & Satisfaction
    const averageCsatRating = Math.round((ratingAgg._avg.rating || 0) * 10) / 10;
    const ratingSubmissionsCount = ratingAgg._count.rating || 0;

    const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    for (const r of allRatings) {
      if (r.rating != null && r.rating >= 1 && r.rating <= 5) {
        starCounts[r.rating]++;
      }
    }
    const ratingDistribution = [
      { stars: 5, count: starCounts[5] },
      { stars: 4, count: starCounts[4] },
      { stars: 3, count: starCounts[3] },
      { stars: 2, count: starCounts[2] },
      { stars: 1, count: starCounts[1] },
    ];

    // Mix approval velocity (hours)
    let totalMixApprovalHours = 0;
    let mixApprovedCount = 0;
    for (const proj of mixApprovedProjects) {
      if (proj.createdAt && proj.mixApprovedAt) {
        const diffHours = (new Date(proj.mixApprovedAt).getTime() - new Date(proj.createdAt).getTime()) / 3_600_000;
        if (diffHours >= 0 && Number.isFinite(diffHours)) {
          totalMixApprovalHours += diffHours;
          mixApprovedCount++;
        }
      }
    }
    const mixApprovalVelocityHours = mixApprovedCount > 0 ? Math.round((totalMixApprovalHours / mixApprovedCount) * 10) / 10 : 0;

    // Repeat client rate
    const totalClientCount = distinctClientProjects.length;
    const repeatArtistsCount = distinctClientProjects.filter((g) => g._count._all > 1).length;
    const repeatArtistRatePct = safeRate(repeatArtistsCount, totalClientCount);

    // Revision drag factor (feedback notes per project)
    const averageRevisionFeedbackCount = totalClientCount > 0 ? Math.round((totalFeedbackCount / totalClientCount) * 10) / 10 : 0;

    // 5. Transform Campaigns Leaderboard
    const campaigns: CampaignLeaderboardItem[] = campaignsList.map((c) => {
      const attemptsCount = c._count.attempts;
      const responsesCount = c.attempts.filter((a) => a.respondedAt != null || a.responseType != null).length;
      const positiveCount = c.attempts.filter((a) => a.responseType === "YES" || a.responseType === "FOLLOW_UP").length;

      return {
        id: c.id,
        name: c.name,
        type: c.type.replace(/_/g, " "),
        channel: c.channel.replace(/_/g, " "),
        status: c.status,
        startDate: new Date(c.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        targetCount: c.targetCount,
        attemptsCount,
        responsesCount,
        responseRatePct: safeRate(responsesCount, attemptsCount),
        successRatePct: safeRate(positiveCount, attemptsCount),
        wonBookingsCount: positiveCount,
        billingsFormatted: safeCurrency(positiveCount * 65000), // Estimated studio project yield benchmark ($650/project)
      };
    });

    const hero: KpiHeroSummary = {
      totalRevenueCents: paidBillingsCents,
      totalRevenueFormatted: safeCurrency(paidBillingsCents),
      revenueDeltaPct: revenueDelta.value,
      revenueDeltaPositive: revenueDelta.isPositive,

      activePipelineCents: activePipelineCents,
      activePipelineFormatted: safeCurrency(activePipelineCents),
      activeProjectsCount,

      conversionRatePct,
      wonLeadsCount,
      contactedLeadsCount,

      averageCsatRating,
      ratingSubmissionsCount,
    };

    return {
      timeframe,
      generatedAt: now.toISOString(),
      hero,
      discovery: {
        totalDiscovered,
        qualifiedCount: qualifiedLeadsCount,
        qualificationRatePct,
        averageLeadScore,
        needLevelBreakdown,
        proximityTiers,
      },
      outreach: {
        totalAttempts: totalAttemptsInWindow || totalAttemptsCount,
        overallResponseRatePct,
        avgResponseHours,
        channels,
        sentimentBreakdown,
      },
      revenue: {
        paidBillingsCents,
        paidBillingsFormatted: safeCurrency(paidBillingsCents),
        averageProjectValueCents,
        averageProjectValueFormatted: safeCurrency(averageProjectValueCents),
        paidInvoicesCount,
        salesCycleMedianDays,
        paymentRailBreakdown,
        funnelStages,
      },
      retention: {
        averageRating: averageCsatRating,
        ratingDistribution,
        mixApprovalVelocityHours,
        mixApprovalVelocityFormatted: formatHours(mixApprovalVelocityHours),
        averageRevisionFeedbackCount,
        repeatArtistRatePct,
        repeatArtistsCount,
        totalClientCount,
      },
      campaigns,
    };
  } catch (err) {
    console.error("[KPIs data-loader] Database query failed or uninitialized, applying cold-start fallback:", err);
    return getEmptyKpiData(timeframe);
  }
}
