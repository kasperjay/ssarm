import { prisma } from "./prisma";

const SCORING_CONFIG = {
  WEIGHTS: {
    followerCount: 30,
    recency: 20,
    releaseCount: 20,
    dataCompleteness: 15,
    engagement: 10,
    genreBonus: 5,
  },
  FOLLOWER_THRESHOLD: 10000,
  RECENCY_DAYS: 180,
  MIN_RELEASES: 3,
  QUALIFIED_THRESHOLD: 60,
};

function calculateFollowerScore(followerCount: number | null) {
  if (!followerCount) return 0;
  const ratio = Math.min(followerCount / SCORING_CONFIG.FOLLOWER_THRESHOLD, 1);
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.followerCount);
}

function calculateRecencyScore(lastPostAt: Date | null) {
  if (!lastPostAt) return 0;
  const daysSincePost = (Date.now() - new Date(lastPostAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePost > SCORING_CONFIG.RECENCY_DAYS) return 0;
  const ratio = 1 - daysSincePost / SCORING_CONFIG.RECENCY_DAYS;
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.recency);
}

function calculateReleaseScore(releaseCount: number) {
  if (!releaseCount) return 0;
  const ratio = Math.min(releaseCount / SCORING_CONFIG.MIN_RELEASES, 1);
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.releaseCount);
}

function calculateDataCompletenessScore(artist: any) {
  const fields = [
    'instagramHandle',
    'spotifyArtistId',
    'genre',
    'city',
    'bio',
  ];
  const filledCount = fields.filter(field => artist[field]).length;
  const ratio = filledCount / fields.length;
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.dataCompleteness);
}

function calculateEngagementScore(artist: any) {
  let engagementPoints = 0;
  if (artist.instagramHandle) engagementPoints += 3;
  if (artist.bio && artist.bio.length > 50) engagementPoints += 3;
  if (artist.emails && artist.emails.length > 1) engagementPoints += 2;
  if (artist.officialSiteUrl) engagementPoints += 2;
  return Math.min(engagementPoints, SCORING_CONFIG.WEIGHTS.engagement);
}

function calculateGenreBonus(artist: any) {
  if (!artist.genre) return 0;
  const genreStr = artist.genre.toLowerCase();
  if (genreStr.length > 2 && genreStr !== 'unknown') {
    return SCORING_CONFIG.WEIGHTS.genreBonus;
  }
  return 0;
}

export async function calculateLeadScore(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { artist: true },
  });

  if (!lead) return null;

  const artist = lead.artist;
  
  const releaseCount = await prisma.release.count({
    where: { artistId: artist.id },
  });
  
  const followerScore = calculateFollowerScore(artist.followerCount);
  const recencyScore = calculateRecencyScore(artist.lastPostAt);
  const releaseScore = calculateReleaseScore(releaseCount);
  const completenessScore = calculateDataCompletenessScore(artist);
  const engagementScore = calculateEngagementScore(artist);
  const genreBonus = calculateGenreBonus(artist);
  
  const totalScore = followerScore + recencyScore + releaseScore + completenessScore + engagementScore + genreBonus;
  
  const rationales: string[] = [];
  if (followerScore > 0) {
    rationales.push(`${artist.followerCount?.toLocaleString() || 0} followers (${followerScore}pts)`);
  }
  if (recencyScore > 0 && artist.lastPostAt) {
    const daysAgo = Math.floor((Date.now() - new Date(artist.lastPostAt).getTime()) / (1000 * 60 * 60 * 24));
    rationales.push(`active posting (${daysAgo}d ago, ${recencyScore}pts)`);
  }
  if (releaseScore > 0) {
    rationales.push(`${releaseCount} releases (${releaseScore}pts)`);
  }
  if (completenessScore > 0) {
    rationales.push(`profile ${completenessScore}% complete (${completenessScore}pts)`);
  }
  if (engagementScore > 0) {
    rationales.push(`engagement signals (${engagementScore}pts)`);
  }
  if (genreBonus > 0) {
    rationales.push(`genre "${artist.genre}" (${genreBonus}pts)`);
  }
  
  const scoreRationale = rationales.length > 0 
    ? rationales.join("; ")
    : "No scoring data available";
  
  const isQualified = totalScore >= SCORING_CONFIG.QUALIFIED_THRESHOLD;
  
  return { totalScore, scoreRationale, isQualified };
}

export async function scoreLead(leadId: string) {
  const scoreData = await calculateLeadScore(leadId);
  if (!scoreData) return null;

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return null;

  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: {
      score: scoreData.totalScore,
      scoreRationale: scoreData.scoreRationale,
      status: (scoreData.isQualified && lead.status === "NEW") ? "QUALIFIED" : lead.status,
    },
  });

  await prisma.activity.create({
    data: {
      leadId: leadId,
      type: "NOTE",
      note: `[SCORE-UPDATE] Score: ${scoreData.totalScore}/100. ${scoreData.scoreRationale}${scoreData.isQualified && lead.status === "NEW" ? ' → Auto-qualified!' : ''}`,
    },
  });

  return updatedLead;
}
