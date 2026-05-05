import { prisma } from "./prisma";

const SCORING_CONFIG = {
  WEIGHTS: {
    proximity: 35,        // TOP PRIORITY — Austin/TX (35 pts max)
    genreBonus: 25,       // Metal, Rock, Hip-Hop, Rap (25 pts)
    followerCount: 20,    // Small/Medium only — caps at ~20k (20 pts max)
    recency: 10,          // Last post recency (10 pts)
    releaseCount: 10,    // Number of releases (10 pts)
    dataCompleteness: 10, // Profile filled (10 pts)
    engagement: 5,        // Contact signals (5 pts) — minor bonus
  },
  QUALIFIED_THRESHOLD: 60,
  // Geo-priority tiers
  AUSTIN_AREA_CITIES: [
    "austin", "round rock", "pflugerville", "cedar park", "georgetown",
    "san marcos", "kyle", "buda", "dripping springs", "hutto", "manor", "lakeway",
    "beecave", "westlake", "rollingwood", "spicewood", "bastrop", "lockhart",
    "elgin", "taylor", "del valle", "dripping", "直达", "austinites", "atx",
  ],
  TEXAS_CITIES: [
    "texas", "tx", "san antonio", "houston", "dallas", "fort worth", "elpaso",
    "amarillo", "laredo", "lubbock", "waco", "tyler", "beaumont", "port arthur",
    "corpus christi", "midland", "odessa", "abilene", "college station",
  ],
};

function calculateProximityScore(artist: any) {
  if (!artist.location && !artist.city) return 0;
  
  const locStr = `${artist.city || ""} ${artist.location || ""} ${artist.state || ""}`.toLowerCase();
  
  // 1. Austin Area (Highest)
  for (const city of SCORING_CONFIG.AUSTIN_AREA_CITIES) {
    if (locStr.includes(city)) {
      return SCORING_CONFIG.WEIGHTS.proximity;
    }
  }
  
  // 2. Texas (Medium)
  for (const city of SCORING_CONFIG.TEXAS_CITIES) {
    if (locStr.includes(city)) {
      return Math.round(SCORING_CONFIG.WEIGHTS.proximity * 0.5); // 10 pts
    }
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

  // Tier 1: Heavy metal, rock, hip-hop/rap — FULL BONUS (25pts)
  const tier1Genres = [
    // Metal subgenres
    "metal", "deathcore", "blackcore", "doom", "sludge", "stoner",
    "gothic", "symphonic", "power", "thrash", "groove", "metalcore",
    "prog metal", "progressive metal", "djent", "mathcore", "post-metal",
    "heavy metal", "traditional metal", "speed metal", "hair metal",
    "hardcore", "hard core", "hc",
    // Rock subgenres
    "rock", "alternative rock", "alt rock", "indie rock", "garage rock",
    "psychedelic", "psych rock", "southern rock", "blues rock", "classic rock",
    "hard rock", "punk", "post-punk", "emo", "shoegaze", "grunge",
    "industrial rock", "goth rock",
    // Hip-hop / Rap subgenres
    "hip hop", "hip-hop", "rap", "trap", "boom bap", "phonk",
    "drill", "cloud rap", "mumble rap", "gangsta rap", "conscious rap",
    "old school rap", "trap soul", "r&b", "rn'b",
  ];

  for (const kw of tier1Genres) {
    if (genreStr.includes(kw)) {
      return SCORING_CONFIG.WEIGHTS.genreBonus;
    }
  }

  // Tier 2: Any other valid genre — partial (10pts)
  if (genreStr.length > 2 && genreStr !== 'unknown' && genreStr !== 'n/a' && genreStr !== 'none') {
    return Math.round(SCORING_CONFIG.WEIGHTS.genreBonus * 0.4); // 10 pts
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
