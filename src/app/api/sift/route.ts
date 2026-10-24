export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { siftItems } from "@/lib/sift-core";
import { prisma } from "@/lib/prisma";
import { fetchInstagramProfilesBatch } from "@/lib/instagram";

export const runtime = "nodejs";

async function enrichInstagramProfiles(rawItems: any[]): Promise<any[]> {
  if (!Array.isArray(rawItems) || rawItems.length === 0) return rawItems;

  const enriched = rawItems.map((item) => ({ ...item }));

  // Collect handles needing enrichment
  const handleMap = new Map<string, number[]>();
  for (let i = 0; i < enriched.length; i++) {
    const it = enriched[i];
    const rawHandle = it.ownerUsername || it.username || it.handle || it.instagramHandle;
    if (rawHandle && typeof rawHandle === "string") {
      const clean = rawHandle.replace(/^@/, "").trim().toLowerCase();
      if (clean && clean.length >= 2 && !/^(?:none|undefined|null)$/i.test(clean)) {
        if (!handleMap.has(clean)) handleMap.set(clean, []);
        handleMap.get(clean)!.push(i);
      }
    }
  }

  const handles = Array.from(handleMap.keys());
  if (handles.length === 0) return enriched;

  // 1. Database lookup from prisma.artist
  try {
    const existingArtists = await prisma.artist.findMany({
      where: {
        instagramHandle: { in: handles, mode: "insensitive" },
      },
      select: {
        instagramHandle: true,
        name: true,
        bio: true,
        spotifyArtistUrl: true,
        officialSiteUrl: true,
        genre: true,
      },
    });

    for (const artist of existingArtists) {
      if (!artist.instagramHandle) continue;
      const key = artist.instagramHandle.toLowerCase();
      const indices = handleMap.get(key) || [];
      for (const idx of indices) {
        if (artist.bio && !enriched[idx].biography && !enriched[idx].bio) {
          enriched[idx].biography = artist.bio;
          enriched[idx].bio = artist.bio;
        }
        if (artist.spotifyArtistUrl || artist.officialSiteUrl) {
          if (!enriched[idx].externalUrl) {
            enriched[idx].externalUrl = artist.spotifyArtistUrl || artist.officialSiteUrl;
          }
        }
        if (!enriched[idx].categoryName) {
          enriched[idx].categoryName = "Musician/band";
        }
      }
    }
  } catch (dbError) {
    console.warn("[SIFT] Database artist lookup failed (proceeding):", dbError);
  }

  // 2. For handles still missing bio/category, fetch batch from Apify if token is available
  const missingHandles = handles.filter((h) => {
    const indices = handleMap.get(h) || [];
    return indices.some((idx) => !enriched[idx].biography && !enriched[idx].bio && !enriched[idx].categoryName);
  });

  if (missingHandles.length > 0 && process.env.APIFY_TOKEN) {
    try {
      const batchMap = await Promise.race([
        fetchInstagramProfilesBatch(missingHandles, 25),
        new Promise<Map<string, any>>((resolve) => setTimeout(() => resolve(new Map()), 12000)),
      ]);

      for (const [key, profile] of batchMap.entries()) {
        const indices = handleMap.get(key.toLowerCase()) || [];
        for (const idx of indices) {
          if (profile.bio && !enriched[idx].biography && !enriched[idx].bio) {
            enriched[idx].biography = profile.bio;
            enriched[idx].bio = profile.bio;
          }
          if (profile.externalUrl && !enriched[idx].externalUrl) {
            enriched[idx].externalUrl = profile.externalUrl;
          }
          if (profile.categoryName && !enriched[idx].categoryName) {
            enriched[idx].categoryName = profile.categoryName;
          }
          if (profile.followersCount !== undefined && enriched[idx].followersCount === undefined) {
            enriched[idx].followersCount = profile.followersCount;
          }
          if (profile.fullName && (!enriched[idx].fullName || enriched[idx].fullName === key)) {
            enriched[idx].fullName = profile.fullName;
          }
        }
      }
    } catch (apifyError) {
      console.warn("[SIFT] Batch Instagram profile fetch failed (proceeding):", apifyError);
    }
  }

  return enriched;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "items array is required" }, { status: 400 });
    }

    const enrichedItems = await enrichInstagramProfiles(body.items);
    const response = await siftItems(enrichedItems);
    return NextResponse.json(response);
  } catch (error) {
    console.error("/api/sift error:", error);
    return NextResponse.json({ error: "Failed to sift items." }, { status: 500 });
  }
}
