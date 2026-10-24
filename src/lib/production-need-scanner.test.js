const test = require("node:test");
const assert = require("node:assert");
const {
  scanLeadForProductionNeeds,
  isClearPreserved,
  scanText,
  CAPTION_SIGNALS,
  BIO_SIGNALS,
  RELEASE_RECENCY_DAYS,
  FRESHNESS_DAYS,
} = require("./production-need-scanner");

test("Production Need Scanner - Caption Signals", async (t) => {
  await t.test("detects seeking mixing/mastering/production help in caption (PROBABLE)", () => {
    const result = scanLeadForProductionNeeds({
      captions: ["Hey Austin friends, looking for a mixer for our upcoming EP!"],
    });
    assert.strictEqual(result.level, "PROBABLE");
    assert.ok(result.evidence.some((e) => e.includes("seeking mixing/mastering/production help")));
  });

  await t.test("detects mix/master own music in caption (PROBABLE)", () => {
    const result = scanLeadForProductionNeeds({
      captions: ["Late night session trying to mix my new song"],
    });
    assert.strictEqual(result.level, "PROBABLE");
    assert.ok(result.evidence.some((e) => e.includes("mix/master/record own music")));
  });

  await t.test("detects studio session mention in caption (PROBABLE)", () => {
    const result = scanLeadForProductionNeeds({
      captions: ["Back in the studio tracking drums today"],
    });
    assert.strictEqual(result.level, "PROBABLE");
    assert.ok(result.evidence.some((e) => e.includes("studio session mention")));
  });

  await t.test("detects tracking/recording mention in caption (PROBABLE)", () => {
    const result = scanLeadForProductionNeeds({
      captions: ["Finished vocal tracking for the new record"],
    });
    assert.strictEqual(result.level, "PROBABLE");
    assert.ok(result.evidence.some((e) => e.includes("tracking/recording mention")));
  });

  await t.test("detects upcoming new music and release drops in caption (POSSIBLE)", () => {
    const result = scanLeadForProductionNeeds({
      captions: ["New single dropping next Friday, stay tuned!"],
    });
    assert.strictEqual(result.level, "POSSIBLE");
    assert.ok(result.evidence.length >= 1);
  });

  await t.test("detects actively making music in caption (POSSIBLE)", () => {
    const result = scanLeadForProductionNeeds({
      captions: ["Spent the weekend making beats"],
    });
    assert.strictEqual(result.level, "POSSIBLE");
    assert.ok(result.evidence.some((e) => e.includes("actively making music")));
  });

  await t.test("detects feature/collab/vocal mention in caption (POSSIBLE)", () => {
    const result = scanLeadForProductionNeeds({
      captions: ["Looking for a guest verse or vocal collab on this rock track"],
    });
    assert.strictEqual(result.level, "POSSIBLE");
    assert.ok(result.evidence.some((e) => e.includes("feature/collab/vocal mention")));
  });

  await t.test("detects audio engineering / sound design keywords in caption (PROBABLE)", () => {
    const result = scanLeadForProductionNeeds({
      captions: ["Diving deep into sound design and audio engineering"],
    });
    assert.strictEqual(result.level, "PROBABLE");
    assert.ok(result.evidence.some((e) => e.includes("engineering keyword")));
  });
});

test("Production Need Scanner - Bio Signals", async (t) => {
  await t.test("detects seeking mixing/production in bio (PROBABLE)", () => {
    const result = scanLeadForProductionNeeds({
      bio: "Austin indie rock band. Open to producer and mixing collaborations.",
    });
    assert.strictEqual(result.level, "PROBABLE");
    assert.ok(result.evidence.some((e) => e.includes("bio: seeking mixing/production")));
  });

  await t.test("detects mix/master own music in bio (PROBABLE)", () => {
    const result = scanLeadForProductionNeeds({
      bio: "Songwriter learning to produce my songs from home.",
    });
    assert.strictEqual(result.level, "PROBABLE");
    assert.ok(result.evidence.some((e) => e.includes("bio: mix/master/record own music")));
  });

  await t.test("detects recording/indie artist in bio (POSSIBLE)", () => {
    const result = scanLeadForProductionNeeds({
      bio: "Independent artist releasing music in Texas.",
    });
    assert.strictEqual(result.level, "POSSIBLE");
    assert.ok(result.evidence.some((e) => e.includes("bio: recording/indie artist")));
  });

  await t.test("detects upcoming release in bio (POSSIBLE)", () => {
    const result = scanLeadForProductionNeeds({
      bio: "Austin TX • Upcoming album releasing late 2026",
    });
    assert.strictEqual(result.level, "POSSIBLE");
    assert.ok(result.evidence.some((e) => e.includes("bio: upcoming release")));
  });
});

test("Production Need Scanner - Spotify Release Activity", async (t) => {
  await t.test("triggers signal when release is within 180 days (POSSIBLE)", () => {
    const recentDate = new Date(Date.now() - 30 * 86400000); // 30 days ago
    const result = scanLeadForProductionNeeds({
      releases: [{ title: "Midnight Sun", releaseDate: recentDate }],
    });
    assert.strictEqual(result.level, "POSSIBLE");
    assert.ok(result.evidence.some((e) => e.includes("recent Spotify release activity (Midnight Sun)")));
  });

  await t.test("does NOT trigger signal when release is older than 180 days", () => {
    const oldDate = new Date(Date.now() - 200 * 86400000); // 200 days ago
    const result = scanLeadForProductionNeeds({
      releases: [{ title: "Ancient Album", releaseDate: oldDate }],
    });
    assert.strictEqual(result.level, "NONE");
    assert.strictEqual(result.evidence.length, 0);
  });
});

