#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Load .env before initializing any DB connections
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
    }
  }
}

const { withAgentRun, prisma, pool } = require("../src/lib/agent-runner");
const {
  parseLocationString,
  extractLocationFromText,
  isGarbageLocation,
  isAustinVenue,
} = require("../src/lib/location-parser");
const { calculateLeadScoreFromData } = require("../src/lib/scoring-core");

const getArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
};

const hasFlag = (name) => process.argv.includes(name);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchMusicBrainzLocation(artistName) {
  if (!artistName || artistName.length < 2) return null;
  // Clean event / tour suffixes
  const cleanName = artistName
    .replace(/:.*$/, "")
    .replace(/\s+and\s+.*$/i, "")
    .replace(/\s+Tour\b.*$/i, "")
    .trim();

  try {
    const url = `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(cleanName)}&fmt=json&limit=1`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "SpectralSoundworksScoring/1.0.0 (contact@spectralsoundworks.com)",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const artist = data.artists?.[0];
    if (!artist) return null;

    const beginArea = artist["begin-area"]?.name;
    const topArea = artist.area?.name;
    const country = artist.country;

    let candidate = null;
    if (beginArea && topArea && beginArea !== topArea) {
      candidate = `${beginArea}, ${topArea}`;
    } else if (beginArea) {
      candidate = country ? `${beginArea}, ${country}` : beginArea;
    } else if (topArea) {
      candidate = country && topArea !== country ? `${topArea}, ${country}` : topArea;
    }

    if (candidate) {
      return parseLocationString(candidate);
    }
  } catch (err) {
    // Network or rate limit error
  }
  return null;
}

async function scoreLead(lead) {
  const releaseCount = await prisma.release.count({
    where: { artistId: lead.artist.id },
  });

  const analyses = await prisma.trackAnalysis.findMany({
    where: { release: { artistId: lead.artist.id } },
    select: { moods: true, themes: true, rating: true },
  });

  const trackAnalysisStats =
    analyses.length > 0
      ? {
          uniqueMoods: [...new Set(analyses.flatMap((a) => a.moods))].length,
          uniqueThemes: [...new Set(analyses.flatMap((a) => a.themes))].length,
          maturityRatings: [...new Set(analyses.map((a) => a.rating).filter(Boolean))],
          hasAnalysis: true,
        }
      : undefined;

  const hasAustinActivity = (lead.activities || []).some((a) => isAustinVenue(a.note));
  const artistWithTie = {
    ...lead.artist,
    hasAustinVenueTie: hasAustinActivity,
  };

  return calculateLeadScoreFromData(artistWithTie, releaseCount, trackAnalysisStats);
}

function getTierName(score, artist, hasAustinActivity) {
  const loc = (artist.location || "").toLowerCase();
  const isAustin =
    hasAustinActivity ||
    loc.includes("austin") ||
    loc.includes("atx") ||
    loc.includes("round rock") ||
    loc.includes("pflugerville") ||
    loc.includes("cedar park");
  if (isAustin) return "Tier 1: Austin Metro (+35pts)";
  const isTx = (artist.state || "").toUpperCase() === "TX" || loc.includes("texas");
  if (isTx) return "Tier 2: Texas Regional (+15pts)";
  if (!artist.location) return "Tier 5: Unknown Location (0pts)";
  return "Tier 4: Out-of-State / Intl (+5pts)";
}

