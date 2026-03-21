#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../prisma/generated-client");
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

// Scoring algorithm (from score-leads.js)
const SCORING_CONFIG = {
  WEIGHTS: {
    followerCount: 20,
    recency: 15,
    releaseCount: 15,
    dataCompleteness: 15,
    engagement: 10,
    genreBonus: 25,
  },
  FOLLOWER_THRESHOLD: 10000,
  RECENCY_DAYS: 180,
  MIN_RELEASES: 3,
  QUALIFIED_THRESHOLD: 60,
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
  if (artist.instagramHandle) engagementPoints += 3;
  if (artist.bio && artist.bio.length > 50) engagementPoints += 3;
  if (artist.emails && artist.emails.length > 1) engagementPoints += 2;
  if (artist.officialSiteUrl) engagementPoints += 2;
  return Math.min(engagementPoints, SCORING_CONFIG.WEIGHTS.engagement);
}

function calculateGenreBonus(artist) {
  if (!artist.genre) return 0;
  const genreStr = artist.genre.toLowerCase().trim();
  if (genreStr.length < 2 || genreStr === "unknown") return 0;

  const PRIORITY_GENRES = /hip.?hop|rap|trap|metal|deathcore|prog.?rock|alt.?rock|hardcore|metalcore/i;
  if (PRIORITY_GENRES.test(genreStr)) {
    return SCORING_CONFIG.WEIGHTS.genreBonus;
  }

  return 10;
}

async function calculateLeadScore(lead) {
  const artist = lead.artist;

  const releaseCount = await prisma.release.count({
    where: { artistId: artist.id },
  });

  const followerScore = calculateFollowerScore(artist.followerCount);
  const recencyScore = calculateRecencyScore(artist.lastPostAt);
  const releaseScore = calculateReleaseScore(releaseCount);
  const completenessScore = calculateDataCompletenessScore(artist);
  const engagementScore = calculateEngagementScore(artist);
  const genreBonus = calculateGenreBonus(artist);

  const totalScore = followerScore + recencyScore + releaseScore + completenessScore + engagementScore + genreBonus;

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

  const isQualified = totalScore >= SCORING_CONFIG.QUALIFIED_THRESHOLD;

  return { totalScore, scoreRationale, isQualified };
}

async function scoreLeadsAutomatic(options) {
  const { limit = 100, dryRun = false } = options;

  const leads = await prisma.lead.findMany({
    where: { score: null },
    include: { artist: true },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  if (leads.length === 0) {
    return { total: 0, scored: 0, qualified: 0, errors: 0 };
  }

  const results = { total: leads.length, scored: 0, qualified: 0, errors: 0, details: [] };

  for (const lead of leads) {
    try {
      const { totalScore, scoreRationale, isQualified } = await calculateLeadScore(lead);

      if (!dryRun) {
        // Update lead with score
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            score: totalScore,
            scoreRationale,
            status: isQualified ? "QUALIFIED" : lead.status,
          },
        });

        // Log scoring activity
        await prisma.activity.create({
          data: {
            leadId: lead.id,
            type: "NOTE",
            note: `[AUTO-SCORE] Score: ${totalScore}/100. ${scoreRationale}${isQualified ? ' → Auto-qualified!' : ''}`,
          },
        });
      }

      results.scored++;
      if (isQualified) results.qualified++;

      results.details.push({
        name: lead.artist.name,
        score: totalScore,
        status: isQualified ? "QUALIFIED" : "PROMISING",
      });
    } catch (error) {
      console.error(`Error scoring lead ${lead.id}:`, error.message);
      results.errors++;
    }
  }

  return results;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limitIndex = process.argv.indexOf("--limit");
  const limit = limitIndex !== -1 ? parseInt(process.argv[limitIndex + 1], 10) : 100;

  console.log("✅ Event-Driven Lead Scoring");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"} | Limit: ${limit}`);
  console.log();

  const results = await scoreLeadsAutomatic({ limit, dryRun });

  if (results.total === 0) {
    console.log("✓ No unscored leads");
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log("📊 Results:");
  console.log(`  Scored: ${results.scored}/${results.total}`);
  console.log(`  Auto-Qualified: ${results.qualified}`);
  console.log(`  Errors: ${results.errors}`);

  if (results.details.length > 0) {
    console.log();
    console.log("Sample scores (first 5):");
    results.details.slice(0, 5).forEach(d => {
      console.log(`  ${d.name}: ${d.score}/100 → ${d.status}`);
    });
  }

  if (dryRun) {
    console.log();
    console.log("⚠️  DRY RUN: No changes saved");
  }

  await prisma.$disconnect();
  process.exit(results.errors > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
