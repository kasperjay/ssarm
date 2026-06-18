#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { withAgentRun, prisma, pool } = require("../src/lib/agent-runner");

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

const MXM_API_KEY = process.env.MUSIXMATCH_API_KEY;
const MXM_BASE = "https://api.musixmatch.com/ws/1.1";

const hasFlag = (name) => process.argv.includes(name);
const getArg = (name) => {
  const i = process.argv.indexOf(name);
  return i === -1 ? null : process.argv[i + 1] ?? null;
};

async function mxmGet(endpoint, params) {
  const url = new URL(`${MXM_BASE}/${endpoint}`);
  url.searchParams.set("apikey", MXM_API_KEY);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  }
  const res = await fetch(url.toString());
  if (!res.ok) return null;
  return res.json();
}

async function mxmPost(endpoint, body) {
  const url = new URL(`${MXM_BASE}/${endpoint}`);
  url.searchParams.set("apikey", MXM_API_KEY);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) return null;
  return res.json();
}

async function getLyricsBySpotifyId(spotifyTrackId) {
  const data = await mxmGet("track.lyrics.get", { track_spotify_id: spotifyTrackId });
  if (!data?.message?.body?.lyrics) return null;
  const lyrics = data.message.body.lyrics;
  return {
    lyricsBody: lyrics.lyrics_body || "",
    explicit: lyrics.explicit === 1,
  };
}

async function getAnalysisByCommongrackId(commontrackId) {
  const data = await mxmGet("track.lyrics.analysis.get", { commontrack_id: commontrackId });
  if (!data?.message?.body?.analysis) return null;
  const a = data.message.body.analysis;
  return {
    moods: (a.moods || []).map((m) => m.mood || m).filter(Boolean),
    themes: (a.themes || []).map((t) => t.theme || t).filter(Boolean),
    entities: a.entities?.entity_list || null,
    rating: a.rating || null,
    explicit: a.explicit === 1 ? true : a.explicit === 0 ? false : null,
    raw: a,
  };
}

async function searchTrack(artistName, trackTitle) {
  const data = await mxmGet("track.search", {
    q_artist: artistName,
    q_track: trackTitle,
    f_has_lyrics: "1",
    page_size: "3",
    s_track_rating: "desc",
  });
  if (!data?.message?.body?.track_list?.length) return null;
  const track = data.message.body.track_list[0].track;
  return {
    commontrack_id: track.commontrack_id,
    track_id: track.track_id,
    artist_id: track.artist_id,
    track_name: track.track_name,
  };
}

async function enrichRelease(release, dryRun) {
  const artist = await prisma.artist.findUnique({ where: { id: release.artistId } });
  if (!artist) return null;

  let analysis = null;
  let mxmTrackId = null;
  let mxmArtistId = null;

  if (release.spotifyTrackId) {
    const lyrics = await getLyricsBySpotifyId(release.spotifyTrackId);
    if (lyrics) {
      const trackMatch = await searchTrack(artist.name, release.title);
      if (trackMatch) {
        mxmTrackId = trackMatch.track_id;
        mxmArtistId = trackMatch.artist_id;
        analysis = await getAnalysisByCommongrackId(trackMatch.commontrack_id);
      }
    }
  }

  if (!analysis) {
    const trackMatch = await searchTrack(artist.name, release.title);
    if (trackMatch) {
      mxmTrackId = trackMatch.track_id;
      mxmArtistId = trackMatch.artist_id;
      analysis = await getAnalysisByCommongrackId(trackMatch.commontrack_id);
    }
  }

  if (!analysis) {
    return { releaseId: release.id, status: "no_analysis_data" };
  }

  if (!dryRun) {
    await prisma.trackAnalysis.upsert({
      where: { releaseId: release.id },
      create: {
        releaseId: release.id,
        moods: analysis.moods,
        themes: analysis.themes,
        entities: analysis.entities,
        explicit: analysis.explicit,
        rating: analysis.rating,
        mxmTrackId,
        mxmArtistId,
        rawPayload: analysis.raw || null,
      },
      update: {
        moods: analysis.moods,
        themes: analysis.themes,
        entities: analysis.entities,
        explicit: analysis.explicit,
        rating: analysis.rating,
        mxmTrackId,
        mxmArtistId,
        rawPayload: analysis.raw || null,
      },
    });
  }

  return {
    releaseId: release.id,
    status: "enriched",
    trackTitle: release.title,
    moods: analysis.moods.length,
    themes: analysis.themes.length,
  };
}

async function main() {
  const dryRun = hasFlag("--dry-run");
  const limitArg = getArg("--limit");
  const limit = limitArg ? parseInt(limitArg, 10) : 50;
  const forceAll = hasFlag("--force-all");

  if (!MXM_API_KEY) {
    console.error("MUSIXMATCH_API_KEY not set in .env");
    process.exit(1);
  }

  console.log("🎵 Lyrics & Analysis Enrichment Agent");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"} | Limit: ${limit}`);
  console.log();

  let releases;
  if (forceAll) {
    releases = await prisma.release.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
    });
  } else {
    const analyzedIds = (await prisma.trackAnalysis.findMany({ select: { releaseId: true } }))
      .map((r) => r.releaseId);
    releases = await prisma.release.findMany({
      where: {
        id: { notIn: analyzedIds },
        spotifyTrackId: { not: null },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    if (releases.length === 0) {
      console.log("  All releases with Spotify IDs already have analysis data.");
      console.log("  Use --force-all to re-process everything.");
      return { processedCount: 0 };
    }
  }

  console.log(`Found ${releases.length} releases to enrich.\n`);

  let enriched = 0;
  let noData = 0;
  let errors = 0;

  for (let i = 0; i < releases.length; i++) {
    const release = releases[i];
    const artist = await prisma.artist.findUnique({
      where: { id: release.artistId },
      select: { name: true },
    });
    const label = artist ? `${artist.name} — "${release.title}"` : `"${release.title}"`;

    try {
      process.stdout.write(`  [${i + 1}/${releases.length}] ${label.substring(0, 65)}... `);
      const result = await enrichRelease(release, dryRun);

      if (result.status === "enriched") {
        process.stdout.write(`✓ (${result.moods} moods, ${result.themes} themes)\n`);
        enriched++;
      } else {
        process.stdout.write("✗ no analysis data\n");
        noData++;
      }

      if (!dryRun && i < releases.length - 1) {
        await new Promise((r) => setTimeout(r, 300));
      }
    } catch (err) {
      process.stdout.write(`✗ ${err.message}\n`);
      errors++;
    }
  }

  console.log(`\n📊 Results:`);
  console.log(`  Enriched: ${enriched}`);
  console.log(`  No data:  ${noData}`);
  console.log(`  Errors:   ${errors}`);

  if (dryRun) console.log("\n⚠️  DRY RUN: No records written to database");

  return { processedCount: enriched };
}

withAgentRun("enrich-analysis", { dryRun: hasFlag("--dry-run") }, main)
  .catch((err) => console.error("Fatal Error:", err))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
