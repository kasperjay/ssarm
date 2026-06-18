#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const rawValue = trimmed.slice(idx + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
    }
  }
}

const { withAgentRun, prisma, pool } = require("../src/lib/agent-runner");

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const hasFlag = (name) => process.argv.includes(name);
const getArg = (name) => {
  const idx = process.argv.indexOf(name);
  return idx === -1 ? null : process.argv[idx + 1] ?? null;
};

async function main() {
  const dryRun = hasFlag("--dry-run");
  const limitArg = getArg("--limit");
  const limit = limitArg ? parseInt(limitArg, 10) : null;
  const skipArg = getArg("--skip");
  const skip = skipArg ? parseInt(skipArg, 10) : 0;

  const where = { spotifyArtistId: { not: null } };
  const total = await prisma.artist.count({ where });

  console.log(`🔁 Spotify Release Bulk Refresh`);
  console.log(`   Mode: ${dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`   Artists with Spotify ID: ${total}`);
  if (limit) console.log(`   Limit: ${limit}`);
  if (skip) console.log(`   Skip: ${skip}`);
  console.log();

  if (total === 0) {
    console.log("No artists with Spotify IDs found. Nothing to do.");
    return { processedCount: 0 };
  }

  const artists = await prisma.artist.findMany({
    where,
    select: { id: true, name: true, spotifyArtistId: true },
    orderBy: { updatedAt: "asc" },
    ...(limit ? { take: limit } : {}),
    ...(skip ? { skip } : {}),
  });

  console.log(`Processing ${artists.length} artists...\n`);

  let refreshed = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < artists.length; i++) {
    const artist = artists[i];
    const label = `[${i + 1}/${artists.length}] ${artist.name} (${artist.spotifyArtistId})`;

    if (dryRun) {
      console.log(`  [DRY RUN] Would refresh: ${label}`);
      skipped++;
      continue;
    }

    try {
      process.stdout.write(`  ${label} ... `);
      const res = await fetch(`${baseUrl}/api/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist: {
            name: artist.name,
            spotifyArtistId: artist.spotifyArtistId,
          },
          skipInstagramFetch: true,
          skipSpotifyFetch: false,
        }),
      });

      if (res.ok) {
        console.log("✓");
        refreshed++;
      } else {
        const errText = await res.text().catch(() => "unknown");
        console.log(`✗ (${res.status}: ${errText.substring(0, 100)})`);
        failed++;
      }
    } catch (err) {
      console.log(`✗ (${err.message})`);
      failed++;
    }

    if (i < artists.length - 1) {
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log();
  console.log("📊 Summary:");
  console.log(`   Refreshed: ${refreshed}`);
  console.log(`   Failed:    ${failed}`);
  if (dryRun) console.log(`   Skipped (dry run): ${skipped}`);
  console.log(`   Total:     ${artists.length}`);

  if (dryRun) {
    console.log();
    console.log("⚠️  DRY RUN — no changes made. Remove --dry-run to execute.");
  }

  return { processedCount: refreshed };
}

withAgentRun("refresh-spotify", { dryRun: hasFlag("--dry-run") }, main)
  .catch((err) => console.error("Fatal:", err))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
