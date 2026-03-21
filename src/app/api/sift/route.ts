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
            const name = item.ownerUsername || item.username || item.fullName || item.title || item.name || item.artist || item.musician || item.band || item.artistName || "Unknown";
            const desc = (item.biography || item.bio || item.description || item.caption || "").substring(0, 500);
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
        
        let bodyPayload: any;

        if (isResponsesApi) {
            // Beta "Responses API" uses a different schema
            bodyPayload = {
                model,
                input: strictPrompt,
                text: { format: { type: "json_object" } }
            };
        } else {
            // Standard Chat Completions API
            bodyPayload = {
                model,
                messages: [{ role: "user", content: strictPrompt }],
                response_format: { type: "json_object" }
            };
        }

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
        
        // Log basic info for debugging but don't dump everything set by user
        console.log("===== OPENAI API RESPONSE STATUS:", strictResponse.status);

        let content = "";

        if (isResponsesApi && json.output && json.output.length > 0) {
            // Traverse Responses API structure
            const firstOutput = json.output[0];
            if (firstOutput.type === "message" && firstOutput.content && firstOutput.content.length > 0) {
                const firstContent = firstOutput.content[0];
                content = firstContent.text || "";
            } else if (firstOutput.type === "text") {
                content = firstOutput.text || "";
            }
        } else if (json.choices && json.choices.length > 0) {
            // Standard Chat Completions structure
            content = json.choices[0].message.content;
        } else {
            console.error("Unknown OpenAI API format:", JSON.stringify(json).substring(0, 500));
            throw new Error("Unable to parse OpenAI payload format. Model may have returned empty or unexpected structure.");
        }

        // Robust JSON extraction using regex
        function extractJson(str: string) {
            try {
                // Try direct parse first
                return JSON.parse(str.trim());
            } catch (e) {
                // Look for anything between { and }
                const match = str.match(/\{[\s\S]*\}/);
                if (match) {
                    try {
                        return JSON.parse(match[0]);
                    } catch (innerError) {
                        console.error("Extract failed inside braces:", match[0]);
                    }
                }
                throw new Error("JSON extraction failed");
            }
        }

        const parsed = extractJson(content);
        
        if (!parsed || !Array.isArray(parsed.results)) {
            console.error("Invalid response format (results missing):", content);
            throw new Error("LLM response did not contain 'results' array.");
        }

        return NextResponse.json({ results: parsed.results });
    } catch (error) {
        console.error("/api/sift error:", error);
        const detail = error instanceof Error ? error.message : String(error);
        return NextResponse.json(
            { error: "Failed to sift results", detail },
            { status: 500 }
        );
    }
}
