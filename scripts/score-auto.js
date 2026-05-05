#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const { calculateLeadScoreFromData } = require("../src/lib/scoring-core");
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

const getArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
};

async function calculateLeadScore(lead) {
  const releaseCount = await prisma.release.count({
    where: { artistId: lead.artist.id },
  });

  return calculateLeadScoreFromData(lead.artist, releaseCount);
}

async function scoreLeadsAutomatic(options) {
  const { limit = 100, dryRun = false, all = false } = options;
  const leads = await prisma.lead.findMany({
    where: all ? undefined : { score: null },
    include: { artist: true },
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
  const limit = limitArg ? parseInt(limitArg, 10) : 100;

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
