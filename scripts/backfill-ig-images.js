const fs = require("fs");
const path = require("path");
const { ApifyClient } = require("apify-client");
const { PrismaClient } = require("../src/generated/prisma");
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

const CONFIG = {
  apifyToken: process.env.APIFY_TOKEN,
  actorId: process.env.APIFY_IG_POSTS_ACTOR_ID || "apify/instagram-scraper",
  resultsLimit: Number.parseInt(process.env.APIFY_IG_RESULTS_LIMIT || "6", 10),
};

const getArg = (name) => {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  return process.argv[index + 1] ?? null;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const toIsoDate = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    const ms = value > 1e12 ? value : value * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  if (typeof value === "string" && value.trim()) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  return null;
};

const getString = (value) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const getPath = (value, path) => {
  let current = value;
  for (const key of path) {
    if (Array.isArray(current)) {
      current = current[key];
    } else if (current && typeof current === "object") {
      current = current[key];
    } else {
      return null;
    }
  }
  return current ?? null;
};

const mapPost = (item) => {
  const shortcode =
    getString(item.shortCode) || getString(item.shortcode) || getString(item.code);
  const instagramPostId =
    getString(item.id) || shortcode || getString(item.postId) || getString(item.pk);
  const caption =
    getString(item.caption) ||
    getString(item.text) ||
    getString(getPath(item, ["edge_media_to_caption", "edges", 0, "node", "text"]));
  const postedAt =
    toIsoDate(item.timestamp) ||
    toIsoDate(item.takenAtTimestamp) ||
    toIsoDate(item.takenAt) ||
    toIsoDate(item.date) ||
    toIsoDate(item.createdAt);
  const url =
    getString(item.url) ||
    getString(item.postUrl) ||
    (shortcode ? `https://www.instagram.com/p/${shortcode}/` : null);
  const imageUrl =
    getString(item.displayUrl) ||
    getString(item.display_url) ||
    getString(item.imageUrl) ||
    getString(item.thumbnailUrl) ||
    getString(item.thumbnail_url) ||
    getString(getPath(item, ["images", 0])) ||
    getString(getPath(item, ["carouselMedia", 0, "displayUrl"])) ||
    getString(getPath(item, ["carouselMedia", 0, "imageUrl"]));

  if (!instagramPostId && !caption && !imageUrl && !url) return null;

  return {
    instagramPostId,
    caption,
    imageUrl,
    postedAt,
    url,
  };
};

const isInstagramPostUrl = (value) =>
  typeof value === "string" &&
  /instagram\.com\/(p|reel|tv)\//i.test(value);

const needsImageUpdate = (current, nextUrl) => {
  if (!nextUrl) return false;
  if (!current) return true;
  if (isInstagramPostUrl(current)) return true;
  return false;
};

const fetchPosts = async (client, username, limit) => {
  const runActor = async (input) => {
    const run = await client.actor(CONFIG.actorId).call(input);
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    return items;
  };

  let items = await runActor({
    directUrls: [`https://www.instagram.com/${username}/`],
    resultsType: "posts",
    resultsLimit: limit,
  });

  if (!items.length) {
    items = await runActor({
      search: username,
      searchType: "user",
      searchLimit: 1,
      resultsType: "posts",
      resultsLimit: limit,
    });
  }

  return items;
};

