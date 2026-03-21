/**
 * Background script to locate and fill missing Instagram handles for artists.
 * 
 * Run with: npm run script scripts/backfill-instagram.js
 */

const { PrismaClient } = require("../prisma/generated-client");
const prisma = new PrismaClient();

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log("🔍 Finding artists with missing Instagram handles...");

    const artists = await prisma.artist.findMany({ take: 3,
        where: {
            instagramHandle: null
        },
        include: {
            leads: true
        }
    });

    console.log(`Found ${artists.length} artists missing an Instagram handle.`);
    const ingestUrl = process.env.INGEST_URL || "http://localhost:3000/api/ingest";

    let successCount = 0;
    let failedCount = 0;

    for (const artist of artists) {
        console.log(`\n⏳ Processing: ${artist.name} (Artist ID: ${artist.id})`);

        const leadId = artist.leads[0]?.id;

        // We will trigger the API route allowing IT to automatically find the handle
        // inside the route and do the heavy lifting of fetching posts/profile
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
                // Check if it successfully found it by querying the DB again
                const updated = await prisma.artist.findUnique({
                    where: { id: artist.id },
                    select: { instagramHandle: true }
                });

                if (updated && updated.instagramHandle) {
                    console.log(`✅ Success! Found handle: @${updated.instagramHandle}`);
                    successCount++;
                } else {
                    console.log(`⏭️  Could not locate an Instagram handle for ${artist.name}`);
                    failedCount++;
                }
            }
        } catch (error) {
            console.error(`❌ Error processing ${artist.name}:`, error.message);
            failedCount++;
        }

        // Wait 3 seconds between making heavy requests so we don't blow up the API limits 
        await delay(3000);
    }

    console.log("\n==================================");
    console.log("🎉 Backfill Complete");
    console.log(`Total Found: ${successCount}`);
    console.log(`Total Missed/Failed: ${failedCount}`);
    console.log("==================================");
}

main()
    .catch((error) => {
        console.error("Fatal error:", error);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
