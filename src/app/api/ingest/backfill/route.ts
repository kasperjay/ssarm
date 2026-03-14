import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { limit, offset } = (await request.json()) || {};

        console.log("🔍 Finding artists with Instagram handles for backfill...");
        const artists = await prisma.artist.findMany({
            where: { instagramHandle: { not: null } },
            select: { id: true, name: true, instagramHandle: true },
            take: limit || 10,
            skip: offset || 0,
        });

        console.log(`ℹ️ Backfilling ${artists.length} artists...`);

        const results = [];
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        for (let i = 0; i < artists.length; i++) {
            const artist = artists[i];
            const handle = artist.instagramHandle?.replace(/^@/, "");

            try {
                console.log(`[${i + 1}/${artists.length}] 🔄 Refreshing @${handle} (${artist.name})...`);

                // Find the lead ID
                const lead = await prisma.lead.findFirst({ where: { artistId: artist.id } });

                // Call our own ingest endpoint
                const response = await fetch(`${baseUrl}/api/ingest`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        artist: { name: artist.name, instagramHandle: handle },
                        lead: { id: lead?.id }
                    })
                });

                if (response.ok) {
                    console.log(`  ✅ Refreshed @${handle}`);
                    results.push({ handle, status: "success" });
                } else {
                    const text = await response.text();
                    console.error(`  ❌ Failed @${handle}: ${text}`);
                    results.push({ handle, status: "failed", error: text });
                }
            } catch (err: any) {
                console.error(`  💥 Error @${handle}: ${err.message}`);
                results.push({ handle, status: "error", error: err.message });
            }
        }

        return NextResponse.json({
            summary: `Processed ${artists.length} artists`,
            results
        });
    } catch (error) {
        console.error("/api/ingest/backfill error", error);
        const detail = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: detail }, { status: 500 });
    }
}
