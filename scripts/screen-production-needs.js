#!/usr/bin/env node
// scripts/screen-production-needs.js
// Scans active leads for production-need signals and writes POSSIBLE level.
// Usage:  node scripts/screen-production-needs.js [--dry-run] [--lead <id>]

const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim().replace(/^['"](.*)['"]\s*$/, "$1");
    if (key && process.env[key] === undefined) process.env[key] = val;
  }
}

const { withAgentRun, prisma, pool } = require("../src/lib/agent-runner");
const {
  scanLeadForProductionNeeds,
  isClearPreserved,
} = require("../src/lib/production-need-scanner");
const { calculateLeadScoreFromData } = require("../src/lib/scoring-core");
const { isAustinVenue } = require("../src/lib/location-parser");

const hasFlag = (f) => process.argv.includes(f);
const getArg  = (f) => {
  const i = process.argv.indexOf(f);
  if (i === -1) return null;
  const val = process.argv[i + 1];
  return val && !val.startsWith("--") ? val : null;
};

const DRY_RUN    = hasFlag("--dry-run");
const TARGET_ID  = getArg("--lead");
const LIMIT_ARG  = getArg("--limit");
const LIMIT      = LIMIT_ARG && !isNaN(parseInt(LIMIT_ARG, 10)) && parseInt(LIMIT_ARG, 10) > 0
  ? parseInt(LIMIT_ARG, 10)
  : undefined;

async function main() {
  console.log(`[screen-production-needs] Starting — ${DRY_RUN ? "DRY RUN" : "LIVE"}`);

  const where = TARGET_ID
    ? { id: TARGET_ID }
    : { status: { notIn: ["WON", "LOST", "PAUSED"] } };

  const leads = await prisma.lead.findMany({
    where,
    take: LIMIT,
    include: {
      artist: true,
      activities: { select: { note: true } },
    },
  });

  console.log(`[screen-production-needs] Scanning ${leads.length} leads...`);

  const totals = { scanned: 0, promoted: 0, demoted: 0, preserved: 0, skipped: 0 };

  for (const lead of leads) {
    totals.scanned++;

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

    const result = scanLeadForProductionNeeds({
      bio: lead.artist.bio,
      captions: instagramPosts.map((p) => p.caption).filter(Boolean),
      releases,
    });

    if (result.level === "NONE") {
      if (lead.productionNeedLevel && lead.productionNeedLevel !== "NONE") {
        console.log(`  [DEMOTE] ${lead.artist.name} — expired qualification without active signals reset to NONE`);
        totals.demoted++;

        const trackAnalysisStats = analyses.length > 0 ? {
          uniqueMoods: [...new Set(analyses.flatMap((a) => a.moods))].length,
          uniqueThemes: [...new Set(analyses.flatMap((a) => a.themes))].length,
          maturityRatings: [...new Set(analyses.map((a) => a.rating).filter(Boolean))],
          hasAnalysis: true,
        } : undefined;

        const hasAustinVenueTie = (lead.activities || []).some((a) => isAustinVenue(a.note));
        const artistWithTie = {
          ...lead.artist,
          hasAustinVenueTie,
        };

        const scoreData = calculateLeadScoreFromData(artistWithTie, releaseCount, trackAnalysisStats, {
          level: "NONE",
          evidence: [],
          approvedAt: null,
        });

        if (!DRY_RUN) {
          await prisma.lead.update({
            where: { id: lead.id },
            data: {
              productionNeedLevel: "NONE",
              productionNeedEvidence: [],
              productionNeedApprovedAt: null,
              score: scoreData.totalScore,
              scoreRationale: scoreData.scoreRationale,
            },
          });

          await prisma.activity.create({
            data: {
              leadId: lead.id,
              type: "NOTE",
              note: `[AUTO-SCREEN] Expired production need reset to NONE (no active signals found).`,
            },
          });
        }
      } else {
        console.log(`  [SKIP] ${lead.artist.name} — no signals found`);
        totals.skipped++;
      }
      continue;
    }

    console.log(`  [${result.level}] ${lead.artist.name} — ${result.evidence.join(" | ")}`);
    totals.promoted++;

    const trackAnalysisStats = analyses.length > 0 ? {
      uniqueMoods: [...new Set(analyses.flatMap((a) => a.moods))].length,
      uniqueThemes: [...new Set(analyses.flatMap((a) => a.themes))].length,
      maturityRatings: [...new Set(analyses.map((a) => a.rating).filter(Boolean))],
      hasAnalysis: true,
    } : undefined;

    const hasAustinVenueTie = (lead.activities || []).some((a) => isAustinVenue(a.note));
    const artistWithTie = {
      ...lead.artist,
      hasAustinVenueTie,
    };

    const scoreData = calculateLeadScoreFromData(artistWithTie, releaseCount, trackAnalysisStats, {
      level: result.level,
      evidence: result.evidence,
      approvedAt: new Date(),
    });

    if (!DRY_RUN) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: {
          productionNeedLevel: result.level,
          productionNeedEvidence: result.evidence,
          productionNeedApprovedAt: new Date(),
          score: scoreData.totalScore,
          scoreRationale: scoreData.scoreRationale,
        },
      });

      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: "NOTE",
          note: `[AUTO-SCREEN] Production need set to ${result.level}. Evidence: ${result.evidence.join("; ")}`,
        },
      });
    }
  }

  console.log(`\n[screen-production-needs] Done — ${totals.promoted} promoted, ${totals.demoted} demoted/reset, ${totals.preserved} preserved, ${totals.skipped} no signal, ${totals.scanned} total`);
  return totals;
}

withAgentRun("screen-production-needs", { dryRun: DRY_RUN }, main)
  .catch((err) => {
    console.error("Fatal error:", err.message || err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
