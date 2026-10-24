const test = require("node:test");
const assert = require("node:assert");
const { calculateLeadScoreFromData, SCORING_CONFIG } = require("./scoring-core");
const { isClearPreserved } = require("./production-need-scanner");

test("Scoring Components", async (t) => {
  await t.test("Proximity Score (Austin Area)", () => {
    const artist = { city: "Austin", state: "TX" };
    const score = calculateLeadScoreFromData(artist, 0);
    assert.strictEqual(score.components.proximityScore, SCORING_CONFIG.WEIGHTS.proximity);
    assert.strictEqual(score.components.proximityScore, 35);
  });

  await t.test("Proximity Score (Texas but not Austin)", () => {
    const artist = { city: "Dallas", state: "TX" };
    const score = calculateLeadScoreFromData(artist, 0);
    assert.strictEqual(score.components.proximityScore, SCORING_CONFIG.WEIGHTS.proximityTexas);
    assert.strictEqual(score.components.proximityScore, 25);
  });

  await t.test("Proximity Score (Outside Texas)", () => {
    const artist = { city: "Los Angeles", state: "CA" };
    const score = calculateLeadScoreFromData(artist, 0);
    assert.strictEqual(score.components.proximityScore, SCORING_CONFIG.WEIGHTS.proximityOutside);
    assert.strictEqual(score.components.proximityScore, 5);
  });

  await t.test("Proximity Score (Unknown Location)", () => {
    const artist = { name: "Mystery Band" };
    const score = calculateLeadScoreFromData(artist, 0);
    assert.strictEqual(score.components.proximityScore, 0);
    assert.ok(score.totalScore <= 14);
  });

  await t.test("Proximity Score (Touring show in Austin)", () => {
    const artist = { city: "Los Angeles", state: "CA", hasAustinVenueTie: true };
    const score = calculateLeadScoreFromData(artist, 0);
    assert.strictEqual(score.components.proximityScore, SCORING_CONFIG.WEIGHTS.proximityTouring);
    assert.strictEqual(score.components.proximityScore, 15);
  });

  await t.test("Proximity Score (Texas artist playing Austin venue retains 25pts and venue tie)", () => {
    const artist = { city: "Dallas", state: "TX", hasAustinVenueTie: true };
    const score = calculateLeadScoreFromData(artist, 0);
    assert.strictEqual(score.components.proximityScore, SCORING_CONFIG.WEIGHTS.proximityTexas);
    assert.strictEqual(score.components.proximityScore, 25);
    assert.strictEqual(score.hasActivityProof, true);
  });

  await t.test("Austin artist has strong local advantage over identical out-of-state artist", () => {
    const austinArtist = {
      city: "Austin",
      state: "TX",
      followerCount: 3000,
      lastPostAt: new Date().toISOString(),
      genre: "deathcore",
    };
    const nyArtist = {
      city: "New York",
      state: "NY",
      followerCount: 3000,
      lastPostAt: new Date().toISOString(),
      genre: "deathcore",
    };
    const austinScore = calculateLeadScoreFromData(austinArtist, 3);
    const nyScore = calculateLeadScoreFromData(nyArtist, 3);

    // Austin proximity (35) vs NY proximity (5) = +30 pt difference
    assert.strictEqual(austinScore.components.proximityScore, 35);
    assert.strictEqual(nyScore.components.proximityScore, 5);
    assert.ok(austinScore.totalScore > nyScore.totalScore);
  });

  await t.test("Active out-of-state artist outscores bare-bones Austin profile with 0 activity", () => {
    const bareAustinArtist = {
      city: "Austin",
      state: "TX",
      followerCount: 0,
      genre: null,
      bio: null,
    };
    const austinScore = calculateLeadScoreFromData(bareAustinArtist, 0);

    const maxedNYArtist = {
      city: "New York",
      state: "NY",
      followerCount: 3000,
      lastPostAt: new Date().toISOString(),
      instagramHandle: "nyband",
      spotifyArtistId: "spotify123",
      genre: "deathcore",
      bio: "A very long detailed bio that exceeds fifty characters to maximize engagement.",
      emails: ["contact@nyband.com"],
      officialSiteUrl: "https://nyband.com",
    };
    const nyAnalysis = { trackCount: 5, moodCount: 5, themeCount: 5, ratingCounts: { R: 4 } };
    const nyScore = calculateLeadScoreFromData(maxedNYArtist, 5, nyAnalysis);

    assert.ok(nyScore.totalScore > austinScore.totalScore);
    assert.strictEqual(austinScore.isQualified, false);
    assert.strictEqual(nyScore.isQualified, true);
  });

  await t.test("Bare Austin artist does NOT auto-qualify without data", () => {
    const bareAustinArtist = { city: "Austin", state: "TX" };
    const austinScore = calculateLeadScoreFromData(bareAustinArtist, 0);
    assert.ok(austinScore.totalScore < SCORING_CONFIG.QUALIFIED_THRESHOLD);
    assert.strictEqual(austinScore.isQualified, false);
  });

  await t.test("Follower Score (Option 2: Strict DIY Focus)", () => {
    const s1 = calculateLeadScoreFromData({ followerCount: 50 }, 0).components.followerScore;
    assert.strictEqual(s1, 0); // < 100

    const s2 = calculateLeadScoreFromData({ followerCount: 300 }, 0).components.followerScore;
    assert.strictEqual(s2, 8); // 100 - 499

    const s3 = calculateLeadScoreFromData({ followerCount: 1500 }, 0).components.followerScore;
    assert.strictEqual(s3, SCORING_CONFIG.WEIGHTS.followerCount); // 500 - 2500 (20 pts)

    const s4 = calculateLeadScoreFromData({ followerCount: 3500 }, 0).components.followerScore;
    assert.strictEqual(s4, 12); // 2501 - 5000

    const s5 = calculateLeadScoreFromData({ followerCount: 8000 }, 0).components.followerScore;
    assert.strictEqual(s5, 4); // 5001 - 10000

    const s6 = calculateLeadScoreFromData({ followerCount: 25000 }, 0).components.followerScore;
    assert.strictEqual(s6, 0); // > 10000 (established audience)
  });

  await t.test("Recency Score", () => {
    const now = Date.now();
    const artistNew = { lastPostAt: new Date(now - 1000 * 60 * 60 * 24 * 10).toISOString() }; // 10 days ago
    const s1 = calculateLeadScoreFromData(artistNew, 0).components.recencyScore;
    assert.ok(s1 > 0);

    const artistOld = { lastPostAt: new Date(now - 1000 * 60 * 60 * 24 * 200).toISOString() }; // 200 days ago
    const s2 = calculateLeadScoreFromData(artistOld, 0).components.recencyScore;
    assert.strictEqual(s2, 0);
  });

  await t.test("Release Score", () => {
    const s1 = calculateLeadScoreFromData({}, 1).components.releaseScore;
    assert.strictEqual(s1, Math.round((1 / SCORING_CONFIG.MIN_RELEASES) * SCORING_CONFIG.WEIGHTS.releaseCount));

    const s2 = calculateLeadScoreFromData({}, 5).components.releaseScore;
    assert.strictEqual(s2, SCORING_CONFIG.WEIGHTS.releaseCount); // capped at 1
  });

  await t.test("Genre Bonus", () => {
    const s1 = calculateLeadScoreFromData({ genre: "Deathcore" }, 0).components.genreBonus;
    assert.strictEqual(s1, SCORING_CONFIG.WEIGHTS.genreBonus);

    const s2 = calculateLeadScoreFromData({ genre: "Pop" }, 0).components.genreBonus;
    assert.strictEqual(s2, Math.round(SCORING_CONFIG.WEIGHTS.genreBonus * 0.4));

    const s3 = calculateLeadScoreFromData({ genre: "unknown" }, 0).components.genreBonus;
    assert.strictEqual(s3, 0);
  });
});

