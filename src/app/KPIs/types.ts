export type TimeframeOption = "7d" | "30d" | "90d" | "all";

export interface KpiHeroSummary {
  totalRevenueCents: number;
  totalRevenueFormatted: string;
  revenueDeltaPct: number;
  revenueDeltaPositive: boolean;

  activePipelineCents: number;
  activePipelineFormatted: string;
  activeProjectsCount: number;

  conversionRatePct: number;
  wonLeadsCount: number;
  contactedLeadsCount: number;

  averageCsatRating: number;
  ratingSubmissionsCount: number;
}

export interface DiscoveryIntentMetrics {
  totalDiscovered: number;
  qualifiedCount: number;
  qualificationRatePct: number;
  averageLeadScore: number;
  needLevelBreakdown: {
    level: "CLEAR" | "PROBABLE" | "POSSIBLE" | "NONE";
    count: number;
    pct: number;
    color: string;
  }[];
  proximityTiers: {
    tier: "AUSTIN" | "TEXAS" | "TOURING" | "OUTSIDE";
    label: string;
    count: number;
    pct: number;
  }[];
}

export interface ChannelPerformanceRow {
  channel: string;
  label: string;
  attemptsCount: number;
  responsesCount: number;
  responseRatePct: number;
  positiveCount: number;
  positiveRatePct: number;
}

export interface OutreachEfficiencyMetrics {
  totalAttempts: number;
  overallResponseRatePct: number;
  avgResponseHours: number;
  channels: ChannelPerformanceRow[];
  sentimentBreakdown: {
    type: "YES" | "FOLLOW_UP" | "NO" | "NO_RESPONSE";
    label: string;
    count: number;
    pct: number;
    color: string;
  }[];
}

export interface CommercialRevenueMetrics {
  paidBillingsCents: number;
  paidBillingsFormatted: string;
  averageProjectValueCents: number;
  averageProjectValueFormatted: string;
  paidInvoicesCount: number;
  salesCycleMedianDays: number;
  paymentRailBreakdown: {
    method: string;
    amountCents: number;
    amountFormatted: string;
    pct: number;
  }[];
  funnelStages: {
    stage: string;
    count: number;
    conversionPct: number;
  }[];
}

export interface RetentionQualityMetrics {
  averageRating: number;
  ratingDistribution: { stars: number; count: number }[];
  mixApprovalVelocityHours: number;
  mixApprovalVelocityFormatted: string;
  averageRevisionFeedbackCount: number;
  repeatArtistRatePct: number;
  repeatArtistsCount: number;
  totalClientCount: number;
}

export interface CampaignLeaderboardItem {
  id: string;
  name: string;
  type: string;
  channel: string;
  status: string;
  startDate: string;
  targetCount: number;
  attemptsCount: number;
  responsesCount: number;
  responseRatePct: number;
  successRatePct: number;
  billingsFormatted?: string;
  wonBookingsCount?: number;
}

export interface KpiDashboardData {
  timeframe: TimeframeOption;
  generatedAt: string;
  hero: KpiHeroSummary;
  discovery: DiscoveryIntentMetrics;
  outreach: OutreachEfficiencyMetrics;
  revenue: CommercialRevenueMetrics;
  retention: RetentionQualityMetrics;
  campaigns: CampaignLeaderboardItem[];
}
