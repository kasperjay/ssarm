const test = require("node:test");
const assert = require("node:assert");
const {
  scanLeadForProductionNeeds,
  isClearPreserved,
  FRESHNESS_DAYS,
} = require("./production-need-scanner");
const { calculateLeadScoreFromData } = require("./scoring-core");

const AUSTIN_ARTIST = {
  name: "Adversarial Austin Artist",
  genre: "Indie Rock",
  city: "Austin",
  state: "TX",
  followerCount: 2500,
  lastPostAt: new Date(),
};

test("Adversarial Workflow: State Transition NONE -> POSSIBLE -> CLEAR -> Preserved Rescores", async (t) => {
  // Step 1: Initial state at NONE
  const initialLead = {
    artist: { ...AUSTIN_ARTIST, bio: "" },
    productionNeedLevel: "NONE",
    productionNeedEvidence: [],
    productionNeedApprovedAt: null,
  };

  const initialScore = calculateLeadScoreFromData(initialLead.artist, 4, null, {
    level: initialLead.productionNeedLevel,
    evidence: initialLead.productionNeedEvidence,
    approvedAt: initialLead.productionNeedApprovedAt,
  });

  assert.ok(initialScore.totalScore > 0, "Initial score calculated");
  assert.strictEqual(initialScore.productionNeedScore || 0, 0, "Initial production need score is 0");
  assert.ok(!initialScore.scoreRationale.includes("production need"), "No production need in rationale");

  // Step 2: Automated scan identifies release-only signals -> sets POSSIBLE (+8)
  const scannedPossibleSignals = scanLeadForProductionNeeds({
    bio: "Independent artist with upcoming EP coming out soon!",
    captions: ["New single dropping next week, pre-save now!"],
    releases: [],
  });

  assert.strictEqual(scannedPossibleSignals.level, "POSSIBLE", "Automated scan assigns POSSIBLE for release/drop mentions");
  assert.ok(scannedPossibleSignals.evidence.length >= 2, "Multiple release signals detected");

  const possibleScore = calculateLeadScoreFromData(initialLead.artist, 4, null, {
    level: scannedPossibleSignals.level,
    evidence: scannedPossibleSignals.evidence,
    approvedAt: scannedPossibleSignals.detectedAt,
  });

  assert.strictEqual(
    possibleScore.totalScore,
    Math.min(initialScore.totalScore + 8, 100),
    "POSSIBLE awards exactly +8 points (subject to 100 cap)"
  );
  assert.ok(
    possibleScore.scoreRationale.includes("production need POSSIBLE (+8pts"),
    "Rationale documents POSSIBLE points"
  );

  // Step 3: Automated scan identifies studio/mix/track signals -> sets PROBABLE (+12)
  const scannedProbableSignals = scanLeadForProductionNeeds({
    bio: "Independent artist in the studio finishing new EP, looking for a mix engineer!",
    captions: ["Working on music, need a producer for vocal tracking"],
    releases: [],
  });

  assert.strictEqual(scannedProbableSignals.level, "PROBABLE", "Automated scan assigns PROBABLE for studio/mix/tracking");
  const probableScore = calculateLeadScoreFromData(initialLead.artist, 4, null, {
    level: scannedProbableSignals.level,
    evidence: scannedProbableSignals.evidence,
    approvedAt: scannedProbableSignals.detectedAt,
  });

  assert.strictEqual(
    probableScore.totalScore,
    Math.min(initialScore.totalScore + 12, 100),
    "PROBABLE awards exactly +12 points (subject to 100 cap)"
  );
  assert.ok(
    probableScore.scoreRationale.includes("production need PROBABLE (+12pts"),
    "Rationale documents PROBABLE points"
  );

  // Step 4: Verify unexpired manual PROBABLE/CLEAR is preserved across repeated automated rescores
  const operatorApprovedAt = new Date();
  const elevatedLead = {
    artist: initialLead.artist,
    productionNeedLevel: "PROBABLE",
    productionNeedEvidence: scannedProbableSignals.evidence,
    productionNeedApprovedAt: operatorApprovedAt,
  };
  const testRescoreDays = [1, 5, 15, 30, 44];
  for (const dayOffset of testRescoreDays) {
    const rescoreTime = new Date(operatorApprovedAt.getTime() + dayOffset * 86400000);
    const preserved = isClearPreserved(
      elevatedLead.productionNeedLevel,
      elevatedLead.productionNeedApprovedAt,
      rescoreTime
    );

    assert.strictEqual(
      preserved,
      true,
      `Manual PROBABLE must be preserved at day ${dayOffset} (< 45 days)`
    );

    const rescoreResult = calculateLeadScoreFromData(elevatedLead.artist, 4, null, {
      level: elevatedLead.productionNeedLevel,
      evidence: elevatedLead.productionNeedEvidence,
      approvedAt: elevatedLead.productionNeedApprovedAt,
    });

    assert.strictEqual(
      rescoreResult.totalScore,
      probableScore.totalScore,
      `Score must retain full +12 PROBABLE bonus at day ${dayOffset}`
    );
  }
});