test("Total Score Capping and Qualification", async (t) => {
  await t.test("Caps at 100", () => {
    const perfectArtist = {
      city: "Austin",
      state: "TX",
      followerCount: 2000,
      lastPostAt: new Date().toISOString(),
      instagramHandle: "test",
      spotifyArtistId: "123",
      genre: "deathcore",
      bio: "This is a very long bio that exceeds fifty characters to max out engagement points.",
      emails: ["test@test.com"],
      officialSiteUrl: "https://test.com",
    };

    const result = calculateLeadScoreFromData(perfectArtist, 5);
    assert.strictEqual(result.totalScore, 100);
    assert.strictEqual(result.isQualified, true);
  });

  await t.test("Fails to qualify (Out of state low engagement)", () => {
    const badArtist = {
      city: "New York",
      followerCount: 2,
    };
    const result = calculateLeadScoreFromData(badArtist, 0);
    assert.ok(result.totalScore < SCORING_CONFIG.QUALIFIED_THRESHOLD);
    assert.strictEqual(result.isQualified, false);
  });

  await t.test("Fails to qualify (Unknown location)", () => {
    const noLocArtist = {
      name: "Unknown Band",
      followerCount: 5000,
      genre: "deathcore",
    };
    const result = calculateLeadScoreFromData(noLocArtist, 2);
    assert.ok(result.totalScore < SCORING_CONFIG.QUALIFIED_THRESHOLD);
    assert.strictEqual(result.isQualified, false);
  });

  await t.test("Requires at least one proof of activity to qualify even if score >= 60", () => {
    // Austin (35) + deathcore (25) + completeness (4) = 64 (>= 60)
    // but 0 releases, no lastPostAt, no venue tie, no production need
    const unverifiedArtist = {
      city: "Austin",
      state: "TX",
      genre: "deathcore",
    };
    const unverifiedResult = calculateLeadScoreFromData(unverifiedArtist, 0);
    assert.ok(unverifiedResult.totalScore >= SCORING_CONFIG.QUALIFIED_THRESHOLD);
    assert.strictEqual(unverifiedResult.hasActivityProof, false);
    assert.strictEqual(unverifiedResult.isQualified, false);
    assert.ok(unverifiedResult.scoreRationale.includes("requires activity proof"));

    // Adding 1 release -> satisfies proof of activity -> qualifies!
    const verifiedByRelease = calculateLeadScoreFromData(unverifiedArtist, 1);
    assert.strictEqual(verifiedByRelease.hasActivityProof, true);
    assert.strictEqual(verifiedByRelease.isQualified, true);

    // Adding recent post -> satisfies proof of activity -> qualifies!
    const verifiedByPost = calculateLeadScoreFromData(
      {
        ...unverifiedArtist,
        lastPostAt: new Date().toISOString(),
      },
      0
    );
    assert.strictEqual(verifiedByPost.hasActivityProof, true);
    assert.strictEqual(verifiedByPost.isQualified, true);

    // Adding Austin venue tie -> satisfies proof of activity -> qualifies!
    const verifiedByVenue = calculateLeadScoreFromData(
      {
        ...unverifiedArtist,
        hasAustinVenueTie: true,
      },
      0
    );
    assert.strictEqual(verifiedByVenue.hasActivityProof, true);
    assert.strictEqual(verifiedByVenue.isQualified, true);

    // Adding production need -> satisfies proof of activity -> qualifies!
    const verifiedByNeed = calculateLeadScoreFromData(unverifiedArtist, 0, null, "POSSIBLE");
    assert.strictEqual(verifiedByNeed.hasActivityProof, true);
    assert.strictEqual(verifiedByNeed.isQualified, true);
  });
});

