const test = require("node:test");
const assert = require("node:assert/strict");
const {
  parseShowActivity,
  getBestShowContext,
  formatPostWithTimestamp,
  isArtistAustinLocal,
  isNonLocalWithPastGigOnly,
} = require("./show-parser");

test("Show Parser: parses upcoming show correctly", () => {
  const fixedNow = new Date("2026-10-24T12:00:00Z");
  const note = "Izzy Outerspace with MILHD · Valhalla Tavern · Nov 5, 2026, 9:30 PM · https://do512.com/...";
  const result = parseShowActivity(note, fixedNow);

  assert.ok(result);
  assert.equal(result.title, "Izzy Outerspace with MILHD");
  assert.equal(result.venue, "Valhalla Tavern");
  assert.equal(result.isUpcoming, true);
  assert.ok(result.daysDiff > 0);
  assert.equal(result.dateStr, "Nov 5, 2026, 9:30 PM");
});

test("Show Parser: parses past show correctly and marks isUpcoming false", () => {
  const fixedNow = new Date("2026-10-24T12:00:00Z");
  const note = "DEFEATED SANITY | Come and Take It Productions · Come and Take It Live · Tue, May 12, 2026";
  const result = parseShowActivity(note, fixedNow);

  assert.ok(result);
  assert.equal(result.title, "DEFEATED SANITY");
  assert.equal(result.venue, "Come and Take It Live");
  assert.equal(result.isUpcoming, false);
  assert.ok(result.daysDiff < -100);
  assert.equal(result.dateStr, "Tue, May 12, 2026");
});

test("Show Parser: handles old multi-year past dates", () => {
  const fixedNow = new Date("2026-10-24T12:00:00Z");
  const note = "Event · Outdoor · Thu, Jan 09, 2025";
  const result = parseShowActivity(note, fixedNow);

  assert.ok(result);
  assert.equal(result.isUpcoming, false);
  assert.ok(result.daysDiff < -500);
});

test("Show Parser: ignores non-show activity notes", () => {
  const fixedNow = new Date("2026-10-24T12:00:00Z");
  assert.equal(parseShowActivity("[SCORE-UPDATE] Score: 95/100 · Austin, TX", fixedNow), null);
  assert.equal(parseShowActivity("[ENRICHMENT] stale_instagram: Last post 81 days ago", fixedNow), null);
  assert.equal(parseShowActivity("Random text note without date", fixedNow), null);
  assert.equal(parseShowActivity("", fixedNow), null);
  assert.equal(parseShowActivity(null, fixedNow), null);
});

test("Show Parser: getBestShowContext prioritizes closest upcoming show", () => {
  const fixedNow = new Date("2026-10-24T12:00:00Z");
  const activities = [
    { type: "NOTE", note: "DEFEATED SANITY · Come and Take It Live · Tue, May 12, 2026" }, // past
    { type: "NOTE", note: "Band Far Future · Mohawk · Dec 15, 2026" }, // upcoming later
    { type: "NOTE", note: "Band Soon · Valhalla Tavern · Oct 29, 2026, 9:00 PM" }, // upcoming soonest
  ];

  const ctx = getBestShowContext(activities, fixedNow);
  assert.ok(ctx.upcomingShow);
  assert.equal(ctx.upcomingShow.title, "Band Soon");
  assert.equal(ctx.upcomingShow.venue, "Valhalla Tavern");
  assert.equal(ctx.recentPastShow, null); // suppressed when upcoming exists
});

test("Show Parser: getBestShowContext returns recent past show (within 30 days) when no upcoming show exists", () => {
  const fixedNow = new Date("2026-10-24T12:00:00Z");
  const activities = [
    { type: "NOTE", note: "Event · Outdoor · Thu, Jan 09, 2025" }, // old past (> 30 days)
    { type: "NOTE", note: "Recent Show · Continental Club · Oct 15, 2026, 10:30 PM" }, // 9 days ago
  ];

  const ctx = getBestShowContext(activities, fixedNow);
  assert.equal(ctx.upcomingShow, null);
  assert.ok(ctx.recentPastShow);
  assert.equal(ctx.recentPastShow.title, "Recent Show");
  assert.equal(ctx.recentPastShow.venue, "Continental Club");
  assert.equal(ctx.recentPastShow.isUpcoming, false);
});

test("Show Parser: getBestShowContext returns null for both if past show is older than 30 days", () => {
  const fixedNow = new Date("2026-10-24T12:00:00Z");
  const activities = [
    { type: "NOTE", note: "Old Show · Come and Take It Live · Tue, May 12, 2026" }, // > 5 months ago
    { type: "NOTE", note: "Older Show · Outdoor · Thu, Jan 09, 2025" },
  ];

  const ctx = getBestShowContext(activities, fixedNow);
  assert.equal(ctx.upcomingShow, null);
  assert.equal(ctx.recentPastShow, null);
});

