import { NextResponse } from "next/server";
import { cleanArtistName } from "@/lib/utils";

type SiftItem = Record<string, any>;

const EVENTISH_TERMS = [
  "open mic", "karaoke", "trivia", "quiz night", "fundraiser", "community night", "members night",
  "friends", "jam session", "music night", "dance night", "soul night", "hosted by", "presents",
  "live at", "tribute", "experience", "songbook", "tour", "release",
  "private party", "closed", "doors", "tickets", "on sale", "night 1", "night 2", "annual",
  "do512", "eventbrite", "rsvp", "afterparty", "after party"
];

function normalizedItem(item: SiftItem, index: number) {
  const rawName = item.artist || item.artistName || item.band || item.musician || item.ownerUsername || item.username || item.fullName || item.title || item.name || "Unknown";
  const name = cleanArtistName(rawName);
  const desc = String(item.biography || item.bio || item.description || item.caption || "").slice(0, 500);
  return { index, rawName: String(rawName), name: String(name || ""), desc };
}

function fallbackHeuristic(items: SiftItem[]) {
  return items.map((item, idx) => {
    const n = normalizedItem(item, idx);
    const haystack = `${n.name} ${n.rawName} ${n.desc}`.toLowerCase();

    if (!n.name || n.name.length < 2) return false;
    if (EVENTISH_TERMS.some((t) => haystack.includes(t))) return false;
    if (/\b(school|college|university|community|choir|ensemble)\b/i.test(haystack)) return false;
    if (/\b(private\s*party|closed|present(s|ed)?\s+by|hosted\s+by|\bnight\s*\d+\b|\d+(st|nd|rd|th)\s+annual)\b/i.test(haystack)) return false;
    if (/@\d{1,2}(:\d{2})?\s?(am|pm)?\b/i.test(haystack)) return false;

    const hasHandle = Boolean(item.ownerUsername || item.username || item.handle || item.instagramHandle);
    const hasBio = n.desc.length >= 12;
    const looksLikePersonOrBand = /[a-z]/i.test(n.name) && n.name.split(" ").length <= 6;

    return looksLikePersonOrBand && (hasHandle || hasBio);
  });
}

function withTimeout(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

function normalizeBooleanArray(input: unknown, len: number): boolean[] {
  const arr = Array.isArray(input) ? input : [];
  const out: boolean[] = new Array(len).fill(false);
  for (let i = 0; i < Math.min(len, arr.length); i++) out[i] = Boolean(arr[i]);
  return out;
}

export async function POST(request: Request) {
  let parsedItems: SiftItem[] = [];
  try {
    const { items } = await request.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "items array is required" }, { status: 400 });
    }
    parsedItems = items;

    if (items.length === 0) {
      return NextResponse.json({ results: [], mode: "fallback" });
    }

    const compactItems = items.map((it: SiftItem, i: number) => normalizedItem(it, i));

    const apiKey = process.env.OPENAI_API_KEY;
    const apiUrl = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    if (!apiKey) {
      return NextResponse.json({ results: fallbackHeuristic(items), mode: "fallback" });
    }

    const evaluationList = compactItems
      .map((it) => `[${it.index}] NAME: ${it.name} (Raw: ${it.rawName}) | DESC: ${it.desc}`)
      .join("\n");

    const strictPrompt = `
You are an expert music industry filter. Determine if each item is a valid, bookable LIVE MUSICAL ARTIST OR BAND.

Return FALSE for ANY of the following:
- Generic social events: "Friends", "Open Mic", "Jam Session", "Karaoke", "Karaoke Night", "Trivia", "Quiz Night", "Fundraiser", "Community Night", "Members Night"
- School/college/community groups: "XYZ School Band", "University Jazz Band", "Community Choir", "Student Ensemble", any entry with "School", "College", "University", "Community" in the name
- Tribute acts: "A Tribute to...", "The [Band] Experience", "The [Artist] Songbook", "Music of [Composer]"
- Promotional/venue entities: "XYZ Presents", "XYZ Events", "Live at [Venue]", "Hosted by...", venue own accounts
- Tour/product names: "[Artist] Tour", "[Album] Release", anything where NAME is just an adjective + generic noun like "Good Friends", "Great Night"
- Generic "Night" events: "Friday Night", "Saturday Night Live", "Music Night", "Dance Night", "Soul Night"
- Promoter/event-format titles: "X & DO512 Present ...", "Presented by ...", "Hosted by ...", "The 6th Annual ...", "Night 1", "Night 2"
- Operational notices: "Closed for a Private Party", anything containing explicit times like "@9pm" in the title
- Empty, single-word generic names, or names that are clearly an event description rather than a specific artist

Return a JSON object with a single key "results" containing an array of booleans corresponding exactly to the length and order of the provided list.

DATA:
${evaluationList}
    `;

    const isResponsesApi = apiUrl.includes("/responses");
    const bodyPayload = isResponsesApi
      ? { model, input: strictPrompt, text: { format: { type: "json_object" } } }
      : { model, messages: [{ role: "user", content: strictPrompt }], response_format: { type: "json_object" } };

    const timeout = withTimeout(30000);
    let json: any;
    try {
      const strictResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(bodyPayload),
        signal: timeout.signal,
      });

      if (!strictResponse.ok) {
        throw new Error(`OpenAI API Error: ${await strictResponse.text()}`);
      }
      json = await strictResponse.json();
    } finally {
      timeout.clear();
    }

    let content = "";
    if (isResponsesApi && json.output && json.output.length > 0) {
      const firstOutput = json.output[0];
      if (firstOutput.type === "message" && firstOutput.content && firstOutput.content.length > 0) {
        content = firstOutput.content[0].text || "";
      } else if (firstOutput.type === "text") {
        content = firstOutput.text || "";
      }
    } else if (json.choices && json.choices.length > 0) {
      content = json.choices[0].message.content;
    }

    const parsed = (() => {
      try {
        return JSON.parse(String(content).trim());
      } catch {
        const match = String(content).match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : null;
      }
    })();

    const normalizedResults = normalizeBooleanArray(parsed?.results, items.length);
    if (normalizedResults.length !== items.length) {
      return NextResponse.json({ results: fallbackHeuristic(items), mode: "fallback" });
    }

    return NextResponse.json({ results: normalizedResults, mode: "ai" });
  } catch (error) {
    console.error("/api/sift error (fallback mode):", error);
    return NextResponse.json({ results: fallbackHeuristic(parsedItems), mode: "fallback" });
  }
}
