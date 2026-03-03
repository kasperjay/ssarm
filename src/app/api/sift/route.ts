import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { items } = await request.json();
        if (!items || !Array.isArray(items)) {
            return NextResponse.json(
                { error: "items array is required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.OPENAI_API_KEY;
        const apiUrl = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
        const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

        if (!apiKey) {
            return NextResponse.json(
                { error: "OPENAI_API_KEY environment variable not set." },
                { status: 500 }
            );
        }

        // Prepare a concise list to send to the LLM to save tokens
        const evaluationList = items.map((item, index) => {
            const name = item.fullName || item.title || item.name || item.artist || item.musician || item.band || item.artistName || "Unknown";
            const desc = (item.biography || item.bio || item.description || "").substring(0, 500);
            return `[${index}] NAME: ${name} | DESC: ${desc}`;
        }).join("\n");

        const prompt = `
You are an expert music industry filter.
I am running a scraper on local event calendars and capturing names of performers.
Many results are NOT musical artists (e.g. they are comedy shows, burlesque, DJ nights, trivia nights, generic event titles, "Closed for private event", "TBA", karaoke, podcasts, open mics, dance parties, art exhibits, etc).

Your job is to look at the list below and strictly determine if each item represents a VALID MUSICIANS/LIVE BANDS.
If it is a DJ or an obvious non-band, return false.

Return a STRICT JSON array of booleans corresponding exactly to the length and order of the provided list.
Example output: [true, false, true, false]

DATA:
${evaluationList}
    `;

        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }, // Depending on model version, might need to wrap in an object for guaranteed JSON, but let's try strict json text for now.
                // Actually to guarantee boolean array we can ask for { "results": [true, false] }
            }),
        });

        // Let's refine the request to guarantee structured JSON output.
        const strictPrompt = `
You are an expert music industry filter. Determine if each item is a valid live musical artist/band. Return false for DJs, comedy, trivia, podcasts, empty names, or generic events.

Return a JSON object with a single key "results" containing an array of booleans corresponding exactly to the length and order of the provided list.

DATA:
${evaluationList}
    `;

        const strictResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [{ role: "user", content: strictPrompt }],
                response_format: { type: "json_object" },
            }),
        });

        if (!strictResponse.ok) {
            const text = await strictResponse.text();
            throw new Error(`OpenAI API Error: ${text}`);
        }

        const json = await strictResponse.json();
        const content = json.choices[0].message.content;
        const parsed = JSON.parse(content);

        return NextResponse.json({ results: parsed.results || [] });
    } catch (error) {
        console.error("/api/sift error", error);
        const detail = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: "Failed to sift results", detail },
            { status: 500 }
        );
    }
}
