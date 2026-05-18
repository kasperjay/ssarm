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

const hasFlag = (name) => process.argv.includes(name);

async function calculateLeadScore(lead) {
  const releaseCount = await prisma.release.count({
    where: { artistId: lead.artist.id },
  });

  return calculateLeadScoreFromData(lead.artist, releaseCount);
}

async function getLeadsToScore(options) {
  const { all, limit = 100, filterStatus } = options;
  const where = {};

  if (!all) where.score = null;

  if (filterStatus) {
    where.status = {
      in: filterStatus.split(",").map((status) => status.trim().toUpperCase()),
    };
  }

  return prisma.lead.findMany({
    where,
    include: { artist: true },
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

      if (!dryRun) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            score: scoreData.totalScore,
            scoreRationale: scoreData.scoreRationale,
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

  console.log("Lead Scoring Engine");
  console.log(
    `Mode: ${dryRun ? "DRY RUN" : "LIVE"}`,
    allFlag ? "| All leads" : "| Unscored only",
    `| Limit: ${limit}`
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
