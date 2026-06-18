#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const chunkFile = process.argv[2];
if (!chunkFile) {
  console.error("Usage: node refresh-spotify-chunk.js <chunk-file.json>");
  process.exit(1);
}

const artists = JSON.parse(fs.readFileSync(chunkFile, "utf8"));
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const workerId = path.basename(chunkFile, ".json");

(async () => {
  console.log(`[${workerId}] Starting ${artists.length} artists`);

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < artists.length; i++) {
    const a = artists[i];
    const label = `[${workerId}] [${i + 1}/${artists.length}] ${a.name}`;
    try {
      process.stdout.write(`  ${label} ... `);
      const res = await fetch(`${baseUrl}/api/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist: {
            name: a.name,
            spotifyArtistId: a.spotifyArtistId,
          },
          skipInstagramFetch: true,
          skipSpotifyFetch: false,
        }),
      });
      if (res.ok) {
        console.log("✓");
        ok++;
      } else {
        const errText = await res.text().catch(() => "unknown");
        console.log(`✗ (${res.status}: ${errText.substring(0, 100)})`);
        fail++;
      }
    } catch (err) {
      console.log(`✗ (${err.message})`);
      fail++;
    }
  }

  console.log(`[${workerId}] Done: ${ok} ok, ${fail} failed`);
})().catch((err) => {
  console.error(`[${workerId}] Fatal:`, err);
  process.exit(1);
});
