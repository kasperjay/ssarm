import { cleanArtistName } from "./utils";

export type SiftItem = Record<string, any>;

export interface SiftNormalizedItem {
  index: number;
  rawName: string;
  name: string;
  eventTitle?: string;
  venueName?: string;
  handle?: string;
  sourceType: string;
  desc: string;
}

export interface ItemEvaluation {
  index: number;
  isArtist: boolean;
  cleanName: string;
  reason?: string;
}

export interface SiftResult {
  results: boolean[];
  mode: "ai" | "fallback";
  cleanedNames: Record<number, string>;
}

export const NON_ARTIST_EVENT_PATTERNS = [
  /\b(?:trivia(?: night)?|quiz night|geeks who drink|bingo|game night)\b/i,
  /\b(?:karaoke|sing-?along)\b/i,
  /\b(?:comedy|stand-?up|improv|open mic comedy)\b/i,
  /\b(?:drag (?:show|brunch|queen)|burlesque|cabaret|pageant|vixens of volstead)\b/i,
  /\b(?:movie|film|screening|watch party)\b/i,
  /\b(?:market|flea market|vintage market|craft fair|makers market|pop-up market|dog party|swap meet)\b/i,
  /\b(?:dance class|cumbia dance|yoga|workout|fitness)\b/i,
  /\b(?:tribute to|a tribute to|the .+? experience|the .+? songbook|music of)\b/i,
  /\b(?:open mic|jam session|happy hour)\b/i,
  /\b(?:closed for|private party|private event)\b/i,
  /\b(?:benefitting|benefit for|fundraiser for|charity)\b/i,
  /\b(?:blade rave|rave|dance party|\b(?:80s|90s|disco|emo|goth|taylor swift|smiths vs morrissey)\s+night\b)\b/i,
  /\b(?:vs\s+night|dance night|soul night)\b/i,
  /\b(?:doors\s*@|tickets\s*on\s*sale|general admission)\b/i,
];

