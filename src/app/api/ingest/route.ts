import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { discoverEmailsFromUrls, extractEmailsFromTextSafe, mergeEmails } from "@/lib/email";
import { fetchInstagramPosts, fetchInstagramProfile } from "@/lib/instagram";
import { fetchSpotifyArtistProfile, fetchSpotifyReleases } from "@/lib/spotify";
import { discoverInstagramHandle, discoverSpotifyArtistId } from "@/lib/google-search";
import { scoreLead } from "@/lib/scoring";
import sharp from "sharp";

type LeadStatus =
  | "NEW"
  | "QUALIFIED"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "WON"
  | "LOST";

type ActivityType =
  | "MESSAGE_SENT"
  | "REPLY_RECEIVED"
  | "FOLLOW_UP_SET"
  | "STATUS_CHANGE"
  | "NOTE";

const getPostKey = (post: { instagramPostId?: string | null; url?: string | null }) =>
  post.instagramPostId ?? post.url ?? null;

const mergeInstagramPosts = (
  incoming: LeadPayload["instagramPosts"],
  scraped: LeadPayload["instagramPosts"]
) => {
  if (!scraped?.length) return incoming;
  if (!incoming?.length) return scraped;

  const incomingMap = new Map<string, NonNullable<LeadPayload["instagramPosts"]>[number]>();
  for (const post of incoming) {
    const key = getPostKey(post);
    if (key) incomingMap.set(key, post);
  }

  const mergedScraped = scraped.map((post) => {
    const key = getPostKey(post);
    const fallback = key ? incomingMap.get(key) : undefined;
    if (!fallback) return post;

    return {
      ...fallback,
      ...post,
      caption: post.caption ?? fallback.caption,
      imageUrl: post.imageUrl ?? fallback.imageUrl,
      postedAt: post.postedAt ?? fallback.postedAt,
      url: post.url ?? fallback.url,
      instagramPostId: post.instagramPostId ?? fallback.instagramPostId,
    };
  });

  const scrapedKeys = new Set(
    mergedScraped.map((post) => getPostKey(post)).filter(Boolean) as string[]
  );
  const incomingOnly = incoming.filter((post) => {
    const key = getPostKey(post);
    return key ? !scrapedKeys.has(key) : true;
  });

  return [...mergedScraped, ...incomingOnly];
};


