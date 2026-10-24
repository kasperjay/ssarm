#!/usr/bin/env node

/**
 * scripts/clean-artist-locations.js
 *
 * Audits all artists in the database, removes false "Austin, TX" locations
 * assigned to touring/out-of-town artists, updates locations from bios/MusicBrainz,
 * and re-scores all affected leads using the unified scoring core.
 *
 * Usage:
 *   node scripts/clean-artist-locations.js --dry-run
 *   node scripts/clean-artist-locations.js --live
 *   node scripts/clean-artist-locations.js --live --fetch-musicbrainz
 */

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

const args = process.argv.slice(2);
const isLive = args.includes("--live");
const isDryRun = !isLive || args.includes("--dry-run");
const fetchMusicBrainz = args.includes("--fetch-musicbrainz");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchMusicBrainzLocation(artistName) {
  try {
    const q = encodeURIComponent(`artist:"${artistName}"`);
    const res = await fetch(
      `https://musicbrainz.org/ws/2/artist/?query=${q}&limit=3&fmt=json`,
      {
        headers: {
          "User-Agent": "SpectralSoundworks/1.0 (https://spectralsound.works)",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const artist = (data.artists || []).find((a) => (a.score ?? 0) >= 75);
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
    // Network / timeout
  }
  return null;
}

async function scoreLead(lead, updatedArtist) {
  const releaseCount = await prisma.release.count({
    where: { artistId: updatedArtist.id },
  });

  const analyses = await prisma.trackAnalysis.findMany({
    where: { release: { artistId: updatedArtist.id } },
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
    ...updatedArtist,
    hasAustinVenueTie: hasAustinActivity,
  };

  return calculateLeadScoreFromData(artistWithTie, releaseCount, trackAnalysisStats);
}

async function main() {
  console.log("=== Artist Location Audit & Correction Agent ===");
  console.log(`Execution Mode: ${isDryRun ? "DRY RUN (No changes will be written)" : "LIVE (Writing to Database)"}`);
  if (limit) console.log(`Limit: ${limit} artists`);
  if (fetchMusicBrainz) console.log("MusicBrainz API Fallback: ENABLED");
  console.log();

  const artists = await prisma.artist.findMany({
    select: {
      id: true,
      name: true,
      location: true,
      city: true,
      state: true,
      country: true,
      bio: true,
      instagramHandle: true,
      leads: {
        select: {
          id: true,
          score: true,
          status: true,
          activities: {
            where: { type: "NOTE" },
            select: { note: true },
          },
        },
      },
    },
    take: limit || undefined,
    orderBy: { createdAt: "asc" },
  });

  console.log(`Loaded ${artists.length} artists from PostgreSQL.\n`);

  const stats = {
    total: artists.length,
    updatedBioLocation: 0,
    updatedMusicBrainz: 0,
    clearedFalseAustin: 0,
    keptGenuineAustin: 0,
    keptExistingNonAustin: 0,
    keptUnknown: 0,
    leadsRescored: 0,
  };

  const sampleUpdates = [];

  for (let i = 0; i < artists.length; i++) {
    const a = artists[i];
    const prevLocation = a.location;
    const isPrevAustin = Boolean(
      (a.location && a.location.toLowerCase().includes("austin")) ||
      (a.city && a.city.toLowerCase().includes("austin"))
    );

    let newLocation = null;
    let newCity = null;
    let newState = null;
    let newCountry = null;
    let resolutionSource = "none";

    // 1. Check bio for explicit location declaration
    const bioExtracted = a.bio ? extractLocationFromText(a.bio, { artistName: a.name, instagramHandle: a.instagramHandle }) : null;
    if (bioExtracted && bioExtracted.formatted) {
      newLocation = bioExtracted.formatted;
      newCity = bioExtracted.city;
      newState = bioExtracted.state;
      newCountry = bioExtracted.country;
      resolutionSource = "bio";
    }

    // 2. If no bio location, check Instagram handle hints
    if (!newLocation && a.instagramHandle) {
      const handleLower = a.instagramHandle.toLowerCase();
      if (handleLower.includes("atx") || handleLower.includes("austin")) {
        newLocation = "Austin, TX";
        newCity = "Austin";
        newState = "TX";
        newCountry = "USA";
        resolutionSource = "handle_atx";
      } else if (handleLower.includes("fromtexas") || /_tx$|tx\d+$/.test(handleLower)) {
        newLocation = "Texas, USA";
        newCity = null;
        newState = "TX";
        newCountry = "USA";
        resolutionSource = "handle_tx";
      }
    }

    // 3. If no bio or handle location, check MusicBrainz if enabled
    if (!newLocation && fetchMusicBrainz) {
      await sleep(1000);
      const mbLoc = await fetchMusicBrainzLocation(a.name);
      if (mbLoc && mbLoc.formatted) {
        newLocation = mbLoc.formatted;
        newCity = mbLoc.city;
        newState = mbLoc.state;
        newCountry = mbLoc.country;
        resolutionSource = "musicbrainz";
      }
    }

    // 4. If still no location, check if existing location was valid non-Austin
    if (!newLocation && a.location && !isPrevAustin) {
      const parsedExisting =
        parseLocationString(a.location) ||
        parseLocationString([a.city, a.state].filter(Boolean).join(", "));
      if (parsedExisting && !parsedExisting.isAustinArea) {
        newLocation = parsedExisting.formatted;
        newCity = parsedExisting.city;
        newState = parsedExisting.state;
        newCountry = parsedExisting.country;
        resolutionSource = "existing_non_austin";
      } else if (!isGarbageLocation(a.location) && /[A-Za-z]/.test(a.location)) {
        // Keep non-garbage existing non-Austin location
        newLocation = a.location;
        newCity = a.city;
        newState = a.state;
        newCountry = a.country;
        resolutionSource = "existing_non_austin";
      }
    }

    // 5. If previously marked Austin, but NO bio/handle/MB evidence says Austin:
    // This was a false Austin assignment from venue gig ingestion!
    // Clear location fields to null.
    if (!newLocation && isPrevAustin) {
      newLocation = null;
      newCity = null;
      newState = null;
      newCountry = null;
      resolutionSource = "cleared_false_austin";
    }

    // Classify changes
    const changed =
      newLocation !== a.location ||
      newCity !== a.city ||
      newState !== a.state ||
      newCountry !== a.country;

    if (resolutionSource === "bio") {
      if (newLocation && newLocation.toLowerCase().includes("austin")) {
        stats.keptGenuineAustin++;
      } else {
        stats.updatedBioLocation++;
      }
    } else if (resolutionSource === "handle_atx") {
      stats.keptGenuineAustin++;
    } else if (resolutionSource === "musicbrainz") {
      stats.updatedMusicBrainz++;
    } else if (resolutionSource === "existing_non_austin") {
      stats.keptExistingNonAustin++;
    } else if (resolutionSource === "cleared_false_austin") {
      stats.clearedFalseAustin++;
    } else {
      stats.keptUnknown++;
    }

    if (changed) {
      if (sampleUpdates.length < 35 || sampleUpdates.length % 20 === 0) {
        sampleUpdates.push({
          name: a.name,
          before: a.location || "(null)",
          after: newLocation || "(null)",
          source: resolutionSource,
        });
      }

      if (!isDryRun) {
        // Update Artist in PostgreSQL
        await prisma.artist.update({
          where: { id: a.id },
          data: {
            location: newLocation,
            city: newCity,
            state: newState,
            country: newCountry,
          },
        });

        // Re-score all leads for this artist
        const updatedArtist = {
          ...a,
          location: newLocation,
          city: newCity,
          state: newState,
          country: newCountry,
        };

        for (const lead of a.leads) {
          const scoreResult = await scoreLead(lead, updatedArtist);
          await prisma.lead.update({
            where: { id: lead.id },
            data: { score: scoreResult.totalScore },
          });
          stats.leadsRescored++;
        }
      }
    }
  }

  console.log("=== Audit Results Summary ===");
  console.log(`Total Artists Analyzed:               ${stats.total}`);
  console.log(`Updated to Real Home Location (Bio):  ${stats.updatedBioLocation}`);
  console.log(`Updated from MusicBrainz:             ${stats.updatedMusicBrainz}`);
  console.log(`Cleared False "Austin, TX" to null:   ${stats.clearedFalseAustin}`);
  console.log(`Confirmed Genuine Austin (Bio/Handle):${stats.keptGenuineAustin}`);
  console.log(`Kept Existing Non-Austin:             ${stats.keptExistingNonAustin}`);
  console.log(`Unknown Location (Preserved):         ${stats.keptUnknown}`);
  if (!isDryRun) {
    console.log(`Leads Re-scored in DB:                ${stats.leadsRescored}`);
  }
  console.log();

  console.log(`Sample Modifications (${sampleUpdates.length} shown):`);
  sampleUpdates.forEach((u) => {
    console.log(`  • ${u.name.padEnd(25)} : ${u.before.padEnd(16)} -> ${u.after.padEnd(16)} [${u.source}]`);
  });

  console.log();
  if (isDryRun) {
    console.log("DRY RUN COMPLETE. No database mutations occurred.");
    console.log("To apply these changes, run with: node scripts/clean-artist-locations.js --live");
  } else {
    console.log("LIVE EXECUTION COMPLETE. Database and lead scores have been updated.");
  }
}

main()
  .catch((err) => {
    console.error("FATAL ERROR:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (pool) await pool.end();
  });
