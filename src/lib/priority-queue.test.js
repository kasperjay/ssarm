const test = require("node:test");
const assert = require("node:assert/strict");
const {
  FRESHNESS_DAYS,
  buildQueueItem,
  comparePriority,
  followUpEligibility,
  outreachEligibility,
  priorityForLead,
  productionNeed,
} = require("./priority-queue");

const now = new Date("2026-10-21T12:00:00.000Z");
const lead = (overrides = {}) => ({
  id: "lead-1",
  status: "NEW",
  score: 60,
  lastContactedAt: null,
  nextActionAt: null,
  followUpActionType: null,
  productionNeedLevel: "NONE",
  productionNeedEvidence: null,
  productionNeedApprovedAt: null,
  artist: { name: "Artist", emails: ["artist@example.com"], instagramHandle: null },
  ...overrides,
});

test("production need awards automated points when fresh", () => {
  assert.equal(productionNeed(lead({ productionNeedLevel: "POSSIBLE" }), now).points, 8);
  assert.equal(productionNeed(lead({
    productionNeedLevel: "PROBABLE",
    productionNeedEvidence: ["studio tracking session"],
    productionNeedApprovedAt: new Date("2026-10-01T12:00:00Z"),
  }), now).points, 12);
  assert.equal(productionNeed(lead({
    productionNeedLevel: "PROBABLE",
    productionNeedEvidence: ["release"],
    productionNeedApprovedAt: new Date(now.getTime() - (FRESHNESS_DAYS * 86400000)),
  }), now).points, 0);
});

test("invalid and stale qualifications are visible but neutral", () => {
  const invalid = productionNeed(lead({
    productionNeedLevel: "UNKNOWN",
    productionNeedEvidence: ["request"],
    productionNeedApprovedAt: now,
  }), now);
  assert.equal(invalid.points, 0);
  assert.equal(invalid.needsReview, true);
  const stale = productionNeed(lead({
    productionNeedLevel: "PROBABLE",
    productionNeedEvidence: ["request"],
    productionNeedApprovedAt: new Date(now.getTime() - 46 * 86400000),
  }), now);
  assert.equal(stale.points, 0);
  assert.equal(stale.expired, true);
});

test("outreach eligibility requires a reachable, new lead", () => {
  assert.equal(outreachEligibility(lead(), now).actionable, true);
  assert.match(outreachEligibility(lead({ artist: { emails: [], instagramHandle: null } }), now).cleanup[0], /contact information/i);
  assert.equal(outreachEligibility(lead({ status: "WON" }), now).actionable, false);
  assert.equal(outreachEligibility(lead({ lastContactedAt: new Date("2026-10-21T10:00:00Z") }), now).actionable, false);
});

test("outreach eligibility excludes non-local artists whose Austin gigs have already been played", () => {
  const pastGigLead = lead({
    artist: {
      name: "Out of town act",
      city: "Los Angeles",
      state: "CA",
      emails: ["band@la.com"],
      instagramHandle: "laband",
    },
    activities: [
      { type: "NOTE", note: "Past Gig · Mohawk · Tue, May 12, 2026" },
    ],
  });
  const eligibility = outreachEligibility(pastGigLead, now);
  assert.equal(eligibility.actionable, false);
  assert.match(eligibility.cleanup[0], /already been played/i);
});

test("outreach eligibility keeps Austin local artists with past gigs actionable", () => {
  const localGigLead = lead({
    artist: {
      name: "Austin act",
      city: "Austin",
      state: "TX",
      emails: ["band@atx.com"],
      instagramHandle: "atxband",
    },
    activities: [
      { type: "NOTE", note: "Past Gig · Mohawk · Tue, May 12, 2026" },
    ],
  });
  const eligibility = outreachEligibility(localGigLead, now);
  assert.equal(eligibility.actionable, true);
});

test("follow-up eligibility requires date and action type", () => {
  assert.equal(followUpEligibility(lead({ status: "FOLLOW_UP" }), now).actionable, false);
  const eligible = followUpEligibility(lead({
    status: "FOLLOW_UP",
    nextActionAt: new Date("2026-10-20T12:00:00Z"),
    followUpActionType: "EMAIL",
  }), now);
  assert.equal(eligible.actionable, true);
});

test("priority is capped and sorting is deterministic", () => {
  const clear = buildQueueItem(lead({
    score: 90,
    productionNeedLevel: "PROBABLE",
    productionNeedEvidence: ["mixing request"],
    productionNeedApprovedAt: now,
  }), "outreach", now);
  assert.equal(clear.priority.score, 100);
  assert.match(clear.priority.topReasons.join(" "), /Probable production need/);
  const a = buildQueueItem(lead({ id: "a", score: 50 }), "outreach", now);
  const b = buildQueueItem(lead({ id: "b", score: 50 }), "outreach", now);
  assert.ok(comparePriority(a, b) < 0);
  assert.equal(priorityForLead(clear.lead, now).reasons.length >= clear.priority.topReasons.length, true);
});
