/**
 * Backfill Instagram Images
 * 
 * Iterates through all artists with Instagram handles and refreshes 
 * their profile images and post images by re-scraping via Apify.
 * This fixes "expired" Instagram CDN signature issues.
 */

require("dotenv").config();
const { ApifyClient } = require("apify-client");
const { PrismaClient } = require("../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const CONFIG = {
  apifyToken: process.env.APIFY_TOKEN,
  actorId: process.env.APIFY_IG_ACTOR_ID || "apify/instagram-profile-scraper",
  ingestUrl: process.env.INGEST_URL || "http://localhost:3000/api/ingest",
  batchSize: 5,
};

async function main() {
  if (!CONFIG.apifyToken) {
    console.error("❌ APIFY_TOKEN is required in .env");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  const client = new ApifyClient({ token: CONFIG.apifyToken });

  console.log("🔍 Finding artists with Instagram handles...");
  const artists = await prisma.artist.findMany({
    where: { instagramHandle: { not: null } },
    select: { id: true, name: true, instagramHandle: true }
  });

  console.log(`ℹ️ Found ${artists.length} artists to refresh.`);

  for (let i = 0; i < artists.length; i++) {
    const artist = artists[i];
    const handle = artist.instagramHandle.replace(/^@/, "");
    try {
      console.log(`[${i + 1}/${artists.length}] 🔄 Refreshing @${handle} (${artist.name})...`);
      
      const response = await fetch(CONFIG.ingestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artist: { name: artist.name, instagramHandle: handle },
          lead: { id: (await prisma.lead.findFirst({ where: { artistId: artist.id } }))?.id }
        })
      });

      if (response.ok) {
        console.log(`  ✅ Refreshed @${handle}`);
      } else {
        const text = await response.text();
        console.error(`  ❌ Failed @${handle}: ${text}`);
      }
    } catch (err) {
      console.error(`  💥 Error @${handle}: ${err.message}`);
    }
  }

  console.log("\n✨ Backfill complete.");
  await prisma.$disconnect();
  await pool.end();
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
