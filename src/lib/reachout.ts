type GenreStyle = {
  keywords: string[];
  igAEmojis: string;
  igBEmojis: string;
  emailEmojis: string;
  tone: string;
  igStyle: string;
};

type ReachoutContext = {
  artist: string;
  genreText?: string | null;
  location?: string | null;
  releaseTitle?: string | null;
  releaseDatePretty?: string | null;
  isRecentRelease: boolean;
  personalHook?: string | null;
  recentPosts?: string | null;
  showInfo?: string | null;
  bio?: string | null;
  hasEmail: boolean;
  styleHint?: string | null;
};

type ReachoutOutput = {
  IG_A: string;
  IG_B: string;
  EMAIL_A?: string;
  EMAIL_B?: string;
};

const REACHOUT_CONFIG = {
  model: process.env.OPENAI_MODEL || "gpt-4o-mini",
  apiUrl: process.env.OPENAI_API_URL || "https://api.openai.com/v1/responses",
  maxRecentPostsChars: 1400,
  maxBioChars: 520,
  maxPersonalHookChars: 340,
};

const GENRE_STYLES: Record<string, GenreStyle> = {
  hiphop: {
    keywords: ["hip hop", "hip-hop", "rap", "trap", "drill", "boom bap", "grime"],
    igAEmojis: "2-4 emojis (🔥💯🎤🎧💿🚀✨)",
    igBEmojis: "1-2 emojis",
    emailEmojis: "none",
    tone: "very casual with hip hop slang (fire, dope, sick, vibes, etc)",
    igStyle: "Keep it real and conversational, like you are talking to another artist in the scene",
  },
  metal: {
    keywords: [
      "metal",
      "heavy metal",
      "death metal",
      "black metal",
      "doom",
      "thrash",
      "metalcore",
      "deathcore",
      "hardcore",
    ],
    igAEmojis: "2-3 emojis (🤘🎸😈🔥⚡💀🖤)",
    igBEmojis: "1-2 emojis (🤘🎸)",
    emailEmojis: "none",
    tone: "casual and direct, respect the heavy sound",
    igStyle: "Acknowledge the intensity and energy of their music",
  },
  rock: {
    keywords: ["rock", "alternative", "indie rock", "punk", "garage", "grunge"],
    igAEmojis: "1-2 emojis (🎸🔥✨🎵)",
    igBEmojis: "0-1 emoji",
    emailEmojis: "none",
    tone: "casual and authentic",
    igStyle: "Keep it straightforward and unpretentious",
  },
  electronic: {
    keywords: [
      "electronic",
      "edm",
      "house",
      "techno",
      "dubstep",
      "drum and bass",
      "dnb",
      "bass music",
      "dance",
    ],
    igAEmojis: "2-3 emojis (🎧🔊✨🌊💫🎛️)",
    igBEmojis: "1 emoji",
    emailEmojis: "none",
    tone: "casual with production/technical appreciation",
    igStyle: "Reference production quality and sonic elements",
  },
  pop: {
    keywords: ["pop", "indie pop", "synth pop", "dream pop"],
    igAEmojis: "1-2 emojis (✨💫🎵🌟)",
    igBEmojis: "0-1 emoji",
    emailEmojis: "none",
    tone: "friendly and upbeat",
    igStyle: "Warm and approachable",
  },
  default: {
    keywords: [],
    igAEmojis: "1 emoji (or none)",
    igBEmojis: "preferably none",
    emailEmojis: "none",
    tone: "casual professional",
    igStyle: "Natural and conversational",
  },
};

const clip = (value: string | null | undefined, max: number) => {
  if (!value) return "";
  return value.length <= max ? value : value.slice(0, max);
};

const detectGenreStyle = (genreText?: string | null) => {
  if (!genreText) return GENRE_STYLES.default;
  const lower = genreText.toLowerCase();
  for (const key of Object.keys(GENRE_STYLES)) {
    if (key === "default") continue;
    const style = GENRE_STYLES[key];
    if (style.keywords.some((keyword) => lower.includes(keyword))) return style;
  }
  return GENRE_STYLES.default;
};

