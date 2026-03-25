/**
 * Artist Enrichment Pipeline — Location & Genre
 *
 * 7-stage waterfall that resolves location, genre, and external bio.
 * Each stage short-circuits as soon as it finds a confident answer.
 *
 * Stage 1: Raw scraper fields (locationName, city, etc.)
 * Stage 2: IG Bio regex (📍Austin, TX / "Based in Seattle")
 * Stage 3: MusicBrainz API   — location + genre tags (free, no key)
 * Stage 4: Last.fm API       — location + top tags + bio (LASTFM_API_KEY)
 * Stage 5: Discogs API       — genres/styles + profile bio (DISCOGS_TOKEN)
 * Stage 6: Google Search     — find artist homepage (APIFY_TOKEN)
 * Stage 7: Homepage scrape   — meta tags + "based in" text
 */

export type EnrichmentResult = {
  location: string | null;
  genre: string | null;
  externalBio: string | null;
  externalBioSource: "lastfm" | "discogs" | null;
};

export type LocationInput = {
  /** Artist display name — required for MB, Last.fm, Discogs, Google */
  name: string;
  /** Raw Instagram biography text */
  bio?: string | null;
  /** URL linked on the IG profile — used as first homepage candidate */
  externalUrl?: string | null;
  /** Raw key-value bag from the scraper */
  rawData?: Record<string, unknown>;
  /** Skip the Google/homepage stages (Apify has a per-run cost) */
  skipGoogle?: boolean;
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const clean = (s: string) =>
  s
    .trim()
    .replace(/[.,|•–\-]+$/, "")
    .trim();

const validLocation = (s: string | null | undefined): string | null => {
  if (!s) return null;
  const c = clean(s);
  if (c.length < 2 || c.length > 80) return null;

  // Reject overly generic or metaphorical values
  const blacklist = [
    "worldwide", "global", "internet", "earth", "world", "everywhere", 
    "universe", "planet", "galaxy", "metaverse", "digital",
    "concert hall", "halls of", "big stage", "small screen", "the road",
    "studio", "bedroom", "basement", "garage", "dream", "nowhere"
  ];

  const lower = c.toLowerCase();
  
  // Check blacklist
  if (blacklist.some(word => lower.includes(word))) return null;

  // Most real locations are short (City) or structured (City, State)
  // If it's more than 4 words and has no comma or digits, it's likely a sentence fragment
  const words = c.split(/\s+/);
  if (words.length > 4 && !c.includes(",") && !/\d/.test(c)) return null;

  return c;
};

const validGenre = (s: string | null | undefined): string | null => {
  if (!s) return null;
  const c = clean(s);
  if (c.length < 2 || c.length > 60) return null;
  return c;
};

const stripHtml = (html: string) =>
  html.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " ").trim();

