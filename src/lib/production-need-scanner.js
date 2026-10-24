// src/lib/production-need-scanner.js
// Shared production need signal detection scanner for Spectral Soundworks.
// Identifies production-need signals across Instagram post captions, artist bio,
// and recent Spotify releases.
//
// AUTOMATED TIERS:
// - "PROBABLE" (+12pt): Specific mentions of studio, mixing, mastering, tracking, audio engineering
// - "POSSIBLE" (+8pt): Upcoming new music, release/drop mentions, recent Spotify releases, active music making
// - "NONE" (0pt): No matching signals

const FRESHNESS_DAYS = 45;
const RELEASE_RECENCY_DAYS = 180;
const RELEASE_SIGNAL_LABEL = "recent Spotify release activity";

const CAPTION_SIGNALS = [
  // PROBABLE: Specific mentions of studio, mixing, mastering, tracking, audio engineering
  {
    pattern: /\b(need|looking\s+for|searching\s+for|want|hiring|iso)\s+(a\s+)?(mix|mixer|mixing|engineer|producer|production|mastering|master|studio|recording|tracking)\b/i,
    label: "caption: seeking mixing/mastering/production help",
    tier: "PROBABLE",
    weight: 2,
  },
  {
    pattern: /\b(mix|master|record|produce|track)\s+(my|this|the|an?)\s+(?:new\s+)?(songs?|tracks?|albums?|eps?|projects?|records?|vocals?|drums?)\b/i,
    label: "caption: mix/master/record own music",
    tier: "PROBABLE",
    weight: 2,
  },
  {
    pattern: /\b(studio\s+session|in\s+the\s+studio|back\s+in\s+the\s+studio|hit\s+the\s+studio|at\s+the\s+studio|recording\s+studio|home\s+studio)\b/i,
    label: "caption: studio session mention",
    tier: "PROBABLE",
    weight: 2,
  },
  {
    pattern: /\b(tracking|track\s+(vocals?|drums?|guitars?|bass)|vocal\s+tracking|drum\s+tracking|cutting\s+(vocals?|tracks?)|recording\s+(session|vocals?|drums?))\b/i,
    label: "caption: tracking/recording mention",
    tier: "PROBABLE",
    weight: 2,
  },
  {
    pattern: /\b(mixing|mastering|audio\s+engineer(ing)?|sound\s+design|sound\s+engineer(ing)?|re-amp(ing)?)\b/i,
    label: "caption: mixing/mastering/engineering keyword",
    tier: "PROBABLE",
    weight: 2,
  },

  // POSSIBLE: Upcoming new music, release/drop mentions, active making
  {
    pattern: /\b(new\s+music|new\s+project|new\s+ep|new\s+album|new\s+single|new\s+song|new\s+track|upcoming\s+(release|drop|project|album|ep|single))\b/i,
    label: "caption: upcoming new music",
    tier: "POSSIBLE",
    weight: 1,
  },
  {
    pattern: /\b(drop(ping|s)?|release\s+date|out\s+now|available\s+now|releasing\s+soon|dropping\s+soon|pre-save|presave)\b/i,
    label: "caption: release/drop mention",
    tier: "POSSIBLE",
    weight: 1,
  },
  {
    pattern: /\b(working\s+on\s+(music|a\s+project|an\s+ep|an?\s+album|new\s+stuff)|making\s+(music|beats|tracks))\b/i,
    label: "caption: actively making music",
    tier: "POSSIBLE",
    weight: 1,
  },
  {
    pattern: /\b(vocals?|feature|collab|collaboration|verse)\b/i,
    label: "caption: feature/collab/vocal mention",
    tier: "POSSIBLE",
    weight: 1,
  },
];

const BIO_SIGNALS = [
  // PROBABLE: Specific mentions of studio, mixing, mastering, tracking
  {
    pattern: /\b(looking\s+for|need|want(ing)?|available\s+for|open\s+to|hire|hiring)\s+(a\s+)?(mix|mixing|engineer|producer|production|mastering|studio|tracking|recording|collaboration|collab)\b/i,
    label: "bio: seeking mixing/production",
    tier: "PROBABLE",
    weight: 2,
  },
  {
    pattern: /\b(mix|master|record|produce|track)\s+(my|songs?|tracks?|music|project|album|ep)\b/i,
    label: "bio: mix/master/record own music",
    tier: "PROBABLE",
    weight: 2,
  },
  {
    pattern: /\b(recording\s+studio|in\s+the\s+studio|home\s+studio)\b/i,
    label: "bio: studio mention",
    tier: "PROBABLE",
    weight: 2,
  },

  // POSSIBLE: Recording/indie artist, upcoming release
  {
    pattern: /\b(recording\s+artist|independent\s+artist|indie\s+artist|releasing\s+(music|soon))\b/i,
    label: "bio: recording/indie artist",
    tier: "POSSIBLE",
    weight: 1,
  },
  {
    pattern: /\b(upcoming\s+(ep|album|single|project)|new\s+(music|project|ep|album))\b/i,
    label: "bio: upcoming release",
    tier: "POSSIBLE",
    weight: 1,
  },
];

