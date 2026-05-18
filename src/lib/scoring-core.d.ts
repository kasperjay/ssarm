export type ScoreableArtist = {
  instagramHandle?: string | null;
  spotifyArtistId?: string | null;
  officialSiteUrl?: string | null;
  location?: string | null;
  city?: string | null;
  state?: string | null;
  genre?: string | null;
  bio?: string | null;
  emails?: string[] | null;
  followerCount?: number | null;
  lastPostAt?: Date | string | null;
};

export type LeadScoreResult = {
  totalScore: number;
  rawScore: number;
  score: number;
  scoreRationale: string;
  isQualified: boolean;
  components: {
    proximityScore: number;
    followerScore: number;
    recencyScore: number;
    releaseScore: number;
    completenessScore: number;
    engagementScore: number;
    genreBonus: number;
  };
};

export const SCORING_CONFIG: {
  WEIGHTS: Record<string, number>;
  QUALIFIED_THRESHOLD: number;
  RECENCY_DAYS: number;
  MIN_RELEASES: number;
  AUSTIN_AREA_CITIES: string[];
  TEXAS_CITIES: string[];
};

export function calculateLeadScoreFromData(
  artist: ScoreableArtist,
  releaseCount: number
): LeadScoreResult;
