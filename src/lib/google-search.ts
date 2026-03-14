export async function discoverInstagramHandle(artistName: string): Promise<string | null> {
    const token = process.env.APIFY_TOKEN;
    if (!token) return null;

    const actorId = "apify~google-search-scraper";
    const query = `${artistName} band musician instagram`;

    try {
        const response = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                queries: query,
                resultsPerPage: 3,
                countryCode: "US"
            }),
        });

        if (!response.ok) {
            console.error(`Apify Google Search failed to start: ${response.status}`);
            return null;
        }

        const { data } = await response.json();
        const runId = data.id;
        const datasetId = data.defaultDatasetId;

        let status = data.status;
        let attempts = 0;
        while ((status === "RUNNING" || status === "READY") && attempts < 30) {
            await new Promise((r) => setTimeout(r, 2000));
            const statusRes = await fetch(
                `https://api.apify.com/v2/actor-runs/${runId}?token=${token}`
            );
            const statusData = await statusRes.json();
            status = statusData.data.status;
            attempts++;
        }

        const itemsRes = await fetch(
            `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`
        );
        const items = await itemsRes.json();

        if (!items || !items[0] || !items[0].organicResults) return null;

        for (const result of items[0].organicResults) {
            const url = result.url;
            if (!url || !url.includes("instagram.com/")) continue;

            // Ignore generic or wrong matches like tags, reels, posts, or popular
            if (
                url.includes("/p/") ||
                url.includes("/reel/") ||
                url.includes("/explore/") ||
                url.includes("/tags/") ||
                url.includes("/popular/") ||
                url.includes("instagram.com/instagram")
            ) {
                continue;
            }

            // Extract username from https://www.instagram.com/username/ or https://instagram.com/username/?hl=en
            try {
                const urlObj = new URL(url);
                const pathParts = urlObj.pathname.split("/").filter(Boolean);
                if (pathParts.length > 0) {
                    return pathParts[0]; // The first part of the path is the handle
                }
            } catch (e) {
                // Bad URL
            }
        }

        return null;
    } catch (error) {
        console.error("discoverInstagramHandle error", error);
        return null;
    }
}
