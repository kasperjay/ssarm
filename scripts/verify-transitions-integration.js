#!/usr/bin/env node
// scripts/verify-transitions-integration.js
// Adversarial verification script for end-to-end database workflow state transitions.

const fs = require("fs");
const path = require("path");

// Ensure .env is loaded BEFORE requiring Prisma/agent-runner
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

const { PrismaClient } = require("../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const assert = require("assert");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const { scanLeadForProductionNeeds, isClearPreserved } = require("../src/lib/production-need-scanner");
const { calculateLeadScoreFromData } = require("../src/lib/scoring-core");

async function run() {
  console.log("=== Starting End-to-End Adversarial DB Transition Verification ===");

  const TEST_ARTIST_ID = "test-artist-pnq-adv-" + Date.now();
  const TEST_LEAD_ID = "test-lead-pnq-adv-" + Date.now();

  try {
    // -------------------------------------------------------------------------
    // 1. Setup: Create Test Artist and Lead at NONE
    // -------------------------------------------------------------------------
    console.log("\n[Step 1] Creating test artist and lead at NONE...");
    const artist = await prisma.artist.create({
      data: {
        id: TEST_ARTIST_ID,
        name: "Adversarial Transition Artist",
        city: "Austin",
        state: "TX",
        genre: "Indie Rock",
        followerCount: 2000,
        bio: "Independent recording artist releasing new EP, looking for a mix engineer!",
      },
    });

    const lead = await prisma.lead.create({
      data: {
        id: TEST_LEAD_ID,
        artistId: TEST_ARTIST_ID,
        status: "NEW",
        score: null,
        productionNeedLevel: "NONE",
        productionNeedEvidence: [],
        productionNeedApprovedAt: null,
      },
    });

    assert.strictEqual(lead.productionNeedLevel, "NONE");
    assert.strictEqual(lead.productionNeedApprovedAt, null);
    assert.deepStrictEqual(lead.productionNeedEvidence, []);
    console.log("  ✓ Created lead at NONE");

    // -------------------------------------------------------------------------
    // 2. Automated Scan Sets POSSIBLE (R1, R2)
    // -------------------------------------------------------------------------
    console.log("\n[Step 2] Running automated scan on lead data...");
    const scanResult = scanLeadForProductionNeeds({
      bio: artist.bio,
      captions: [],
      releases: [],
    });

    assert.strictEqual(scanResult.level, "POSSIBLE", "Scanner must return POSSIBLE");
    assert.notStrictEqual(scanResult.level, "CLEAR", "Scanner must NEVER return CLEAR");
    assert.ok(scanResult.evidence.length > 0, "Evidence detected");

    const scanScore = calculateLeadScoreFromData(artist, 0, null, {
      level: scanResult.level,
      evidence: scanResult.evidence,
      approvedAt: scanResult.detectedAt,
    });

    const updatedLeadPossible = await prisma.lead.update({
      where: { id: TEST_LEAD_ID },
      data: {
        productionNeedLevel: scanResult.level,
        productionNeedEvidence: scanResult.evidence,
        productionNeedApprovedAt: scanResult.detectedAt,
        score: scanScore.totalScore,
        scoreRationale: scanScore.scoreRationale,
      },
    });

    assert.strictEqual(updatedLeadPossible.productionNeedLevel, "POSSIBLE");
    assert.ok(updatedLeadPossible.scoreRationale.includes("production need POSSIBLE (+8pts"));
    console.log(`  ✓ Lead promoted to POSSIBLE (Score: ${updatedLeadPossible.score})`);

    // -------------------------------------------------------------------------
    // 3. Operator Elevates to CLEAR (R4)
    // -------------------------------------------------------------------------
    console.log("\n[Step 3] Operator manually elevates to CLEAR...");
    const elevatedApprovedAt = new Date();
    const elevatedEvidence = [...scanResult.evidence, "Operator verified album session in studio"];
    const clearScore = calculateLeadScoreFromData(artist, 0, null, {
      level: "CLEAR",
      evidence: elevatedEvidence,
      approvedAt: elevatedApprovedAt,
    });

    const updatedLeadClear = await prisma.lead.update({
      where: { id: TEST_LEAD_ID },
      data: {
        productionNeedLevel: "CLEAR",
        productionNeedEvidence: elevatedEvidence,
        productionNeedApprovedAt: elevatedApprovedAt,
        score: clearScore.totalScore,
        scoreRationale: clearScore.scoreRationale,
      },
    });

    await prisma.activity.create({
      data: {
        leadId: TEST_LEAD_ID,
        type: "NOTE",
        note: `Production need set to CLEAR. Evidence: ${elevatedEvidence.join("; ")}`,
      },
    });

    assert.strictEqual(updatedLeadClear.productionNeedLevel, "CLEAR");
    assert.strictEqual(
      updatedLeadClear.score,
      Math.min(scanScore.totalScore + 17, 100),
      "CLEAR increases score by 17 points over POSSIBLE (+25 total)"
    );
    assert.ok(updatedLeadClear.scoreRationale.includes("production need CLEAR (+25pts"));
    console.log(`  ✓ Operator elevated to CLEAR (Score: ${updatedLeadClear.score})`);

    // -------------------------------------------------------------------------
    // 4. Repeated Automated Rescores Preserve Manual CLEAR (R2)
    // -------------------------------------------------------------------------
    console.log("\n[Step 4] Simulating repeated automated rescores on unexpired CLEAR (< 45 days)...");
    for (let cycle = 1; cycle <= 3; cycle++) {
      const currentLead = await prisma.lead.findUnique({
        where: { id: TEST_LEAD_ID },
        include: { artist: true },
      });

      const preserved = isClearPreserved(
        currentLead.productionNeedLevel,
        currentLead.productionNeedApprovedAt
      );
      assert.strictEqual(preserved, true, `Cycle ${cycle}: isClearPreserved must be true`);

      let needLevel = currentLead.productionNeedLevel;
      let needEvidence = currentLead.productionNeedEvidence;
      let needApprovedAt = currentLead.productionNeedApprovedAt;

      if (!preserved) {
        // Fallback scan (should not happen)
        const reScan = scanLeadForProductionNeeds({ bio: currentLead.artist.bio });
        needLevel = reScan.level;
        needEvidence = reScan.evidence;
        needApprovedAt = new Date();
      }

      const rescoreData = calculateLeadScoreFromData(currentLead.artist, 0, null, {
        level: needLevel,
        evidence: needEvidence,
        approvedAt: needApprovedAt,
      });

      const rescoredLead = await prisma.lead.update({
        where: { id: TEST_LEAD_ID },
        data: {
          productionNeedLevel: needLevel,
          productionNeedEvidence: needEvidence,
          productionNeedApprovedAt: needApprovedAt,
          score: rescoreData.totalScore,
          scoreRationale: rescoreData.scoreRationale,
        },
      });

      assert.strictEqual(rescoredLead.productionNeedLevel, "CLEAR", `Cycle ${cycle}: Level remains CLEAR`);
      assert.strictEqual(
        rescoredLead.productionNeedApprovedAt.getTime(),
        elevatedApprovedAt.getTime(),
        `Cycle ${cycle}: Original approvedAt timestamp strictly preserved`
      );
      assert.strictEqual(rescoredLead.score, updatedLeadClear.score, `Cycle ${cycle}: Score strictly preserved`);
    }
    console.log("  ✓ Manual CLEAR successfully preserved across 3 repeated rescores without mutation");

    // -------------------------------------------------------------------------
    // 5. Expired CLEAR Transition: With Signals -> Re-evaluates to POSSIBLE
    // -------------------------------------------------------------------------
    console.log("\n[Step 5] Expired CLEAR (50 days old) with active signals -> Re-evaluates to POSSIBLE...");
    const fiftyDaysAgo = new Date(Date.now() - 50 * 86400000);
    await prisma.lead.update({
      where: { id: TEST_LEAD_ID },
      data: { productionNeedApprovedAt: fiftyDaysAgo },
    });

    const leadExpiredWithSignals = await prisma.lead.findUnique({
      where: { id: TEST_LEAD_ID },
      include: { artist: true },
    });

    const isPreservedExpired = isClearPreserved(
      leadExpiredWithSignals.productionNeedLevel,
      leadExpiredWithSignals.productionNeedApprovedAt
    );
    assert.strictEqual(isPreservedExpired, false, "isClearPreserved must be FALSE for 50-day-old qualification");

    // Rescore re-evaluates
    const reScanSignals = scanLeadForProductionNeeds({
      bio: leadExpiredWithSignals.artist.bio,
      captions: [],
      releases: [],
    });
    assert.strictEqual(reScanSignals.level, "POSSIBLE");

    const reEvaluatedScore = calculateLeadScoreFromData(leadExpiredWithSignals.artist, 0, null, {
      level: reScanSignals.level,
      evidence: reScanSignals.evidence,
      approvedAt: new Date(),
    });

    const leadAfterExpiredRescore = await prisma.lead.update({
      where: { id: TEST_LEAD_ID },
      data: {
        productionNeedLevel: reScanSignals.level,
        productionNeedEvidence: reScanSignals.evidence,
        productionNeedApprovedAt: new Date(),
        score: reEvaluatedScore.totalScore,
        scoreRationale: reEvaluatedScore.scoreRationale,
      },
    });

    assert.strictEqual(leadAfterExpiredRescore.productionNeedLevel, "POSSIBLE");
    assert.ok(leadAfterExpiredRescore.scoreRationale.includes("production need POSSIBLE (+8pts"));
    console.log(`  ✓ Expired CLEAR re-evaluated to POSSIBLE (Score: ${leadAfterExpiredRescore.score})`);

    // -------------------------------------------------------------------------
    // 6. Expired CLEAR Transition: Without Signals -> Re-evaluates to NONE
    // -------------------------------------------------------------------------
    console.log("\n[Step 6] Expired CLEAR (50 days old) WITHOUT active signals -> Re-evaluates to NONE...");
    // Clear artist signals
    await prisma.artist.update({
      where: { id: TEST_ARTIST_ID },
      data: { bio: "Playing acoustic coffee shop sets" },
    });

    // Reset lead to expired CLEAR
    await prisma.lead.update({
      where: { id: TEST_LEAD_ID },
      data: {
        productionNeedLevel: "CLEAR",
        productionNeedApprovedAt: fiftyDaysAgo,
      },
    });

    const leadExpiredNoSignals = await prisma.lead.findUnique({
      where: { id: TEST_LEAD_ID },
      include: { artist: true },
    });

    assert.strictEqual(
      isClearPreserved(leadExpiredNoSignals.productionNeedLevel, leadExpiredNoSignals.productionNeedApprovedAt),
      false
    );

    const reScanNoSignals = scanLeadForProductionNeeds({
      bio: leadExpiredNoSignals.artist.bio,
      captions: [],
      releases: [],
    });
    assert.strictEqual(reScanNoSignals.level, "NONE");
    assert.deepStrictEqual(reScanNoSignals.evidence, []);

    const noneScore = calculateLeadScoreFromData(leadExpiredNoSignals.artist, 0, null, {
      level: reScanNoSignals.level,
      evidence: reScanNoSignals.evidence,
      approvedAt: null,
    });

    const leadAfterNoSignalsRescore = await prisma.lead.update({
      where: { id: TEST_LEAD_ID },
      data: {
        productionNeedLevel: reScanNoSignals.level,
        productionNeedEvidence: reScanNoSignals.evidence,
        productionNeedApprovedAt: null,
        score: noneScore.totalScore,
        scoreRationale: noneScore.scoreRationale,
      },
    });

    assert.strictEqual(leadAfterNoSignalsRescore.productionNeedLevel, "NONE");
    assert.strictEqual(leadAfterNoSignalsRescore.productionNeedApprovedAt, null);
    assert.deepStrictEqual(leadAfterNoSignalsRescore.productionNeedEvidence, []);
    assert.ok(!leadAfterNoSignalsRescore.scoreRationale.includes("production need"));
    console.log(`  ✓ Expired CLEAR with no signals successfully re-evaluated to NONE (Score: ${leadAfterNoSignalsRescore.score})`);

    // -------------------------------------------------------------------------
    // 7. Reset Transition: Operator Resets to NONE
    // -------------------------------------------------------------------------
    console.log("\n[Step 7] Operator explicitly resets to NONE...");
    // First, elevate lead back to CLEAR
    await prisma.lead.update({
      where: { id: TEST_LEAD_ID },
      data: {
        productionNeedLevel: "CLEAR",
        productionNeedEvidence: ["Operator override"],
        productionNeedApprovedAt: new Date(),
      },
    });

    // Operator executes Reset
    const resetData = {
      productionNeedLevel: "NONE",
      productionNeedEvidence: [],
      productionNeedEvidenceNote: null,
      productionNeedApprovedAt: null,
    };

    const resetScore = calculateLeadScoreFromData(artist, 0, null, {
      level: resetData.productionNeedLevel,
      evidence: resetData.productionNeedEvidence,
      approvedAt: resetData.productionNeedApprovedAt,
    });

    const resetLead = await prisma.lead.update({
      where: { id: TEST_LEAD_ID },
      data: {
        ...resetData,
        score: resetScore.totalScore,
        scoreRationale: resetScore.scoreRationale,
      },
    });

    await prisma.activity.create({
      data: {
        leadId: TEST_LEAD_ID,
        type: "NOTE",
        note: "Production need cleared (reset to NONE)",
      },
    });

    assert.strictEqual(resetLead.productionNeedLevel, "NONE");
    assert.strictEqual(resetLead.productionNeedApprovedAt, null);
    assert.deepStrictEqual(resetLead.productionNeedEvidence, []);
    assert.strictEqual(resetLead.productionNeedEvidenceNote, null);
    assert.ok(!resetLead.scoreRationale.includes("production need"));
    console.log("  ✓ Operator reset to NONE verified: level=NONE, approvedAt=null, evidence=[]");

    console.log("\n=== ALL DATABASE WORKFLOW STATE TRANSITIONS VERIFIED EMPIRICALLY ===");
  } finally {
    // -------------------------------------------------------------------------
    // Cleanup: Delete test data
    // -------------------------------------------------------------------------
    console.log("\n[Cleanup] Deleting test records...");
    try {
      await prisma.activity.deleteMany({ where: { leadId: TEST_LEAD_ID } });
      await prisma.lead.deleteMany({ where: { id: TEST_LEAD_ID } });
      await prisma.artist.deleteMany({ where: { id: TEST_ARTIST_ID } });
      console.log("  ✓ Cleaned up test lead, artist, and activities");
    } catch (e) {
      console.error("Cleanup error:", e.message);
    }
    await prisma.$disconnect();
    await pool.end();
  }
}

run().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
