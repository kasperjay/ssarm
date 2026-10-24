const test = require("node:test");
const assert = require("node:assert/strict");
const { cleanArtistName, splitArtistLineup } = require("./utils.ts");

test("cleanArtistName: preserves genuine artist and band names", () => {
  assert.equal(cleanArtistName("Die Spitz"), "Die Spitz");
  assert.equal(cleanArtistName("Being Dead"), "Being Dead");
  assert.equal(cleanArtistName("The Black Angels"), "The Black Angels");
  assert.equal(cleanArtistName("Sarah & The Sundowners"), "Sarah & The Sundowners");
  assert.equal(cleanArtistName("Hovvdy"), "Hovvdy");
});

test("cleanArtistName: strips promoter and presenter prefixes", () => {
  assert.equal(cleanArtistName("Resound Presents: The Black Angels"), "The Black Angels");
  assert.equal(cleanArtistName("KUTX Presents: Heartless Bastards"), "Heartless Bastards");
  assert.equal(cleanArtistName("Presented by Do512: Hovvdy"), "Hovvdy");
  assert.equal(cleanArtistName("C3 Presents: Spoon"), "Spoon");
  assert.equal(cleanArtistName("Margin Walker Presents: Title Fight"), "Title Fight");
  assert.equal(cleanArtistName("Presents: Men I Trust"), "Men I Trust");
});

test("cleanArtistName: strips venue prefixes and suffixes", () => {
  assert.equal(cleanArtistName("Hotel Vegas: A Giant Dog"), "A Giant Dog");
  assert.equal(cleanArtistName("Antone's: Gary Clark Jr."), "Gary Clark Jr.");
  assert.equal(cleanArtistName("Gary Clark Jr. Live at Antone's"), "Gary Clark Jr.");
  assert.equal(cleanArtistName("The Black Angels at Hotel Vegas"), "The Black Angels");
  assert.equal(cleanArtistName("Being Dead on the Volstead Patio"), "Being Dead");
  assert.equal(cleanArtistName("Puma Blue at Mohawk Austin"), "Puma Blue");
});

test("cleanArtistName: strips location, set time, and release noise", () => {
  assert.equal(cleanArtistName("The Saint Cecilia (Costa Rica)"), "The Saint Cecilia");
  assert.equal(cleanArtistName("Kennedy Ryon: The Can We Evolve? Tour"), "Kennedy Ryon");
  assert.equal(cleanArtistName("Go-Machine (Single launch)"), "Go-Machine");
  assert.equal(cleanArtistName("Being Dead (Album Release Show)"), "Being Dead");
  assert.equal(cleanArtistName("Artist @ 10:30 PM"), "Artist");
  assert.equal(cleanArtistName("Artist (21+)"), "Artist");
  assert.equal(cleanArtistName("Artist - US Tour 2026"), "Artist");
});

test("cleanArtistName: extracts headliner from co-bill lineups", () => {
  assert.equal(cleanArtistName("Die Spitz w/ Being Dead"), "Die Spitz");
  assert.equal(cleanArtistName("Headliner with Support Artist"), "Headliner");
  assert.equal(cleanArtistName("Headliner ft. Guest Performer"), "Headliner");
});

test("splitArtistLineup: splits multi-artist bills into separate clean artist names", () => {
  const result1 = splitArtistLineup("Headliner w/ Support One, Support Two");
  assert.deepEqual(result1, ["Headliner", "Support One", "Support Two"]);

  const result2 = splitArtistLineup("Zilker Sessions V w/ Angel White & The Droptines");
  assert.deepEqual(result2, ["Zilker Sessions V", "Angel White", "The Droptines"]);

  const result3 = splitArtistLineup("Resound Presents: Men I Trust with Tops");
  assert.deepEqual(result3, ["Men I Trust", "Tops"]);

  const result4 = splitArtistLineup("Band A + Band B & Band C");
  assert.deepEqual(result4, ["Band A", "Band B", "Band C"]);
});