/**
 * Scan text against a set of regex rules and return unique hits.
 */
function scanText(text, rules) {
  if (!text || typeof text !== "string") return [];
  const found = [];
  for (const rule of rules) {
    if (rule.pattern.test(text)) {
      if (!found.some((h) => h.label === rule.label)) {
        found.push({ label: rule.label, weight: rule.weight, tier: rule.tier });
      }
    }
  }
  return found;
}

/**
 * Checks whether an existing manual qualification is still valid and unexpired (< 45 days).
 */
function isClearPreserved(currentLevel, approvedAt, now = new Date()) {
  const normalizedLevel = typeof currentLevel === "string" ? currentLevel.trim() : currentLevel;
  if ((normalizedLevel !== "CLEAR" && normalizedLevel !== "PROBABLE") || !approvedAt) return false;
  const approvedDate = approvedAt instanceof Date ? approvedAt : new Date(approvedAt);
  if (Number.isNaN(approvedDate.getTime())) return false;
  const ageDays = (now.getTime() - approvedDate.getTime()) / (1000 * 60 * 60 * 24);
  const CLOCK_SKEW_TOLERANCE_DAYS = 5 / (24 * 60);
  return ageDays >= -CLOCK_SKEW_TOLERANCE_DAYS && ageDays < FRESHNESS_DAYS;
}

/**
 * Scan lead data for production-need signals.
 *
 * Accepts either:
 *   scanLeadForProductionNeeds({ bio, captions, releases })
 * or
 *   scanLeadForProductionNeeds(leadOrArtist, posts, releases)
 *
 * AUTOMATED CLASSIFICATION:
 * - Specific mentions of studio, mixing, mastering, tracking -> "PROBABLE" (+12pt)
 * - Upcoming new music or release/drop mentions / active release -> "POSSIBLE" (+8pt)
 * - No signals -> "NONE" (0pt)
 *
 * @param {Object} input
 * @param {Array} [postsArg]
 * @param {Array} [releasesArg]
 * @returns {{ level: "PROBABLE" | "POSSIBLE" | "NONE", evidence: string[], source: Object, detectedAt: Date }}
 */
function scanLeadForProductionNeeds(input, postsArg, releasesArg) {
  let bio = "";
  let captions = [];
  let releases = [];

  if (input && (postsArg !== undefined || releasesArg !== undefined)) {
    bio = input.artist?.bio ?? input.bio ?? "";
    captions = postsArg || [];
    releases = releasesArg || [];
  } else if (input && typeof input === "object") {
    bio = input.bio ?? input.artist?.bio ?? "";
    captions = input.captions ?? input.instagramPosts ?? [];
    releases = input.releases ?? [];
  }

  const hits = [];

  // 1. Instagram captions (most recent 30 posts)
  const normalizedCaptions = Array.isArray(captions) ? captions.slice(0, 30) : [];
  for (const item of normalizedCaptions) {
    const text = typeof item === "string" ? item : item?.caption;
    if (text) {
      for (const m of scanText(text, CAPTION_SIGNALS)) {
        if (!hits.some((h) => h.label === m.label)) {
          hits.push(m);
        }
      }
    }
  }

  // 2. Artist bio
  if (bio) {
    for (const m of scanText(bio, BIO_SIGNALS)) {
      if (!hits.some((h) => h.label === m.label)) {
        hits.push(m);
      }
    }
  }

  // 3. Recent releases (within 180 days = active production cycle -> POSSIBLE)
  if (Array.isArray(releases)) {
    const cutoffDate = new Date(Date.now() - RELEASE_RECENCY_DAYS * 86400000);
    const recentRelease = releases.find((r) => {
      if (!r || !r.releaseDate) return false;
      const d = r.releaseDate instanceof Date ? r.releaseDate : new Date(r.releaseDate);
      return !Number.isNaN(d.getTime()) && d >= cutoffDate;
    });

    if (recentRelease) {
      const label = recentRelease.title
        ? `${RELEASE_SIGNAL_LABEL} (${recentRelease.title})`
        : RELEASE_SIGNAL_LABEL;
      if (!hits.some((h) => h.label === label)) {
        hits.push({ label, weight: 1, tier: "POSSIBLE" });
      }
    }
  }

  const hasProbable = hits.some((h) => h.tier === "PROBABLE");
  const hasPossible = hits.some((h) => h.tier === "POSSIBLE");

  let level = "NONE";
  if (hasProbable) {
    level = "PROBABLE";
  } else if (hasPossible) {
    level = "POSSIBLE";
  }

  const evidence = hits.map((h) => h.label);

  return {
    level,
    evidence,
    source: {
      type: "AUTOMATED_SCAN",
      signalCount: hits.length,
      scannedAt: new Date().toISOString(),
    },
    detectedAt: new Date(),
  };
}

module.exports = {
  FRESHNESS_DAYS,
  RELEASE_RECENCY_DAYS,
  RELEASE_SIGNAL_LABEL,
  CAPTION_SIGNALS,
  BIO_SIGNALS,
  scanText,
  isClearPreserved,
  scanLeadForProductionNeeds,
};
