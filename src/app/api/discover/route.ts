import { NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

const MAX_CONCURRENT_RUNS = 2;

async function getActiveRunCount(client: ApifyClient): Promise<number> {
    try {
        const result = await client.runs().list({ status: "RUNNING", limit: 20 });
        const items = (result as any).items || [];
        return items.length;
    } catch {
        return 0;
    }
}

export async function POST(request: Request) {
    try {
        const { actorId, input } = await request.json();
        if (!actorId || !input) {
            return NextResponse.json(
                { error: "actorId and input are required" },
                { status: 400 }
            );
        }

        const personalToken = process.env.APIFY_TOKEN;
        const orgToken = process.env.APIFY_ORG_TOKEN;
        const isOrgActor = actorId.startsWith("specsoundwrx/");
        const isPublicInstagramActor = actorId === "apify/instagram-scraper" || actorId === "apify/instagram-hashtag-scraper" || actorId === "apify/instagram-profile-scraper";

        const token = isOrgActor
            ? (orgToken || personalToken)
            : isPublicInstagramActor
              ? (personalToken || orgToken)
              : (personalToken || orgToken);

        if (!token) {
            return NextResponse.json(
                { error: "No Apify token configured for this search type. Please set APIFY_TOKEN and/or APIFY_ORG_TOKEN in .env." },
                { status: 500 }
            );
        }

        const client = new ApifyClient({ token });

        if (isOrgActor) {
            const activeCount = await getActiveRunCount(client);
            if (activeCount >= MAX_CONCURRENT_RUNS) {
                return NextResponse.json(
                    { error: `Concurrency limit reached (${MAX_CONCURRENT_RUNS} max). ${activeCount} runs are already active. Wait for one to finish and try again.` },
                    { status: 429 }
                );
            }
        }

        console.log(`[DISCOVER] Starting actor ${actorId} with ${isOrgActor ? "org" : "personal"} token: ${token.substring(0, 10)}...`);

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