async function main() {
  const dryRun = hasFlag("--dry-run");
  const limitArg = getArg("--limit");
  const limit = limitArg ? parseInt(limitArg, 10) : null;
  const rescoreAll = hasFlag("--rescore-all") || true; // Default to true so all leads align with new brackets
  const enableMusicBrainz = hasFlag("--fetch-musicbrainz");

  console.log("📍 Artist Location Backfill & Re-scoring Agent");
  console.log(`Mode: ${dryRun ? "DRY RUN (no database changes)" : "LIVE"}`);
  if (limit) console.log(`Limit: ${limit} artists`);
  if (enableMusicBrainz) console.log(`MusicBrainz Fallback: Enabled (1 req/sec)`);
  console.log();

  const artists = await prisma.artist.findMany({
    include: {
      leads: {
        include: {
          activities: { select: { note: true, createdAt: true } },
        },
      },
    },
    take: limit || undefined,
    orderBy: { createdAt: "asc" },
  });

  console.log(`Loaded ${artists.length} artists from database.`);
  console.log();

  const stats = {
    total: artists.length,
    garbageCleaned: 0,
    existingParsed: 0,
    resolvedFromBio: 0,
    resolvedFromVenueActivity: 0,
    resolvedFromMusicBrainz: 0,
    stillMissing: 0,
    artistsUpdated: 0,
    leadsRescored: 0,
    tierBreakdownBefore: {},
    tierBreakdownAfter: {},
  };

  const pendingArtistUpdates = [];

  for (const artist of artists) {
    let currentLocation = artist.location;
    let isGarbage = false;

    // Record before tier for leads
    for (const lead of artist.leads) {
      const hasAustinActivity = lead.activities.some((a) => isAustinVenue(a.note));
      const tier = getTierName(lead.score || 0, artist, hasAustinActivity);
      stats.tierBreakdownBefore[tier] = (stats.tierBreakdownBefore[tier] || 0) + 1;
    }

    // Step A: Check if current location is garbage
    if (currentLocation && isGarbageLocation(currentLocation)) {
      stats.garbageCleaned++;
      currentLocation = null;
      isGarbage = true;
    }

    let parsed = null;
    let resolutionSource = null;

    // Step B: If current location is valid, parse it
    if (currentLocation) {
      parsed = parseLocationString(currentLocation);
      if (parsed) {
        if (!artist.city || !artist.state || !artist.country || artist.location !== parsed.formatted) {
          stats.existingParsed++;
          resolutionSource = "existing_parsed";
        }
      }
    }

    // Step C: If no location (or wiped as garbage), attempt extraction
    if (!parsed) {
      // 1. Try artist bio and handle
      const fromBio = extractLocationFromText(artist.bio || "", {
        artistName: artist.name,
        instagramHandle: artist.instagramHandle,
      });
      if (fromBio) {
        parsed = fromBio;
        stats.resolvedFromBio++;
        resolutionSource = "bio";
      }

      // 2. Try MusicBrainz if enabled
      if (!parsed && enableMusicBrainz) {
        await sleep(1000);
        const fromMB = await fetchMusicBrainzLocation(artist.name);
        if (fromMB) {
          parsed = fromMB;
          stats.resolvedFromMusicBrainz++;
          resolutionSource = "musicbrainz";
        }
      }
    }

    if (!parsed) {
      stats.stillMissing++;
    }

    // Determine if artist needs DB update
    const newLocation = parsed ? parsed.formatted : null;
    const newCity = parsed ? parsed.city : null;
    const newState = parsed ? parsed.state : null;
    const newCountry = parsed ? parsed.country : null;

    const needsUpdate =
      isGarbage ||
      artist.location !== newLocation ||
      artist.city !== newCity ||
      artist.state !== newState ||
      artist.country !== newCountry;

    if (needsUpdate) {
      stats.artistsUpdated++;
      pendingArtistUpdates.push({
        artist,
        newLocation,
        newCity,
        newState,
        newCountry,
        resolutionSource,
      });
    }
  }

  console.log("Analysis Complete:");
  console.log(`  Existing locations parsed to structured city/state: ${stats.existingParsed}`);
  console.log(`  Garbage locations wiped: ${stats.garbageCleaned}`);
  console.log(`  Locations resolved via Bio: ${stats.resolvedFromBio}`);
  console.log(`  Locations resolved via Austin Venue Activity: ${stats.resolvedFromVenueActivity}`);
  if (enableMusicBrainz) {
    console.log(`  Locations resolved via MusicBrainz: ${stats.resolvedFromMusicBrainz}`);
  }
  console.log(`  Still missing location: ${stats.stillMissing}`);
  console.log(`  Artists to update in DB: ${stats.artistsUpdated}`);
  console.log();

  // Apply Artist updates
  if (!dryRun) {
    console.log("Writing location updates to database...");
  }
  for (const update of pendingArtistUpdates) {
    if (!dryRun) {
      await prisma.artist.update({
        where: { id: update.artist.id },
        data: {
          location: update.newLocation,
          city: update.newCity,
          state: update.newState,
          country: update.newCountry,
        },
      });

      // Add activity note if location was newly resolved
      if (update.resolutionSource && update.newLocation) {
        for (const lead of update.artist.leads) {
          await prisma.activity.create({
            data: {
              leadId: lead.id,
              type: "NOTE",
              note: `[LOCATION-BACKFILL] Location set to "${update.newLocation}" (Source: ${update.resolutionSource})`,
            },
          });
        }
      }
    }

    // Update in-memory artist object for scoring (both live and dry-run)
    update.artist.location = update.newLocation;
    update.artist.city = update.newCity;
    update.artist.state = update.newState;
    update.artist.country = update.newCountry;
  }
  if (!dryRun) {
    console.log("✓ Artist updates committed.");
    console.log();
  }

  // Re-score leads
  console.log("Re-scoring leads under new proximity-dominated model...");
  const leadsToScore = rescoreAll
    ? artists.flatMap((a) => a.leads)
    : pendingArtistUpdates.flatMap((u) => u.artist.leads);

  console.log(`Leads to score: ${leadsToScore.length}`);

  for (const lead of leadsToScore) {
    const parentArtist = artists.find((a) => a.id === lead.artistId) || lead.artist;
    const scoreData = await scoreLead({ ...lead, artist: parentArtist });

    const hasAustinActivity = (lead.activities || []).some((a) => isAustinVenue(a.note));
    const tier = getTierName(scoreData.totalScore, parentArtist, hasAustinActivity);
    stats.tierBreakdownAfter[tier] = (stats.tierBreakdownAfter[tier] || 0) + 1;

    if (!dryRun) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          score: scoreData.totalScore,
          scoreRationale: scoreData.scoreRationale,
        },
      });
      stats.leadsRescored++;
    } else {
      stats.leadsRescored++;
    }
  }

  console.log();
  console.log("📊 Lead Tier Breakdown Comparison:");
  console.log("--- BEFORE BACKFILL ---");
  for (const [tier, count] of Object.entries(stats.tierBreakdownBefore)) {
    console.log(`  ${tier}: ${count} leads`);
  }
  console.log("--- AFTER BACKFILL ---");
  for (const [tier, count] of Object.entries(stats.tierBreakdownAfter)) {
    console.log(`  ${tier}: ${count} leads`);
  }

  console.log();
  if (dryRun) {
    console.log("⚠️  DRY RUN: No database changes were made. Run without --dry-run to commit.");
  } else {
    console.log(`✅ Success! Updated ${stats.artistsUpdated} artists and re-scored ${stats.leadsRescored} leads.`);
  }

  return stats;
}

withAgentRun(
  "backfill-locations",
  { dryRun: process.argv.includes("--dry-run") },
  main
)
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
