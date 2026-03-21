const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) {
      const value = rawValue.replace(/^['"]|['"]$/g, "");
      process.env[key] = value;
    }
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const getArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const main = async () => {
  const ingestUrl = process.env.INGEST_URL || "http://localhost:3000/api/ingest";
  const offset = Number.parseInt(getArg("--offset") || "0", 10) || 0;
  const limitArg = getArg("--limit");
  const limit = limitArg ? Number.parseInt(limitArg, 10) : null;
  const sleepMs = Number.parseInt(getArg("--sleep-ms") || "250", 10) || 0;
  const skipIg = process.argv.includes("--skip-ig");
  const skipSpotify = process.argv.includes("--skip-spotify");
  const missingOnly = process.argv.includes("--missing-only");

  const artists = await prisma.artist.findMany({
    where: {
      OR: [
        { instagramHandle: { not: null } },
        { spotifyArtistId: { not: null } },
      ],
    },
    orderBy: { createdAt: "asc" },
    skip: offset,
    take: limit ?? undefined,
  });

  console.log(`Loaded ${artists.length} artists.`);

  for (const artist of artists) {
    if (missingOnly) {
      const [releaseCount, postCount] = await Promise.all([
        prisma.release.count({ where: { artistId: artist.id } }),
        prisma.instagramPost.count({ where: { artistId: artist.id } }),
      ]);

      if (!skipSpotify && releaseCount > 0) continue;
      if (!skipIg && postCount > 0) continue;
    }

    const payload = {
      skipInstagramFetch: skipIg || undefined,
      skipSpotifyFetch: skipSpotify || undefined,
      artist: {
        name: artist.name,
        instagramHandle: artist.instagramHandle ?? undefined,
        instagramProfileUrl: artist.instagramProfileUrl ?? undefined,
        spotifyArtistId: artist.spotifyArtistId ?? undefined,
        spotifyArtistUrl: artist.spotifyArtistUrl ?? undefined,
        officialSiteUrl: artist.officialSiteUrl ?? undefined,
      },
    };

    const response = await fetch(ingestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`Failed ${artist.name}`, response.status, text);
    } else {
      console.log(`Enriched ${artist.name}`);
    }

    if (sleepMs > 0) await sleep(sleepMs);
  }
};

main()
  .catch((error) => {
    console.error("Backfill failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
