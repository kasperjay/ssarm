#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Load .env file
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

// Initialize Prisma with PostgreSQL adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const getArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
};

const hasFlag = (name) => process.argv.includes(name);

// Scoring weights & thresholds (total = 100)
const SCORING_CONFIG = {
  WEIGHTS: {
    followerCount: 20,    // 0-20: scaled by 10k followers
    recency: 15,          // 0-15: based on lastPostAt
    releaseCount: 15,     // 0-15: count of releases
    dataCompleteness: 15, // 0-15: profile fields filled
    engagement: 10,       // 0-10: post count, profile bio quality
    genreBonus: 25,       // 0-25: prioritized by genre type
  },
  FOLLOWER_THRESHOLD: 10000, // 10k followers = max points
  RECENCY_DAYS: 180,         // Posts within 180 days = full points
  MIN_RELEASES: 3,           // 3+ releases for full points
  QUALIFIED_THRESHOLD: 60,   // Score >= 60 suggests QUALIFIED status
};

function calculateFollowerScore(followerCount) {
  if (!followerCount) return 0;
  const ratio = Math.min(followerCount / SCORING_CONFIG.FOLLOWER_THRESHOLD, 1);
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.followerCount);
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
  const fields = [
    'instagramHandle',
    'spotifyArtistId',
    'genre',
    'city',
    'bio',
  ];
  const filledCount = fields.filter(field => artist[field]).length;
  const ratio = filledCount / fields.length;
  return Math.round(ratio * SCORING_CONFIG.WEIGHTS.dataCompleteness);
}

function calculateEngagementScore(artist) {
  let engagementPoints = 0;

  // Has Instagram presence
  if (artist.instagramHandle) engagementPoints += 3;

  // Has quality bio (> 50 chars, likely contains useful info)
  if (artist.bio && artist.bio.length > 50) engagementPoints += 3;

  // Has multiple emails (suggests accessible/professional)
  if (artist.emails && artist.emails.length > 1) engagementPoints += 2;

  // Has official site
  if (artist.officialSiteUrl) engagementPoints += 2;

  return Math.min(engagementPoints, SCORING_CONFIG.WEIGHTS.engagement);
}

function calculateGenreBonus(artist) {
  if (!artist.genre) return 0;
  const genreStr = artist.genre.toLowerCase().trim();
  if (genreStr.length < 2 || genreStr === "unknown") return 0;

  // Priority genres get full bonus
  const PRIORITY_GENRES = /hip.?hop|rap|trap|metal|deathcore|prog.?rock|alt.?rock|hardcore|metalcore/i;
  if (PRIORITY_GENRES.test(genreStr)) {
    return SCORING_CONFIG.WEIGHTS.genreBonus;
  }

  // Standard valid genres get a baseline (10 pts)
  return 10;
}

async function calculateLeadScore(lead) {
  const artist = lead.artist;

  // Get release count
  const releaseCount = await prisma.release.count({
    where: { artistId: artist.id },
  });

  // Calculate components
  const followerScore = calculateFollowerScore(artist.followerCount);
  const recencyScore = calculateRecencyScore(artist.lastPostAt);
  const releaseScore = calculateReleaseScore(releaseCount);
  const completenessScore = calculateDataCompletenessScore(artist);
  const engagementScore = calculateEngagementScore(artist);
  const genreBonus = calculateGenreBonus(artist);

  const totalScore = followerScore + recencyScore + releaseScore + completenessScore + engagementScore + genreBonus;

  // Generate human-readable rationale
  const rationales = [];
  if (followerScore > 0) {
    rationales.push(`${artist.followerCount?.toLocaleString() || 0} followers (${followerScore}pts)`);
  }
  if (recencyScore > 0) {
    const daysAgo = Math.floor((Date.now() - new Date(artist.lastPostAt).getTime()) / (1000 * 60 * 60 * 24));
    rationales.push(`active posting (${daysAgo}d ago, ${recencyScore}pts)`);
  }
  if (releaseScore > 0) {
    rationales.push(`${releaseCount} releases (${releaseScore}pts)`);
  }
  if (completenessScore > 0) {
    rationales.push(`profile ${completenessScore}% complete (${completenessScore}pts)`);
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

  return {
    score: totalScore,
    scoreRationale,
    components: {
      followerScore,
      recencyScore,
      releaseScore,
      completenessScore,
      engagementScore,
      genreBonus,
    },
  };
}

async function getLeadsToScore(options) {
  const { all, limit = 100, filterStatus } = options;

  const where = {};

  // Only score unscored leads unless --all flag
  if (!all) {
    where.score = null;
  }

  // Filter by status if provided
  if (filterStatus) {
    const statuses = filterStatus.split(",").map(s => s.trim().toUpperCase());
    where.status = { in: statuses };
  }

  return prisma.lead.findMany({
    where,
    include: {
      artist: true,
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });
}

async function scoreLeads(leads, dryRun = false) {
  const results = {
    total: leads.length,
    scored: 0,
    updated: 0,
    error: 0,
    changes: [],
  };

  for (const lead of leads) {
    try {
      const { score, scoreRationale } = await calculateLeadScore(lead);

      const hadScore = lead.score !== null;
      const scoreChanged = hadScore && lead.score !== score;
      const rationaleChanged = lead.scoreRationale !== scoreRationale;

      results.changes.push({
        leadId: lead.id,
        artistName: lead.artist.name,
        oldScore: lead.score,
        newScore: score,
        oldRationale: lead.scoreRationale,
        newRationale: scoreRationale,
      });

      if (!dryRun) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            score,
            scoreRationale,
          },
        });
        results.updated++;
      }

      results.scored++;
    } catch (error) {
      console.error(`Error scoring lead ${lead.id}:`, error.message);
      results.error++;
    }
  }

  return results;
}

async function main() {
  const allFlag = hasFlag("--all");
  const dryRun = hasFlag("--dry-run");
  const limitArg = getArg("--limit");
  const filterStatus = getArg("--filter-status");

  const limit = limitArg ? parseInt(limitArg, 10) : 100;

  console.log("🎯 Lead Scoring Engine");
  console.log(
    `Mode: ${dryRun ? "DRY RUN" : "LIVE"}`,
    allFlag ? "| All leads" : "| Unscored only",
    `| Limit: ${limit}`
  );

  if (filterStatus) {
    console.log(`Filter: status in [${filterStatus}]`);
  }

  console.log();

  const leads = await getLeadsToScore({
    all: allFlag,
    limit,
    filterStatus,
  });

  if (leads.length === 0) {
    console.log("✓ No leads to score");
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log(`Scoring ${leads.length} leads...`);

  const results = await scoreLeads(leads, dryRun);

  // Summary
  console.log();
  console.log("📊 Results:");
  console.log(`  Scored: ${results.scored}`);
  console.log(`  Updated: ${results.updated}`);
  console.log(`  Errors: ${results.error}`);

  // Show sample changes
  if (results.changes.length > 0) {
    console.log();
    console.log("Sample changes (first 5):");
    results.changes.slice(0, 5).forEach((change) => {
      console.log(`  ${change.artistName}: ${change.oldScore ?? "null"} → ${change.newScore}`);
      if (change.newRationale) {
        console.log(`    → ${change.newRationale.substring(0, 80)}...`);
      }
    });
  }

  if (dryRun) {
    console.log();
    console.log("⚠️  DRY RUN: No changes saved to database");
  }

  await prisma.$disconnect();
  process.exit(results.error > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
