#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { withAgentRun, prisma, pool } = require("../src/lib/agent-runner");

// Load .env
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
      const value = rawValue.replace(/^['"]|['"]$/g, "");
      process.env[key] = value;
    }
  }
}

const getArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
};

const hasFlag = (name) => process.argv.includes(name);

// Base URL for API calls
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";


// Configuration
const STALE_INSTAGRAM_DAYS = 60;  // Posts older than 60 days
const STALE_RELEASES_MONTHS = 6;  // No releases in 6 months
const FOLLOWER_DROP_THRESHOLD = 0.1; // 10% drop = concerning

async function detectStaleInstagram(artist) {
  if (!artist.lastPostAt) return null;
  
  const daysSincePost = (Date.now() - new Date(artist.lastPostAt).getTime()) / (1000 * 60 * 60 * 24);
  if (daysSincePost > STALE_INSTAGRAM_DAYS) {
    return {
      type: "stale_instagram",
      reason: `Last post ${Math.floor(daysSincePost)} days ago`,
      severity: daysSincePost > 180 ? "high" : "medium",
    };
  }
  return null;
}

async function detectStaleReleases(artist, releaseCount) {
  const releases = await prisma.release.findMany({
    where: { artistId: artist.id },
    orderBy: { releaseDate: "desc" },
    take: 1,
  });

  if (releases.length === 0) {
    return {
      type: "no_releases",
      reason: "No releases in database",
      severity: "medium",
    };
  }

  const lastRelease = releases[0];
  if (!lastRelease.releaseDate) return null;

  const monthsSinceRelease = (Date.now() - new Date(lastRelease.releaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  if (monthsSinceRelease > STALE_RELEASES_MONTHS) {
    return {
      type: "stale_releases",
      reason: `Last release ${Math.floor(monthsSinceRelease)} months ago`,
      severity: monthsSinceRelease > 12 ? "high" : "medium",
    };
  }
  return null;
}

async function checkEngagementDrop(artist) {
  // Check Activity log for follower count history
  const activities = await prisma.activity.findMany({
    where: {
      lead: { artistId: artist.id },
      type: "NOTE",
      note: { contains: "followers:" },
    },
    orderBy: { occurredAt: "desc" },
    take: 2,
  });

  if (activities.length < 2) return null;

  // Note: This is a simplified check. In production, would store follower history separately
  // For now, just check if current count is suspiciously low
  if (artist.followerCount && artist.followerCount < 100 && artist.lastPostAt) {
    const daysSincePost = (Date.now() - new Date(artist.lastPostAt).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSincePost > 30) {
      return {
        type: "low_engagement",
        reason: `Low followers (${artist.followerCount}) + inactive (${Math.floor(daysSincePost)}d)`,
        severity: "low",
      };
    }
  }

  return null;
}

async function enrichArtist(artist, dryRun = false) {
  const checks = [];
  
  // Check for stale Instagram
  const staleIG = await detectStaleInstagram(artist);
  if (staleIG) checks.push(staleIG);

  // Check for stale releases
  const releaseCount = await prisma.release.count({ where: { artistId: artist.id } });
  const staleReleases = await detectStaleReleases(artist, releaseCount);
  if (staleReleases) checks.push(staleReleases);

  // Check for engagement drops
  const engagementDrop = await checkEngagementDrop(artist);
  if (engagementDrop) checks.push(engagementDrop);

  if (checks.length === 0) {
    return { artistId: artist.id, status: "healthy", checks: [] };
  }

  // Log findings
  if (!dryRun) {
    const lead = await prisma.lead.findFirst({
      where: { artistId: artist.id },
    });

    if (lead) {
      for (const check of checks) {
        await prisma.activity.create({
          data: {
            leadId: lead.id,
            type: "NOTE",
            note: `[ENRICHMENT] ${check.type}: ${check.reason} (severity: ${check.severity})`,
          },
        });
      }
    }
  }

  return { artistId: artist.id, status: "needs_refresh", checks };
}

async function getArtistsToEnrich(options) {
  const { limit = 100 } = options;
  
  // Exclude anything updated in the last 10 minutes to avoid batch overlap
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

  return prisma.artist.findMany({
    where: {
      updatedAt: { lt: tenMinutesAgo },
    },
    take: limit,
    orderBy: { updatedAt: "asc" },
  });
}

// â”€â”€â”€ Location backfill â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function fixArtistLocations(options = {}) {
  const { limit = 100, dryRun = false, skipGoogle = false } = options;

  // Because scripts/ is CJS, we use the ingest API as a bridge instead of
  // importing location.ts directly. This keeps the script dependency-light.

  const artists = await prisma.artist.findMany({
    where: {
      OR: [
        { location: null },
        { genre: null },
        { bio: null },
      ],
    },
    take: limit,
    orderBy: { updatedAt: "asc" },
  });

  console.log(`\nðŸ” Found ${artists.length} artists missing location, genre, or bio.\n`);
  if (dryRun) {
    for (const a of artists) {
      const missing = [!a.location && "location", !a.genre && "genre", !a.bio && "bio"].filter(Boolean);
      console.log(`  [DRY RUN] Would enrich "${a.name}" (missing: ${missing.join(", ")})`);
    }
    return;
  }

  let updated = 0;
  let failed = 0;

  for (const artist of artists) {
    try {
      const missing = [!artist.location && "location", !artist.genre && "genre", !artist.bio && "bio"].filter(Boolean);
      process.stdout.write(`  Enriching "${artist.name}" (missing: ${missing.join(", ")})...`);

      // Re-ingest via API which runs the full enrichment pipeline
      const res = await fetch(`${baseUrl}/api/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist: {
            name: artist.name,
            instagramHandle: artist.instagramHandle,
            spotifyArtistId: artist.spotifyArtistId,
            location: artist.location,
            genre: artist.genre,
            bio: artist.bio,
            officialSiteUrl: artist.officialSiteUrl,
          },
          skipInstagramFetch: true,
          skipSpotifyFetch: true,
          isDiscoveryImport: skipGoogle,
        }),
      });

      if (res.ok) {
        process.stdout.write(" âœ“\n");
        updated++;
      } else {
        const errText = await res.text();
        process.stdout.write(` âœ— (${res.status}: ${errText.substring(0, 80)})\n`);
        failed++;
      }

      // MusicBrainz rate limit: 1 req/sec. The pipeline itself also delays,
      // but we add extra breathing room here between artists.
      await new Promise((r) => setTimeout(r, 1500));
    } catch (err) {
      process.stdout.write(` âœ— (${err.message})\n`);
      failed++;
    }
  }

  console.log(`\nðŸ“ Location/Genre/Bio Backfill: ${updated} updated, ${failed} failed`);
}

async function main() {
  const dryRun = hasFlag("--dry-run");
  const fixLocations = hasFlag("--fix-locations");
  const skipGoogle = hasFlag("--no-google");
  const limitArg = getArg("--limit");
  const limit = limitArg ? parseInt(limitArg, 10) : 100;

  console.log("ðŸ“Š Data Enrichment & Staleness Agent");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"} | Limit: ${limit}`);
  console.log();

  // â”€â”€ Location / Genre / Bio backfill mode â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (fixLocations) {
    console.log("ðŸ“ Running location/genre/bio backfill...");
    if (skipGoogle) console.log("   (Skipping Google/homepage stages â€” --no-google)");
    await fixArtistLocations({ limit, dryRun, skipGoogle });
    return { processedCount: 0 };
  }

  // â”€â”€ Normal staleness check mode â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const artists = await getArtistsToEnrich({ limit });

  if (artists.length === 0) {
    console.log("âœ“ No artists to enrich");
    return { processedCount: 0 };
  }

  console.log(`Checking ${artists.length} artists for stale data...`);
  console.log();

  const results = {
    total: artists.length,
    healthy: 0,
    needsRefresh: 0,
    refreshed: 0,
    failed: 0,
    staleInstagram: 0,
    staleReleases: 0,
    lowEngagement: 0,
    errors: 0,
  };

  for (const artist of artists) {
    try {
      const enrichResult = await enrichArtist(artist, dryRun);

      if (enrichResult.status === "healthy") {
        results.healthy++;
        
        // No refresh needed, artist is already healthy
      } else {
        results.needsRefresh++;
        
        for (const check of enrichResult.checks) {
          if (check.type === "stale_instagram") results.staleInstagram++;
          if (check.type === "stale_releases") results.staleReleases++;
          if (check.type === "low_engagement") results.lowEngagement++;
        }

        if (!dryRun) {
          try {
            process.stdout.write(`  Refreshing artist "${artist.name}"... `);
            const res = await fetch(`${baseUrl}/api/ingest`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                artist: {
                  name: artist.name,
                  instagramHandle: artist.instagramHandle,
                  spotifyArtistId: artist.spotifyArtistId,
                  officialSiteUrl: artist.officialSiteUrl,
                },
                skipInstagramFetch: false,
                skipSpotifyFetch: false,
              }),
            });

            if (res.ok) {
              process.stdout.write("âœ“\n");
              results.refreshed++;
            } else {
              const errText = await res.text();
              process.stdout.write(`âœ— (${res.status}: ${errText.substring(0, 80)})\n`);
              results.failed++;
            }
          } catch (apiError) {
            process.stdout.write(`âœ— (${apiError.message})\n`);
            results.failed++;
          }
        }
      }

      // â”€â”€ Touch Logic â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // This ensures the artist moves to the back of the queue (updatedAt asc)
      // regardless of whether they were healthy or refreshed.
      if (!dryRun) {
        try {
          await prisma.artist.update({
            where: { id: artist.id },
            data: { updatedAt: new Date() },
          });
        } catch (touchError) {
          // If we already refreshed, we might skip the warning
          if (enrichResult.status === "healthy") {
             console.error(`  Warning: Could not touch updatedAt for "${artist.name}": ${touchError.message}`);
          }
        }
        
        // Wait 1.5s between refreshes to avoid rate limits
        if (enrichResult.status !== "healthy") {
           await new Promise((r) => setTimeout(r, 1500));
        }
      }
    } catch (error) {
      console.error(`Error checking artist ${artist.id}:`, error.message);
      results.errors++;
    }
  }

  console.log("ðŸ“ˆ Results:");
  console.log(`  Checked: ${results.total}`);
  console.log(`  Healthy: ${results.healthy}`);
  console.log(`  Needs Refresh: ${results.needsRefresh}`);
  if (!dryRun) {
    console.log(`    - Successfully Refreshed: ${results.refreshed}`);
    if (results.failed > 0) console.log(`    - Failed to Refresh: ${results.failed}`);
  }
  if (results.staleInstagram > 0) console.log(`    - Stale Instagram: ${results.staleInstagram}`);
  if (results.staleReleases > 0) console.log(`    - Stale Releases: ${results.staleReleases}`);
  if (results.lowEngagement > 0) console.log(`    - Low Engagement: ${results.lowEngagement}`);
  console.log(`  Errors: ${results.errors}`);

  if (dryRun) {
    console.log();
    console.log("âš ï¸  DRY RUN: No activities logged to database");
  }

  console.log(`\nâœ¨ Finished. Processed ${results.refreshed} stale leads.`);
  return { processedCount: results.refreshed };
}

withAgentRun("enrich-stale", { dryRun: hasFlag("--dry-run") }, main)
  .catch(err => console.error("Fatal Error:", err))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
