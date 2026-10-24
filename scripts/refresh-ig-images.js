/**
 * Refresh Instagram Image URLs
 *
 * Re-scrapes artists with Instagram handles via Apify to get fresh
 * CDN image URLs (which expire after ~7 days). Updates both profile
 * images and post images in the database.
 *
 * Supports batching for faster execution and lower Apify compute usage.
 *
 * Usage:
 *   node scripts/refresh-ig-images.js [--dry-run] [--limit N] [--skip N] [--batch-size N] [--artists handle1,handle2]
 */

require("dotenv").config();
const { ApifyClient } = require("apify-client");
const { PrismaClient } = require("../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const CONFIG = {
  apifyToken: process.env.APIFY_TOKEN,
  actorId: process.env.APIFY_IG_ACTOR_ID || "apify/instagram-profile-scraper",
  resultsLimit: 12,
  dryRun: process.argv.includes("--dry-run"),
  batchSize: (() => {
    const idx = process.argv.indexOf("--batch-size");
    return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : 8;
  })(),
  limit: (() => {
    const idx = process.argv.indexOf("--limit");
    return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : Infinity;
  })(),
  skip: (() => {
    const idx = process.argv.indexOf("--skip");
    return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : 0;
  })(),
  artistsFilter: (() => {
    const idx = process.argv.indexOf("--artists");
    if (idx === -1) return null;
    return (process.argv[idx + 1] || "")
      .split(",")
      .map((s) => s.trim().replace(/^@/, "").toLowerCase())
      .filter(Boolean);
  })(),
};

// Catch unhandled rejections so one network blip doesn't kill the whole run
process.on("unhandledRejection", (err) => {
  console.error("[UNHANDLED_REJECTION]", err?.message || err);
});

const toIsoDate = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    const ms = value > 1e12 ? value : value * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  if (typeof value === "string" && value.trim()) {
    const date = new Date(value.trim());
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  return null;
};

const getString = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const mapPost = (item) => {
  const shortCode = getString(item.shortCode) || getString(item.shortcode) || getString(item.code);
  const instagramPostId = getString(item.id) || shortCode;
  const caption = getString(item.caption) || getString(item.text);
  const postedAt = toIsoDate(item.timestamp) || toIsoDate(item.takenAtTimestamp) || toIsoDate(item.takenAt) || toIsoDate(item.date);
  const url = getString(item.url) || (shortCode ? `https://www.instagram.com/p/${shortCode}/` : null);
  const imageUrl = getString(item.displayUrl) || getString(item.display_url) || getString(item.imageUrl) || getString(item.thumbnailUrl);
  if (!instagramPostId && !caption && !imageUrl && !url) return null;
  return { instagramPostId, shortCode, caption, imageUrl, postedAt, url };
};