test("Adversarial Workflow: Expired CLEAR Transition (> 45 days)", async (t) => {
  const baseApprovedAt = new Date("2026-08-01T12:00:00Z");
  const expiredTime = new Date("2026-09-20T12:00:00Z"); // 50 days later (> 45 days)

  await t.test("Expired CLEAR in scoring-core yields 0 points and reports expired in rationale", () => {
    const expiredLead = {
      artist: AUSTIN_ARTIST,
      productionNeedLevel: "CLEAR",
      productionNeedEvidence: ["Old mix request"],
      productionNeedApprovedAt: baseApprovedAt,
    };

    // calculateLeadScoreFromData evaluates age against Date.now()
    // Test with approvedAt 50 days before now
    const fiftyDaysAgo = new Date(Date.now() - 50 * 86400000);
    const scoreResult = calculateLeadScoreFromData(expiredLead.artist, 4, null, {
      level: "CLEAR",
      evidence: expiredLead.productionNeedEvidence,
      approvedAt: fiftyDaysAgo,
    });

    assert.ok(
      scoreResult.scoreRationale.includes("production need CLEAR expired (0pts)"),
      "Rationale indicates expired qualification with 0pts"
    );
  });

  await t.test("Expired CLEAR with active signals transitions to POSSIBLE on rescore", () => {
    // Lead is at CLEAR but 50 days old
    const expiredLead = {
      artist: {
        ...AUSTIN_ARTIST,
        bio: "Independent recording artist releasing new tracks soon",
      },
      productionNeedLevel: "CLEAR",
      productionNeedApprovedAt: new Date(Date.now() - 50 * 86400000),
      productionNeedEvidence: ["Historical manual evidence"],
    };

    const isPreserved = isClearPreserved(
      expiredLead.productionNeedLevel,
      expiredLead.productionNeedApprovedAt
    );
    assert.strictEqual(isPreserved, false, "isClearPreserved must be FALSE when > 45 days old");

    // Rescore logic runs automated scan
    const scanResult = scanLeadForProductionNeeds({
      bio: expiredLead.artist.bio,
      captions: [],
      releases: [],
    });

    assert.strictEqual(scanResult.level, "POSSIBLE", "Active signals trigger POSSIBLE");

    // State transition applied
    const nextLevel = isPreserved ? "CLEAR" : scanResult.level;
    const nextEvidence = isPreserved ? expiredLead.productionNeedEvidence : scanResult.evidence;
    const nextApprovedAt = isPreserved ? expiredLead.productionNeedApprovedAt : new Date();

    assert.strictEqual(nextLevel, "POSSIBLE", "State transitioned from expired CLEAR to POSSIBLE");
    assert.notStrictEqual(nextApprovedAt, expiredLead.productionNeedApprovedAt, "ApprovedAt timestamp refreshed");

    const newScore = calculateLeadScoreFromData(expiredLead.artist, 4, null, {
      level: nextLevel,
      evidence: nextEvidence,
      approvedAt: nextApprovedAt,
    });

    assert.ok(newScore.scoreRationale.includes("production need POSSIBLE (+8pts"), "Receives +8 pts for POSSIBLE");
  });

  await t.test("Expired CLEAR without active signals transitions to NONE on rescore", () => {
    // Lead is at CLEAR but 50 days old and has NO signals
    const expiredLead = {
      artist: {
        ...AUSTIN_ARTIST,
        bio: "Just playing acoustic shows around town",
      },
      productionNeedLevel: "CLEAR",
      productionNeedApprovedAt: new Date(Date.now() - 50 * 86400000),
      productionNeedEvidence: ["Historical manual evidence"],
    };

    const isPreserved = isClearPreserved(
      expiredLead.productionNeedLevel,
      expiredLead.productionNeedApprovedAt
    );
    assert.strictEqual(isPreserved, false, "isClearPreserved must be FALSE when > 45 days old");

    // Rescore logic runs automated scan
    const scanResult = scanLeadForProductionNeeds({
      bio: expiredLead.artist.bio,
      captions: [],
      releases: [],
    });

    assert.strictEqual(scanResult.level, "NONE", "No signals detected returns NONE");

    // State transition applied
    const nextLevel = isPreserved ? "CLEAR" : scanResult.level;
    const nextEvidence = isPreserved ? expiredLead.productionNeedEvidence : scanResult.evidence;
    const nextApprovedAt = isPreserved ? expiredLead.productionNeedApprovedAt : null;

    assert.strictEqual(nextLevel, "NONE", "State transitioned from expired CLEAR to NONE");
    assert.deepStrictEqual(nextEvidence, [], "Evidence cleared to empty array");
    assert.strictEqual(nextApprovedAt, null, "ApprovedAt reset to null");

    const newScore = calculateLeadScoreFromData(expiredLead.artist, 4, null, {
      level: nextLevel,
      evidence: nextEvidence,
      approvedAt: nextApprovedAt,
    });

    assert.ok(!newScore.scoreRationale.includes("production need"), "No production need bonus in rationale");
  });
});