// ─────────────────────────────────────────────────────────────────────────────
// Stage 1 — Raw scraper fields
// ─────────────────────────────────────────────────────────────────────────────
const fromRawFields = (raw: Record<string, unknown>): string | null => {
  const keys = [
    "locationName", "city", "location", "address", "venueName",
    "hometown", "hometown_location", "place", "region",
  ];
  for (const k of keys) {
    const v = raw[k];
    if (typeof v === "string") {
      const loc = validLocation(v);
      if (loc) return loc;
    }
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 2 — IG Bio regex
// ─────────────────────────────────────────────────────────────────────────────
const BIO_PATTERNS: RegExp[] = [
  /📍\s*([^\n,|•–·]{2,50})/u,
  /🏠\s*([^\n,|•–·]{2,50})/u,
  /\b(?:based\s+(?:in|out\s+of)|located\s+in|hailing\s+from|originally\s+from|from|out\s+of|hometown[:\s]+)\s+([A-Za-z][^\n,|•–·]{2,50})/i,
  /(?:^|[\n|•·–])\s*([A-Z][a-z]{2,20},?\s+[A-Z]{2})\b/m,
  /\b([A-Z][a-z]{2,20}(?:\s+[A-Z][a-z]+)?,\s+[A-Z]{2})\b/,
];

const fromBio = (bio: string): string | null => {
  for (const re of BIO_PATTERNS) {
    const m = bio.match(re);
    if (m?.[1]) {
      const loc = validLocation(m[1]);
      if (loc) return loc;
    }
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 3 — MusicBrainz
// ─────────────────────────────────────────────────────────────────────────────
const fromMusicBrainz = async (
  name: string
): Promise<{ location: string | null; genre: string | null }> => {
  try {
    const q = encodeURIComponent(`artist:"${name}"`);
    const res = await fetch(
      `https://musicbrainz.org/ws/2/artist/?query=${q}&limit=5&fmt=json`,
      {
        headers: {
          "User-Agent": "SpectralSoundworks/1.0 (https://spectralsoundworks.com)",
          Accept: "application/json",
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return { location: null, genre: null };
    const data = (await res.json()) as {
      artists?: Array<{
        name?: string;
        score?: number;
        area?: { name?: string };
        "begin-area"?: { name?: string };
        tags?: Array<{ name: string; count: number }>;
      }>;
    };

    const top = data.artists?.[0];
    if (!top || (top.score ?? 0) < 70) return { location: null, genre: null };

    const location = validLocation(top.area?.name ?? top["begin-area"]?.name ?? null);
    const tags = (top.tags ?? []).sort((a, b) => b.count - a.count);
    const genre = validGenre(tags[0]?.name ?? null);
    return { location, genre };
  } catch {
    return { location: null, genre: null };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 4 — Last.fm
// ─────────────────────────────────────────────────────────────────────────────
const fromLastFm = async (
  name: string,
  apiKey: string
): Promise<{ location: string | null; genre: string | null; bio: string | null }> => {
  try {
    const params = new URLSearchParams({
      method: "artist.getinfo",
      artist: name,
      api_key: apiKey,
      format: "json",
      autocorrect: "1",
    });
    const res = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { location: null, genre: null, bio: null };
    const data = (await res.json()) as {
      artist?: {
        bio?: { summary?: string; content?: string };
        tags?: { tag?: Array<{ name: string }> };
        stats?: { listeners?: string };
      };
      error?: number;
    };
    if (data.error || !data.artist) return { location: null, genre: null, bio: null };

    const artist = data.artist;

    // Extract genre from tags
    const tags = artist.tags?.tag ?? [];
    const genre = validGenre(tags[0]?.name ?? null);

    // Extract location from bio text
    const bioText = stripHtml(artist.bio?.summary ?? artist.bio?.content ?? "");
    // Remove Last.fm's boilerplate footer link
    const cleanBio = bioText.replace(/Read more on Last\.fm.*$/i, "").trim();
    const location = cleanBio ? fromBio(cleanBio) : null;

    const bio = cleanBio.length > 20 ? cleanBio.substring(0, 1200) : null;
    return { location, genre, bio };
  } catch {
    return { location: null, genre: null, bio: null };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 5 — Discogs
// ─────────────────────────────────────────────────────────────────────────────
const fromDiscogs = async (
  name: string,
  token: string
): Promise<{ location: string | null; genre: string | null; bio: string | null }> => {
  try {
    const searchRes = await fetch(
      `https://api.discogs.com/database/search?${new URLSearchParams({
        q: name,
        type: "artist",
        per_page: "3",
      })}`,
      {
        headers: {
          "User-Agent": "SpectralSoundworks/1.0",
          Authorization: `Discogs token=${token}`,
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!searchRes.ok) return { location: null, genre: null, bio: null };
    const searchData = (await searchRes.json()) as {
      results?: Array<{ id?: number; title?: string; genre?: string[]; style?: string[]; resource_url?: string }>;
    };

    const top = searchData.results?.[0];
    if (!top?.resource_url) return { location: null, genre: null, bio: null };

    // Fetch full artist record for profile bio
    const artistRes = await fetch(top.resource_url, {
      headers: {
        "User-Agent": "SpectralSoundworks/1.0",
        Authorization: `Discogs token=${token}`,
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!artistRes.ok) return { location: null, genre: null, bio: null };
    const artistData = (await artistRes.json()) as {
      profile?: string;
      genres?: string[];
      styles?: string[];
      name?: string;
    };

    const genres = artistData.genres ?? top.genre ?? [];
    const styles = artistData.styles ?? top.style ?? [];
    const genre = validGenre(genres[0] ?? styles[0] ?? null);

    const profileText = (artistData.profile ?? "")
      // Remove Discogs markup [a=...], [l=...], etc.
      .replace(/\[([a-z]|url)=[^\]]+\]/gi, "")
      .replace(/</g, "").trim();
    const location = profileText ? fromBio(profileText) : null;
    const bio = profileText.length > 20 ? profileText.substring(0, 1200) : null;

    return { location, genre, bio };
  } catch {
    return { location: null, genre: null, bio: null };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 6 — Google Search → Homepage
// (imported lazily to avoid circular deps)
// ─────────────────────────────────────────────────────────────────────────────
const findHomepageViaGoogle = async (
  name: string,
  apifyToken: string
): Promise<string | null> => {
  try {
    const { discoverArtistHomepage } = await import("./google-search");
    return discoverArtistHomepage(name, apifyToken);
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Stage 7 — Homepage scrape
// ─────────────────────────────────────────────────────────────────────────────
const HOMEPAGE_PATTERNS: RegExp[] = [
  /<meta[^>]+name=["']geo\.placename["'][^>]+content=["']([^"']+)["']/i,
  /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']geo\.placename["']/i,
  /\b(?:based\s+(?:in|out\s+of)|located\s+in|hometown)\s*[:\s]\s*([A-Za-z][^<,.\n]{2,50})/i,
  /📍\s*([^\n<,•–]{2,50})/u,
  /\b([A-Z][a-z]{2,},\s+[A-Z]{2})\b/,
];

const fromHomepage = async (url: string): Promise<string | null> => {
  try {
    const cleanUrl = url.startsWith("http") ? url : `https://${url}`;
    const res = await fetch(cleanUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const html = (await res.text()).substring(0, 60_000);

    for (const re of HOMEPAGE_PATTERNS) {
      const m = html.match(re);
      if (m?.[1]) {
        const loc = validLocation(stripHtml(m[1]));
        if (loc) return loc;
      }
    }
    return null;
  } catch {
    return null;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Main export: resolveArtistEnrichment
// ─────────────────────────────────────────────────────────────────────────────
export const resolveArtistEnrichment = async (
  input: LocationInput
): Promise<EnrichmentResult> => {
  const { name, bio, externalUrl, rawData, skipGoogle } = input;
  let location: string | null = null;
  let genre: string | null = null;
  let externalBio: string | null = null;
  let externalBioSource: EnrichmentResult["externalBioSource"] = null;

  // Stage 1 — Raw scraper fields
  if (rawData) {
    location = fromRawFields(rawData);
    if (location) console.log(`[enrich] Stage 1 → location: "${location}"`);
  }

  // Stage 2 — IG bio regex
  if (!location && bio) {
    location = fromBio(bio);
    if (location) console.log(`[enrich] Stage 2 (bio) → location: "${location}"`);
  }

  // Short-circuit: if location AND genre both set, done early
  if (location && genre) return { location, genre, externalBio, externalBioSource };

  // Stage 3 — MusicBrainz (rate limit: 1 req/sec)
  await new Promise((r) => setTimeout(r, 1100));
  const mb = await fromMusicBrainz(name);
  if (!location && mb.location) {
    location = mb.location;
    console.log(`[enrich] Stage 3 (MusicBrainz) → location: "${location}"`);
  }
  if (!genre && mb.genre) {
    genre = mb.genre;
    console.log(`[enrich] Stage 3 (MusicBrainz) → genre: "${genre}"`);
  }

  if (location && genre) return { location, genre, externalBio, externalBioSource };

  // Stage 4 — Last.fm
  const lastFmKey = process.env.LASTFM_API_KEY;
  if (lastFmKey) {
    const lastfm = await fromLastFm(name, lastFmKey);
    if (!location && lastfm.location) {
      location = lastfm.location;
      console.log(`[enrich] Stage 4 (Last.fm) → location: "${location}"`);
    }
    if (!genre && lastfm.genre) {
      genre = lastfm.genre;
      console.log(`[enrich] Stage 4 (Last.fm) → genre: "${genre}"`);
    }
    if (lastfm.bio) {
      externalBio = lastfm.bio;
      externalBioSource = "lastfm";
    }
  }

  if (location && genre) return { location, genre, externalBio, externalBioSource };

  // Stage 5 — Discogs
  const discogsToken = process.env.DISCOGS_TOKEN;
  if (discogsToken) {
    const discogs = await fromDiscogs(name, discogsToken);
    if (!location && discogs.location) {
      location = discogs.location;
      console.log(`[enrich] Stage 5 (Discogs) → location: "${location}"`);
    }
    if (!genre && discogs.genre) {
      genre = discogs.genre;
      console.log(`[enrich] Stage 5 (Discogs) → genre: "${genre}"`);
    }
    // Only use Discogs bio if we don't have a Last.fm one already
    if (!externalBio && discogs.bio) {
      externalBio = discogs.bio;
      externalBioSource = "discogs";
    }
  }

  if (location) return { location, genre, externalBio, externalBioSource };

  // Stages 6 & 7 — Google → Homepage scrape
  if (!skipGoogle) {
    const apifyToken = process.env.APIFY_TOKEN;
    if (apifyToken) {
      // Prefer existing IG external URL over doing a fresh Google search
      let homepageUrl = externalUrl ?? null;
      if (!homepageUrl) {
        homepageUrl = await findHomepageViaGoogle(name, apifyToken);
        if (homepageUrl) console.log(`[enrich] Stage 6 (Google) → homepage: "${homepageUrl}"`);
      }
      if (homepageUrl) {
        location = await fromHomepage(homepageUrl);
        if (location) console.log(`[enrich] Stage 7 (homepage scrape) → location: "${location}"`);
      }
    }
  }

  if (!location && !genre && !externalBio) {
    console.log(`[enrich] All stages exhausted for "${name}" — no enrichment found.`);
  }

  return { location, genre, externalBio, externalBioSource };
};

// Legacy export for backwards compat with any direct location-only callers
export const resolveArtistLocation = async (
  input: LocationInput
): Promise<string | null> => {
  const result = await resolveArtistEnrichment(input);
  return result.location;
};