async function processBatch(client, prisma, batchArtists, opts) {
  const { isDryRun, resultsLimit, stats, batchIndex, totalBatches } = opts;
  const artistMap = new Map();

  for (const a of batchArtists) {
    const cleanHandle = a.instagramHandle.replace(/^@/, "").trim().toLowerCase();
    artistMap.set(cleanHandle, a);
  }

  const usernames = Array.from(artistMap.keys());
  console.log(`\n[Batch ${batchIndex + 1}/${totalBatches}] Scraping ${usernames.length} accounts: ${usernames.join(", ")}`);

  let retries = 0;
  const maxRetries = 2;

  while (retries <= maxRetries) {
    try {
      const runPromise = client.actor(CONFIG.actorId).call({
        usernames,
        resultsLimit,
        searchType: "user",
      });
      const run = await Promise.race([
        runPromise,
        new Promise((_, rej) => setTimeout(() => rej(new Error("Apify call timeout")), 180000)),
      ]);

      const datasetPromise = client.dataset(run.defaultDatasetId).listItems();
      const { items } = await Promise.race([
        datasetPromise,
        new Promise((_, rej) => setTimeout(() => rej(new Error("Dataset timeout")), 60000)),
      ]);

      if (!items || items.length === 0) {
        console.log(`  ⚠️  No data returned for batch`);
        return;
      }

      console.log(`  ✓ Received ${items.length} profile items from Apify`);

      for (const profile of items) {
        const username = (profile.username || "").toLowerCase();
        let artist = artistMap.get(username);

        // Fallback: match via inputUrl if username is missing or different
        if (!artist && profile.inputUrl) {
          for (const [handle, a] of artistMap.entries()) {
            if (profile.inputUrl.toLowerCase().includes(handle)) {
              artist = a;
              break;
            }
          }
        }

        if (!artist) {
          console.log(`  ⚠️  Could not match profile to batch artist: ${username || profile.inputUrl}`);
          continue;
        }

        const freshProfilePicUrl = getString(profile.profilePicUrl) || getString(profile.profilePicUrlHD);
        const latestPosts = profile.latestPosts || [];

        if (isDryRun) {
          const freshPostCount = latestPosts.filter((p) => getString(p.displayUrl)).length;
          console.log(`  [DRY RUN] @${artist.instagramHandle}: avatar=${freshProfilePicUrl ? "yes" : "no"} posts=${freshPostCount}/${latestPosts.length}`);
          stats.profiles++;
          stats.posts += freshPostCount;
          continue;
        }

        // Update profile picture
        if (freshProfilePicUrl) {
          await prisma.artist.update({
            where: { id: artist.id },
            data: { instagramProfileImageUrl: freshProfilePicUrl },
          });
          stats.profiles++;
        }

        // Update / create posts
        let updatedPostsForArtist = 0;
        let createdPostsForArtist = 0;

        for (const postData of latestPosts) {
          const mapped = mapPost(postData);
          if (!mapped || !mapped.imageUrl) continue;

          let existing = null;
          if (mapped.instagramPostId) {
            existing = await prisma.instagramPost.findUnique({
              where: { instagramPostId: mapped.instagramPostId },
            });
          }

          if (!existing && mapped.url) {
            existing = await prisma.instagramPost.findFirst({
              where: {
                artistId: artist.id,
                url: mapped.url,
              },
            });
          }

          if (existing) {
            await prisma.instagramPost.update({
              where: { id: existing.id },
              data: {
                imageUrl: mapped.imageUrl,
                caption: mapped.caption || existing.caption,
                url: mapped.url || existing.url,
                postedAt: mapped.postedAt ? new Date(mapped.postedAt) : existing.postedAt,
              },
            });
            updatedPostsForArtist++;
            stats.posts++;
          } else {
            await prisma.instagramPost.create({
              data: {
                artistId: artist.id,
                instagramPostId: mapped.instagramPostId,
                caption: mapped.caption,
                imageUrl: mapped.imageUrl,
                postedAt: mapped.postedAt ? new Date(mapped.postedAt) : undefined,
                url: mapped.url,
              },
            });
            createdPostsForArtist++;
            stats.created++;
          }
        }

        console.log(`  ✓ @${artist.instagramHandle}: avatar=${freshProfilePicUrl ? "updated" : "none"} (${updatedPostsForArtist} posts refreshed, ${createdPostsForArtist} created)`);
      }

      return; // Batch succeeded
    } catch (err) {
      retries++;
      if (retries <= maxRetries) {
        const backoff = retries * 5000;
        console.log(`  Batch retry ${retries}/${maxRetries} in ${backoff}ms: ${err.message}`);
        await new Promise((r) => setTimeout(r, backoff));
      } else {
        stats.errors += batchArtists.length;
        console.error(`  ❌ Batch failed after ${maxRetries} retries: ${err.message}`);
      }
    }
  }
}

async function main() {
  if (!CONFIG.apifyToken) {
    console.error("❌ APIFY_TOKEN is required in .env");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const client = new ApifyClient({ token: CONFIG.apifyToken });

  console.log("=== Instagram Post & Avatar Image Refresher ===");
  console.log(`Mode: ${CONFIG.dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`Batch Size: ${CONFIG.batchSize} | Results Limit Per User: ${CONFIG.resultsLimit}`);

  let allArtists = await prisma.artist.findMany({
    where: {
      instagramHandle: { not: null },
    },
    select: { id: true, name: true, instagramHandle: true },
    orderBy: { name: "asc" },
  });

  allArtists = allArtists.filter((a) => a.instagramHandle && a.instagramHandle.trim().length > 0);

  if (CONFIG.artistsFilter && CONFIG.artistsFilter.length > 0) {
    allArtists = allArtists.filter((a) =>
      CONFIG.artistsFilter.includes(a.instagramHandle.replace(/^@/, "").toLowerCase())
    );
    console.log(`Filtered to specific artists: ${allArtists.map((a) => a.instagramHandle).join(", ")}`);
  }

  const artists = allArtists.slice(CONFIG.skip, CONFIG.skip + CONFIG.limit);
  console.log(`Target: ${artists.length} artists to process (out of ${allArtists.length} total eligible, skip=${CONFIG.skip})\n`);

  const stats = { profiles: 0, posts: 0, created: 0, errors: 0 };

  const batches = [];
  for (let i = 0; i < artists.length; i += CONFIG.batchSize) {
    batches.push(artists.slice(i, i + CONFIG.batchSize));
  }

  console.log(`Split into ${batches.length} batches of up to ${CONFIG.batchSize} artists each.`);

  for (let b = 0; b < batches.length; b++) {
    await processBatch(client, prisma, batches[b], {
      isDryRun: CONFIG.dryRun,
      resultsLimit: CONFIG.resultsLimit,
      stats,
      batchIndex: b,
      totalBatches: batches.length,
    });

    console.log(`Current Total Stats: avatars=${stats.profiles} posts_updated=${stats.posts} posts_created=${stats.created} errors=${stats.errors}`);

    // Polite pause between batches
    if (b < batches.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n======================================================`);
  console.log(`✅ Instagram Image Refresh Complete!`);
  console.log(`- Profile avatars updated: ${stats.profiles}`);
  console.log(`- Post images refreshed:   ${stats.posts}`);
  console.log(`- New posts imported:      ${stats.created}`);
  console.log(`- Account errors:          ${stats.errors}`);
  console.log(`======================================================`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