test("Production Need Scoring & Points (R3)", async (t) => {
  const baseArtist = { city: "Dallas", state: "TX" }; // Tier 2: 50 base

  await t.test("Awards +8 points for POSSIBLE level", () => {
    const scoreNone = calculateLeadScoreFromData(baseArtist, 0, null, "NONE");
    const scorePossible = calculateLeadScoreFromData(baseArtist, 0, null, "POSSIBLE");

    assert.strictEqual(scoreNone.components.productionNeedScore, 0);
    assert.strictEqual(scorePossible.components.productionNeedScore, 8);
    assert.strictEqual(scorePossible.totalScore, scoreNone.totalScore + 8);
  });

  await t.test("Awards +12 points for PROBABLE level", () => {
    const scoreNone = calculateLeadScoreFromData(baseArtist, 0, null, "NONE");
    const scoreProbable = calculateLeadScoreFromData(baseArtist, 0, null, "PROBABLE");

    assert.strictEqual(scoreProbable.components.productionNeedScore, 12);
    assert.strictEqual(scoreProbable.totalScore, scoreNone.totalScore + 12);
  });

  await t.test("Awards +12 points for legacy CLEAR level", () => {
    const scoreNone = calculateLeadScoreFromData(baseArtist, 0, null, "NONE");
    const scoreClear = calculateLeadScoreFromData(baseArtist, 0, null, "CLEAR");

    assert.strictEqual(scoreClear.components.productionNeedScore, 12);
    assert.strictEqual(scoreClear.totalScore, scoreNone.totalScore + 12);
  });

  await t.test("Awards 0 points for NONE or undefined", () => {
    const scoreDefault = calculateLeadScoreFromData(baseArtist, 0);
    const scoreNone = calculateLeadScoreFromData(baseArtist, 0, null, { level: "NONE" });

    assert.strictEqual(scoreDefault.components.productionNeedScore, 0);
    assert.strictEqual(scoreNone.components.productionNeedScore, 0);
    assert.strictEqual(scoreDefault.totalScore, scoreNone.totalScore);
  });
});

