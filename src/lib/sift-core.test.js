const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeSiftItem,
  evaluateItemHeuristic,
  siftItems,
} = require("./sift-core.ts");

test("normalizeSiftItem: extracts full context including eventTitle, venueName, handle, and sourceType", () => {
  const item = {
    artist: "Die Spitz",
    eventTitle: "Die Spitz w/ Being Dead",
    venueName: "Mohawk",
    description: "Live show in Austin",
  };
  const normalized = normalizeSiftItem(item, 0);

  assert.equal(normalized.index, 0);
  assert.equal(normalized.name, "Die Spitz");
  assert.equal(normalized.eventTitle, "Die Spitz w/ Being Dead");
  assert.equal(normalized.venueName, "Mohawk");
  assert.equal(normalized.sourceType, "venue_calendar");
});

test("evaluateItemHeuristic: correctly identifies genuine live musical artists from venue calendars", () => {
  const artists = [
    { artist: "Die Spitz", eventTitle: "Die Spitz w/ Being Dead", venueName: "Mohawk" },
    { artist: "Being Dead", eventTitle: "Die Spitz w/ Being Dead", venueName: "Mohawk" },
    { artist: "Heartless Bastards", eventTitle: "KUTX Presents: Heartless Bastards", venueName: "Antone's" },
    { artist: "Sarah & The Sundowners", eventTitle: "Sarah & The Sundowners Live", venueName: "Antone's" },
    { artist: "The Black Angels", eventTitle: "The Black Angels at Hotel Vegas", venueName: "Hotel Vegas" },
    { artist: "Hovvdy", eventTitle: "Hovvdy", venueName: "Mohawk" },
  ];

  for (const it of artists) {
    const norm = normalizeSiftItem(it, 0);
    const ev = evaluateItemHeuristic(norm);
    assert.equal(ev.isArtist, true, `Expected "${it.artist}" to be recognized as an artist`);
    assert.ok(ev.cleanName.length > 0);
  }
});

test("evaluateItemHeuristic: separates and rejects non-artist events, trivia, drag, tributes, and promoters", () => {
  const nonArtists = [
    { artist: "The Smiths vs Morrissey Night", eventTitle: "The Smiths vs Morrissey Night at Hotel Vegas", venueName: "Hotel Vegas" },
    { artist: "Blade Rave", eventTitle: "Blade Rave", venueName: "Mohawk" },
    { artist: "Veronica Valentine", eventTitle: "Vixens of Volstead Drag Brunch", venueName: "Volstead" },
    { artist: "DREAMS - A Tribute to Fleetwood Mac", eventTitle: "DREAMS - A Tribute to Fleetwood Mac", venueName: "Antone's" },
    { artist: "Trivia Tuesday", eventTitle: "Geeks Who Drink Trivia", venueName: "Volstead" },
    { artist: "Karaoke Sundays", eventTitle: "Free Karaoke", venueName: "Volstead" },
    { artist: "Austin Flea", eventTitle: "Austin Flea Handmade Market", venueName: "Hotel Vegas" },
    { artist: "Howdy Gals", eventTitle: "Howdy Gals presents Most Personal", venueName: "Hotel Vegas" },
    { artist: "Hotel Vegas", eventTitle: "Hotel Vegas 13th Anniversary", venueName: "Hotel Vegas" },
    { artist: "Purgatory Players benefitting The Food Bank", eventTitle: "Purgatory Players benefitting The Food Bank", venueName: "Saxon Pub" },
  ];

  for (const it of nonArtists) {
    const norm = normalizeSiftItem(it, 0);
    const ev = evaluateItemHeuristic(norm);
    assert.equal(ev.isArtist, false, `Expected "${it.artist}" to be rejected as a non-artist`);
  }
});

test("evaluateItemHeuristic: filters out non-musician Instagram profiles (photographers, media, venues)", () => {
  const igItems = [
    {
      ownerUsername: "atxphotographer",
      fullName: "Austin Concert Photography",
      caption: "Had an amazing time shooting @diespitz last night!",
    },
    {
      ownerUsername: "austinchronicle",
      fullName: "The Austin Chronicle",
      caption: "Read our review of the weekend shows.",
    },
  ];

  for (const it of igItems) {
    const norm = normalizeSiftItem(it, 0);
    const ev = evaluateItemHeuristic(norm);
    assert.equal(ev.isArtist, false, `Expected @${it.ownerUsername} to be rejected as non-musician`);
  }
});

test("evaluateItemHeuristic: keeps Instagram musician profiles with musical bio", () => {
  const musician = {
    ownerUsername: "indierockband",
    fullName: "Velvet Waves",
    biography: "Indie rock band from Austin TX. New single streaming on Spotify now!",
  };
  const norm = normalizeSiftItem(musician, 0);
  const ev = evaluateItemHeuristic(norm);
  assert.equal(ev.isArtist, true, "Expected musician profile to be recognized as artist");
});

test("siftItems: handles empty or invalid requests gracefully", async () => {
  const resEmpty = await siftItems([]);
  assert.deepEqual(resEmpty.results, []);
  assert.deepEqual(resEmpty.cleanedNames, {});

  const resNull = await siftItems(null);
  assert.deepEqual(resNull.results, []);
});

test("siftItems: returns cleanedNames and booleans corresponding exactly to input list", async () => {
  const items = [
    { artist: "KUTX Presents: Heartless Bastards", eventTitle: "Heartless Bastards Live", venueName: "Antone's" },
    { artist: "Trivia Night", eventTitle: "Tuesday Trivia", venueName: "Volstead" },
    { artist: "Die Spitz w/ Support", eventTitle: "Die Spitz w/ Support", venueName: "Mohawk" },
  ];

  const result = await siftItems(items);

  assert.equal(result.results.length, 3);
  assert.equal(result.results[0], true);  // Heartless Bastards
  assert.equal(result.results[1], false); // Trivia Night
  assert.equal(result.results[2], true);  // Die Spitz

  // Cleaned names must be present and stripped of prefixes
  assert.equal(result.cleanedNames[0], "Heartless Bastards");
  assert.equal(result.cleanedNames[2], "Die Spitz");
});