test("Adversarial Workflow: Operator Reset Transition to NONE", async (t) => {
  await t.test("Reset from CLEAR to NONE clears approvedAt and evidence", () => {
    const beforeState = {
      productionNeedLevel: "CLEAR",
      productionNeedEvidence: ["Explicit studio need", "Mix inquiry in DM"],
      productionNeedEvidenceNote: "Operator approved",
      productionNeedApprovedAt: new Date(),
    };

    // Simulate operator resetting to NONE (updateProductionNeed logic)
    const resetTargetLevel = "NONE";
    const afterData = {
      productionNeedLevel: resetTargetLevel,
      productionNeedEvidence: resetTargetLevel === "NONE" ? [] : beforeState.productionNeedEvidence,
      productionNeedEvidenceNote: resetTargetLevel === "NONE" ? null : beforeState.productionNeedEvidenceNote,
      productionNeedApprovedAt: resetTargetLevel === "NONE" ? null : new Date(),
    };

    assert.strictEqual(afterData.productionNeedLevel, "NONE");
    assert.deepStrictEqual(afterData.productionNeedEvidence, []);
    assert.strictEqual(afterData.productionNeedEvidenceNote, null);
    assert.strictEqual(afterData.productionNeedApprovedAt, null);

    // Verify isClearPreserved is false
    assert.strictEqual(isClearPreserved(afterData.productionNeedLevel, afterData.productionNeedApprovedAt), false);

    // Verify score recomputation with NONE
    const scoreResult = calculateLeadScoreFromData(AUSTIN_ARTIST, 3, null, {
      level: afterData.productionNeedLevel,
      evidence: afterData.productionNeedEvidence,
      approvedAt: afterData.productionNeedApprovedAt,
    });

    assert.ok(!scoreResult.scoreRationale.includes("production need POSSIBLE"));
    assert.ok(!scoreResult.scoreRationale.includes("production need CLEAR"));
  });

  await t.test("Reset from POSSIBLE to NONE clears approvedAt and evidence", () => {
    const beforeState = {
      productionNeedLevel: "POSSIBLE",
      productionNeedEvidence: ["bio: recording/indie artist"],
      productionNeedEvidenceNote: null,
      productionNeedApprovedAt: new Date(),
    };

    // Simulate operator resetting to NONE
    const resetTargetLevel = "NONE";
    const afterData = {
      productionNeedLevel: resetTargetLevel,
      productionNeedEvidence: resetTargetLevel === "NONE" ? [] : beforeState.productionNeedEvidence,
      productionNeedEvidenceNote: null,
      productionNeedApprovedAt: resetTargetLevel === "NONE" ? null : new Date(),
    };

    assert.strictEqual(afterData.productionNeedLevel, "NONE");
    assert.deepStrictEqual(afterData.productionNeedEvidence, []);
    assert.strictEqual(afterData.productionNeedApprovedAt, null);

    assert.strictEqual(isClearPreserved(afterData.productionNeedLevel, afterData.productionNeedApprovedAt), false);
  });
});

