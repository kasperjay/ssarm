import { prisma } from "./prisma";

const SCORING_CONFIG = {
  WEIGHTS: {
    proximity: 20,       // Distance from Austin
    followerCount: 20,   // Small/Medium preference
    genreBonus: 15,      // Metal, Rock, Hip Hop
    recency: 15,         // Last post recency
    releaseCount: 15,    // Number of releases
    dataCompleteness: 10, // Profile filled
    engagement: 5,       // Bio/Site/Emails
  },
  QUALIFIED_THRESHOLD: 65, // Slightly higher due to proximity/genre boosts
};

const AUSTIN_AREA_CITIES = [
  "austin", "round rock", "pflugerville", "cedar park", "georgetown",
  "san marcos", "kyle", "buda", "dripping springs", "hutto", "manor", "lakeway",
  "beecave", "westlake", "rollingwood", "spicewood", "bastrop"
];

function calculateProximityScore(artist: any) {
  if (!artist.location && !artist.city) return 0;
  
  const locStr = `${artist.city || ""} ${artist.location || ""}`.toLowerCase();
  
  // 1. Austin Area (Highest)
  for (const city of AUSTIN_AREA_CITIES) {
    if (locStr.includes(city)) {
      return SCORING_CONFIG.WEIGHTS.proximity;
    }
  }
  
  // 2. Texas (Medium)
  if (locStr.includes("tx") || locStr.includes("texas") || locStr.includes("san antonio") || locStr.includes("houston") || locStr.includes("dallas") || locStr.includes("fort worth")) {
    return Math.round(SCORING_CONFIG.WEIGHTS.proximity * 0.5); // 10 pts
  }
  
  // 3. USA (Low)
  // Assuming most of our leads are US-based, if they don't match TX/Austin but have a location
  return Math.round(SCORING_CONFIG.WEIGHTS.proximity * 0.2); // 4 pts
}

function calculateFollowerScore(followerCount: number | null) {
  if (!followerCount || followerCount === 0) return 0;
  
  // Favor Small/Medium (1 - 20,000)
  if (followerCount < 50) return 5; // Very small
  if (followerCount <= 5000) return SCORING_CONFIG.WEIGHTS.followerCount; // Ideal (20 pts)
  if (followerCount <= 20000) return Math.round(SCORING_CONFIG.WEIGHTS.followerCount * 0.8); // Good (16 pts)
  if (followerCount <= 100000) return Math.round(SCORING_CONFIG.WEIGHTS.followerCount * 0.4); // Large (8 pts)
  
  return 5; // Too big
}

function calculateRecencyScore(lastPostAt: Date | null) {
  if (!lastPostAt) return 0;
  const daysSincePost = (Date.now() - new Date(lastPostAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePost > 180) return 0;
  const ratio = 1 - daysSincePost / 180;
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.recency);
}

function calculateReleaseScore(releaseCount: number) {
  if (!releaseCount) return 0;
  const ratio = Math.min(releaseCount / 3, 1);
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.releaseCount);
}

function calculateDataCompletenessScore(artist: any) {
  const fields = ['instagramHandle', 'spotifyArtistId', 'genre', 'city', 'bio'];
  const filledCount = fields.filter(field => artist[field]).length;
  const ratio = filledCount / fields.length;
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.dataCompleteness);
}

function calculateEngagementScore(artist: any) {
  let points = 0;
  if (artist.instagramHandle) points += 2;
  if (artist.bio && artist.bio.length > 50) points += 1;
  if (artist.emails && artist.emails.length > 0) points += 1;
  if (artist.officialSiteUrl) points += 1;
  return Math.min(points, SCORING_CONFIG.WEIGHTS.engagement);
}

function calculateGenreBonus(artist: any) {
  if (!artist.genre) return 0;
  const genreStr = artist.genre.toLowerCase();
  
  const favoredKeywords = ["metal", "rock", "hardcore", "punk", "hip hop", "hip-hop", "rap", "trap"];
  for (const kw of favoredKeywords) {
    if (genreStr.includes(kw)) {
      return SCORING_CONFIG.WEIGHTS.genreBonus;
    }
  }
  
  if (genreStr.length > 2 && genreStr !== 'unknown') {
    return Math.round(SCORING_CONFIG.WEIGHTS.genreBonus * 0.4); // 6 pts for any valid genre
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
  
  const proximityScore = calculateProximityScore(artist);
  const followerScore = calculateFollowerScore(artist.followerCount);
  const recencyScore = calculateRecencyScore(artist.lastPostAt);
  const releaseScore = calculateReleaseScore(releaseCount);
  const completenessScore = calculateDataCompletenessScore(artist);
  const engagementScore = calculateEngagementScore(artist);
  const genreBonus = calculateGenreBonus(artist);
  
  const totalScore = proximityScore + followerScore + recencyScore + releaseScore + completenessScore + engagementScore + genreBonus;
  
  const rationales: string[] = [];
  if (proximityScore > 0) {
    const loc = artist.city || artist.location || "unknown";
    rationales.push(`proximity: ${loc} (${proximityScore}pts)`);
  }
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
    rationales.push(`profile ${completenessScore * 10}% complete (${completenessScore}pts)`);
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
