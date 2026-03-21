const fs = require("fs");
const path = require("path");
const https = require("https");
const { PrismaClient } = require("./generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const sharp = (() => {
  try {
    return require("sharp");
  } catch {
    return null;
  }
})();

const envPath = path.join(process.cwd(), ".env");

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) {
      const value = rawValue.replace(/^['"]|['"]$/g, "");
      process.env[key] = value;
    }
  }
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Provide it in your environment.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const shouldReset = process.argv.includes("--reset") || process.argv.includes("--fresh");

const fetchJsonWithHttps = (url, redirects = 0) =>
  new Promise((resolve) => {
    const request = https.get(
      url,
      {
        headers: {
          "User-Agent": "spectral-seed/1.0",
        },
      },
      (res) => {
        const status = res.statusCode ?? 0;
        const location = res.headers.location;

        if ([301, 302, 307, 308].includes(status) && location && redirects < 3) {
          res.resume();
          resolve(fetchJsonWithHttps(location, redirects + 1));
          return;
        }

        if (status < 200 || status >= 300) {
          res.resume();
          resolve(null);
          return;
        }

        let raw = "";
        res.on("data", (chunk) => {
          raw += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch {
            resolve(null);
          }
        });
      }
    );

    request.on("error", () => resolve(null));
  });

const fetchSpotifyImageUrl = async (spotifyArtistUrl, spotifyArtistId) => {
  const url =
    spotifyArtistUrl ||
    (spotifyArtistId ? `https://open.spotify.com/artist/${spotifyArtistId}` : null);
  if (!url) return null;

  try {
    const endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
    const data =
      typeof fetch === "function"
        ? await fetch(endpoint)
            .then((response) => (response.ok ? response.json() : null))
            .catch(() => null)
        : await fetchJsonWithHttps(endpoint);
    return data && typeof data.thumbnail_url === "string" ? data.thumbnail_url : null;
  } catch {
    return null;
  }
};

const fetchSpotifyThumbnail = async (spotifyUrl) => {
  if (!spotifyUrl) return null;

  try {
    const endpoint = `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`;
    const data =
      typeof fetch === "function"
        ? await fetch(endpoint)
            .then((response) => (response.ok ? response.json() : null))
            .catch(() => null)
        : await fetchJsonWithHttps(endpoint);
    return data && typeof data.thumbnail_url === "string" ? data.thumbnail_url : null;
  } catch {
    return null;
  }
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const rgbToHsl = (r, g, b) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / delta + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
};

const hslToRgb = (h, s, l) => {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p, q, t) => {
    let tn = t;
    if (tn < 0) tn += 1;
    if (tn > 1) tn -= 1;
    if (tn < 1 / 6) return p + (q - p) * 6 * tn;
    if (tn < 1 / 2) return q;
    if (tn < 2 / 3) return p + (q - p) * (2 / 3 - tn) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);
  return { r, g, b };
};