const buildPayload = (ctx: ReachoutContext) => {
  const genreStyle = detectGenreStyle(ctx.genreText);
  const messagesToGenerate = ctx.hasEmail
    ? "FOUR messages: IG_A, IG_B, EMAIL_A, EMAIL_B"
    : "TWO messages: IG_A, IG_B (no emails needed)";

  const genreInstructions =
    "GENRE-SPECIFIC TONE REQUIREMENTS:\n" +
    `Artist Genre: ${ctx.genreText || "Not specified"}\n` +
    `Tone: ${genreStyle.tone}\n` +
    `IG Style: ${genreStyle.igStyle}\n\n` +
    "EMOJI REQUIREMENTS (STRICT):\n" +
    `- IG_A: ${genreStyle.igAEmojis}\n` +
    `- IG_B: ${genreStyle.igBEmojis}\n` +
    (ctx.hasEmail
      ? `- EMAIL_A: ${genreStyle.emailEmojis}\n- EMAIL_B: ${genreStyle.emailEmojis}\n`
      : "");

  const styleHintText = ctx.styleHint ? `Style tweak (apply to ALL messages): ${ctx.styleHint}\n` : "";

  const systemText =
    "You write outreach like a real Austin recording/mix/master engineer.\n" +
    "Sound specific, nonchalant, charismatic, and human. No template vibes.\n\n" +
    "Banned phrases/vibes (do not use):\n" +
    "- love what you're building\n" +
    "- super clean work\n" +
    "- really solid stuff\n" +
    "- momentum\n" +
    "- resonated\n" +
    "- quick message\n" +
    "- no pressure\n\n" +
    "Hard constraints:\n" +
    `- Write ${messagesToGenerate}.\n` +
    "- Each message is 3–5 sentences.\n" +
    "- Every message MUST introduce yourself as Kasper, an audio engineer in the Austin area AND include a subtle offer of recording/mixing/mastering services (not salesy, not pushy).\n" +
    "- Do NOT mention AI, automation, scraping, spreadsheets, or data.\n" +
    "- If referencing posts, paraphrase meaning like you actually understood it.\n" +
    `- Output JSON only with keys: ${ctx.hasEmail ? "IG_A, IG_B, EMAIL_A, EMAIL_B" : "IG_A, IG_B"}.\n` +
    styleHintText +
    (ctx.hasEmail
      ? "- EMAIL_A and EMAIL_B must end with a signoff name exactly: Kasper Pickett.\n"
      : "") +
    "- Do NOT include placeholders like [Your Name] or [Your contact information].\n";

  const userText =
    "Context:\n" +
    `Artist: ${ctx.artist}\n` +
    `Location (Artist's Home): ${ctx.location || "Unknown"}\n` +
    `Upcoming Show in Austin (if non-local): ${ctx.showInfo || "None"}\n\n` +
    genreInstructions +
    "DRAFT-SPECIFIC RULES:\n" +
    "1. VARIANT A (IG_A and EMAIL_A):\n" +
    (ctx.recentPosts
      ? "   - Reference exactly ONE idea from Recent Posts. Pick the most interesting one and paraphrase it naturally.\n"
      : "   - Use the Personal Hook or Release reference if available.\n") +
    (ctx.showInfo
      ? "   - If the artist is NOT based in Austin (or is >150 miles away), mention their upcoming Austin show and suggest that since they are coming into town, they might be interested in stopping by the studio if they have time. Keep it low-pressure. If the artist IS based in Austin, do NOT mention their upcoming show at a specific venue/date, and NEVER suggest they 'stop by because they are in town'—treat them as a local.\n"
      : "") +
    "\n2. VARIANT B (IG_B and EMAIL_B):\n" +
    (ctx.personalHook
      ? "   - Reference the Personal Hook.\n"
      : ctx.isRecentRelease
        ? `   - Reference the recent release: ${ctx.releaseTitle}. Include the title verbatim.\n`
        : "   - Be friendly and refer to their overall vibe or bio.\n") +
    "\nArtist Data:\n" +
    `Personal Hook: ${clip(ctx.personalHook, REACHOUT_CONFIG.maxPersonalHookChars)}\n` +
    `Recent release: ${ctx.isRecentRelease ? ctx.releaseTitle : "None"}\n` +
    `Recent IG Posts: ${clip(ctx.recentPosts, REACHOUT_CONFIG.maxRecentPostsChars)}\n` +
    `Bio: ${clip(ctx.bio, REACHOUT_CONFIG.maxBioChars)}\n\n` +
    "Return JSON only.\n";

  const schemaProperties: Record<string, { type: "string" }> = {
    IG_A: { type: "string" },
    IG_B: { type: "string" },
  };
  const requiredFields = ["IG_A", "IG_B"];
  if (ctx.hasEmail) {
    schemaProperties.EMAIL_A = { type: "string" };
    schemaProperties.EMAIL_B = { type: "string" };
    requiredFields.push("EMAIL_A", "EMAIL_B");
  }

  return {
    model: REACHOUT_CONFIG.model,
    store: false,
    input: [
      { role: "system", content: [{ type: "input_text", text: systemText }] },
      { role: "user", content: [{ type: "input_text", text: userText }] },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "reachouts",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: schemaProperties,
          required: requiredFields,
        },
      },
    },
  };
};

