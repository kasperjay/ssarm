/* eslint-disable @typescript-eslint/no-require-imports */
const test = require("node:test");
const assert = require("node:assert");
const {
  safeRate,
  safeDelta,
  safeCurrency,
  formatHours,
  getEmptyKpiData,
} = require("./kpi-math");

test("KPI Data Loader: Safe Math Utilities", async (t) => {
  await t.test("safeRate - zero division protection", () => {
    assert.strictEqual(safeRate(10, 0), 0);
    assert.strictEqual(safeRate(0, 0), 0);
    assert.strictEqual(safeRate(0, 100), 0);
    assert.strictEqual(safeRate(10, -5), 0);
    assert.strictEqual(safeRate(-10, 50), 0);
    assert.strictEqual(safeRate(null, undefined), 0);
    assert.strictEqual(safeRate(NaN, Infinity), 0);
  });

  await t.test("safeRate - standard percentages with 1 decimal place rounding", () => {
    assert.strictEqual(safeRate(1, 4), 25);
    assert.strictEqual(safeRate(1, 3), 33.3);
    assert.strictEqual(safeRate(2, 3), 66.7);
    assert.strictEqual(safeRate(42, 100), 42);
    assert.strictEqual(safeRate(14, 42), 33.3);
  });

  await t.test("safeDelta - growth and decline calculations", () => {
    // Zero baseline handling
    assert.deepStrictEqual(safeDelta(500, 0), { value: 100, isPositive: true });
    assert.deepStrictEqual(safeDelta(0, 0), { value: 0, isPositive: true });

    // Positive growth
    assert.deepStrictEqual(safeDelta(120, 100), { value: 20, isPositive: true });
    assert.deepStrictEqual(safeDelta(150, 100), { value: 50, isPositive: true });

    // Negative decline
    assert.deepStrictEqual(safeDelta(80, 100), { value: 20, isPositive: false });
    assert.deepStrictEqual(safeDelta(33, 100), { value: 67, isPositive: false });

    // Null, undefined, NaN, and negative guards
    assert.deepStrictEqual(safeDelta(null, undefined), { value: 0, isPositive: true });
    assert.deepStrictEqual(safeDelta(100, null), { value: 100, isPositive: true });
    assert.deepStrictEqual(safeDelta(null, 100), { value: 100, isPositive: false });
    assert.deepStrictEqual(safeDelta(NaN, 100), { value: 100, isPositive: false });
    assert.deepStrictEqual(safeDelta(100, -50), { value: 100, isPositive: true });
  });

  await t.test("safeCurrency - cents to USD currency strings", () => {
    assert.strictEqual(safeCurrency(0), "$0.00");
    assert.strictEqual(safeCurrency(null), "$0.00");
    assert.strictEqual(safeCurrency(undefined), "$0.00");
    assert.strictEqual(safeCurrency(NaN), "$0.00");
    assert.strictEqual(safeCurrency(-500), "$0.00");
    assert.strictEqual(safeCurrency(100), "$1.00");
    assert.strictEqual(safeCurrency(65000), "$650.00");
    assert.strictEqual(safeCurrency(1245000), "$12,450.00");
  });

  await t.test("formatHours - decimal hour formatting", () => {
    assert.strictEqual(formatHours(null), "--");
    assert.strictEqual(formatHours(undefined), "--");
    assert.strictEqual(formatHours(NaN), "--");
    assert.strictEqual(formatHours(0), "--");
    assert.strictEqual(formatHours(-5), "--");
    assert.strictEqual(formatHours(0.4), "< 1h");
    assert.strictEqual(formatHours(4.82), "4.8h");
    assert.strictEqual(formatHours(12.0), "12h");
    assert.strictEqual(formatHours(48), "48h");
  });

  await t.test("getEmptyKpiData - cold database fallback structure", () => {
    // Default timeframe fallback
    const defaultData = getEmptyKpiData();
    assert.strictEqual(defaultData.timeframe, "30d");

    const data = getEmptyKpiData("90d");
    assert.strictEqual(data.timeframe, "90d");
    assert.ok(typeof data.generatedAt === "string");

    // Hero metrics
    assert.strictEqual(data.hero.totalRevenueCents, 0);
    assert.strictEqual(data.hero.totalRevenueFormatted, "$0.00");
    assert.strictEqual(data.hero.revenueDeltaPct, 0);
    assert.strictEqual(data.hero.revenueDeltaPositive, true);
    assert.strictEqual(data.hero.conversionRatePct, 0);
    assert.strictEqual(data.hero.averageCsatRating, 0);

    // Discovery metrics
    assert.strictEqual(data.discovery.totalDiscovered, 0);
    assert.strictEqual(data.discovery.qualificationRatePct, 0);
    assert.strictEqual(data.discovery.needLevelBreakdown.length, 4);
    assert.strictEqual(data.discovery.proximityTiers.length, 4);

    // Outreach metrics
    assert.strictEqual(data.outreach.totalAttempts, 0);
    assert.strictEqual(data.outreach.overallResponseRatePct, 0);
    assert.strictEqual(data.outreach.channels.length, 4);
    assert.strictEqual(data.outreach.sentimentBreakdown.length, 4);

    // Revenue metrics
    assert.strictEqual(data.revenue.paidBillingsCents, 0);
    assert.strictEqual(data.revenue.paidBillingsFormatted, "$0.00");
    assert.strictEqual(data.revenue.funnelStages.length, 4);

    // Retention metrics
    assert.strictEqual(data.retention.averageRating, 0);
    assert.strictEqual(data.retention.ratingDistribution.length, 5);
    assert.strictEqual(data.retention.repeatArtistRatePct, 0);

    // Campaigns
    assert.deepStrictEqual(data.campaigns, []);
  });
});
