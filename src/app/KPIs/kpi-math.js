// Pure math safety utilities and zero-division guards for KPI tracking dashboard

/**
 * Safe percentage rate calculator with zero division guard.
 * Returns percentage rounded to 1 decimal place (e.g. 24.5).
 */
function safeRate(numerator, denominator) {
  if (denominator == null || denominator <= 0 || !Number.isFinite(denominator)) return 0;
  if (numerator == null || numerator <= 0 || !Number.isFinite(numerator)) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

/**
 * Safe delta calculator between current period and previous period.
 * Returns absolute percentage change and boolean isPositive flag.
 */
function safeDelta(current, previous) {
  const cur = typeof current === "number" && Number.isFinite(current) ? current : 0;
  const prev = typeof previous === "number" && Number.isFinite(previous) ? previous : 0;
  if (prev <= 0) {
    return { value: cur > 0 ? 100 : 0, isPositive: cur >= 0 };
  }
  const diff = cur - prev;
  const pct = Math.round((diff / prev) * 1000) / 10;
  return { value: Math.abs(pct), isPositive: pct >= 0 };
}

/**
 * Safe currency formatter from cents to USD string.
 */
function safeCurrency(cents) {
  if (!cents || cents <= 0 || !Number.isFinite(cents)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/**
 * Safe format hours from decimal to string.
 */
function formatHours(hours) {
  if (hours == null || !Number.isFinite(hours) || hours <= 0) return "--";
  if (hours < 1) return "< 1h";
  return `${Math.round(hours * 10) / 10}h`;
}

/**
 * Cold-database fallback builder returning safe default structure.
 */
function getEmptyKpiData(timeframe = "30d") {
  return {
    timeframe,
    generatedAt: new Date().toISOString(),
    hero: {
      totalRevenueCents: 0,
      totalRevenueFormatted: "$0.00",
      revenueDeltaPct: 0,
      revenueDeltaPositive: true,
      activePipelineCents: 0,
      activePipelineFormatted: "$0.00",
      activeProjectsCount: 0,
      conversionRatePct: 0,
      wonLeadsCount: 0,
      contactedLeadsCount: 0,
      averageCsatRating: 0,
      ratingSubmissionsCount: 0,
    },
    discovery: {
      totalDiscovered: 0,
      qualifiedCount: 0,
      qualificationRatePct: 0,
      averageLeadScore: 0,
      needLevelBreakdown: [
        { level: "CLEAR", count: 0, pct: 0, color: "#34c759" },
        { level: "PROBABLE", count: 0, pct: 0, color: "#00f2ff" },
        { level: "POSSIBLE", count: 0, pct: 0, color: "#ffb340" },
        { level: "NONE", count: 0, pct: 0, color: "#8e8e93" },
      ],
      proximityTiers: [
        { tier: "AUSTIN", label: "Austin Metro Area", count: 0, pct: 0 },
        { tier: "TEXAS", label: "Texas Regional", count: 0, pct: 0 },
        { tier: "TOURING", label: "Touring Austin Show", count: 0, pct: 0 },
        { tier: "OUTSIDE", label: "Outside Texas", count: 0, pct: 0 },
      ],
    },
    outreach: {
      totalAttempts: 0,
      overallResponseRatePct: 0,
      avgResponseHours: 0,
      channels: [
        { channel: "INSTAGRAM_DM", label: "Instagram DM", attemptsCount: 0, responsesCount: 0, responseRatePct: 0, positiveCount: 0, positiveRatePct: 0 },
        { channel: "EMAIL", label: "Email (SMTP)", attemptsCount: 0, responsesCount: 0, responseRatePct: 0, positiveCount: 0, positiveRatePct: 0 },
        { channel: "PHONE", label: "Phone / SMS", attemptsCount: 0, responsesCount: 0, responseRatePct: 0, positiveCount: 0, positiveRatePct: 0 },
        { channel: "IN_PERSON", label: "In-Person Venue", attemptsCount: 0, responsesCount: 0, responseRatePct: 0, positiveCount: 0, positiveRatePct: 0 },
      ],
      sentimentBreakdown: [
        { type: "YES", label: "Direct Booking (YES)", count: 0, pct: 0, color: "#34c759" },
        { type: "FOLLOW_UP", label: "Follow Up Later", count: 0, pct: 0, color: "#00f2ff" },
        { type: "NO", label: "Not Interested (NO)", count: 0, pct: 0, color: "#ff453a" },
        { type: "NO_RESPONSE", label: "Ghost / Unanswered", count: 0, pct: 0, color: "#8e8e93" },
      ],
    },
    revenue: {
      paidBillingsCents: 0,
      paidBillingsFormatted: "$0.00",
      averageProjectValueCents: 0,
      averageProjectValueFormatted: "$0.00",
      paidInvoicesCount: 0,
      salesCycleMedianDays: 0,
      paymentRailBreakdown: [],
      funnelStages: [
        { stage: "Discovered Leads", count: 0, conversionPct: 100 },
        { stage: "Contacted Leads", count: 0, conversionPct: 0 },
        { stage: "Replied / Engaged", count: 0, conversionPct: 0 },
        { stage: "Won Studio Clients", count: 0, conversionPct: 0 },
      ],
    },
    retention: {
      averageRating: 0,
      ratingDistribution: [
        { stars: 5, count: 0 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ],
      mixApprovalVelocityHours: 0,
      mixApprovalVelocityFormatted: "--",
      averageRevisionFeedbackCount: 0,
      repeatArtistRatePct: 0,
      repeatArtistsCount: 0,
      totalClientCount: 0,
    },
    campaigns: [],
  };
}

module.exports = {
  safeRate,
  safeDelta,
  safeCurrency,
  formatHours,
  getEmptyKpiData,
};
