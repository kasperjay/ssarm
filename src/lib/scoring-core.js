const {
  AUSTIN_AREA_CITIES,
  TEXAS_CITIES,
  parseLocationString,
  extractLocationFromText,
  isAustinVenue,
} = require("./location-parser");

const PRODUCTION_NEED_POINTS = {
  NONE: 0,
  POSSIBLE: 8,
  PROBABLE: 12,
  CLEAR: 12,
};
const FRESHNESS_DAYS = 45;

const SCORING_CONFIG = {
  WEIGHTS: {
    proximity: 35,
    proximityTexas: 25,
    proximityTouring: 15,
    proximityOutside: 5,
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
  AUSTIN_AREA_CITIES,
  TEXAS_CITIES,
  PRODUCTION_NEED_POINTS,
  FRESHNESS_DAYS,
};

/**
 * Determines the proximity tier and scoring parameters for an artist.
 * Austin area artists receive 35pts, Texas regional 25pts, touring acts playing Austin 15pts, outside Texas 5pts.
 */
function getProximityTier(artist) {
  if (!artist) {
    return {
      tier: "UNKNOWN",
      proximityScore: 0,
      baseScore: 0,
      maxSecondary: 100,
      label: "Unknown Location",
      hasVenueTie: false,
    };
  }

  // 1. Try explicit location fields
  const rawLoc = [artist.city, artist.state, artist.location].filter(Boolean).join(", ");
  let parsed = parseLocationString(rawLoc);

  // 2. If not found, try extracting from bio
  if (!parsed && artist.bio) {
    parsed = extractLocationFromText(artist.bio, {
      artistName: artist.name,
    });
  }

  // Check venue ties (explicit or from notes / location / bio)
  const hasVenueTie = Boolean(
    artist.hasAustinVenueTie === true ||
    (artist.location && isAustinVenue(artist.location)) ||
    (artist.bio && isAustinVenue(artist.bio)) ||
    (parsed && parsed.venueTie)
  );

  // Tier 1: Austin Metro Area (Austin & surrounding communities)
  if (parsed && parsed.isAustinArea) {
    return {
      tier: "AUSTIN",
      proximityScore: SCORING_CONFIG.WEIGHTS.proximity,
      baseScore: SCORING_CONFIG.WEIGHTS.proximity,
      maxSecondary: 65,
      label: parsed.formatted || "Austin Area",
      hasVenueTie,
    };
  }

  // Tier 2: Texas Regional (Outside Austin Metro)
  if (parsed && parsed.isTexas) {
    return {
      tier: "TEXAS",
      proximityScore: SCORING_CONFIG.WEIGHTS.proximityTexas,
      baseScore: SCORING_CONFIG.WEIGHTS.proximityTexas,
      maxSecondary: 75,
      label: hasVenueTie ? `${parsed.formatted} (Playing Austin)` : (parsed.formatted || "Texas"),
      hasVenueTie,
    };
  }

  // Tier 3: Non-Texas with confirmed upcoming/past Austin show (Touring)
  if (hasVenueTie) {
    return {
      tier: "TOURING",
      proximityScore: SCORING_CONFIG.WEIGHTS.proximityTouring,
      baseScore: SCORING_CONFIG.WEIGHTS.proximityTouring,
      maxSecondary: 85,
      label: `${parsed?.formatted || "Out-of-state"} (Touring Austin)`,
      hasVenueTie: true,
    };
  }

  // Tier 4: Known Location Outside Texas (No Austin connection)
  if (parsed && parsed.formatted) {
    return {
      tier: "OUTSIDE",
      proximityScore: SCORING_CONFIG.WEIGHTS.proximityOutside,
      baseScore: SCORING_CONFIG.WEIGHTS.proximityOutside,
      maxSecondary: 95,
      label: parsed.formatted,
      hasVenueTie: false,
    };
  }

  // Tier 5: Unknown Location
  return {
    tier: "UNKNOWN",
    proximityScore: 0,
    baseScore: 0,
    maxSecondary: 100,
    label: "Unknown Location",
    hasVenueTie: false,
  };
}

function calculateProximityScore(artist) {
  return getProximityTier(artist).proximityScore;
}

function calculateFollowerScore(followerCount) {
  if (typeof followerCount !== "number" || followerCount <= 0 || !Number.isFinite(followerCount)) return 0;

  if (followerCount < 100) return 0;
  if (followerCount < 500) return 8;
  if (followerCount <= 2500) return SCORING_CONFIG.WEIGHTS.followerCount;
  if (followerCount <= 5000) return 12;
  if (followerCount <= 10000) return 4;

  return 0;
}

function calculateRecencyScore(lastPostAt) {
  if (!lastPostAt) return 0;
  const daysSincePost = (Date.now() - new Date(lastPostAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePost > SCORING_CONFIG.RECENCY_DAYS) return 0;
  const ratio = 1 - daysSincePost / SCORING_CONFIG.RECENCY_DAYS;
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.recency);
}

function calculateReleaseScore(releaseCount) {
  if (typeof releaseCount !== "number" || releaseCount <= 0 || !Number.isFinite(releaseCount)) return 0;
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

function calculateLyricalRangeScore(analysisStats) {
  if (!analysisStats || !analysisStats.trackCount) return 0;
  const diversity = (analysisStats.moodCount || 0) + (analysisStats.themeCount || 0);
  if (diversity < 3) return 2;
  if (diversity < 6) return 5;
  if (diversity < 10) return 8;
  return 10;
}

function calculateContentMaturityScore(analysisStats) {
  if (!analysisStats || !analysisStats.trackCount) return 0;
  const matureCount = (analysisStats.ratingCounts?.PG13 || 0) + (analysisStats.ratingCounts?.R || 0);
  const ratio = matureCount / analysisStats.trackCount;
  if (ratio >= 0.5) return 5;
  if (ratio >= 0.25) return 3;
  return 0;
}

function calculateCommercialReadability(analysisStats) {
  if (analysisStats && analysisStats.trackCount > 0) return 5;
  return 0;
}

function calculateLeadScoreFromData(artist, releaseCount, trackAnalysisStats, productionNeed) {
  const tierInfo = getProximityTier(artist);
  const proximityScore = tierInfo.proximityScore;
  const followerScore = calculateFollowerScore(artist.followerCount);
  const recencyScore = calculateRecencyScore(artist.lastPostAt);
  const releaseScore = calculateReleaseScore(releaseCount);
  const completenessScore = calculateDataCompletenessScore(artist);
  const engagementScore = calculateEngagementScore(artist);
  const genreBonus = calculateGenreBonus(artist);
  const lyricalRangeScore = calculateLyricalRangeScore(trackAnalysisStats);
  const contentMaturityScore = calculateContentMaturityScore(trackAnalysisStats);
  const commercialReadabilityScore = calculateCommercialReadability(trackAnalysisStats);

  // Evaluate production need input
  let needLevel = "NONE";
  let needEvidence = [];
  let needApprovedAt = null;

  if (typeof productionNeed === "string") {
    needLevel = productionNeed.trim().toUpperCase();
  } else if (productionNeed && typeof productionNeed === "object") {
    if (productionNeed.level) needLevel = String(productionNeed.level).trim().toUpperCase();
    if (Array.isArray(productionNeed.evidence)) {
      needEvidence = productionNeed.evidence
        .filter((e) => typeof e === "string" && e.trim())
        .map((e) => e.trim());
    } else if (typeof productionNeed.evidence === "string" && productionNeed.evidence.trim()) {
      needEvidence = [productionNeed.evidence.trim()];
    }
    if (productionNeed.approvedAt) {
      needApprovedAt = productionNeed.approvedAt;
    }
  }

  let isExpired = false;
  if (needApprovedAt) {
    const approvedDate = needApprovedAt instanceof Date ? needApprovedAt : new Date(needApprovedAt);
    if (!Number.isNaN(approvedDate.getTime())) {
      const ageDays = (Date.now() - approvedDate.getTime()) / (1000 * 60 * 60 * 24);
      if (ageDays >= FRESHNESS_DAYS) {
        isExpired = true;
      }
    }
  }

  let productionNeedScore = 0;
  if (!isExpired) {
    if (needLevel === "CLEAR") {
      productionNeedScore = PRODUCTION_NEED_POINTS.CLEAR;
    } else if (needLevel === "PROBABLE") {
      productionNeedScore = PRODUCTION_NEED_POINTS.PROBABLE;
    } else if (needLevel === "POSSIBLE") {
      productionNeedScore = PRODUCTION_NEED_POINTS.POSSIBLE;
    }
  }

  // Additive model: sum of all components
  const rawScore = Math.max(
    0,
    proximityScore +
      followerScore +
      recencyScore +
      releaseScore +
      completenessScore +
      engagementScore +
      genreBonus +
      lyricalRangeScore +
      contentMaturityScore +
      commercialReadabilityScore +
      productionNeedScore
  );
  const totalScore = Math.min(rawScore, 100);

  // Proof of activity: at least one proof of active artist engagement
  const hasRecentPost = Boolean(
    artist.lastPostAt &&
      !Number.isNaN(new Date(artist.lastPostAt).getTime()) &&
      (Date.now() - new Date(artist.lastPostAt).getTime()) <= SCORING_CONFIG.RECENCY_DAYS * 86400000
  );
  const hasReleases = typeof releaseCount === "number" && releaseCount > 0;
  const hasVenueTie = Boolean(tierInfo.hasVenueTie);
  const hasProductionNeed = productionNeedScore > 0;
  const hasTrackAnalysis = Boolean(
    trackAnalysisStats &&
      ((trackAnalysisStats.trackCount && trackAnalysisStats.trackCount > 0) || trackAnalysisStats.hasAnalysis)
  );

  const hasActivityProof = hasRecentPost || hasReleases || hasVenueTie || hasProductionNeed || hasTrackAnalysis;
  const isQualified = totalScore >= SCORING_CONFIG.QUALIFIED_THRESHOLD && hasActivityProof;

  const activityProofs = [];
  if (hasReleases) activityProofs.push(`${releaseCount} release${releaseCount === 1 ? "" : "s"}`);
  if (hasRecentPost) activityProofs.push("active posting");
  if (hasVenueTie) activityProofs.push("Austin venue tie");
  if (hasProductionNeed) activityProofs.push(`production need ${needLevel}`);
  if (hasTrackAnalysis) activityProofs.push("track analysis");

  const rationales = [];
  if (tierInfo.tier === "AUSTIN") {
    rationales.push(`Austin-local proximity: ${tierInfo.label} (+${proximityScore}pts)`);
  } else if (tierInfo.tier === "TEXAS") {
    rationales.push(`Texas regional proximity: ${tierInfo.label} (+${proximityScore}pts)`);
  } else if (tierInfo.tier === "TOURING") {
    rationales.push(`Touring show in Austin: ${tierInfo.label} (+${proximityScore}pts)`);
  } else if (tierInfo.tier === "OUTSIDE") {
    rationales.push(`Out-of-state location: ${tierInfo.label} (+${proximityScore}pts)`);
  } else {
    rationales.push("Location unknown (+0pts)");
  }

  if (genreBonus > 0) rationales.push(`genre "${artist.genre}" (+${genreBonus}pts)`);
  if (followerScore > 0) {
    rationales.push(`${(artist.followerCount || 0).toLocaleString()} followers (+${followerScore}pts)`);
  } else if (typeof artist.followerCount === "number" && artist.followerCount > 10000) {
    rationales.push(`${artist.followerCount.toLocaleString()} followers (0pts - established audience)`);
  }
  if (recencyScore > 0 && artist.lastPostAt) {
    const daysAgo = Math.floor((Date.now() - new Date(artist.lastPostAt).getTime()) / (1000 * 60 * 60 * 24));
    rationales.push(`active posting (${daysAgo}d ago, +${recencyScore}pts)`);
  }
  if (releaseScore > 0) rationales.push(`${releaseCount} releases (+${releaseScore}pts)`);
  if (completenessScore > 0) {
    rationales.push(`profile ${completenessScore * 10}% complete (+${completenessScore}pts)`);
  }
  if (engagementScore > 0) rationales.push(`engagement signals (+${engagementScore}pts)`);
  if (lyricalRangeScore > 0 && trackAnalysisStats && trackAnalysisStats.trackCount > 0) {
    rationales.push(`lyrical range (${trackAnalysisStats.moodCount}moods/${trackAnalysisStats.themeCount}themes, +${lyricalRangeScore}pts)`);
  }
  if (contentMaturityScore > 0) rationales.push(`content maturity (+${contentMaturityScore}pts)`);
  if (commercialReadabilityScore > 0) rationales.push(`sync-ready catalog (+${commercialReadabilityScore}pts)`);

  if (productionNeedScore > 0) {
    const evText = needEvidence.length > 0 ? `: ${needEvidence.join(", ")}` : "";
    rationales.push(`production need ${needLevel} (+${productionNeedScore}pts${evText})`);
  } else if (isExpired && (needLevel === "PROBABLE" || needLevel === "CLEAR" || needLevel === "POSSIBLE")) {
    rationales.push(`production need ${needLevel} expired (0pts)`);
  }

  if (rawScore > totalScore) {
    rationales.push(`capped at 100 from ${rawScore} raw pts`);
  }

  if (totalScore >= SCORING_CONFIG.QUALIFIED_THRESHOLD && !hasActivityProof) {
    rationales.push("unqualified: requires activity proof (recent post, release, venue tie, or production need)");
  }

  const scoreRationale = rationales.length > 0 ? rationales.join("; ") : "No scoring data available";

  return {
    totalScore,
    rawScore,
    score: totalScore,
    scoreRationale,
    isQualified,
    hasActivityProof,
    activityProofs,
    components: {
      proximityScore,
      followerScore,
      recencyScore,
      releaseScore,
      completenessScore,
      engagementScore,
      genreBonus,
      lyricalRangeScore,
      contentMaturityScore,
      commercialReadabilityScore,
      productionNeedScore,
    },
  };
}

module.exports = {
  SCORING_CONFIG,
  PRODUCTION_NEED_POINTS,
  FRESHNESS_DAYS,
  calculateLeadScoreFromData,
  calculateProximityScore,
  getProximityTier,
  calculateLyricalRangeScore,
  calculateContentMaturityScore,
  calculateCommercialReadability,
};