test("Production Need Freshness and Expiration (R2, R3)", async (t) => {
  const artist = { city: "Dallas", state: "TX" };
  const baseScoreWithoutNeed = calculateLeadScoreFromData(artist, 0).totalScore;

  await t.test("Fresh qualification (< 45 days) awards designated points", () => {
    const approved15DaysAgo = new Date(Date.now() - 15 * 86400000);
    const score = calculateLeadScoreFromData(artist, 0, null, {
      level: "PROBABLE",
      evidence: ["asking for mixer in DM"],
      approvedAt: approved15DaysAgo,
    });

    assert.strictEqual(score.components.productionNeedScore, 12);
    assert.strictEqual(score.totalScore, baseScoreWithoutNeed + 12);
    assert.ok(score.scoreRationale.includes("production need PROBABLE (+12pts: asking for mixer in DM)"));
  });

  await t.test("Expired qualification (>= 45 days) awards 0 points", () => {
    const approved45DaysAgo = new Date(Date.now() - 45 * 86400000);
    const score45 = calculateLeadScoreFromData(artist, 0, null, {
      level: "PROBABLE",
      evidence: ["asking for mixer in DM"],
      approvedAt: approved45DaysAgo,
    });

    const approved60DaysAgo = new Date(Date.now() - 60 * 86400000);
    const score60 = calculateLeadScoreFromData(artist, 0, null, {
      level: "POSSIBLE",
      evidence: ["studio session"],
      approvedAt: approved60DaysAgo,
    });

    assert.strictEqual(score45.components.productionNeedScore, 0);
    assert.strictEqual(score45.totalScore, baseScoreWithoutNeed);
    assert.ok(score45.scoreRationale.includes("production need PROBABLE expired (0pts)"));

    assert.strictEqual(score60.components.productionNeedScore, 0);
    assert.strictEqual(score60.totalScore, baseScoreWithoutNeed);
    assert.ok(score60.scoreRationale.includes("production need POSSIBLE expired (0pts)"));
  });
});

test("Strict 100-Point Score Cap with Production Need (R3)", async (t) => {
  await t.test("Strictly caps total score at 100 when base + secondary + PROBABLE exceeds 100", () => {
    // Austin artist with high secondary signals (90+ base)
    const austinArtist = {
      city: "Austin",
      state: "TX",
      followerCount: 2000, // +20 (sweet spot)
      genre: "deathcore", // +25
      bio: "Detailed bio exceeding fifty characters to maximize engagement score.",
    };

    const baseResult = calculateLeadScoreFromData(austinArtist, 3);
    assert.ok(baseResult.totalScore >= 85);

    // Adding PROBABLE (+12) caps at 100
    const clearResult = calculateLeadScoreFromData(austinArtist, 3, null, {
      level: "PROBABLE",
      evidence: ["needs mixing engineer"],
    });

    assert.strictEqual(clearResult.totalScore, 100);
    assert.strictEqual(clearResult.score, 100);
  });
});

test("State Transitions and Point Differences (POSSIBLE vs PROBABLE)", async (t) => {
  const artist = { city: "Dallas", state: "TX" };

  await t.test("PROBABLE (+12) increases score by 4 points over POSSIBLE (+8)", () => {
    const possibleScore = calculateLeadScoreFromData(artist, 0, null, {
      level: "POSSIBLE",
      evidence: ["upcoming album drop"],
      approvedAt: new Date(),
    });
    const probableScore = calculateLeadScoreFromData(artist, 0, null, {
      level: "PROBABLE",
      evidence: ["studio tracking session", "mixing stems"],
      approvedAt: new Date(),
    });

    assert.strictEqual(possibleScore.components.productionNeedScore, 8);
    assert.strictEqual(probableScore.components.productionNeedScore, 12);
    assert.strictEqual(probableScore.totalScore - possibleScore.totalScore, 4);
  });
});

