import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

export async function POST(request: Request) {
    try {
        const { runId, datasetId } = await request.json();
        if (!runId || !datasetId) {
            return NextResponse.json(
                { error: "runId and datasetId are required" },
                { status: 400 }
            );
        }

        const token = process.env.APIFY_TOKEN || process.env.APIFY_ORG_TOKEN;
        if (!token) {
            return NextResponse.json(
                { error: "APIFY_TOKEN or APIFY_ORG_TOKEN environment variable not set." },
                { status: 500 }
            );
        }

        const client = new ApifyClient({ token });

        // Get run status
        const run = await client.run(runId).get();
        if (!run) {
            return NextResponse.json(
                { error: "Run not found" },
                { status: 404 }
            );
        }

        const status = run.status;

        // Let's get the item count from the dataset to show progress
        const dataset = await client.dataset(datasetId).get();
        const itemCount = dataset ? dataset.itemCount : 0;

        let items: any[] = [];
        if (status === "SUCCEEDED") {
            // Fetch all items when done
            const datasetList = await client.dataset(datasetId).listItems();
            const rawItems = datasetList.items;

            // Deeply flatten if results are nested in numbered keys (common in some custom scrapers)
            // Example: [{"0": {artist: "X"}, "1": {artist: "Y"}}] -> [{artist: "X"}, {artist: "Y"}]
            if (rawItems.length === 1 && typeof rawItems[0] === 'object' && rawItems[0] !== null) {
                const first = rawItems[0];
                const keys = Object.keys(first);
                const allNumeric = keys.length > 0 && keys.every(k => !isNaN(Number(k)));
                
                if (allNumeric) {
                    items = Object.values(first);
                } else {
                    items = rawItems;
                }
            } else {
                items = rawItems;
            }
        }

        // Deduplicate results by ownerUsername (IG handle) or by cleaned artist name
        const seenKeys = new Set<string>();
        const dedupedItems = items.filter((item: Record<string, unknown>) => {
          const handle = (item.ownerUsername || item.username || item.handle || item.instagramHandle || "") as string;
          const rawName = (item.artist || item.artistName || item.band || item.musician || item.fullName || item.title || item.name || "") as string;
          // For IG results: dedupe by handle (most reliable identifier)
          if (handle && handle !== "None" && handle !== "undefined") {
            const cleanHandle = handle.replace(/^@/, "").toLowerCase();
            if (seenKeys.has("handle:" + cleanHandle)) return false;
            seenKeys.add("handle:" + cleanHandle);
            return true;
          }
          // For calendar results: dedupe by cleaned name
          if (rawName) {
            const cleanName = rawName.toLowerCase().replace(/[^a-z0-9]/g, "").trim();
            if (seenKeys.has("name:" + cleanName)) return false;
            seenKeys.add("name:" + cleanName);
          }
          return true;
        });

        return NextResponse.json({
            status,
            itemCount: dedupedItems.length > 0 ? dedupedItems.length : itemCount,
            items: dedupedItems
        });

    } catch (error: any) {
        console.error("/api/discover/status error", error);
        
        let detail = error.message || String(error);
        if (error.response?.body) {
            detail += ` | Response: ${typeof error.response.body === 'string' ? error.response.body.substring(0, 500) : JSON.stringify(error.response.body)}`;
        }

        return NextResponse.json(
            { error: "Failed to check actor status", detail },
            { status: 500 }
        );
    }
}