const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const rgbToHsl = (r: number, g: number, b: number) => {
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

const hslToRgb = (h: number, s: number, l: number) => {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
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

const rgbToHex = (r: number, g: number, b: number) =>
  `#${[r, g, b]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;

const createAccentPalette = (r: number, g: number, b: number) => {
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

const extractAccentFromImage = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });
    if (!response.ok) return null;
    const buffer = Buffer.from(await response.arrayBuffer());

    // Resize to a small grid to sample colors
    const { data } = await sharp(buffer)
      .resize(24, 24, { fit: "cover" })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    if (!data || data.length < 3) return null;

    let bestPixel = { r: data[0], g: data[1], b: data[2], score: -1 };

    for (let i = 0; i < data.length; i += 3) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const { s, l } = rgbToHsl(r, g, b);
      const score = s * (1 - Math.abs(l - 0.5) * 2);
      if (score > bestPixel.score) {
        bestPixel = { r, g, b, score };
      }
    }

    if (bestPixel.score < 0.1) {
      const { data: avgData } = await sharp(buffer)
        .resize(1, 1, { fit: "cover" })
        .removeAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      return createAccentPalette(avgData[0], avgData[1], avgData[2]);
    }

    return createAccentPalette(bestPixel.r, bestPixel.g, bestPixel.b);
  } catch {
    return null;
  }
};

const fetchSpotifyImageUrl = async (
  spotifyArtistUrl?: string | null,
  spotifyArtistId?: string | null
) => {
  const url =
    spotifyArtistUrl ||
    (spotifyArtistId ? `https://open.spotify.com/artist/${spotifyArtistId}` : null);
  if (!url) return null;

  try {
    const response = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { thumbnail_url?: string };
    return typeof data.thumbnail_url === "string" ? data.thumbnail_url : null;
  } catch {
    return null;
  }
};

const fetchSpotifyThumbnail = async (spotifyUrl?: string | null) => {
  if (!spotifyUrl) return null;
  try {
    const response = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(spotifyUrl)}`
    );
    if (!response.ok) return null;
    const data = (await response.json()) as { thumbnail_url?: string };
    return typeof data.thumbnail_url === "string" ? data.thumbnail_url : null;
  } catch {
    return null;
  }
};

const getReleaseKey = (release: {
  spotifyReleaseId?: string | null;
  spotifyTrackId?: string | null;
  url?: string | null;
  title: string;
}) =>
  release.spotifyReleaseId ??
  release.spotifyTrackId ??
  release.url ??
  release.title.toLowerCase();

const mergeReleases = (
  incoming: LeadPayload["releases"],
  spotify: LeadPayload["releases"]
) => {
  if (!spotify?.length) return incoming;
  if (!incoming?.length) return spotify;

  const incomingMap = new Map<string, NonNullable<LeadPayload["releases"]>[number]>();
  for (const release of incoming) {
    incomingMap.set(getReleaseKey(release), release);
  }

  const mergedSpotify = spotify.map((release) => {
    const key = getReleaseKey(release);
    const fallback = incomingMap.get(key);
    if (!fallback) return release;
    return {
      ...fallback,
      ...release,
      title: release.title || fallback.title,
      url: release.url ?? fallback.url,
      imageUrl: release.imageUrl ?? fallback.imageUrl,
      releaseDate: release.releaseDate ?? fallback.releaseDate,
    };
  });

  const spotifyKeys = new Set(mergedSpotify.map((release) => getReleaseKey(release)));
  const incomingOnly = incoming.filter((release) => !spotifyKeys.has(getReleaseKey(release)));

  return [...mergedSpotify, ...incomingOnly];
};

type LeadPayload = {
  isDiscoveryImport?: boolean;
  skipInstagramFetch?: boolean;
  skipSpotifyFetch?: boolean;
  artist: {
    name: string;
    instagramHandle?: string | null;
    instagramProfileUrl?: string | null;
    instagramProfileImageUrl?: string | null;
    spotifyArtistId?: string | null;
    spotifyArtistUrl?: string | null;
    spotifyImageUrl?: string | null;
    spotifyAccent?: string | null;
    spotifyAccentStrong?: string | null;
    spotifyHighlight?: string | null;
    officialSiteUrl?: string | null;
    location?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    genre?: string | null;
    tags?: string[] | null;
    bio?: string | null;
    emails?: string[] | null;
    followerCount?: number | null;
    lastPostAt?: string | null;
  };
  lead?: {
    id?: string;
    status?: LeadStatus;
    score?: number | null;
    scoreRationale?: string | null;
    lastContactedAt?: string | null;
    nextActionAt?: string | null;
  };
  releases?: Array<{
    spotifyTrackId?: string | null;
    spotifyReleaseId?: string | null;
    title: string;
    releaseDate?: string | null;
    imageUrl?: string | null;
    url?: string | null;
    releaseType?: string | null;
  }>;
  instagramPosts?: Array<{
    instagramPostId?: string | null;
    caption?: string | null;
    imageUrl?: string | null;
    postedAt?: string | null;
    url?: string | null;
  }>;
  messageDrafts?: Array<{
    tone?: string | null;
    body: string;
    source?: string | null;
    selected?: boolean | null;
  }>;
  activities?: Array<{
    type: ActivityType;
    note?: string | null;
    occurredAt?: string | null;
  }>;
};

const toDate = (value?: string | null) => (value ? new Date(value) : undefined);

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;

    if (!payload?.artist?.name) {
      return NextResponse.json(
        { error: "artist.name is required" },
        { status: 400 }
      );
    }

    const {
      name,
      instagramProfileUrl,
      instagramProfileImageUrl,
      spotifyArtistId,
      spotifyArtistUrl,
      spotifyImageUrl,
      spotifyAccent,
      spotifyAccentStrong,
      spotifyHighlight,
      officialSiteUrl,
      location,
      city,
      state,
      country,
      genre,
      tags,
      bio,
      emails,
      followerCount,
      lastPostAt,
    } = payload.artist;

    let { instagramHandle } = payload.artist;

    const artistMatchers = [] as Array<Record<string, unknown>>;
    if (instagramHandle) {
      artistMatchers.push({ instagramHandle });
    }
    if (spotifyArtistId) {
      artistMatchers.push({ spotifyArtistId });
    }
    artistMatchers.push({
      name,
      city: city ?? undefined,
      state: state ?? undefined,
    });

    const existingArtist = await prisma.artist.findFirst({
      where: { OR: artistMatchers },
      include: {
        leads: true,
      }
    });

    // If this is a new scraper upload and the artist already exists AND has recent data, skip to save API calls
    // But if they are missing critical data like spotifyId or profile pic, we proceed.
    if (payload.isDiscoveryImport && existingArtist) {
      const hasSpotify = !!existingArtist.spotifyArtistId;
      const hasPic = !!existingArtist.instagramProfileImageUrl;
      const isRecent = existingArtist.updatedAt > new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      if (hasSpotify && hasPic && isRecent) {
        return NextResponse.json({
          artistId: existingArtist.id,
          leadId: existingArtist.leads?.[0]?.id,
          status: "skipped_recent_duplicate"
        });
      }
    }

    if (!instagramHandle) {
      console.log(`[Ingest] Missing IG handle for ${name}. Attempting to auto-discover...`);
      const discovered = await discoverInstagramHandle(name);
      if (discovered) {
        console.log(`[Ingest] Discovered handle @${discovered} for ${name}`);
        instagramHandle = discovered;
      }
    }

    let resolvedSpotifyArtistId = spotifyArtistId;
    if (!resolvedSpotifyArtistId) {
      console.log(`[Ingest] Missing Spotify ID for ${name}. Attempting to auto-discover...`);
      const discovered = await discoverSpotifyArtistId(name);
      if (discovered) {
        console.log(`[Ingest] Discovered Spotify ID ${discovered} for ${name}`);
        resolvedSpotifyArtistId = discovered;
      } else {
        console.log(`[Ingest] NO Spotify ID found for ${name}`);
      }
    }

    const skipInstagramFetch = payload.skipInstagramFetch === true;
    const skipSpotifyFetch = payload.skipSpotifyFetch === true;
    const [scrapedInstagramPosts, scrapedInstagramProfile] =
      instagramHandle && !skipInstagramFetch
        ? await Promise.all([
          fetchInstagramPosts(instagramHandle).catch(e => { console.error(`[Ingest] IG Posts fetch failed for @${instagramHandle}:`, e); return undefined; }),
          fetchInstagramProfile(instagramHandle).catch(e => { console.error(`[Ingest] IG Profile fetch failed for @${instagramHandle}:`, e); return null; }),
        ])
        : [undefined, null];
    
    if (scrapedInstagramProfile) {
        console.log(`[Ingest] Scraped IG Profile for @${instagramHandle}:`, {
            followers: scrapedInstagramProfile.followersCount,
            hasPic: !!scrapedInstagramProfile.profileImageUrl
        });
    }
    const resolvedInstagramPosts = mergeInstagramPosts(
      payload.instagramPosts,
      scrapedInstagramPosts
    );
    const spotifyReleaseLimit = Number.parseInt(
      process.env.SPOTIFY_RELEASE_LIMIT ?? "6",
      10
    );
    const [spotifyProfile, spotifyReleases] =
      resolvedSpotifyArtistId && !skipSpotifyFetch
        ? await Promise.all([
          fetchSpotifyArtistProfile(resolvedSpotifyArtistId).catch(e => { console.error(`[Ingest] Spotify Profile fetch failed for ${resolvedSpotifyArtistId}:`, e); return null; }),
          fetchSpotifyReleases(
            resolvedSpotifyArtistId,
            Number.isFinite(spotifyReleaseLimit) ? spotifyReleaseLimit : 6
          ).catch(e => { console.error(`[Ingest] Spotify Releases fetch failed for ${resolvedSpotifyArtistId}:`, e); return []; }),
        ])
        : [null, []];

    if (spotifyProfile) {
        console.log(`[Ingest] Scraped Spotify Profile for ${resolvedSpotifyArtistId}:`, {
            name: spotifyProfile.name,
            hasPic: !!spotifyProfile.imageUrl
        });
    }

    const resolvedSpotifyArtistUrl =
      spotifyArtistUrl ?? spotifyProfile?.url ?? existingArtist?.spotifyArtistUrl ?? null;
    const resolvedSpotifyImageUrl =
      spotifyImageUrl ??
      existingArtist?.spotifyImageUrl ??
      spotifyProfile?.imageUrl ??
      (await fetchSpotifyImageUrl(resolvedSpotifyArtistUrl, resolvedSpotifyArtistId));
    const computedAccent = resolvedSpotifyImageUrl
      ? await extractAccentFromImage(resolvedSpotifyImageUrl)
      : null;
    const resolvedSpotifyAccent =
      spotifyAccent ?? computedAccent?.accent ?? existingArtist?.spotifyAccent ?? null;
    const resolvedSpotifyAccentStrong =
      spotifyAccentStrong ??
      computedAccent?.accentStrong ??
      existingArtist?.spotifyAccentStrong ??
      resolvedSpotifyAccent;
    const resolvedSpotifyHighlight =
      spotifyHighlight ??
      computedAccent?.highlight ??
      existingArtist?.spotifyHighlight ??
      resolvedSpotifyAccent;
    const derivedEmails = extractEmailsFromTextSafe(
      bio ?? scrapedInstagramProfile?.bio ?? existingArtist?.bio ?? null
    );
    const resolvedEmails = mergeEmails(
      existingArtist?.emails,
      emails ?? undefined,
      derivedEmails,
      scrapedInstagramProfile?.businessEmail
        ? [scrapedInstagramProfile.businessEmail]
        : undefined
    );
    const resolvedOfficialSiteUrl =
      officialSiteUrl ??
      scrapedInstagramProfile?.externalUrl ??
      existingArtist?.officialSiteUrl ??
      null;
    const resolvedInstagramProfileImageUrl =
      instagramProfileImageUrl ??
      scrapedInstagramProfile?.profileImageUrl ??
      existingArtist?.instagramProfileImageUrl ??
      null;
    const scrapedWebsiteEmails = await discoverEmailsFromUrls([
      resolvedOfficialSiteUrl,
    ]);
    const resolvedEmailsWithWebsite = mergeEmails(resolvedEmails, scrapedWebsiteEmails);

    const resolvedBio = bio ?? scrapedInstagramProfile?.bio ?? existingArtist?.bio ?? undefined;
    const maxFollowers = Math.max(
      followerCount ?? 0,
      scrapedInstagramProfile?.followersCount ?? 0,
      existingArtist?.followerCount ?? 0
    );
    const resolvedFollowerCount = maxFollowers > 0 ? maxFollowers : undefined;
    const payloadLastPostAt = toDate(lastPostAt);
    const scrapedLastPostAt = resolvedInstagramPosts?.[0]?.postedAt ? new Date(resolvedInstagramPosts[0].postedAt) : undefined;
    const existingLastPostAt = existingArtist?.lastPostAt;
    const dateOptions = [payloadLastPostAt, scrapedLastPostAt, existingLastPostAt].filter(Boolean) as Date[];
    const resolvedLastPostAt = dateOptions.length > 0 ? new Date(Math.max(...dateOptions.map(d => d.getTime()))) : undefined;
    const resolvedGenre = genre ?? spotifyProfile?.genres?.[0] ?? existingArtist?.genre ?? undefined;
    const resolvedCity = city ?? existingArtist?.city ?? undefined;
    const resolvedState = state ?? existingArtist?.state ?? undefined;
    const resolvedCountry = country ?? existingArtist?.country ?? undefined;
    const resolvedLocation = location ?? existingArtist?.location ?? undefined;

    const artist = existingArtist
      ? await prisma.artist.update({
        where: { id: existingArtist.id },
        data: {
          name,
          instagramHandle,
          instagramProfileUrl,
          instagramProfileImageUrl: resolvedInstagramProfileImageUrl,
          spotifyArtistId: resolvedSpotifyArtistId,
          spotifyArtistUrl: resolvedSpotifyArtistUrl ?? undefined,
          spotifyImageUrl: resolvedSpotifyImageUrl,
          spotifyAccent: resolvedSpotifyAccent,
          spotifyAccentStrong: resolvedSpotifyAccentStrong,
          spotifyHighlight: resolvedSpotifyHighlight,
          officialSiteUrl: resolvedOfficialSiteUrl ?? undefined,
          location: resolvedLocation,
          city: resolvedCity,
          state: resolvedState,
          country: resolvedCountry,
          genre: resolvedGenre,
          tags: tags ?? undefined,
          bio: resolvedBio,
          emails: resolvedEmailsWithWebsite,
          followerCount: resolvedFollowerCount,
          lastPostAt: resolvedLastPostAt,
        },
      })
      : await prisma.artist.create({
        data: {
          name,
          instagramHandle,
          instagramProfileUrl,
          instagramProfileImageUrl: resolvedInstagramProfileImageUrl,
          spotifyArtistId: resolvedSpotifyArtistId,
          spotifyArtistUrl: resolvedSpotifyArtistUrl ?? undefined,
          spotifyImageUrl: resolvedSpotifyImageUrl,
          spotifyAccent: resolvedSpotifyAccent,
          spotifyAccentStrong: resolvedSpotifyAccentStrong,
          spotifyHighlight: resolvedSpotifyHighlight,
          officialSiteUrl: resolvedOfficialSiteUrl ?? undefined,
          location: resolvedLocation,
          city: resolvedCity,
          state: resolvedState,
          country: resolvedCountry,
          genre: resolvedGenre,
          tags: tags ?? [],
          bio: resolvedBio,
          emails: resolvedEmailsWithWebsite,
          followerCount: resolvedFollowerCount,
          lastPostAt: resolvedLastPostAt,
        },
      });

    const leadData = payload.lead;
    const existingLead = leadData?.id
      ? await prisma.lead.findUnique({ where: { id: leadData.id } })
      : await prisma.lead.findFirst({ where: { artistId: artist.id } });

    const lead = existingLead
      ? await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          artistId: artist.id,
          status: leadData?.status ?? undefined,
          score: leadData?.score ?? undefined,
          scoreRationale: leadData?.scoreRationale ?? undefined,
          lastContactedAt: toDate(leadData?.lastContactedAt),
          nextActionAt: toDate(leadData?.nextActionAt),
        },
      })
      : await prisma.lead.create({
        data: {
          artistId: artist.id,
          status: leadData?.status ?? undefined,
          score: leadData?.score ?? undefined,
          scoreRationale: leadData?.scoreRationale ?? undefined,
          lastContactedAt: toDate(leadData?.lastContactedAt),
          nextActionAt: toDate(leadData?.nextActionAt),
        },
      });

    const resolvedReleases = mergeReleases(payload.releases, spotifyReleases);

    if (resolvedReleases?.length) {
      await Promise.all(
        resolvedReleases.map((release) =>
          (async () => {
            const resolvedUrl =
              release.url ??
              (release.spotifyTrackId
                ? `https://open.spotify.com/track/${release.spotifyTrackId}`
                : release.spotifyReleaseId
                  ? `https://open.spotify.com/album/${release.spotifyReleaseId}`
                  : null);
            const resolvedImageUrl =
              release.imageUrl ??
              (await fetchSpotifyThumbnail(resolvedUrl)) ??
              artist.spotifyImageUrl ??
              undefined;

            if (release.spotifyReleaseId) {
              return prisma.release.upsert({
                where: { spotifyReleaseId: release.spotifyReleaseId },
                update: {
                  artistId: artist.id,
                  title: release.title,
                  releaseDate: toDate(release.releaseDate),
                  imageUrl: resolvedImageUrl ?? undefined,
                  url: resolvedUrl ?? undefined,
                  releaseType: release.releaseType ?? undefined,
                },
                create: {
                  artistId: artist.id,
                  spotifyReleaseId: release.spotifyReleaseId,
                  title: release.title,
                  releaseDate: toDate(release.releaseDate),
                  imageUrl: resolvedImageUrl ?? undefined,
                  url: resolvedUrl ?? undefined,
                  releaseType: release.releaseType ?? undefined,
                },
              });
            }

            if (release.spotifyTrackId) {
              return prisma.release.upsert({
                where: { spotifyTrackId: release.spotifyTrackId },
                update: {
                  artistId: artist.id,
                  title: release.title,
                  releaseDate: toDate(release.releaseDate),
                  imageUrl: resolvedImageUrl ?? undefined,
                  url: resolvedUrl ?? undefined,
                  releaseType: release.releaseType ?? undefined,
                },
                create: {
                  artistId: artist.id,
                  spotifyTrackId: release.spotifyTrackId,
                  title: release.title,
                  releaseDate: toDate(release.releaseDate),
                  imageUrl: resolvedImageUrl ?? undefined,
                  url: resolvedUrl ?? undefined,
                  releaseType: release.releaseType ?? undefined,
                },
              });
            }

            return prisma.release.create({
              data: {
                artistId: artist.id,
                title: release.title,
                releaseDate: toDate(release.releaseDate),
                imageUrl: resolvedImageUrl ?? undefined,
                url: resolvedUrl ?? undefined,
                releaseType: release.releaseType ?? undefined,
              },
            });
          })()
        )
      );
    }

    if (resolvedInstagramPosts?.length) {
      await Promise.all(
        resolvedInstagramPosts.map((post) =>
          post.instagramPostId
            ? prisma.instagramPost.upsert({
              where: { instagramPostId: post.instagramPostId },
              update: {
                artistId: artist.id,
                caption: post.caption,
                imageUrl: post.imageUrl ?? undefined,
                postedAt: toDate(post.postedAt),
                url: post.url,
              },
              create: {
                artistId: artist.id,
                instagramPostId: post.instagramPostId,
                caption: post.caption,
                imageUrl: post.imageUrl ?? undefined,
                postedAt: toDate(post.postedAt),
                url: post.url,
              },
            })
            : prisma.instagramPost.create({
              data: {
                artistId: artist.id,
                caption: post.caption,
                imageUrl: post.imageUrl ?? undefined,
                postedAt: toDate(post.postedAt),
                url: post.url,
              },
            })
        )
      );
    }

    if (payload.messageDrafts?.length) {
      await prisma.messageDraft.createMany({
        data: payload.messageDrafts.map((draft) => ({
          leadId: lead.id,
          tone: draft.tone ?? undefined,
          body: draft.body,
          source: draft.source ?? undefined,
          selected: draft.selected ?? false,
        })),
      });
    }

    if (payload.activities?.length) {
      await prisma.activity.createMany({
        data: payload.activities.map((activity) => ({
          leadId: lead.id,
          type: activity.type,
          note: activity.note ?? undefined,
          occurredAt: toDate(activity.occurredAt) ?? new Date(),
        })),
      });
    }

    await scoreLead(lead.id);

    return NextResponse.json({
      artistId: artist.id,
      leadId: lead.id,
    });
  } catch (error) {
    console.error("/api/ingest error", error);
    const detail = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to ingest lead", detail },
      { status: 500 }
    );
  }
}
