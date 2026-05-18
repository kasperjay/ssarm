/**
 * Background script to re-trigger Instagram scraping for all artists.
 * 
 * Run with: npm run script scripts/refresh-all-instagram.js
 */

const { PrismaClient } = require("../prisma/generated-client");
const prisma = new PrismaClient();

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("🔍 Finding all artists for Instagram refresh...");

    const artists = await prisma.artist.findMany({
        include: {
            leads: true
        }
    });

    console.log(`Found ${artists.length} artists to refresh.`);
    const ingestUrl = process.env.INGEST_URL || "http://localhost:3000/api/ingest";

    let successCount = 0;
    let failedCount = 0;

    for (const artist of artists) {
        console.log(`\n⏳ Refreshing: ${artist.name} (Artist ID: ${artist.id})`);

        const leadId = artist.leads[0]?.id;

        const payload = {
            artist: {
                name: artist.name,
                spotifyArtistId: artist.spotifyArtistId,
                spotifyArtistUrl: artist.spotifyArtistUrl,
                spotifyImageUrl: artist.spotifyImageUrl,
                officialSiteUrl: artist.officialSiteUrl,
                location: artist.location,
                city: artist.city,
                state: artist.state,
                country: artist.country,
                genre: artist.genre,
                tags: artist.tags,
                bio: artist.bio,
                instagramHandle: artist.instagramHandle,
            },
            lead: leadId ? { id: leadId } : undefined
        };

        try {
            const response = await fetch(ingestUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                console.error(`❌ Ingest failed for ${artist.name}: ${response.status}`);
                const text = await response.text();
                console.error(`   ${text.slice(0, 150)}`);
                failedCount++;
            } else {
                console.log(`✅ Successfully triggered refresh for ${artist.name}`);
                successCount++;
            }
        } catch (error) {
            console.error(`❌ Error processing ${artist.name}:`, error.message);
            failedCount++;
        }

        // Wait 3 seconds between making heavy requests to avoid rate limits
        await delay(3000);
    }

    console.log("\n==================================");
    console.log("🎉 All-Artist Refresh Complete");
    console.log(`Total Triggered: ${successCount}`);
    console.log(`Total Failed: ${failedCount}`);
    console.log("==================================");
}

main()
    .catch((error) => {
        console.error("Fatal error:", error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
