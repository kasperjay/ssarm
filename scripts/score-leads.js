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
const { isNonLocalWithPastGigOnly } = require("../src/lib/show-parser");
const { withAgentRun, prisma, pool } = require("../src/lib/agent-runner");

const getArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  const val = process.argv[index + 1];
  return val && !val.startsWith("--") ? val : null;
};

const hasFlag = (name) => process.argv.includes(name);

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

  const isPastGigOnly = isNonLocalWithPastGigOnly(lead);
  const hasAustinActivity = !isPastGigOnly && (lead.activities || []).some((a) => isAustinVenue(a.note));
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

async function getLeadsToScore(options) {
  const { all, limit, filterStatus } = options;
  const where = {};

  if (!all) where.score = null;

  if (filterStatus) {
    where.status = {
      in: filterStatus.split(",").map((status) => status.trim().toUpperCase()),
    };
  } else {
    where.status = { not: "PAUSED" };
  }

  return prisma.lead.findMany({
    where,
    include: {
      artist: true,
      activities: { select: { note: true } },
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
      const scoreData = await calculateLeadScore(lead);

      results.changes.push({
        leadId: lead.id,
        artistName: lead.artist.name,
        oldScore: lead.score,
        newScore: scoreData.totalScore,
        oldRationale: lead.scoreRationale,
        newRationale: scoreData.scoreRationale,
      });

      const isPastGigOnly = isNonLocalWithPastGigOnly(lead);
      const shouldPause = isPastGigOnly && (lead.status === "NEW" || lead.status === "QUALIFIED");
      const shouldAutoQualify = !isPastGigOnly && scoreData.isQualified && lead.status === "NEW";
      const nextStatus = shouldPause ? "PAUSED" : shouldAutoQualify ? "QUALIFIED" : lead.status;

      if (!dryRun) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            score: scoreData.totalScore,
            scoreRationale: scoreData.scoreRationale,
            status: nextStatus,
            productionNeedLevel: scoreData.productionNeed.level,
            productionNeedEvidence: scoreData.productionNeed.evidence,
            productionNeedApprovedAt: scoreData.productionNeed.approvedAt,
          },
        });
        if (shouldPause) {
          await prisma.activity.create({
            data: {
              leadId: lead.id,
              type: "NOTE",
              note: "[AUTO-PAUSE] Non-local artist whose Austin gigs have already been played. Removed from lead queue.",
            },
          });
        }
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
  const limitParsed = limitArg ? parseInt(limitArg, 10) : null;
  const limit = limitParsed && !isNaN(limitParsed) && limitParsed > 0 ? limitParsed : (allFlag ? undefined : 100);

  console.log("Lead Scoring Engine");
  console.log(
    `Mode: ${dryRun ? "DRY RUN" : "LIVE"}`,
    allFlag ? "| All leads" : "| Unscored only",
    limit ? `| Limit: ${limit}` : "| No limit (all)"
  );

  if (filterStatus) console.log(`Filter: status in [${filterStatus}]`);
  console.log();

  const leads = await getLeadsToScore({ all: allFlag, limit, filterStatus });

  if (leads.length === 0) {
    console.log("No leads to score");
    return { scoredCount: 0 };
  }

  console.log(`Scoring ${leads.length} leads...`);
  const results = await scoreLeads(leads, dryRun);

  console.log();
  console.log("Results:");
  console.log(`  Scored: ${results.scored}`);
  console.log(`  Updated: ${results.updated}`);
  console.log(`  Errors: ${results.error}`);

  if (results.changes.length > 0) {
    console.log();
    console.log("Sample changes (first 5):");
    results.changes.slice(0, 5).forEach((change) => {
      console.log(`  ${change.artistName}: ${change.oldScore ?? "null"} -> ${change.newScore}`);
      if (change.newRationale) console.log(`    -> ${change.newRationale.substring(0, 80)}...`);
    });
  }

  if (dryRun) {
    console.log();
    console.log("DRY RUN: No changes saved to database");
  }

  return { scoredCount: results.scored, errors: results.error };
}

withAgentRun("score-leads", { dryRun: process.argv.includes("--dry-run") }, main)
  .catch((err) => {
    console.error("Fatal error:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
