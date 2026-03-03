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

        const token = process.env.APIFY_ORG_TOKEN;
        if (!token) {
            return NextResponse.json(
                { error: "APIFY_ORG_TOKEN environment variable not set." },
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
            items = datasetList.items;
        }

        return NextResponse.json({
            status,
            itemCount,
            items
        });

    } catch (error) {
        console.error("/api/discover/status error", error);
        const detail = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: "Failed to check actor status", detail },
            { status: 500 }
        );
    }
}
