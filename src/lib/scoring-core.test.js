const test = require("node:test");
const assert = require("node:assert");
const { calculateLeadScoreFromData, SCORING_CONFIG } = require("./scoring-core");

test("Scoring Components", async (t) => {
  await t.test("Proximity Score (Austin Area)", () => {
    const artist = { city: "Austin", state: "TX" };
    const score = calculateLeadScoreFromData(artist, 0);
    assert.strictEqual(score.components.proximityScore, SCORING_CONFIG.WEIGHTS.proximity);
  });

  await t.test("Proximity Score (Texas but not Austin)", () => {
    const artist = { city: "Dallas", state: "TX" };
    const score = calculateLeadScoreFromData(artist, 0);
    assert.strictEqual(score.components.proximityScore, Math.round(SCORING_CONFIG.WEIGHTS.proximity * 0.5));
  });

  await t.test("Proximity Score (Outside Texas)", () => {
    const artist = { city: "Los Angeles", state: "CA" };
    const score = calculateLeadScoreFromData(artist, 0);
    assert.strictEqual(score.components.proximityScore, Math.round(SCORING_CONFIG.WEIGHTS.proximity * 0.2));
  });

  await t.test("Follower Score", () => {
    const s1 = calculateLeadScoreFromData({ followerCount: 10 }, 0).components.followerScore;
    assert.strictEqual(s1, 5); // < 50

    const s2 = calculateLeadScoreFromData({ followerCount: 3000 }, 0).components.followerScore;
    assert.strictEqual(s2, SCORING_CONFIG.WEIGHTS.followerCount); // <= 5000

    const s3 = calculateLeadScoreFromData({ followerCount: 15000 }, 0).components.followerScore;
    assert.strictEqual(s3, Math.round(SCORING_CONFIG.WEIGHTS.followerCount * 0.8)); // <= 20000

    const s4 = calculateLeadScoreFromData({ followerCount: 80000 }, 0).components.followerScore;
    assert.strictEqual(s4, Math.round(SCORING_CONFIG.WEIGHTS.followerCount * 0.4)); // <= 100000

    const s5 = calculateLeadScoreFromData({ followerCount: 200000 }, 0).components.followerScore;
    assert.strictEqual(s5, 5); // > 100000
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
    // An artist that maxes out everything
    const perfectArtist = {
      city: "Austin",
      state: "TX",
      followerCount: 3000,
      lastPostAt: new Date().toISOString(),
      instagramHandle: "test",
      spotifyArtistId: "123",
      genre: "deathcore",
      bio: "This is a very long bio that exceeds fifty characters to max out engagement points.",
      emails: ["test@test.com"],
      officialSiteUrl: "https://test.com"
    };

    const result = calculateLeadScoreFromData(perfectArtist, 5);
    assert.ok(result.rawScore > 100);
    assert.strictEqual(result.totalScore, 100);
    assert.ok(result.scoreRationale.includes("capped at 100 from"));
    assert.strictEqual(result.isQualified, true);
  });

  await t.test("Fails to qualify", () => {
    const badArtist = {
      city: "New York",
      followerCount: 2,
    };
    const result = calculateLeadScoreFromData(badArtist, 0);
    assert.ok(result.totalScore < SCORING_CONFIG.QUALIFIED_THRESHOLD);
    assert.strictEqual(result.isQualified, false);
  });
});
