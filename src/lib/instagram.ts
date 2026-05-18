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
  let current: any = value;
  for (const key of path) {
    if (Array.isArray(current)) {
      current = current[key as number];
    } else if (current && typeof current === "object") {
      current = (current as Record<string, any>)[key as string];
    } else {
      return null;
    }
  }
  return current ?? null;
};

const toIsoDate = (value: unknown) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    const ms = value > 1e12 ? value : value * 1000;
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
  const shortcode =
    getString(item.shortCode) || getString(item.shortcode) || getString(item.code);
  const instagramPostId =
    getString(item.id) || shortcode || getString(item.postId) || getString(item.pk);
  const caption =
    getString(item.caption) ||
    getString(item.text) ||
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
    (shortcode ? `https://www.instagram.com/p/${shortcode}/` : null);
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

async function callApifyActor(actorId: string, input: any, token: string) {
  // Use 'acts' endpoint as it's the standard for runs
  const normalizedActorId = actorId.replace(/\//g, "~");
  const response = await fetch(`https://api.apify.com/v2/acts/${normalizedActorId}/runs?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Apify call failed: ${response.status} ${text}`);
  }

  const { data } = await response.json();
  const runId = data.id;
  const datasetId = data.defaultDatasetId;

  // Wait for completion (longer polling)
  let status = data.status;
  let attempts = 0;
  while ((status === "RUNNING" || status === "READY") && attempts < 30) {
    await new Promise(r => setTimeout(r, 2000));
    const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    const statusData = await statusRes.json();
    status = statusData.data.status;
    attempts++;
  }

  const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`);
  const items = await itemsRes.json();
  console.log(`[DEBUG] Apify Actor ${actorId} finished with status ${status}. Items: ${items.length}`);
  return items;
}

export const fetchInstagramPosts = async (
  username: string,
  limit = 6
): Promise<InstagramPostInput[]> => {
  const token = process.env.APIFY_TOKEN;
  if (!token) return [];

  const actorId = process.env.APIFY_IG_ACTOR_ID || "apify/instagram-profile-scraper";
  const envLimit = Number.parseInt(process.env.APIFY_IG_RESULTS_LIMIT ?? "", 10);
  const resolvedLimit = Number.isFinite(envLimit) && envLimit > 0 ? envLimit : limit;
  const cleanUsername = username.replace(/^@/, "").trim();
  if (!cleanUsername) return [];

  try {
    const rawItems = await callApifyActor(actorId, {
      usernames: [cleanUsername],
      resultsLimit: resolvedLimit,
      resultsType: "posts",
      searchType: "user",
      searchLimit: 1,
    }, token);

    // Some actors return posts in a 'latestPosts' array inside a profile item
    // Others return flat items. We'll handle both.
    let items = rawItems;
    if (rawItems[0]?.latestPosts && Array.isArray(rawItems[0].latestPosts)) {
      items = [...rawItems[0].latestPosts, ...rawItems.slice(1)];
    }

    const mapped = items
      .map((item: any) => mapInstagramPost(item as Record<string, unknown>))
      .filter((item: any): item is InstagramPostInput => Boolean(item));

    // Dedup by instagramPostId
    const seen = new Set<string>();
    const unique = mapped.filter((p: InstagramPostInput) => {
      if (!p.instagramPostId) return true;
      if (seen.has(p.instagramPostId)) return false;
      seen.add(p.instagramPostId);
      return true;
    });

    return unique.slice(0, resolvedLimit);
  } catch (error) {
    console.error("fetchInstagramPosts error", error);
    return [];
  }
};

export const fetchInstagramProfile = async (
  username: string
): Promise<InstagramProfile | null> => {
  const token = process.env.APIFY_TOKEN;
  if (!token) return null;

  const actorId = process.env.APIFY_IG_ACTOR_ID || "apify/instagram-profile-scraper";
  const cleanUsername = username.replace(/^@/, "").trim();
  if (!cleanUsername) return null;

  try {
    const items = await callApifyActor(actorId, {
      usernames: [cleanUsername],
      resultsLimit: 1,
      searchType: "user",
    }, token);

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
  } catch (error) {
    console.error("fetchInstagramProfile error", error);
    return null;
  }
};