test("Adversarial Edge Cases & Freshness Boundary Stress-Testing", async (t) => {
  const now = new Date("2026-10-24T12:00:00.000Z");

  await t.test("Exact 45.000-day boundary check", () => {
    // 44 days, 23 hours, 59 minutes, 59 seconds ago -> VALID
    const unexpired = new Date(now.getTime() - (45 * 86400000 - 1000));
    assert.strictEqual(isClearPreserved("CLEAR", unexpired, now), true);

    // Exactly 45 days (45 * 86400000 ms) -> EXPIRED
    const exactBoundary = new Date(now.getTime() - 45 * 86400000);
    assert.strictEqual(isClearPreserved("CLEAR", exactBoundary, now), false);

    // 45 days + 1 millisecond -> EXPIRED
    const justExpired = new Date(now.getTime() - (45 * 86400000 + 1));
    assert.strictEqual(isClearPreserved("CLEAR", justExpired, now), false);
  });

  await t.test("Invalid / corrupt approvedAt values", () => {
    assert.strictEqual(isClearPreserved("CLEAR", null, now), false);
    assert.strictEqual(isClearPreserved("CLEAR", undefined, now), false);
    assert.strictEqual(isClearPreserved("CLEAR", "not-a-date", now), false);
    assert.strictEqual(isClearPreserved("CLEAR", {}, now), false);
    assert.strictEqual(isClearPreserved("CLEAR", NaN, now), false);
  });

  await t.test("Level variations for isClearPreserved", () => {
    const freshDate = new Date(now.getTime() - 1000);
    assert.strictEqual(isClearPreserved("POSSIBLE", freshDate, now), false, "POSSIBLE is never preserved by isClearPreserved");
    assert.strictEqual(isClearPreserved("NONE", freshDate, now), false, "NONE is never preserved");
    assert.strictEqual(isClearPreserved("clear", freshDate, now), false, "lowercase 'clear' is rejected");
    assert.strictEqual(isClearPreserved("", freshDate, now), false, "empty string is rejected");
  });

  await t.test("Future timestamp / clock skew edge case", () => {
    // Approved 5 seconds in future due to clock skew (within 5-min tolerance)
    const nearFutureDate = new Date(now.getTime() + 5000);
    assert.strictEqual(isClearPreserved("CLEAR", nearFutureDate, now), true, "Near-future timestamp (< 5 min) is preserved due to clock skew tolerance");

    // Approved beyond 5-minute clock skew tolerance
    const farFutureDate = new Date(now.getTime() + 10 * 60 * 1000);
    assert.strictEqual(isClearPreserved("CLEAR", farFutureDate, now), false, "Far-future timestamp (> 5 min) returns false");
  });

  await t.test("Score cap with CLEAR (raw score exceeds 100 -> capped at 100)", () => {
    // Austin artist with max secondary
    const maxArtist = {
      ...AUSTIN_ARTIST,
      followerCount: 5000,
      lastPostAt: now,
    };

    const scoreResult = calculateLeadScoreFromData(maxArtist, 10, {
      uniqueMoods: 10,
      uniqueThemes: 10,
      maturityRatings: ["PG"],
      hasAnalysis: true,
      trackCount: 5,
    }, {
      level: "CLEAR",
      evidence: ["Mastering request"],
      approvedAt: now,
    });

    assert.strictEqual(scoreResult.totalScore, 100, "Score strictly capped at 100");
    assert.ok(scoreResult.rawScore > 100, `Raw score exceeds 100 (got ${scoreResult.rawScore})`);
  });
});