test("Show Parser: formatPostWithTimestamp anchors captions with relative and absolute dates", () => {
  const fixedNow = new Date("2026-10-24T12:00:00Z");

  const todayPost = { caption: "Excited for today!", postedAt: new Date("2026-10-24T08:00:00Z") };
  assert.ok(formatPostWithTimestamp(todayPost, fixedNow).includes("[Posted today on Oct 24, 2026]"));

  const yesterdayPost = { caption: "Last night was crazy", postedAt: new Date("2026-10-23T12:00:00Z") };
  assert.ok(formatPostWithTimestamp(yesterdayPost, fixedNow).includes("[Posted yesterday on Oct 23, 2026]"));

  const olderPost = { caption: "New single out!", postedAt: new Date("2026-04-10T12:00:00Z") };
  assert.ok(formatPostWithTimestamp(olderPost, fixedNow).includes("[Posted 6 months ago on Apr 10, 2026]"));

  const noDatePost = { caption: "Just vibing", postedAt: null };
  assert.equal(formatPostWithTimestamp(noDatePost, fixedNow), "Just vibing");
});

test("Show Parser: isArtistAustinLocal accurately detects Austin-area artists", () => {
  assert.equal(isArtistAustinLocal({ city: "Austin", state: "TX" }), true);
  assert.equal(isArtistAustinLocal({ city: "Round Rock", state: "TX" }), true);
  assert.equal(isArtistAustinLocal({ city: "San Marcos", state: "TX" }), true);
  assert.equal(isArtistAustinLocal({ location: "ATX" }), true);
  assert.equal(isArtistAustinLocal({ bio: "Indie rock band from Austin, Texas" }), true);

  assert.equal(isArtistAustinLocal({ city: "Dallas", state: "TX" }), false);
  assert.equal(isArtistAustinLocal({ city: "Houston", state: "TX" }), false);
  assert.equal(isArtistAustinLocal({ city: "Los Angeles", state: "CA" }), false);
  assert.equal(isArtistAustinLocal({ city: "Denver", state: "CO" }), false);
  assert.equal(isArtistAustinLocal(null), false);
});

test("Show Parser: isNonLocalWithPastGigOnly flags non-local artists whose gigs have already been played", () => {
  const fixedNow = new Date("2026-10-24T12:00:00Z");

  // Case 1: Non-local artist with past Austin gig only -> true
  const pastTouringLead = {
    artist: { name: "Touring Act", city: "Los Angeles", state: "CA" },
    activities: [
      { type: "NOTE", note: "DEFEATED SANITY · Come and Take It Live · Tue, May 12, 2026" },
    ],
  };
  assert.equal(isNonLocalWithPastGigOnly(pastTouringLead, fixedNow), true);

  // Case 2: Austin local artist with past Austin gig -> false (local artists stay in queue)
  const localArtistWithPastShow = {
    artist: { name: "Austin Band", city: "Austin", state: "TX" },
    activities: [
      { type: "NOTE", note: "DEFEATED SANITY · Come and Take It Live · Tue, May 12, 2026" },
    ],
  };
  assert.equal(isNonLocalWithPastGigOnly(localArtistWithPastShow, fixedNow), false);

  // Case 3: Non-local artist with upcoming Austin gig -> false (upcoming gig keeps them in queue)
  const upcomingTouringLead = {
    artist: { name: "Upcoming Act", city: "Chicago", state: "IL" },
    activities: [
      { type: "NOTE", note: "Touring Show · Mohawk · Nov 15, 2026" },
    ],
  };
  assert.equal(isNonLocalWithPastGigOnly(upcomingTouringLead, fixedNow), false);

  // Case 4: Non-local artist with both past gig and upcoming gig -> false
  const multiShowLead = {
    artist: { name: "Multi Show Act", city: "Denver", state: "CO" },
    activities: [
      { type: "NOTE", note: "Past Gig · Continental Club · May 10, 2026" },
      { type: "NOTE", note: "Upcoming Gig · Hotel Vegas · Dec 01, 2026" },
    ],
  };
  assert.equal(isNonLocalWithPastGigOnly(multiShowLead, fixedNow), false);

  // Case 5: Non-local artist with no show activities -> false
  const noShowsLead = {
    artist: { name: "Studio Band", city: "New York", state: "NY" },
    activities: [
      { type: "NOTE", note: "[SCORE-UPDATE] Score: 85/100" },
    ],
  };
  assert.equal(isNonLocalWithPastGigOnly(noShowsLead, fixedNow), false);
});
