import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

export async function POST(request: Request) {
    try {
        const { actorId, input } = await request.json();
        if (!actorId || !input) {
            return NextResponse.json(
                { error: "actorId and input are required" },
                { status: 400 }
            );
        }

        const token = process.env.APIFY_ORG_TOKEN;
        if (!token) {
            return NextResponse.json(
                { error: "APIFY_ORG_TOKEN environment variable not set. Please add it to your .env file." },
                { status: 500 }
            );
        }

        const client = new ApifyClient({ token });

        // Start the Apify actor and immediately return the run info
        const run = await client.actor(actorId).start(input);

        return NextResponse.json({
            runId: run.id,
            datasetId: run.defaultDatasetId
        });
    } catch (error) {
        console.error("/api/discover error", error);
        const detail = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: "Failed to run discovery actor", detail },
            { status: 500 }
        );
    }
}