const rgbToHex = (r, g, b) =>
  `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;

const createAccentPalette = (r, g, b) => {
  const { h, s, l } = rgbToHsl(r, g, b);
  if (s < 0.08) return null;

  const accentS = clamp(s + 0.25, 0.45, 0.95);
  const accentL = clamp(l < 0.45 ? l + 0.32 : l + 0.18, 0.5, 0.72);
  const accentRgb = hslToRgb(h, accentS, accentL);
  const accentStrongRgb = hslToRgb(
    h,
    clamp(accentS + 0.1, 0.55, 1),
    clamp(accentL + 0.08, 0.56, 0.8)
  );
  const highlightRgb = hslToRgb(
    h,
    clamp(accentS + 0.16, 0.6, 1),
    clamp(accentL + 0.2, 0.66, 0.88)
  );

  return {
    accent: rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b),
    accentStrong: rgbToHex(accentStrongRgb.r, accentStrongRgb.g, accentStrongRgb.b),
    highlight: rgbToHex(highlightRgb.r, highlightRgb.g, highlightRgb.b),
  };
};

const extractAccentFromImage = async (imageUrl) => {
  if (!sharp) return null;
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());
    const { data } = await sharp(buffer)
      .resize(1, 1, { fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    if (!data || data.length < 3) return null;
    return createAccentPalette(data[0], data[1], data[2]);
  } catch {
    return null;
  }
};

const seedEntries = [
  {
    artist: {
      name: "Billie Eilish",
      instagramHandle: "billieeilish",
      instagramProfileUrl: "https://www.instagram.com/billieeilish/",
      spotifyArtistId: "6qqNVTkY8uBg9cP3Jd7DAH",
      spotifyArtistUrl: "https://open.spotify.com/artist/6qqNVTkY8uBg9cP3Jd7DAH",
      location: "Los Angeles, CA",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      genre: "Alt-pop",
      tags: ["pop", "cinematic"],
      bio: "Alt-pop vocalist with cinematic production and intimate storytelling.",
      followerCount: 110000000,
      lastPostAt: "2026-02-02T18:30:00.000Z",
    },
    lead: {
      status: "NEW",
      score: 86,
      scoreRationale: "Global fanbase, strong recent release momentum.",
      nextActionAt: "2026-02-08T17:00:00.000Z",
    },
    releases: [
      {
        spotifyTrackId: "2Fxmhks0bxGSBdJ92vM42m",
        title: "bad guy",
        releaseDate: "2019-03-29T00:00:00.000Z",
      },
    ],
    instagramPosts: [
      {
        instagramPostId: "CR6aS1",
        caption: "Studio night. New visuals coming soon.",
        imageUrl:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
        postedAt: "2026-02-02T18:30:00.000Z",
        url: "https://www.instagram.com/p/CR6aS1",
      },
    ],
    messageDrafts: [
      {
        tone: "Warm intro",
        body:
          "Hey Billie — love the atmospheric palette on the latest release. Would you be open to a custom mix concept?",
        source: "seed",
        selected: true,
      },
    ],
    activities: [
      {
        type: "NOTE",
        note: "Priority outreach for cinematic session concept.",
        occurredAt: "2026-02-03T16:00:00.000Z",
      },
    ],
  },
  {
    artist: {
      name: "Phoebe Bridgers",
      instagramHandle: "phoebebridgers",
      instagramProfileUrl: "https://www.instagram.com/phoebebridgers/",
      spotifyArtistId: "1r1uxoy19fzMxunt3ONAkG",
      spotifyArtistUrl: "https://open.spotify.com/artist/1r1uxoy19fzMxunt3ONAkG",
      location: "Los Angeles, CA",
      city: "Los Angeles",
      state: "CA",
      country: "USA",
      genre: "Indie folk",
      tags: ["songwriter", "guitar"],
      bio: "Indie folk songwriter known for hushed vocals and sharp lyricism.",
      followerCount: 1700000,
      lastPostAt: "2026-02-01T14:00:00.000Z",
    },
    lead: {
      status: "FOLLOW_UP",
      score: 74,
      scoreRationale: "Strong touring base; follow-up due.",
      nextActionAt: "2026-02-01T12:00:00.000Z",
    },
    releases: [
      {
        spotifyTrackId: "4u7EnebtmKWzUH433cf5Qv",
        title: "Bohemian Rhapsody - Remastered 2011",
        releaseDate: "2011-01-01T00:00:00.000Z",
      },
    ],
    instagramPosts: [
      {
        instagramPostId: "CR9dB2",
        caption: "Tour dates dropping tomorrow.",
        imageUrl:
          "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
        postedAt: "2026-02-01T14:00:00.000Z",
        url: "https://www.instagram.com/p/CR9dB2",
      },
    ],
    messageDrafts: [
      {
        tone: "Follow-up",
        body:
          "Hey Phoebe — circling back on the tour visuals idea. Want to see a quick concept?",
        source: "seed",
        selected: false,
      },
    ],
    activities: [
      {
        type: "FOLLOW_UP_SET",
        note: "Scheduled follow-up after Jan 29 post.",
        occurredAt: "2026-01-30T09:00:00.000Z",
      },
    ],
  },
  {
    artist: {
      name: "Tycho",
      instagramHandle: "tychomusic",
      instagramProfileUrl: "https://www.instagram.com/tychomusic/",
      spotifyArtistId: "5oOhM2DFWab8XhSdQiITry",
      spotifyArtistUrl: "https://open.spotify.com/artist/5oOhM2DFWab8XhSdQiITry",
      location: "San Francisco, CA",
      city: "San Francisco",
      state: "CA",
      country: "USA",
      genre: "Ambient electronic",
      tags: ["ambient", "downtempo"],
      bio: "Instrumental electronic project blending guitars and analog synths.",
      followerCount: 900000,
      lastPostAt: "2026-02-03T21:15:00.000Z",
    },
    lead: {
      status: "QUALIFIED",
      score: 92,
      scoreRationale: "High-fit aesthetic; strong visuals and catalog depth.",
      nextActionAt: "2026-02-06T19:00:00.000Z",
    },
    releases: [
      {
        spotifyTrackId: "0Svkvt5I79wficMFgaqEQJ",
        title: "El Scorcho",
        releaseDate: "1996-09-24T00:00:00.000Z",
      },
    ],
    instagramPosts: [
      {
        instagramPostId: "CR8zQ1",
        caption: "Studio night. New visuals in the works.",
        imageUrl:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        postedAt: "2026-02-03T21:15:00.000Z",
        url: "https://www.instagram.com/p/CR8zQ1",
      },
    ],
    messageDrafts: [
      {
        tone: "Curated pitch",
        body:
          "Your catalog feels like a perfect fit for our immersive sessions. Want to explore a bespoke mix?",
        source: "seed",
        selected: true,
      },
    ],
    activities: [
      {
        type: "NOTE",
        note: "Top priority for Q1 experiential pitch.",
        occurredAt: "2026-02-04T10:30:00.000Z",
      },
    ],
  },
];

const toDate = (value) => (value ? new Date(value) : undefined);

async function resetDatabase() {
  await prisma.messageDraft.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.release.deleteMany();
  await prisma.instagramPost.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.artist.deleteMany();
}

async function upsertArtist(artist) {
  const existingArtist = artist.instagramHandle
    ? await prisma.artist.findUnique({ where: { instagramHandle: artist.instagramHandle } })
    : artist.spotifyArtistId
      ? await prisma.artist.findUnique({ where: { spotifyArtistId: artist.spotifyArtistId } })
      : await prisma.artist.findFirst({
          where: {
            name: artist.name,
            city: artist.city ?? undefined,
            state: artist.state ?? undefined,
          },
        });

  if (existingArtist) {
    return prisma.artist.update({
      where: { id: existingArtist.id },
      data: {
        name: artist.name,
        instagramHandle: artist.instagramHandle,
        instagramProfileUrl: artist.instagramProfileUrl,
        spotifyArtistId: artist.spotifyArtistId,
        spotifyArtistUrl: artist.spotifyArtistUrl,
        spotifyImageUrl: artist.spotifyImageUrl ?? undefined,
        spotifyAccent: artist.spotifyAccent ?? undefined,
        spotifyAccentStrong: artist.spotifyAccentStrong ?? undefined,
        spotifyHighlight: artist.spotifyHighlight ?? undefined,
        location: artist.location,
        city: artist.city,
        state: artist.state,
        country: artist.country,
        genre: artist.genre,
        tags: artist.tags ?? undefined,
        bio: artist.bio,
        followerCount: artist.followerCount,
        lastPostAt: toDate(artist.lastPostAt),
      },
    });
  }

  return prisma.artist.create({
    data: {
      name: artist.name,
      instagramHandle: artist.instagramHandle,
      instagramProfileUrl: artist.instagramProfileUrl,
      spotifyArtistId: artist.spotifyArtistId,
      spotifyArtistUrl: artist.spotifyArtistUrl,
      spotifyImageUrl: artist.spotifyImageUrl ?? null,
      spotifyAccent: artist.spotifyAccent ?? null,
      spotifyAccentStrong: artist.spotifyAccentStrong ?? null,
      spotifyHighlight: artist.spotifyHighlight ?? null,
      location: artist.location,
      city: artist.city,
      state: artist.state,
      country: artist.country,
      genre: artist.genre,
      tags: artist.tags ?? [],
      bio: artist.bio,
      followerCount: artist.followerCount,
      lastPostAt: toDate(artist.lastPostAt),
    },
  });
}

async function upsertLead(artistId, lead) {
  const existingLead = await prisma.lead.findFirst({ where: { artistId } });

  if (existingLead) {
    return prisma.lead.update({
      where: { id: existingLead.id },
      data: {
        status: lead.status ?? undefined,
        score: lead.score ?? undefined,
        scoreRationale: lead.scoreRationale ?? undefined,
        lastContactedAt: toDate(lead.lastContactedAt),
        nextActionAt: toDate(lead.nextActionAt),
      },
    });
  }

  return prisma.lead.create({
    data: {
      artistId,
      status: lead.status,
      score: lead.score ?? undefined,
      scoreRationale: lead.scoreRationale,
      lastContactedAt: toDate(lead.lastContactedAt),
      nextActionAt: toDate(lead.nextActionAt),
    },
  });
}

async function upsertRelease(artistId, release) {
  const resolvedUrl =
    release.url ||
    (release.spotifyTrackId
      ? `https://open.spotify.com/track/${release.spotifyTrackId}`
      : null);
  const resolvedImageUrl =
    release.imageUrl || (await fetchSpotifyThumbnail(resolvedUrl));

  if (release.spotifyTrackId) {
    return prisma.release.upsert({
      where: { spotifyTrackId: release.spotifyTrackId },
      update: {
        artistId,
        title: release.title,
        releaseDate: toDate(release.releaseDate),
        imageUrl: resolvedImageUrl ?? undefined,
        url: resolvedUrl ?? undefined,
      },
      create: {
        artistId,
        spotifyTrackId: release.spotifyTrackId,
        title: release.title,
        releaseDate: toDate(release.releaseDate),
        imageUrl: resolvedImageUrl ?? undefined,
        url: resolvedUrl ?? undefined,
      },
    });
  }

  const existing = await prisma.release.findFirst({
    where: {
      artistId,
      title: release.title,
      releaseDate: toDate(release.releaseDate),
    },
  });

  if (existing) return existing;

  return prisma.release.create({
    data: {
      artistId,
      title: release.title,
      releaseDate: toDate(release.releaseDate),
      imageUrl: resolvedImageUrl ?? undefined,
      url: resolvedUrl ?? undefined,
    },
  });
}

