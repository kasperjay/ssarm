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

        // Let's refine the request to guarantee structured JSON output.
        const strictPrompt = `
You are an expert music industry filter. Determine if each item is a valid live musical artist/band. Return false for DJs, comedy, trivia, podcasts, empty names, or generic events.

Return a JSON object with a single key "results" containing an array of booleans corresponding exactly to the length and order of the provided list.

DATA:
${evaluationList}
    `;

        const isResponsesApi = apiUrl.includes("/responses");
        const bodyPayload = isResponsesApi
            ? { model, input: strictPrompt }
            : { model, messages: [{ role: "user", content: strictPrompt }] };

        const strictResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(bodyPayload),
        });

        if (!strictResponse.ok) {
            const text = await strictResponse.text();
            throw new Error(`OpenAI API Error: ${text}`);
        }

        const json = await strictResponse.json();
        console.log("===== OPENAI RAW API JSON RESPONSE =====");
        console.log(JSON.stringify(json, null, 2));
        console.log("=========================================");

        let content = "";

        if (isResponsesApi && json.output && json.output.length > 0) {
            // Traverse Responses API structure
            const firstOutput = json.output[0];
            if (firstOutput.type === "message" && firstOutput.content && firstOutput.content.length > 0) {
                // The text is inside output[0].content[0].text
                const firstContent = firstOutput.content[0];
                if (firstContent.type === "output_text") {
                    content = firstContent.text || "";
                } else if (firstContent.type === "text") {
                    content = firstContent.text || "";
                }
            } else if (firstOutput.type === "text") {
                content = firstOutput.text || "";
            }
        } else if (json.choices && json.choices.length > 0) {
            // Standard Chat Completions structure
            content = json.choices[0].message.content;
        } else {
            console.error("Unknown OpenAI API format:", json);
            throw new Error("Unable to parse OpenAI payload format.");
        }

        let cleanContent = content.trim();
        if (cleanContent.startsWith("```json")) {
            cleanContent = cleanContent.substring(7);
        } else if (cleanContent.startsWith("```")) {
            cleanContent = cleanContent.substring(3);
        }
        if (cleanContent.endsWith("```")) {
            cleanContent = cleanContent.substring(0, cleanContent.length - 3);
        }
        cleanContent = cleanContent.trim();

        let parsed;
        try {
            parsed = JSON.parse(cleanContent);
        } catch (parseError) {
            console.error("Failed to parse OpenAI response:");
            console.error("raw content:", content);
            console.error("clean content:", cleanContent);
            console.error("parse error:", parseError);
            throw new Error("Unable to parse OpenAI payload format. Check server logs.");
        }

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