export const KNOWN_PROMOTER_OR_VENUE_NAMES = [
  /^(?:howdy gals|resound|do512|margin walker|kutx|austin chronicle|c3 presents|live nation|heard presents|transmission)\b/i,
  /^(?:hotel vegas|volstead|mohawk|antone'?s|continental club|continental gallery|the cut|saxon pub|c-?boys|broken spoke|elephant room|3ten|scoot inn|valhalla|haute spot|parker jazz|come and take it)\b/i,
];

export const NON_MUSIC_HANDLE_PATTERNS = [
  /(?:photo|photography|photographer|videography|videographer|films|visuals)$/i,
  /(?:chronicle|media|press|radio|podcast|magazine|blog|news)$/i,
  /(?:bar|pub|lounge|tavern|club|brewery|distillery|coffee|pizza|tacos|vintage|apparel|clothing|boutique|tattoo)$/i,
];

export function normalizeSiftItem(item: SiftItem, index: number): SiftNormalizedItem {
  const rawName = String(
    item.artist ||
    item.artistName ||
    item.band ||
    item.musician ||
    item.ownerUsername ||
    item.username ||
    item.fullName ||
    item.title ||
    item.name ||
    ""
  );

  const cleanName = cleanArtistName(rawName);
  const eventTitle = item.eventTitle ? String(item.eventTitle).trim() : undefined;
  const venueName = item.venueName ? String(item.venueName).trim() : undefined;
  const handle = (item.ownerUsername || item.username || item.handle || item.instagramHandle)
    ? String(item.ownerUsername || item.username || item.handle || item.instagramHandle).replace(/^@+/, "").trim()
    : undefined;

  const sourceType = eventTitle || venueName
    ? "venue_calendar"
    : String(item.sourceType || "instagram");

  const desc = String(
    item.biography || item.bio || item.description || item.caption || ""
  ).slice(0, 400).trim();

  return {
    index,
    rawName,
    name: cleanName || rawName,
    eventTitle,
    venueName,
    handle,
    sourceType,
    desc,
  };
}

export function evaluateItemHeuristic(item: SiftNormalizedItem): ItemEvaluation {
  const cleanName = cleanArtistName(item.name || item.rawName);
  const rawName = item.rawName;
  const eventTitle = item.eventTitle || "";
  const handle = item.handle || "";
  const desc = item.desc || "";
  const isVenueItem = item.sourceType === "venue_calendar" || Boolean(item.eventTitle || item.venueName);

  const nameAndEvent = `${cleanName} ${rawName} ${eventTitle}`.toLowerCase();

  // 1. Negative pattern check in artist name or event title
  for (const rx of NON_ARTIST_EVENT_PATTERNS) {
    if (rx.test(nameAndEvent)) {
      return { index: item.index, isArtist: false, cleanName, reason: "event_pattern" };
    }
  }

  // 2. Promoter or venue check on cleaned name
  for (const rx of KNOWN_PROMOTER_OR_VENUE_NAMES) {
    if (rx.test(cleanName)) {
      return { index: item.index, isArtist: false, cleanName, reason: "promoter_or_venue" };
    }
  }

  // 3. Instagram non-musician profile filtering
  if (!isVenueItem && handle) {
    for (const rx of NON_MUSIC_HANDLE_PATTERNS) {
      if (rx.test(handle) || rx.test(cleanName)) {
        const hasMusicSignal = /\b(?:band|musician|singer|songwriter|vocals|guitar|drums|bass|rapper|indie|rock|punk|live music|stream my|new single|album out)\b/i.test(desc);
        if (!hasMusicSignal) {
          return { index: item.index, isArtist: false, cleanName, reason: "non_musician_handle" };
        }
      }
    }
  }

  // 4. Name length and validity check
  if (!cleanName || cleanName.length < 2 || cleanName.length > 60) {
    return { index: item.index, isArtist: false, cleanName, reason: "invalid_length" };
  }
  if (!/[a-z]/i.test(cleanName)) {
    return { index: item.index, isArtist: false, cleanName, reason: "no_letters" };
  }
  if (/^(?:tba|to be announced|various artists|more bands?|special guest|tbd|unknown artist)$/i.test(cleanName)) {
    return { index: item.index, isArtist: false, cleanName, reason: "placeholder" };
  }

  // 5. Venue calendar items that passed all filters are live musical artists
  if (isVenueItem) {
    return { index: item.index, isArtist: true, cleanName };
  }

  // 6. Instagram items check word count and basic shape
  const words = cleanName.split(/\s+/);
  if (words.length > 5) {
    return { index: item.index, isArtist: false, cleanName, reason: "too_many_words" };
  }

  return { index: item.index, isArtist: true, cleanName };
}

function withTimeout(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

async function evaluateBatchAI(
  batch: SiftNormalizedItem[],
  apiKey: string,
  apiUrl: string,
  model: string
): Promise<Map<number, ItemEvaluation>> {
  const evaluationsMap = new Map<number, ItemEvaluation>();

  const evaluationList = batch
    .map((it) => {
      const parts = [`[${it.index}] NAME: ${it.name}`];
      if (it.eventTitle) parts.push(`EVENT: ${it.eventTitle}`);
      if (it.venueName) parts.push(`VENUE: ${it.venueName}`);
      if (it.handle) parts.push(`HANDLE: @${it.handle}`);
      if (it.desc) parts.push(`DESC: ${it.desc.slice(0, 150)}`);
      parts.push(`TYPE: ${it.sourceType}`);
      return parts.join(" | ");
    })
    .join("\n");

  const strictPrompt = `
You are an expert live music industry filter for an Austin recording studio.
Evaluate each candidate below and determine if it represents a VALID, BOOKABLE LIVE MUSICAL ARTIST OR BAND (singer-songwriter, band, musician, rapper, etc.).

Return FALSE for:
- Themed DJ/dance nights (e.g. Smiths vs Morrissey Night, Emo Night, 80s Night, Blade Rave)
- Promoters, presenting organizations, radio stations (e.g. Howdy Gals, Resound, Do512, KUTX, Margin Walker)
- Tribute acts and tribute bands (e.g. DREAMS - A Tribute to Fleetwood Mac, [Band] Experience)
- Drag shows/brunches, burlesque, pageants (e.g. Veronica Valentine, Vixens of Volstead)
- Non-musical events: Trivia, karaoke, open mic comedy, markets/fleas, movie screenings, dog parties, fundraisers
- Venues themselves (e.g. Hotel Vegas, Mohawk, Antones)
- Non-musician Instagram profiles (photographers, videographers, media outlets, fans, apparel)

Return TRUE for:
- Genuine live musical artists, original bands, solo artists, singer-songwriters playing shows

Return a JSON object with key "evaluations" containing an array of objects:
{
  "evaluations": [
    { "index": number, "isArtist": boolean, "cleanName": string }
  ]
}

DATA:
${evaluationList}
  `.trim();

  const isResponsesApi = apiUrl.includes("/responses");
  const bodyPayload = isResponsesApi
    ? { model, input: strictPrompt, text: { format: { type: "json_object" } } }
    : { model, messages: [{ role: "user", content: strictPrompt }], response_format: { type: "json_object" } };

  const timeout = withTimeout(15000);
  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(bodyPayload),
      signal: timeout.signal,
    });

    if (!res.ok) {
      throw new Error(`OpenAI API error ${res.status}: ${await res.text()}`);
    }

    const json = await res.json();
    let content = "";
    if (isResponsesApi && json.output && json.output.length > 0) {
      const firstOutput = json.output[0];
      if (firstOutput.type === "message" && firstOutput.content && firstOutput.content.length > 0) {
        content = firstOutput.content[0].text || "";
      } else if (firstOutput.type === "text") {
        content = firstOutput.text || "";
      }
    } else if (json.choices && json.choices.length > 0) {
      content = json.choices[0].message?.content || "";
    }

    const parsed = (() => {
      try {
        return JSON.parse(String(content).trim());
      } catch {
        const match = String(content).match(/\{[\s\S]*\}/);
        return match ? JSON.parse(match[0]) : null;
      }
    })();

    const evaluationsArray = Array.isArray(parsed?.evaluations)
      ? parsed.evaluations
      : Array.isArray(parsed?.results)
        ? parsed.results.map((r: any, idx: number) => ({
            index: batch[idx]?.index,
            isArtist: Boolean(typeof r === "boolean" ? r : r?.isArtist),
            cleanName: batch[idx]?.name || "",
          }))
        : [];

    for (const ev of evaluationsArray) {
      if (typeof ev?.index === "number") {
        evaluationsMap.set(ev.index, {
          index: ev.index,
          isArtist: Boolean(ev.isArtist),
          cleanName: typeof ev.cleanName === "string" && ev.cleanName.trim()
            ? cleanArtistName(ev.cleanName)
            : batch.find((b) => b.index === ev.index)?.name || "",
        });
      }
    }
  } finally {
    timeout.clear();
  }

  return evaluationsMap;
}

