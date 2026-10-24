export type ScoreableArtist = {
  name?: string;
  instagramHandle?: string | null;
  spotifyArtistId?: string | null;
  officialSiteUrl?: string | null;
  location?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  genre?: string | null;
  bio?: string | null;
  emails?: string[] | null;
  followerCount?: number | null;
  lastPostAt?: Date | string | null;
  hasAustinVenueTie?: boolean;
};

export type ProximityTierInfo = {
  tier: "AUSTIN" | "TEXAS" | "TOURING" | "OUTSIDE" | "UNKNOWN";
  proximityScore: number;
  baseScore: number;
  maxSecondary: number;
  label: string;
  hasVenueTie?: boolean;
};

export type ProductionNeedInput =
  | {
      level?: "NONE" | "POSSIBLE" | "PROBABLE" | "CLEAR" | string | null;
      evidence?: string[] | string | null;
      approvedAt?: Date | string | null;
    }
  | "NONE"
  | "POSSIBLE"
  | "PROBABLE"
  | "CLEAR"
  | string
  | null;

export type LeadScoreResult = {
  totalScore: number;
  rawScore: number;
  score: number;
  scoreRationale: string;
  isQualified: boolean;
  hasActivityProof: boolean;
  activityProofs?: string[];
  components: {
    proximityScore: number;
    followerScore: number;
    recencyScore: number;
    releaseScore: number;
    completenessScore: number;
    engagementScore: number;
    genreBonus: number;
    lyricalRangeScore: number;
    contentMaturityScore: number;
    commercialReadabilityScore: number;
    productionNeedScore: number;
  };
};

export const PRODUCTION_NEED_POINTS: {
  NONE: number;
  POSSIBLE: number;
  PROBABLE: number;
  CLEAR: number;
};

export const FRESHNESS_DAYS: number;

export const SCORING_CONFIG: {
  WEIGHTS: Record<string, number>;
  QUALIFIED_THRESHOLD: number;
  RECENCY_DAYS: number;
  MIN_RELEASES: number;
  AUSTIN_AREA_CITIES: string[];
  TEXAS_CITIES: string[];
  PRODUCTION_NEED_POINTS: Record<string, number>;
  FRESHNESS_DAYS: number;
};

export function getProximityTier(artist: ScoreableArtist | null | undefined): ProximityTierInfo;

export function calculateProximityScore(artist: ScoreableArtist | null | undefined): number;

export function calculateLeadScoreFromData(
  artist: ScoreableArtist,
  releaseCount: number,
  trackAnalysisStats?: unknown,
  productionNeed?: ProductionNeedInput
): LeadScoreResult;

export function calculateLyricalRangeScore(analysisStats: unknown): number;
export function calculateContentMaturityScore(analysisStats: unknown): number;
export function calculateCommercialReadability(analysisStats: unknown): number;
