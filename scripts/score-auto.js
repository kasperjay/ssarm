#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Load .env FIRST before any modules that instantiate DB pools
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

const { calculateLeadScoreFromData } = require("../src/lib/scoring-core");
const { isAustinVenue } = require("../src/lib/location-parser");
const { scanLeadForProductionNeeds, isClearPreserved } = require("../src/lib/production-need-scanner");
const { withAgentRun, prisma, pool } = require("../src/lib/agent-runner");

const getArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  const val = process.argv[index + 1];
  return val && !val.startsWith("--") ? val : null;
};

async function calculateLeadScore(lead) {
  const [releaseCount, analyses, instagramPosts, releases] = await Promise.all([
    prisma.release.count({
      where: { artistId: lead.artist.id },
    }),
    prisma.trackAnalysis.findMany({
      where: { release: { artistId: lead.artist.id } },
      select: { moods: true, themes: true, rating: true },
    }),
    prisma.instagramPost.findMany({
      where: { artistId: lead.artist.id },
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
      take: 30,
      select: { caption: true },
    }),
    prisma.release.findMany({
      where: { artistId: lead.artist.id },
      orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
      take: 10,
      select: { title: true, releaseDate: true },
    }),
  ]);

  const trackAnalysisStats = analyses.length > 0 ? {
    uniqueMoods: [...new Set(analyses.flatMap(a => a.moods))].length,
    uniqueThemes: [...new Set(analyses.flatMap(a => a.themes))].length,
    maturityRatings: [...new Set(analyses.map(a => a.rating).filter(Boolean))],
    hasAnalysis: true,
  } : undefined;

  const hasAustinActivity = (lead.activities || []).some((a) => isAustinVenue(a.note));
  const artistWithTie = {
    ...lead.artist,
    hasAustinVenueTie: hasAustinActivity,
  };

  const scanResult = scanLeadForProductionNeeds({
    bio: lead.artist.bio,
    captions: instagramPosts.map((p) => p.caption).filter(Boolean),
    releases,
  });
  const needLevel = scanResult.level;
  const needEvidence = scanResult.evidence;
  const needApprovedAt = scanResult.level !== "NONE" ? new Date() : null;

  const scoreData = calculateLeadScoreFromData(artistWithTie, releaseCount, trackAnalysisStats, {
    level: needLevel,
    evidence: needEvidence,
    approvedAt: needApprovedAt,
  });

  return {
    ...scoreData,
    productionNeed: {
      level: needLevel,
      evidence: needEvidence,
      approvedAt: needApprovedAt,
    },
  };
}

async function scoreLeadsAutomatic(options) {
  const { limit = 100, dryRun = false, all = false } = options;
  const leads = await prisma.lead.findMany({
    where: all ? { status: { not: "PAUSED" } } : { score: null, status: { not: "PAUSED" } },
    include: {
      artist: true,
      activities: { select: { note: true } },
    },
    take: limit,
    orderBy: { createdAt: "desc" },
  });

  const results = { total: leads.length, scored: 0, qualified: 0, errors: 0, details: [] };

  for (const lead of leads) {
    try {
      const scoreData = await calculateLeadScore(lead);
      const shouldAutoQualify = scoreData.isQualified && lead.status === "NEW";

      if (!dryRun) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            score: scoreData.totalScore,
            scoreRationale: scoreData.scoreRationale,
            status: shouldAutoQualify ? "QUALIFIED" : lead.status,
            productionNeedLevel: scoreData.productionNeed.level,
            productionNeedEvidence: scoreData.productionNeed.evidence,
            productionNeedApprovedAt: scoreData.productionNeed.approvedAt,
          },
        });

        await prisma.activity.create({
          data: {
            leadId: lead.id,
            type: "NOTE",
            note: `[AUTO-SCORE] Score: ${scoreData.totalScore}/100. ${scoreData.scoreRationale}${shouldAutoQualify ? " -> Auto-qualified!" : ""}`,
          },
        });
      }

      results.scored++;
      if (shouldAutoQualify) results.qualified++;
      results.details.push({
        name: lead.artist.name,
        score: scoreData.totalScore,
        status: shouldAutoQualify ? "QUALIFIED" : lead.status,
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
  const all = process.argv.includes("--all");
  const limitArg = getArg("--limit");
  const limitParsed = limitArg ? parseInt(limitArg, 10) : 100;
  const limit = !isNaN(limitParsed) && limitParsed > 0 ? limitParsed : 100;

  console.log("Event-Driven Lead Scoring");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"} | Limit: ${limit}${all ? " | All leads" : ""}`);
  console.log();

  const results = await scoreLeadsAutomatic({ limit, dryRun, all });

  if (results.total === 0) {
    console.log(all ? "No leads found" : "No unscored leads");
    return { scoredCount: 0, errors: 0 };
  }

  console.log("Results:");
  console.log(`  Scored: ${results.scored}/${results.total}`);
  console.log(`  Auto-Qualified: ${results.qualified}`);
  console.log(`  Errors: ${results.errors}`);

  if (results.details.length > 0) {
    console.log();
    console.log("Sample scores (first 5):");
    results.details.slice(0, 5).forEach((detail) => {
      console.log(`  ${detail.name}: ${detail.score}/100 -> ${detail.status}`);
    });
  }

  if (dryRun) {
    console.log("DRY RUN: No changes saved to database");
  }

  return { scoredCount: results.scored, errors: results.errors };
}

withAgentRun("score-auto", { dryRun: process.argv.includes("--dry-run") }, main)
  .catch((err) => {
    console.error("Fatal error:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