test("Iteration 2 Hardening: Edge Cases & Robustness", async (t) => {
  await t.test("Negative releaseCount and followerCount floor at 0 and do not yield negative scores", () => {
    const resNegRelease = calculateLeadScoreFromData({ city: "Unknown" }, -5);
    assert.strictEqual(resNegRelease.components.releaseScore, 0);
    assert.ok(resNegRelease.totalScore >= 0, `Expected totalScore >= 0, got ${resNegRelease.totalScore}`);
    assert.ok(resNegRelease.rawScore >= 0, `Expected rawScore >= 0, got ${resNegRelease.rawScore}`);

    const resNegFollowers = calculateLeadScoreFromData({ followerCount: -500 }, 0);
    assert.strictEqual(resNegFollowers.components.followerScore, 0);
    assert.ok(resNegFollowers.totalScore >= 0);
    assert.ok(resNegFollowers.rawScore >= 0);

    const resNaN = calculateLeadScoreFromData({}, NaN);
    assert.strictEqual(resNaN.components.releaseScore, 0);
  });

  await t.test("Whitespace trimming for productionNeed string and object levels", () => {
    const baseArtist = { city: "Dallas", state: "TX" };
    const baseScore = calculateLeadScoreFromData(baseArtist, 0).totalScore;

    // String input with whitespace
    const resTrimStr = calculateLeadScoreFromData(baseArtist, 0, null, "  POSSIBLE  ");
    assert.strictEqual(resTrimStr.components.productionNeedScore, 8);
    assert.strictEqual(resTrimStr.totalScore, baseScore + 8);

    const resTrimStrClear = calculateLeadScoreFromData(baseArtist, 0, null, "  CLEAR  ");
    assert.strictEqual(resTrimStrClear.components.productionNeedScore, 12);
    assert.strictEqual(resTrimStrClear.totalScore, baseScore + 12);

    const resTrimStrProbable = calculateLeadScoreFromData(baseArtist, 0, null, "  PROBABLE  ");
    assert.strictEqual(resTrimStrProbable.components.productionNeedScore, 12);
    assert.strictEqual(resTrimStrProbable.totalScore, baseScore + 12);

    // Object input with whitespace
    const resTrimObj = calculateLeadScoreFromData(baseArtist, 0, null, {
      level: "  POSSIBLE  ",
      evidence: ["  needs mixing  ", ""],
    });
    assert.strictEqual(resTrimObj.components.productionNeedScore, 8);
    assert.ok(resTrimObj.scoreRationale.includes("needs mixing"));

    const resTrimObjClear = calculateLeadScoreFromData(baseArtist, 0, null, {
      level: "  CLEAR  ",
    });
    assert.strictEqual(resTrimObjClear.components.productionNeedScore, 12);
  });

  await t.test("Clock skew tolerance and trimming in isClearPreserved", () => {
    const now = new Date();

    // Whitespace trimming in isClearPreserved
    assert.strictEqual(isClearPreserved("  CLEAR  ", now, now), true);
    assert.strictEqual(isClearPreserved("  clear  ", now, now), false); // lowercase rejected

    // Within 5-minute clock skew tolerance (future timestamp)
    const future2Min = new Date(now.getTime() + 2 * 60 * 1000);
    assert.strictEqual(isClearPreserved("CLEAR", future2Min, now), true, "Timestamp 2 minutes in future is preserved");

    const future4Min = new Date(now.getTime() + 4.9 * 60 * 1000);
    assert.strictEqual(isClearPreserved("CLEAR", future4Min, now), true, "Timestamp 4.9 minutes in future is preserved");

    // Beyond 5-minute clock skew tolerance
    const future10Min = new Date(now.getTime() + 10 * 60 * 1000);
    assert.strictEqual(isClearPreserved("CLEAR", future10Min, now), false, "Timestamp 10 minutes in future is rejected");
  });
});