export async function siftItems(rawItems: SiftItem[]): Promise<SiftResult> {
  const parsedItems = Array.isArray(rawItems) ? rawItems.slice(0, 500) : [];
  if (parsedItems.length === 0) {
    return { results: [], mode: "fallback", cleanedNames: {} };
  }

  const normalized = parsedItems.map((it, idx) => normalizeSiftItem(it, idx));
  const apiKey = process.env.OPENAI_API_KEY;
  const apiUrl = process.env.OPENAI_API_URL || "https://api.openai.com/v1/chat/completions";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const evaluations: ItemEvaluation[] = new Array(normalized.length);
  const cleanedNames: Record<number, string> = {};

  let usedAI = false;

  if (apiKey) {
    try {
      const BATCH_SIZE = 25;
      const batches: SiftNormalizedItem[][] = [];
      for (let i = 0; i < normalized.length; i += BATCH_SIZE) {
        batches.push(normalized.slice(i, i + BATCH_SIZE));
      }

      const batchResults = await Promise.all(
        batches.map(async (batch) => {
          try {
            return await evaluateBatchAI(batch, apiKey, apiUrl, model);
          } catch (batchError) {
            console.warn("[SIFT] AI batch failed, falling back to heuristic for batch:", batchError);
            const fallbackMap = new Map<number, ItemEvaluation>();
            for (const it of batch) {
              fallbackMap.set(it.index, evaluateItemHeuristic(it));
            }
            return fallbackMap;
          }
        })
      );

      usedAI = true;
      for (const batchMap of batchResults) {
        for (const [idx, ev] of batchMap.entries()) {
          evaluations[idx] = ev;
        }
      }
    } catch (aiError) {
      console.error("[SIFT] AI processing failed, using heuristic:", aiError);
      usedAI = false;
    }
  }

  // Fill in any gaps with heuristic evaluations
  for (let i = 0; i < normalized.length; i++) {
    if (!evaluations[i]) {
      evaluations[i] = evaluateItemHeuristic(normalized[i]);
    }
    cleanedNames[i] = evaluations[i].cleanName;
  }

  const results = evaluations.map((ev) => Boolean(ev?.isArtist));

  return {
    results,
    mode: usedAI ? "ai" : "fallback",
    cleanedNames,
  };
}
