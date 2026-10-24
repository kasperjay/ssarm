const test = require("node:test");
const assert = require("node:assert/strict");
const {
  cleanHandle,
  extractCaptionMentions,
  extractTaggedProfiles,
} = require("./instagram-discovery");

test("Instagram Discovery: cleanHandle normalizes and validates handles", () => {
  assert.equal(cleanHandle("@band_name"), "band_name");
  assert.equal(cleanHandle("@@band.name..."), "band.name");
  assert.equal(cleanHandle("Valid_Artist.123"), "valid_artist.123");
  assert.equal(cleanHandle(""), null);
  assert.equal(cleanHandle("a"), null); // too short
  assert.equal(cleanHandle("@instagram"), null); // ignored system handle
  assert.equal(cleanHandle("meta"), null);
  assert.equal(cleanHandle("invalid handle with spaces"), null);
  assert.equal(cleanHandle(null), null);
});

test("Instagram Discovery: extractCaptionMentions parses mentions and ignores emails", () => {
  const caption = "Catch @band_one and @band.two live! Booking: info@venue.com, shoutout @band3, thanks @band4.";
  const mentions = extractCaptionMentions(caption);
  assert.deepEqual(mentions.sort(), ["band.two", "band3", "band4", "band_one"].sort());
  assert.ok(!mentions.includes("venue.com"));
  assert.ok(!mentions.includes("info"));
});

test("Instagram Discovery: extracts taggedUsers, coauthors, mentions, and author from single post", () => {
  const rawPosts = [
    {
      shortCode: "ABC123xyz",
      ownerUsername: "mohawkaustin",
      ownerFullName: "Mohawk Austin",
      caption: "Tonight! Live sets from @the_hushabyes and @connor_music. Sound by @soundguy.",
      displayUrl: "https://example.com/flyer.jpg",
      timestamp: "2026-10-24T20:00:00Z",
      taggedUsers: [
        {
          username: "the_hushabyes",
          full_name: "The Hushabyes",
          profile_pic_url: "https://example.com/hushabyes.jpg",
        },
        {
          username: "connor_music",
          full_name: "Connor Schwanke",
          profile_pic_url: "https://example.com/connor.jpg",
        },
      ],
      coauthorProducers: [
        {
          username: "coauthor_band",
          full_name: "Coauthor Band",
          profile_pic_url: "https://example.com/coauthor.jpg",
        },
      ],
      mentions: ["the_hushabyes", "soundguy"],
    },
  ];

  const results = extractTaggedProfiles(rawPosts);
  assert.equal(results.length, 5); // mohawkaustin (author), the_hushabyes, connor_music, coauthor_band, soundguy

  const hushabyes = results.find((r) => r.username === "the_hushabyes");
  assert.ok(hushabyes);
  assert.equal(hushabyes.artist, "The Hushabyes");
  assert.equal(hushabyes.fullName, "The Hushabyes");
  assert.equal(hushabyes.profilePicUrl, "https://example.com/hushabyes.jpg");
  assert.equal(hushabyes.sourceType, "tagged");
  assert.equal(hushabyes.shortCode, "ABC123xyz");
  assert.equal(hushabyes.url, "https://www.instagram.com/p/ABC123xyz/");

  const connor = results.find((r) => r.username === "connor_music");
  assert.ok(connor);
  assert.equal(connor.artist, "Connor Schwanke");
  assert.equal(connor.sourceType, "tagged");

  const coauthor = results.find((r) => r.username === "coauthor_band");
  assert.ok(coauthor);
  assert.equal(coauthor.artist, "Coauthor Band");
  assert.equal(coauthor.sourceType, "coauthor");

  const soundguy = results.find((r) => r.username === "soundguy");
  assert.ok(soundguy);
  assert.equal(soundguy.sourceType, "mention");

  const mohawk = results.find((r) => r.username === "mohawkaustin");
  assert.ok(mohawk);
  assert.equal(mohawk.sourceType, "author");
});

test("Instagram Discovery: extracts taggedUsers from carousel childPosts", () => {
  const rawPosts = [
    {
      shortCode: "CAROUSEL1",
      ownerUsername: "fest_austin",
      caption: "Check all the slides for the festival lineup!",
      childPosts: [
        {
          taggedUsers: [
            { username: "slide1_artist", full_name: "Slide One Band" },
          ],
        },
        {
          taggedUsers: ["slide2_artist"],
        },
      ],
    },
  ];

  const results = extractTaggedProfiles(rawPosts);
  assert.ok(results.some((r) => r.username === "slide1_artist" && r.artist === "Slide One Band"));
  assert.ok(results.some((r) => r.username === "slide2_artist"));
});

test("Instagram Discovery: deduplicates and merges profiles across multiple posts preserving richest data", () => {
  const rawPosts = [
    {
      shortCode: "POST1",
      ownerUsername: "venue1",
      caption: "Opening with @repeat_artist",
      mentions: ["repeat_artist"],
    },
    {
      shortCode: "POST2",
      ownerUsername: "venue2",
      caption: "Headline show with @repeat_artist",
      taggedUsers: [
        {
          username: "repeat_artist",
          full_name: "Repeat Artist Band",
          profile_pic_url: "https://example.com/pic.jpg",
        },
      ],
    },
  ];

  const results = extractTaggedProfiles(rawPosts);
  const artist = results.find((r) => r.username === "repeat_artist");
  assert.ok(artist);
  // Merged: full name was adopted from the tagged entry
  assert.equal(artist.artist, "Repeat Artist Band");
  assert.equal(artist.profilePicUrl, "https://example.com/pic.jpg");
  // Source type upgraded from mention to tagged
  assert.equal(artist.sourceType, "tagged");
  // Tagged count tracked
  assert.equal(artist.taggedCount, 2);
});

test("Instagram Discovery: preserves venue calendar items untouched", () => {
  const mixedItems = [
    {
      eventTitle: "The Bright Light Social Hour",
      venueName: "Mohawk",
      artist: "The Bright Light Social Hour",
      eventDate: "2026-11-01T20:00:00Z",
    },
    {
      shortCode: "IGPOST1",
      ownerUsername: "some_venue",
      taggedUsers: [{ username: "band_from_ig", full_name: "IG Band" }],
    },
  ];

  const results = extractTaggedProfiles(mixedItems);
  assert.equal(results.length, 3); // 1 calendar event + some_venue (author) + band_from_ig (tagged)
  const calendarItem = results.find((r) => r.eventTitle === "The Bright Light Social Hour");
  assert.ok(calendarItem);
  assert.equal(calendarItem.venueName, "Mohawk");
});
