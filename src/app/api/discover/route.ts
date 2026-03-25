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

        const token = process.env.APIFY_TOKEN || process.env.APIFY_ORG_TOKEN;
        if (!token) {
            return NextResponse.json(
                { error: "APIFY_TOKEN or APIFY_ORG_TOKEN environment variable not set. Please add it to your .env file." },
                { status: 500 }
            );
        }

        console.log(`[DISCOVER] Starting actor ${actorId} with token: ${token.substring(0, 10)}...`);
        const client = new ApifyClient({ token });

        // Start the Apify actor and immediately return the run info
        const run = await client.actor(actorId).start(input);
        console.log(`[DISCOVER] Run started: ${run.id}`);

        return NextResponse.json({
            runId: run.id,
            datasetId: run.defaultDatasetId
        });
    } catch (error: any) {
        console.error("/api/discover error", error);
        
        let detail = error.message || String(error);
        if (error.response?.body) {
            detail += ` | Response: ${typeof error.response.body === 'string' ? error.response.body.substring(0, 500) : JSON.stringify(error.response.body)}`;
        }

        return NextResponse.json(
            { error: "Failed to run discovery actor", detail },
            { status: 500 }
        );
    }
}
