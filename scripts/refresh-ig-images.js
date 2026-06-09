/**
 * Refresh Instagram Image URLs
 *
 * Re-scrapes all artists with Instagram handles via Apify to get fresh
 * CDN image URLs (which expire after ~7 days). Updates both profile
 * images and post images in the database.
 *
 * Usage: node scripts/refresh-ig-images.js [--dry-run] [--limit N] [--skip N]
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
  limit: (() => {
    const idx = process.argv.indexOf("--limit");
    return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : Infinity;
  })(),
  skip: (() => {
    const idx = process.argv.indexOf("--skip");
    return idx !== -1 ? parseInt(process.argv[idx + 1], 10) : 0;
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
  return { instagramPostId, caption, imageUrl, postedAt, url };
};

async function processArtist(client, prisma, artist, opts) {
  const handle = artist.instagramHandle.replace(/^@/, "");
  const { isDryRun, resultsLimit, stats, index, total } = opts;

  let retries = 0;
  const maxRetries = 3;

  while (retries <= maxRetries) {
    try {
      const runPromise = client.actor(CONFIG.actorId).call({
        usernames: [handle],
        resultsLimit,
        searchType: "user",
      });
      const run = await Promise.race([runPromise, new Promise((_, rej) => setTimeout(() => rej(new Error("Apify call timeout")), 120000))]);

      const datasetPromise = client.dataset(run.defaultDatasetId).listItems();
      const { items } = await Promise.race([datasetPromise, new Promise((_, rej) => setTimeout(() => rej(new Error("Dataset timeout")), 60000))]);

      if (!items.length) {
        console.log(`[${index + 1}/${total}] ⚠️  No data for @${handle}`);
        return;
      }

      const profile = items[0];
      const freshProfilePicUrl = getString(profile.profilePicUrl) || getString(profile.profilePicUrlHD);
      const latestPosts = profile.latestPosts || [];

      if (isDryRun) {
        const freshPostCount = latestPosts.filter(p => getString(p.displayUrl)).length;
        console.log(`[${index + 1}/${total}] @${handle}: profile=${freshProfilePicUrl ? 1 : 0} posts_with_images=${freshPostCount}/${latestPosts.length}`);
        stats.profiles++;
        stats.posts += freshPostCount;
        return;
      }

      if (freshProfilePicUrl) {
        await prisma.artist.update({
          where: { id: artist.id },
          data: { instagramProfileImageUrl: freshProfilePicUrl },
        });
        stats.profiles++;
      }

      for (const postData of latestPosts) {
        const mapped = mapPost(postData);
        if (!mapped) continue;

        if (mapped.instagramPostId) {
          const existing = await prisma.instagramPost.findUnique({
            where: { instagramPostId: mapped.instagramPostId },
          });
          if (existing) {
            if (mapped.imageUrl) {
              await prisma.instagramPost.update({
                where: { instagramPostId: mapped.instagramPostId },
                data: {
                  imageUrl: mapped.imageUrl,
                  caption: mapped.caption || existing.caption,
                  url: mapped.url || existing.url,
                  postedAt: mapped.postedAt ? new Date(mapped.postedAt) : existing.postedAt,
                },
              });
              stats.posts++;
            }
          } else if (mapped.imageUrl) {
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
            stats.created++;
          }
        }
      }
      return; // success, exit retry loop

    } catch (err) {
      retries++;
      if (retries <= maxRetries) {
        const backoff = retries * 3000;
        console.log(`  @${handle} retry ${retries}/${maxRetries} in ${backoff}ms: ${err.message}`);
        await new Promise(r => setTimeout(r, backoff));
      } else {
        stats.errors++;
        console.error(`[${index + 1}/${total}] ❌ Failed @${handle} after ${maxRetries} retries: ${err.message}`);
      }
    }
  }
}

async function main() {
  if (!CONFIG.apifyToken) {
    console.error("❌ APIFY_TOKEN is required");
    process.exit(1);
  }
  if (CONFIG.dryRun) console.log("🏃 DRY RUN mode — no writes to DB\n");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const client = new ApifyClient({ token: CONFIG.apifyToken });

  const allArtists = await prisma.artist.findMany({
    where: { instagramHandle: { not: null } },
    select: { id: true, name: true, instagramHandle: true },
  });

  const artists = allArtists.slice(CONFIG.skip, CONFIG.skip + CONFIG.limit);
  console.log(`📋 ${allArtists.length} artists with IG handles, processing ${artists.length} (skip=${CONFIG.skip})\n`);

  const stats = { profiles: 0, posts: 0, created: 0, errors: 0 };

  for (let i = 0; i < artists.length; i++) {
    await processArtist(client, prisma, artists[i], {
      isDryRun: CONFIG.dryRun,
      resultsLimit: CONFIG.resultsLimit,
      stats,
      index: i,
      total: artists.length,
    });

    if ((i + 1) % 10 === 0 || i === artists.length - 1) {
      console.log(`[${i + 1}/${artists.length}] profiles=${stats.profiles} posts_updated=${stats.posts} posts_created=${stats.created} errors=${stats.errors}`);
    }

    // Rate limit delay
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n✅ Done! profiles=${stats.profiles} posts_updated=${stats.posts} posts_created=${stats.created} errors=${stats.errors}`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => {
  console.error("Fatal:", err);
  process.exit(1);
});