async function upsertInstagramPost(artistId, post) {
  if (post.instagramPostId) {
    return prisma.instagramPost.upsert({
      where: { instagramPostId: post.instagramPostId },
      update: {
        artistId,
        caption: post.caption,
        imageUrl: post.imageUrl ?? undefined,
        postedAt: toDate(post.postedAt),
        url: post.url,
      },
      create: {
        artistId,
        instagramPostId: post.instagramPostId,
        caption: post.caption,
        imageUrl: post.imageUrl ?? undefined,
        postedAt: toDate(post.postedAt),
        url: post.url,
      },
    });
  }

  const existing = await prisma.instagramPost.findFirst({
    where: {
      artistId,
      caption: post.caption ?? undefined,
      postedAt: toDate(post.postedAt),
    },
  });

  if (existing) return existing;

  return prisma.instagramPost.create({
    data: {
      artistId,
      caption: post.caption,
      imageUrl: post.imageUrl ?? undefined,
      postedAt: toDate(post.postedAt),
      url: post.url,
    },
  });
}

async function ensureDraft(leadId, draft) {
  const existing = await prisma.messageDraft.findFirst({
    where: {
      leadId,
      body: draft.body,
      source: draft.source ?? null,
    },
  });

  if (existing) return existing;

  return prisma.messageDraft.create({
    data: {
      leadId,
      tone: draft.tone ?? undefined,
      body: draft.body,
      source: draft.source ?? undefined,
      selected: draft.selected ?? false,
    },
  });
}

