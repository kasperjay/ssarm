import { ApifyClient } from "apify-client";

type InstagramPostInput = {
  instagramPostId?: string | null;
  caption?: string | null;
  imageUrl?: string | null;
  postedAt?: string | null;
  url?: string | null;
};

export type InstagramProfile = {
  fullName?: string | null;
  bio?: string | null;
  followersCount?: number | null;
  businessEmail?: string | null;
  externalUrl?: string | null;
  profileImageUrl?: string | null;
};

const getString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const getNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const getPath = (value: unknown, path: Array<string | number>) => {
  let current: unknown = value;
  for (const key of path) {
    if (Array.isArray(current)) {
      current = current[key as number];
    } else if (current && typeof current === "object") {
      current = (current as Record<string, unknown>)[key as string];
    } else {
      return null;
    }
  }
  return current;
};

const toIsoDate = (value: unknown) => {
  const numeric = getNumber(value);
  if (numeric !== null) {
    const ms = numeric > 1e12 ? numeric : numeric * 1000;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  const text = getString(value);
  if (!text) return null;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const buildInstagramPostUrl = (shortcode: string | null) =>
  shortcode ? `https://www.instagram.com/p/${shortcode}/` : null;

const mapInstagramPost = (item: Record<string, unknown>): InstagramPostInput | null => {
  const instagramPostId =
    getString(item.id) ||
    getString(item.shortCode) ||
    getString(item.shortcode) ||
    getString(item.code);
  const caption =
    getString(item.caption) ||
    getString(item.text) ||
    getString(item.description) ||
    getString(getPath(item, ["edge_media_to_caption", "edges", 0, "node", "text"]));
  const postedAt =
    toIsoDate(item.timestamp) ||
    toIsoDate(item.takenAtTimestamp) ||
    toIsoDate(item.takenAt) ||
    toIsoDate(item.date) ||
    toIsoDate(item.createdAt);
  const url =
    getString(item.url) ||
    getString(item.postUrl) ||
    getString(item.link) ||
    buildInstagramPostUrl(
      getString(item.shortCode) || getString(item.shortcode) || getString(item.code)
    );
  const imageUrl =
    getString(item.displayUrl) ||
    getString(item.display_url) ||
    getString(item.imageUrl) ||
    getString(item.thumbnailUrl) ||
    getString(item.thumbnail_url) ||
    getString(getPath(item, ["images", 0])) ||
    getString(getPath(item, ["carouselMedia", 0, "displayUrl"])) ||
    getString(getPath(item, ["carouselMedia", 0, "imageUrl"]));

  if (!instagramPostId && !caption && !imageUrl && !url) return null;

  return {
    instagramPostId,
    caption,
    imageUrl,
    postedAt,
    url,
  };
};

export const fetchInstagramPosts = async (
  username: string,
  limit = 6
): Promise<InstagramPostInput[]> => {
  const token = process.env.APIFY_TOKEN;
  if (!token) return [];

  const actorId = process.env.APIFY_IG_ACTOR_ID || "apify/instagram-profile-scraper";
  const envLimit = Number.parseInt(process.env.APIFY_IG_RESULTS_LIMIT ?? "", 10);
  const resolvedLimit = Number.isFinite(envLimit) && envLimit > 0 ? envLimit : limit;
  const client = new ApifyClient({ token });
  const cleanUsername = username.replace(/^@/, "").trim();
  if (!cleanUsername) return [];

  const run = await client.actor(actorId).call({
    usernames: [cleanUsername],
    resultsLimit: resolvedLimit,
    resultsType: "posts",
    searchType: "user",
    searchLimit: 1,
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  const mapped = items
    .map((item) => mapInstagramPost(item as Record<string, unknown>))
    .filter((item): item is InstagramPostInput => Boolean(item));

  return mapped.slice(0, resolvedLimit);
};

export const fetchInstagramProfile = async (
  username: string
): Promise<InstagramProfile | null> => {
  const token = process.env.APIFY_TOKEN;
  if (!token) return null;

  const actorId = process.env.APIFY_IG_ACTOR_ID || "apify/instagram-profile-scraper";
  const client = new ApifyClient({ token });
  const cleanUsername = username.replace(/^@/, "").trim();
  if (!cleanUsername) return null;

  const run = await client.actor(actorId).call({
    usernames: [cleanUsername],
    resultsLimit: 1,
    searchType: "user",
  });

  const { items } = await client.dataset(run.defaultDatasetId).listItems();
  const profile = items[0] as Record<string, unknown> | undefined;
  if (!profile) return null;

  const profileImageUrl =
    getString(profile.profilePicUrl) ??
    getString(profile.profilePicUrlHd) ??
    getString(profile.profilePicUrlHD) ??
    getString(profile.profile_pic_url_hd as string | undefined) ??
    getString(profile.profile_pic_url as string | undefined) ??
    getString(profile.avatar) ??
    getString(profile.avatarUrl) ??
    getString(profile.profileImageUrl) ??
    getString(profile.profilePictureUrl);

  return {
    fullName: getString(profile.fullName),
    bio: getString(profile.biography) ?? getString(profile.bio),
    followersCount: getNumber(profile.followersCount),
    businessEmail: getString(profile.businessEmail) ?? getString(profile.email),
    externalUrl:
      getString(profile.externalUrl) ??
      getString(profile.externalURL) ??
      getString(profile.website) ??
      getString(profile.websiteUrl),
    profileImageUrl,
  };
};