test("Production Need Scanner - Automated Tier Classification", async (t) => {
  await t.test("automated scan assigns PROBABLE when studio/mix/master/tracking signals exist", () => {
    const multiSignalLead = {
      bio: "Austin recording artist looking for mix engineer for my album. Upcoming EP coming soon.",
      captions: [
        "Need a mixer and mastering engineer for our new album ASAP!",
        "In the studio mixing my new track",
        "New single dropping next week",
      ],
      releases: [
        { title: "Summer Heat", releaseDate: new Date() },
      ],
    };

    const result = scanLeadForProductionNeeds(multiSignalLead);
    assert.strictEqual(result.level, "PROBABLE");
    assert.ok(result.evidence.length >= 3);
    assert.strictEqual(result.source.type, "AUTOMATED_SCAN");
    assert.ok(result.source.signalCount >= 3);
  });

  await t.test("automated scan assigns POSSIBLE when only upcoming release / drops exist without studio/mix/track mentions", () => {
    const releaseOnlyLead = {
      bio: "Austin indie songwriter. Releasing soon!",
      captions: [
        "New single dropping next week! Pre-save link in bio.",
      ],
      releases: [],
    };

    const result = scanLeadForProductionNeeds(releaseOnlyLead);
    assert.strictEqual(result.level, "POSSIBLE");
  });

  await t.test("lead with no signals returns NONE with empty evidence", () => {
    const cleanLead = {
      bio: "Just a fan page sharing photography and nature pics.",
      captions: [
        "Great sunny day in the park",
        "Coffee with friends",
      ],
      releases: [],
    };

    const result = scanLeadForProductionNeeds(cleanLead);
    assert.strictEqual(result.level, "NONE");
    assert.deepStrictEqual(result.evidence, []);
  });

  await t.test("safely handles null, undefined, or empty inputs", () => {
    const res1 = scanLeadForProductionNeeds(null);
    assert.strictEqual(res1.level, "NONE");
    assert.deepStrictEqual(res1.evidence, []);

    const res2 = scanLeadForProductionNeeds({});
    assert.strictEqual(res2.level, "NONE");
    assert.deepStrictEqual(res2.evidence, []);

    const res3 = scanLeadForProductionNeeds({ bio: null, captions: null, releases: null });
    assert.strictEqual(res3.level, "NONE");
    assert.deepStrictEqual(res3.evidence, []);
  });
});

test("Production Need Scanner - Manual CLEAR/PROBABLE Preservation Helper (R2)", async (t) => {
  const approved10DaysAgo = new Date(Date.now() - 10 * 86400000);
  const approved50DaysAgo = new Date(Date.now() - 50 * 86400000);

  await t.test("preserves manual CLEAR when approved within 45 days", () => {
    assert.strictEqual(isClearPreserved("CLEAR", approved10DaysAgo), true);
  });

  await t.test("preserves manual PROBABLE when approved within 45 days", () => {
    assert.strictEqual(isClearPreserved("PROBABLE", approved10DaysAgo), true);
  });

  await t.test("does NOT preserve CLEAR when older than 45 days (expired)", () => {
    assert.strictEqual(isClearPreserved("CLEAR", approved50DaysAgo), false);
  });

  await t.test("does NOT preserve when level is POSSIBLE or NONE", () => {
    assert.strictEqual(isClearPreserved("POSSIBLE", approved10DaysAgo), false);
    assert.strictEqual(isClearPreserved("NONE", approved10DaysAgo), false);
  });

  await t.test("does NOT preserve when approvedAt is null or invalid", () => {
    assert.strictEqual(isClearPreserved("CLEAR", null), false);
    assert.strictEqual(isClearPreserved("CLEAR", "invalid-date"), false);
  });
});

test("Production Need Scanner - Exported Constants & scanText helper", async (t) => {
  await t.test("exports valid FRESHNESS_DAYS and RELEASE_RECENCY_DAYS", () => {
    assert.strictEqual(FRESHNESS_DAYS, 45);
    assert.strictEqual(RELEASE_RECENCY_DAYS, 180);
  });

  await t.test("exports valid signal definition lists", () => {
    assert.ok(Array.isArray(CAPTION_SIGNALS) && CAPTION_SIGNALS.length > 0);
    assert.ok(Array.isArray(BIO_SIGNALS) && BIO_SIGNALS.length > 0);
  });

  await t.test("scanText returns hits and de-duplicates identical rule matches", () => {
    const text = "looking for a mixer for this track, really need a mixer";
    const hits = scanText(text, CAPTION_SIGNALS);
    assert.ok(hits.length >= 1);
    const labels = hits.map((h) => h.label);
    const uniqueLabels = [...new Set(labels)];
    assert.strictEqual(labels.length, uniqueLabels.length);
  });
});
