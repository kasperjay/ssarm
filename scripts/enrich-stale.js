#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../src/generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

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

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const getArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
};

const hasFlag = (name) => process.argv.includes(name);

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
  const { limit = 100, dryRun = false } = options;

  return prisma.artist.findMany({
    take: limit,
    orderBy: { updatedAt: "asc" },
  });
}

async function main() {
  const dryRun = hasFlag("--dry-run");
  const limitArg = getArg("--limit");
  const limit = limitArg ? parseInt(limitArg, 10) : 100;

  console.log("📊 Data Enrichment & Staleness Agent");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"} | Limit: ${limit}`);
  console.log();

  const artists = await getArtistsToEnrich({ limit, dryRun });

  if (artists.length === 0) {
    console.log("✓ No artists to enrich");
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log(`Checking ${artists.length} artists for stale data...`);
  console.log();

  const results = {
    total: artists.length,
    healthy: 0,
    needsRefresh: 0,
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
      } else {
        results.needsRefresh++;
        
        for (const check of enrichResult.checks) {
          if (check.type === "stale_instagram") results.staleInstagram++;
          if (check.type === "stale_releases") results.staleReleases++;
          if (check.type === "low_engagement") results.lowEngagement++;
        }
      }
    } catch (error) {
      console.error(`Error checking artist ${artist.id}:`, error.message);
      results.errors++;
    }
  }

  console.log("📈 Results:");
  console.log(`  Checked: ${results.total}`);
  console.log(`  Healthy: ${results.healthy}`);
  console.log(`  Needs Refresh: ${results.needsRefresh}`);
  if (results.staleInstagram > 0) console.log(`    - Stale Instagram: ${results.staleInstagram}`);
  if (results.staleReleases > 0) console.log(`    - Stale Releases: ${results.staleReleases}`);
  if (results.lowEngagement > 0) console.log(`    - Low Engagement: ${results.lowEngagement}`);
  console.log(`  Errors: ${results.errors}`);

  if (dryRun) {
    console.log();
    console.log("⚠️  DRY RUN: No activities logged to database");
  }

  await prisma.$disconnect();
  process.exit(results.errors > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