async function ensureActivity(leadId, activity) {
  const occurredAt = toDate(activity.occurredAt);
  const existing = await prisma.activity.findFirst({
    where: {
      leadId,
      type: activity.type,
      note: activity.note ?? null,
      occurredAt: occurredAt ?? undefined,
    },
  });

  if (existing) return existing;

  return prisma.activity.create({
    data: {
      leadId,
      type: activity.type,
      note: activity.note ?? undefined,
      occurredAt: occurredAt ?? new Date(),
    },
  });
}

async function seedEntry(entry) {
  const resolvedSpotifyImageUrl =
    entry.artist.spotifyImageUrl ??
    (await fetchSpotifyImageUrl(
      entry.artist.spotifyArtistUrl,
      entry.artist.spotifyArtistId
    ));
  const accentPalette = resolvedSpotifyImageUrl
    ? await extractAccentFromImage(resolvedSpotifyImageUrl)
    : null;

  const artist = await upsertArtist({
    ...entry.artist,
    spotifyImageUrl: resolvedSpotifyImageUrl,
    spotifyAccent: accentPalette?.accent ?? entry.artist.spotifyAccent,
    spotifyAccentStrong: accentPalette?.accentStrong ?? entry.artist.spotifyAccentStrong,
    spotifyHighlight: accentPalette?.highlight ?? entry.artist.spotifyHighlight,
  });
  const lead = await upsertLead(artist.id, entry.lead ?? {});

  if (entry.releases?.length) {
    for (const release of entry.releases) {
      await upsertRelease(artist.id, release);
    }
  }

  if (entry.instagramPosts?.length) {
    for (const post of entry.instagramPosts) {
      await upsertInstagramPost(artist.id, post);
    }
  }

  if (entry.messageDrafts?.length) {
    for (const draft of entry.messageDrafts) {
      await ensureDraft(lead.id, draft);
    }
  }

  if (entry.activities?.length) {
    for (const activity of entry.activities) {
      await ensureActivity(lead.id, activity);
    }
  }

  return { artistId: artist.id, leadId: lead.id };
}

async function main() {
  console.log("Seeding Spectral Soundworks data...");

  if (shouldReset) {
    console.log("Reset flag detected. Clearing existing data...");
    await resetDatabase();
  }

  for (const entry of seedEntries) {
    const result = await seedEntry(entry);
    console.log(`Seeded ${entry.artist.name} (artist ${result.artistId}, lead ${result.leadId})`);
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
