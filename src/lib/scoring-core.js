const SCORING_CONFIG = {
  WEIGHTS: {
    proximity: 35,
    genreBonus: 25,
    followerCount: 20,
    recency: 10,
    releaseCount: 10,
    dataCompleteness: 10,
    engagement: 5,
  },
  QUALIFIED_THRESHOLD: 60,
  RECENCY_DAYS: 180,
  MIN_RELEASES: 3,
  AUSTIN_AREA_CITIES: [
    "austin", "round rock", "pflugerville", "cedar park", "georgetown",
    "san marcos", "kyle", "buda", "dripping springs", "hutto", "manor", "lakeway",
    "beecave", "bee cave", "westlake", "rollingwood", "spicewood", "bastrop",
    "lockhart", "elgin", "taylor", "del valle", "dripping", "austinites", "atx",
  ],
  TEXAS_CITIES: [
    "texas", "tx", "san antonio", "houston", "dallas", "fort worth", "el paso",
    "elpaso", "amarillo", "laredo", "lubbock", "waco", "tyler", "beaumont",
    "port arthur", "corpus christi", "midland", "odessa", "abilene",
    "college station",
  ],
};

function calculateProximityScore(artist) {
  if (!artist.location && !artist.city && !artist.state) return 0;

  const locStr = `${artist.city || ""} ${artist.location || ""} ${artist.state || ""}`.toLowerCase();

  for (const city of SCORING_CONFIG.AUSTIN_AREA_CITIES) {
    if (locStr.includes(city)) return SCORING_CONFIG.WEIGHTS.proximity;
  }

  for (const city of SCORING_CONFIG.TEXAS_CITIES) {
    if (locStr.includes(city)) return Math.round(SCORING_CONFIG.WEIGHTS.proximity * 0.5);
  }

  return Math.round(SCORING_CONFIG.WEIGHTS.proximity * 0.2);
}

function calculateFollowerScore(followerCount) {
  if (!followerCount || followerCount === 0) return 0;

  if (followerCount < 50) return 5;
  if (followerCount <= 5000) return SCORING_CONFIG.WEIGHTS.followerCount;
  if (followerCount <= 20000) return Math.round(SCORING_CONFIG.WEIGHTS.followerCount * 0.8);
  if (followerCount <= 100000) return Math.round(SCORING_CONFIG.WEIGHTS.followerCount * 0.4);

  return 5;
}

function calculateRecencyScore(lastPostAt) {
  if (!lastPostAt) return 0;
  const daysSincePost = (Date.now() - new Date(lastPostAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePost > SCORING_CONFIG.RECENCY_DAYS) return 0;
  const ratio = 1 - daysSincePost / SCORING_CONFIG.RECENCY_DAYS;
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.recency);
}

function calculateReleaseScore(releaseCount) {
  if (!releaseCount) return 0;
  const ratio = Math.min(releaseCount / SCORING_CONFIG.MIN_RELEASES, 1);
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.releaseCount);
}

function calculateDataCompletenessScore(artist) {
  const fields = ["instagramHandle", "spotifyArtistId", "genre", "city", "bio"];
  const filledCount = fields.filter((field) => artist[field]).length;
  const ratio = filledCount / fields.length;
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.dataCompleteness);
}

function calculateEngagementScore(artist) {
  let points = 0;
  if (artist.instagramHandle) points += 2;
  if (artist.bio && artist.bio.length > 50) points += 1;
  if (artist.emails && artist.emails.length > 0) points += 1;
  if (artist.officialSiteUrl) points += 1;
  return Math.min(points, SCORING_CONFIG.WEIGHTS.engagement);
}

function calculateGenreBonus(artist) {
  if (!artist.genre) return 0;
  const genreStr = artist.genre.toLowerCase();

  const tier1Genres = [
    "metal", "deathcore", "blackcore", "doom", "sludge", "stoner",
    "gothic", "symphonic", "power", "thrash", "groove", "metalcore",
    "prog metal", "progressive metal", "djent", "mathcore", "post-metal",
    "heavy metal", "traditional metal", "speed metal", "hair metal",
    "hardcore", "hard core", "hc", "rock", "alternative rock", "alt rock",
    "indie rock", "garage rock", "psychedelic", "psych rock", "southern rock",
    "blues rock", "classic rock", "hard rock", "punk", "post-punk", "emo",
    "shoegaze", "grunge", "industrial rock", "goth rock", "hip hop",
    "hip-hop", "rap", "trap", "boom bap", "phonk", "drill", "cloud rap",
    "mumble rap", "gangsta rap", "conscious rap", "old school rap",
    "trap soul", "r&b", "rn'b",
  ];

  for (const keyword of tier1Genres) {
    if (genreStr.includes(keyword)) return SCORING_CONFIG.WEIGHTS.genreBonus;
  }

  if (genreStr.length > 2 && genreStr !== "unknown" && genreStr !== "n/a" && genreStr !== "none") {
    return Math.round(SCORING_CONFIG.WEIGHTS.genreBonus * 0.4);
  }

  return 0;
}

function calculateLeadScoreFromData(artist, releaseCount) {
  const proximityScore = calculateProximityScore(artist);
  const followerScore = calculateFollowerScore(artist.followerCount);
  const recencyScore = calculateRecencyScore(artist.lastPostAt);
  const releaseScore = calculateReleaseScore(releaseCount);
  const completenessScore = calculateDataCompletenessScore(artist);
  const engagementScore = calculateEngagementScore(artist);
  const genreBonus = calculateGenreBonus(artist);

  const rawScore =
    proximityScore +
    followerScore +
    recencyScore +
    releaseScore +
    completenessScore +
    engagementScore +
    genreBonus;
  const totalScore = Math.min(rawScore, 100);

  const rationales = [];
  if (proximityScore > 0) {
    const loc = artist.city || artist.location || artist.state || "unknown";
    rationales.push(`proximity: ${loc} (${proximityScore}pts)`);
  }
  if (followerScore > 0) {
    rationales.push(`${(artist.followerCount || 0).toLocaleString()} followers (${followerScore}pts)`);
  }
  if (recencyScore > 0 && artist.lastPostAt) {
    const daysAgo = Math.floor((Date.now() - new Date(artist.lastPostAt).getTime()) / (1000 * 60 * 60 * 24));
    rationales.push(`active posting (${daysAgo}d ago, ${recencyScore}pts)`);
  }
  if (releaseScore > 0) rationales.push(`${releaseCount} releases (${releaseScore}pts)`);
  if (completenessScore > 0) {
    rationales.push(`profile ${completenessScore * 10}% complete (${completenessScore}pts)`);
  }
  if (engagementScore > 0) rationales.push(`engagement signals (${engagementScore}pts)`);
  if (genreBonus > 0) rationales.push(`genre "${artist.genre}" (${genreBonus}pts)`);
  if (rawScore > totalScore) rationales.push(`capped at 100 from ${rawScore} raw pts`);

  const scoreRationale = rationales.length > 0 ? rationales.join("; ") : "No scoring data available";
  const isQualified = totalScore >= SCORING_CONFIG.QUALIFIED_THRESHOLD;

  return {
    totalScore,
    rawScore,
    score: totalScore,
    scoreRationale,
    isQualified,
    components: {
      proximityScore,
      followerScore,
      recencyScore,
      releaseScore,
      completenessScore,
      engagementScore,
      genreBonus,
    },
  };
}

module.exports = {
  SCORING_CONFIG,
  calculateLeadScoreFromData,
};