const main = async () => {
  if (!CONFIG.apifyToken) {
    console.error("APIFY_TOKEN is required to backfill IG images.");
    process.exit(1);
  }

  const offset = Number.parseInt(getArg("--offset") || "0", 10) || 0;
  const limitArg = getArg("--limit");
  const limit = limitArg ? Number.parseInt(limitArg, 10) : null;
  const sleepMs = Number.parseInt(getArg("--sleep-ms") || "250", 10) || 0;
  const dryRun = process.argv.includes("--dry-run");
  const missingOnly = process.argv.includes("--missing-only");
  const skipCreate = process.argv.includes("--skip-create");
  const debug = process.argv.includes("--debug");
  const onlyHandle = getArg("--handle");
  const onlyArtistId = getArg("--artist-id");

  const artists = await prisma.artist.findMany({
    where: { instagramHandle: { not: null } },
    orderBy: { createdAt: "asc" },
    skip: offset,
    take: limit ?? undefined,
  });

  console.log(`Loaded ${artists.length} artists.`);

  const client = new ApifyClient({ token: CONFIG.apifyToken });
  const resultsLimit = Number.isFinite(CONFIG.resultsLimit) ? CONFIG.resultsLimit : 6;

  for (const artist of artists) {
    if (onlyArtistId && artist.id !== onlyArtistId) continue;
    const handle = artist.instagramHandle?.replace(/^@/, "").trim();
    if (!handle) {
      if (debug) console.log(`Skipping ${artist.id}: empty handle`);
      continue;
    }
    if (onlyHandle && handle !== onlyHandle.replace(/^@/, "").trim()) continue;

    const existingPosts = await prisma.instagramPost.findMany({
      where: { artistId: artist.id },
    });

    if (missingOnly) {
      const missingCount = existingPosts.filter(
        (post) => !post.imageUrl || isInstagramPostUrl(post.imageUrl)
      ).length;
      if (missingCount === 0) {
        if (debug) console.log(`@${handle}: no missing images`);
        continue;
      }
    }

    console.log(`Fetching posts for @${handle}...`);
    let posts;
    try {
      const items = await fetchPosts(client, handle, resultsLimit);
      posts = items
        .map(mapPost)
        .filter(Boolean)
        .filter((post) => {
          const hasImage = Boolean(post.imageUrl);
          const hasPostUrl = isInstagramPostUrl(post.url);
          return hasImage || hasPostUrl;
        });
      if (debug) {
        console.log(`@${handle}: fetched ${posts.length} posts`);
        if (posts[0]) {
          console.log(`@${handle}: sample`, {
            instagramPostId: posts[0].instagramPostId,
            imageUrl: posts[0].imageUrl,
            url: posts[0].url,
          });
        }
      }
    } catch (error) {
      console.error(`Failed to fetch @${handle}`, error);
      continue;
    }

    const byId = new Map();
    const byUrl = new Map();
    for (const post of existingPosts) {
      if (post.instagramPostId) byId.set(post.instagramPostId, post);
      if (post.url) byUrl.set(post.url, post);
    }

    let updated = 0;
    let created = 0;

    const emptyPosts = existingPosts.filter(
      (post) => !post.instagramPostId && !post.imageUrl && !post.url
    );
    const fillCandidates = posts.filter((post) => post.imageUrl);
    if (emptyPosts.length && fillCandidates.length) {
      const fillCount = Math.min(emptyPosts.length, fillCandidates.length);
      for (let i = 0; i < fillCount; i += 1) {
        const existing = emptyPosts[i];
        const next = fillCandidates[i];
        let instagramPostId = next.instagramPostId ?? undefined;
        if (instagramPostId) {
          const collision = await prisma.instagramPost.findUnique({
            where: { instagramPostId },
            select: { id: true },
          });
          if (collision && collision.id !== existing.id) {
            instagramPostId = undefined;
          }
        }
        if (dryRun) {
          console.log(`Would fill empty post ${existing.id}`);
        } else {
          await prisma.instagramPost.update({
            where: { id: existing.id },
            data: {
              instagramPostId,
              caption: next.caption ?? undefined,
              imageUrl: next.imageUrl ?? undefined,
              postedAt: next.postedAt ? new Date(next.postedAt) : undefined,
              url: next.url ?? undefined,
            },
          });
        }
        updated += 1;
      }
    }

    for (const post of posts) {
      const existing =
        (post.instagramPostId && byId.get(post.instagramPostId)) ||
        (post.url && byUrl.get(post.url)) ||
        null;

      if (existing) {
        if (needsImageUpdate(existing.imageUrl, post.imageUrl)) {
          if (dryRun) {
            console.log(`Would update image for ${existing.id}`);
          } else {
            await prisma.instagramPost.update({
              where: { id: existing.id },
              data: {
                imageUrl: post.imageUrl ?? undefined,
                caption: post.caption ?? undefined,
                postedAt: post.postedAt ? new Date(post.postedAt) : undefined,
                url: post.url ?? undefined,
              },
            });
          }
          updated += 1;
        }
        continue;
      }

      if (skipCreate) continue;
      if (!post.imageUrl && !post.caption && !post.url) continue;

      if (post.instagramPostId) {
        const existingById = await prisma.instagramPost.findUnique({
          where: { instagramPostId: post.instagramPostId },
          select: { id: true, artistId: true },
        });
        if (existingById) {
          if (dryRun) {
            console.log(`Would update existing post ${existingById.id}`);
          } else {
            await prisma.instagramPost.update({
              where: { id: existingById.id },
              data: {
                caption: post.caption ?? undefined,
                imageUrl: post.imageUrl ?? undefined,
                postedAt: post.postedAt ? new Date(post.postedAt) : undefined,
                url: post.url ?? undefined,
              },
            });
          }
          updated += 1;
          continue;
        }
      }

      if (dryRun) {
        console.log(`Would create post for @${handle}`);
      } else {
        await prisma.instagramPost.create({
          data: {
            artistId: artist.id,
            instagramPostId: post.instagramPostId ?? undefined,
            caption: post.caption ?? undefined,
            imageUrl: post.imageUrl ?? undefined,
            postedAt: post.postedAt ? new Date(post.postedAt) : undefined,
            url: post.url ?? undefined,
          },
        });
      }
      created += 1;
    }

    if (updated || created) {
      console.log(`@${handle}: updated ${updated}, created ${created}`);
    } else {
      console.log(`@${handle}: no changes`);
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
