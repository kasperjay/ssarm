const test = require("node:test");
const assert = require("node:assert/strict");
const {
  normalizeSiftItem,
  evaluateItemHeuristic,
  siftItems,
  checkProfileMusicSignals,
  extractVenueCaptionContext,
} = require("./sift-core.js");

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

test("extractVenueCaptionContext: detects venue photo/sound/flyer credit disqualifications", () => {
  const photoCaption1 = "Great show last night at @hotelpub! 📸: @austinphotog";
  const credit1 = extractVenueCaptionContext(photoCaption1, "austinphotog");
  assert.equal(credit1.isCreditDisqualified, true);
  assert.equal(credit1.creditReason, "venue_photo_credit");

  const photoCaption2 = "Photos by @lenscrafter from Saturday's show.";
  const credit2 = extractVenueCaptionContext(photoCaption2, "lenscrafter");
  assert.equal(credit2.isCreditDisqualified, true);
  assert.equal(credit2.creditReason, "venue_photo_credit");

  const soundCaption = "Live at Mohawk. Sound by @frontofhouseguy";
  const credit3 = extractVenueCaptionContext(soundCaption, "frontofhouseguy");
  assert.equal(credit3.isCreditDisqualified, true);
  assert.equal(credit3.creditReason, "venue_sound_credit");

  const flyerCaption = "Show flyer by @posterartisan";
  const credit4 = extractVenueCaptionContext(flyerCaption, "posterartisan");
  assert.equal(credit4.isCreditDisqualified, true);
  assert.equal(credit4.creditReason, "venue_art_credit");
});

test("extractVenueCaptionContext: recognizes live lineup performer indicators", () => {
  const lineupCaption = "Tonight at Mohawk! Performing live: @fontband w/ @borzoi. Doors at 8pm";
  const perf1 = extractVenueCaptionContext(lineupCaption, "fontband");
  assert.equal(perf1.isLineupPerformer, true);
  assert.equal(perf1.isCreditDisqualified, false);

  const perf2 = extractVenueCaptionContext(lineupCaption, "borzoi");
  assert.equal(perf2.isLineupPerformer, true);
  assert.equal(perf2.isCreditDisqualified, false);
});

test("checkProfileMusicSignals: identifies rich music profile signals", () => {
  // Bio music role + genre + release
  const res1 = checkProfileMusicSignals({
    handle: "fontband",
    bio: "Post-punk quartet from Austin TX. Debut LP out now on Spotify & Bandcamp.",
    categoryName: "Musician/band",
    externalUrl: "https://open.spotify.com/artist/12345",
  });
  assert.equal(res1.isArtist, true);
  assert.ok(res1.signals.length >= 3);
  assert.equal(res1.disqualifiers.length, 0);

  // Streaming platform URL without explicit bio role
  const res2 = checkProfileMusicSignals({
    handle: "beingdead",
    bio: "austin tx",
    externalUrl: "https://beingdead.bandcamp.com",
  });
  assert.equal(res2.isArtist, true);
  assert.ok(res2.signals.some((s) => s.startsWith("music_link")));
});

test("checkProfileMusicSignals: disqualifies photographers, videographers, venues, and media", () => {
  const photoProfile = checkProfileMusicSignals({
    handle: "atxconcertphotog",
    bio: "Music & event photographer based in Austin. Available for hire / DMs open for camera work.",
    categoryName: "Photographer",
    externalUrl: "https://myportfolio.com",
  });
  assert.equal(photoProfile.isArtist, false);
  assert.ok(photoProfile.disqualifiers.length > 0);

  const breweryProfile = checkProfileMusicSignals({
    handle: "eastsidebrewing",
    bio: "Craft beer and pub food in East Austin. Open daily 12-10.",
    categoryName: "Brewery",
  });
  assert.equal(breweryProfile.isArtist, false);
});

test("evaluateItemHeuristic: keeps non-traditional band names when music profile signals exist", () => {
  // Acts with common or dictionary words that naive LLMs mistakenly reject
  const unconventionalBands = [
    {
      ownerUsername: "font",
      fullName: "Font",
      biography: "Post-punk 5-piece from Austin, TX. Debut album 'Strange Burden' out now.",
      externalUrl: "https://fontband.bandcamp.com",
      categoryName: "Musician/band",
    },
    {
      ownerUsername: "beingdead",
      fullName: "Being Dead",
      biography: "Band. Tour dates and vinyl available at link below.",
      externalUrl: "https://linktr.ee/beingdead",
      categoryName: "Musician/band",
    },
    {
      ownerUsername: "borzoi_tx",
      fullName: "Borzoi",
      biography: "Austin noise rock trio. Stream our new EP.",
      externalUrl: "https://open.spotify.com/artist/xyz",
    },
    {
      ownerUsername: "waterdamage_atx",
      fullName: "Water Damage",
      biography: "Minimal drone rock ensemble. 12k records.",
      externalUrl: "https://waterdamage.bandcamp.com",
    },
  ];

  for (const it of unconventionalBands) {
    const norm = normalizeSiftItem(it, 0);
    const ev = evaluateItemHeuristic(norm);
    assert.equal(ev.isArtist, true, `Expected non-traditional act "${it.fullName}" to be preserved as artist`);
  }
});

test("evaluateItemHeuristic: rejects non-musician Instagram profiles (photographers, media, venues, photo credits)", () => {
  const igItems = [
    {
      ownerUsername: "atxphotographer",
      fullName: "Austin Concert Photography",
      biography: "Freelance music photographer & visual media.",
      caption: "Had an amazing time shooting @diespitz last night! 📸: @atxphotographer",
    },
    {
      ownerUsername: "austinchronicle",
      fullName: "The Austin Chronicle",
      biography: "Austin's independent news and culture weekly.",
      caption: "Read our review of the weekend shows.",
    },
    {
      ownerUsername: "randomsoundguy",
      fullName: "Austin Audio Engineer",
      biography: "Live sound engineer for Austin clubs. Sound console wizard.",
      caption: "Great night at Mohawk. Sound by @randomsoundguy",
    },
    {
      ownerUsername: "buzzmillcoffee",
      fullName: "The Buzz Mill",
      biography: "24-hour coffee bar, craft beer, and community space.",
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