const extractJson = (resp: Record<string, unknown>) => {
  const output = Array.isArray(resp.output) ? resp.output : [];
  for (const item of output) {
    const content = Array.isArray((item as { content?: unknown }).content)
      ? (item as { content?: Array<Record<string, unknown>> }).content
      : [];
    for (const chunk of content ?? []) {
      if (chunk.type === "output_json" && chunk.json) return chunk.json as ReachoutOutput;
      if (chunk.type === "output_text" && typeof chunk.text === "string") {
        return JSON.parse(chunk.text) as ReachoutOutput;
      }
    }
  }
  throw new Error("Could not find JSON in OpenAI response");
};

const callOpenAI = async (payload: Record<string, unknown>) => {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  const response = await fetch(REACHOUT_CONFIG.apiUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`OpenAI error ${response.status}: ${text}`);
  }
  return JSON.parse(text) as Record<string, unknown>;
};

const mentionsServices = (text: string) =>
  /\b(record|recording|mix|mixing|mixdown|master|mastering|studio|session|engineer|tracking)\b/i.test(
    text
  );

const validateRequired = (out: ReachoutOutput, fields: Array<keyof ReachoutOutput>) => {
  for (const key of fields) {
    const value = out[key];
    if (!value || typeof value !== "string" || !value.trim()) {
      throw new Error(`Missing output for ${key}`);
    }
  }
};

const cleanEmail = (value: string) => {
  let text = value;
  text = text.replace(/\[your name\]/gi, "Kasper Pickett");
  text = text.replace(/\[your contact info(?:rmation)?\]/gi, "");
  text = text.replace(/\[contact info(?:rmation)?\]/gi, "");
  text = text.replace(/\[phone\]/gi, "");
  text = text.replace(/\[email\]/gi, "");
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  if (!/kasper pickett/i.test(text)) {
    text = `${text}\n\nKasper Pickett`;
  } else if (!/kasper pickett\s*$/i.test(text)) {
    text = `${text.trim()}\n\nKasper Pickett`;
  }

  return text.trim();
};

const requireTitle = (out: ReachoutOutput, title: string) =>
  Object.values(out).every((value) =>
    typeof value === "string" ? value.toLowerCase().includes(title.toLowerCase()) : true
  );

export const generateReachoutDrafts = async (ctx: ReachoutContext) => {
  const fields: Array<keyof ReachoutOutput> = ctx.hasEmail
    ? ["IG_A", "IG_B", "EMAIL_A", "EMAIL_B"]
    : ["IG_A", "IG_B"];

  let payload = buildPayload(ctx);
  let output = extractJson(await callOpenAI(payload));
  validateRequired(output, fields);

  if (!fields.every((key) => mentionsServices(output[key] as string))) {
    payload = {
      ...payload,
      input: [
        ...payload.input,
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                "Correction: In EACH message, explicitly include at least ONE of these exact words: recording, mixing, mastering. (Include the literal word.) Regenerate ALL messages. Return JSON only.",
            },
          ],
        },
      ],
    };
    output = extractJson(await callOpenAI(payload));
    validateRequired(output, fields);
  }

  if (ctx.isRecentRelease && ctx.releaseTitle) {
    const ok = requireTitle(output, ctx.releaseTitle);
    if (!ok) {
      payload = {
        ...payload,
        input: [
          ...payload.input,
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text:
                  "Correction: Regenerate all messages and include this exact track title verbatim in EVERY message: " +
                  ctx.releaseTitle +
                  ". Do not wrap the title in quotes. Return JSON only.",
              },
            ],
          },
        ],
      };
      output = extractJson(await callOpenAI(payload));
      validateRequired(output, fields);
    }
  }

  if (ctx.hasEmail) {
    output.EMAIL_A = cleanEmail(output.EMAIL_A || "");
    output.EMAIL_B = cleanEmail(output.EMAIL_B || "");
  }

  return output;
};
