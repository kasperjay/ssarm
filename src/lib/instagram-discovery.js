// src/lib/instagram-discovery.js
// Shared Instagram profile and tag extraction utility for Spectral Soundworks.
// Expands raw Instagram posts (from apify/instagram-scraper, apify/instagram-hashtag-scraper,
// or apify/instagram-profile-scraper) into individual artist profiles from:
// 1. Tagged users (main post photo/video and carousel childPosts)
// 2. Co-author producers (collaborator profiles)
// 3. Mentions array and caption @mentions
// 4. Post authors (when searching hashtags or artist posts)

const IGNORED_INSTAGRAM_HANDLES = new Set([
  "instagram",
  "threads",
  "facebook",
  "meta",
  "tiktok",
  "youtube",
  "twitter",
  "x",
  "reels",
  "explore",
  "none",
  "undefined",
  "null",
]);

const SOURCE_PRIORITY = {
  tagged: 4,
  coauthor: 3,
  author: 2,
  mention: 1,
};

function cleanHandle(handle) {
  if (typeof handle !== "string") return null;
  const cleaned = handle
    .replace(/^@+/, "")
    .replace(/\.+$/, "")
    .trim()
    .toLowerCase();

  if (cleaned.length < 2 || cleaned.length > 30) return null;
  if (IGNORED_INSTAGRAM_HANDLES.has(cleaned)) return null;
  if (!/^[a-z0-9._]+$/.test(cleaned)) return null;
  return cleaned;
}

function extractCaptionMentions(caption) {
  if (typeof caption !== "string" || !caption.includes("@")) return [];
  const results = new Set();
  const regex = /(?:^|[^\w.])@([\w.]{2,30})\b/g;
  let match;
  while ((match = regex.exec(caption)) !== null) {
    const candidate = cleanHandle(match[1]);
    if (candidate) results.add(candidate);
  }
  return Array.from(results);
}

/**
 * Expands raw dataset items into normalized unique artist profiles.
 * Preserves calendar items untouched while pulling all tagged/mentioned/coauthor profiles from posts.
 *
 * @param {Array<Object>} rawItems
 * @returns {Array<Object>}
 */
function extractTaggedProfiles(rawItems) {
  if (!Array.isArray(rawItems)) return [];

  const profileMap = new Map();
  const calendarItems = [];

  function addOrMerge(profile, postKey) {
    const key = cleanHandle(profile.handle);
    if (!key) return;

    const rawFullName = profile.fullName && typeof profile.fullName === "string" && profile.fullName.trim()
      ? profile.fullName.trim()
      : "";
    const effectiveName = rawFullName || key;

    const effectivePostKey = postKey || profile.shortCode || profile.url;

    const existing = profileMap.get(key);
    if (!existing) {
      const postsSet = new Set();
      if (effectivePostKey) postsSet.add(effectivePostKey);
      profileMap.set(key, {
        artist: effectiveName,
        artistName: effectiveName,
        fullName: rawFullName || undefined,
        username: key,
        ownerUsername: key,
        handle: key,
        instagramHandle: key,
        profilePicUrl: profile.profilePicUrl,
        ownerProfilePicUrl: profile.profilePicUrl,
        avatarUrl: profile.profilePicUrl,
        biography: profile.biography || profile.bio,
        bio: profile.biography || profile.bio,
        followersCount: profile.followersCount,
        externalUrl: profile.externalUrl || profile.website || profile.externalURL,
        website: profile.externalUrl || profile.website || profile.externalURL,
        categoryName: profile.categoryName || profile.businessCategoryName,
        businessCategoryName: profile.businessCategoryName || profile.categoryName,
        caption: profile.caption,
        shortCode: profile.shortCode,
        url: profile.url || (profile.shortCode ? `https://www.instagram.com/p/${profile.shortCode}/` : `https://www.instagram.com/${key}/`),
        instagramUrl: profile.url || (profile.shortCode ? `https://www.instagram.com/p/${profile.shortCode}/` : `https://www.instagram.com/${key}/`),
        imageUrl: profile.imageUrl,
        displayUrl: profile.imageUrl,
        timestamp: profile.timestamp,
        postedAt: profile.timestamp,
        sourceType: profile.sourceType,
        taggedCount: 1,
        _posts: postsSet,
        postOwner: profile.postOwner,
      });
      return;
    }

    if (effectivePostKey && existing._posts) {
      existing._posts.add(effectivePostKey);
      existing.taggedCount = existing._posts.size;
    } else {
      existing.taggedCount = (existing.taggedCount || 1) + 1;
    }

    // Prefer full name over bare handle
    if (rawFullName && rawFullName.toLowerCase() !== key.toLowerCase() && (!existing.fullName || existing.fullName.toLowerCase() === key.toLowerCase())) {
      existing.fullName = rawFullName;
      existing.artist = rawFullName;
      existing.artistName = rawFullName;
    }

    // Keep profile picture if missing
    if (profile.profilePicUrl && !existing.profilePicUrl) {
      existing.profilePicUrl = profile.profilePicUrl;
      existing.ownerProfilePicUrl = profile.profilePicUrl;
      existing.avatarUrl = profile.profilePicUrl;
    }

    // Keep biography if missing
    if ((profile.biography || profile.bio) && !existing.biography) {
      existing.biography = profile.biography || profile.bio;
      existing.bio = profile.biography || profile.bio;
    }

    // Keep external URL if missing
    if ((profile.externalUrl || profile.website) && !existing.externalUrl) {
      existing.externalUrl = profile.externalUrl || profile.website;
      existing.website = profile.externalUrl || profile.website;
    }

    // Keep category if missing
    if ((profile.categoryName || profile.businessCategoryName) && !existing.categoryName) {
      existing.categoryName = profile.categoryName || profile.businessCategoryName;
      existing.businessCategoryName = profile.businessCategoryName || profile.categoryName;
    }

    // Keep followers if missing
    if (profile.followersCount !== undefined && existing.followersCount === undefined) {
      existing.followersCount = profile.followersCount;
    }

    // Upgrade source type and post context if higher priority
    const curP = SOURCE_PRIORITY[existing.sourceType] || 0;
    const newP = SOURCE_PRIORITY[profile.sourceType] || 0;
    if (newP > curP) {
      existing.sourceType = profile.sourceType;
      if (profile.caption) existing.caption = profile.caption;
      if (profile.shortCode) existing.shortCode = profile.shortCode;
      if (profile.url) {
        existing.url = profile.url;
        existing.instagramUrl = profile.url;
      }
      if (profile.imageUrl) {
        existing.imageUrl = profile.imageUrl;
        existing.displayUrl = profile.imageUrl;
      }
      if (profile.timestamp) {
        existing.timestamp = profile.timestamp;
        existing.postedAt = profile.timestamp;
      }
    }
  }

  function processPost(post) {
    if (!post || typeof post !== "object") return;

    const postShortCode = post.shortCode || post.shortcode || post.code;
    const postUrl = postShortCode
      ? `https://www.instagram.com/p/${postShortCode}/`
      : (post.url || post.link || post.postUrl);
    const postKey = postShortCode || postUrl || (post.id ? String(post.id) : undefined);
    const postImage = post.displayUrl || post.imageUrl || post.display_url || (Array.isArray(post.images) ? post.images[0] : undefined);
    const postCaption = post.caption || post.text;
    const postTimestamp = post.timestamp || post.takenAt || post.postedAt || post.date;
    const postOwner = post.ownerUsername || post.owner?.username;

    // 1. Post author
    if (postOwner) {
      const ownerName = post.ownerFullName || post.owner?.full_name || postOwner;
      const ownerPic = post.ownerProfilePicUrl || post.owner?.profile_pic_url || post.profilePicUrl;
      addOrMerge({
        handle: postOwner,
        fullName: ownerName,
        profilePicUrl: ownerPic,
        caption: postCaption,
        shortCode: postShortCode,
        url: postUrl,
        imageUrl: postImage,
        timestamp: postTimestamp,
        sourceType: "author",
        postOwner,
      }, postKey);
    }

    // 2. Tagged users in main post
    const taggedList = [];
    if (Array.isArray(post.taggedUsers)) taggedList.push(...post.taggedUsers);
    if (Array.isArray(post.tagged_users)) taggedList.push(...post.tagged_users);

    // 3. Tagged users in child posts (carousel slides)
    if (Array.isArray(post.childPosts)) {
      for (const child of post.childPosts) {
        if (child && typeof child === "object") {
          if (Array.isArray(child.taggedUsers)) taggedList.push(...child.taggedUsers);
          if (Array.isArray(child.tagged_users)) taggedList.push(...child.tagged_users);
        }
      }
    }

    for (const t of taggedList) {
      if (typeof t === "string") {
        addOrMerge({
          handle: t,
          caption: postCaption,
          shortCode: postShortCode,
          url: postUrl,
          imageUrl: postImage,
          timestamp: postTimestamp,
          sourceType: "tagged",
          postOwner,
        }, postKey);
      } else if (t && typeof t === "object") {
        const userObj = t.user && typeof t.user === "object" ? t.user : t;
        const u = userObj.username || userObj.name || userObj.handle;
        const name = userObj.full_name || userObj.fullName || userObj.name || u;
        const pic = userObj.profile_pic_url || userObj.profilePicUrl;
        if (u) {
          addOrMerge({
            handle: u,
            fullName: name,
            profilePicUrl: pic,
            caption: postCaption,
            shortCode: postShortCode,
            url: postUrl,
            imageUrl: postImage,
            timestamp: postTimestamp,
            sourceType: "tagged",
            postOwner,
          }, postKey);
        }
      }
    }

    // 4. Coauthor producers
    if (Array.isArray(post.coauthorProducers)) {
      for (const c of post.coauthorProducers) {
        if (typeof c === "string") {
          addOrMerge({
            handle: c,
            caption: postCaption,
            shortCode: postShortCode,
            url: postUrl,
            imageUrl: postImage,
            timestamp: postTimestamp,
            sourceType: "coauthor",
            postOwner,
          }, postKey);
        } else if (c && typeof c === "object") {
          const userObj = c.user && typeof c.user === "object" ? c.user : c;
          const u = userObj.username || userObj.name;
          const name = userObj.full_name || userObj.fullName || u;
          const pic = userObj.profile_pic_url || userObj.profilePicUrl;
          if (u) {
            addOrMerge({
              handle: u,
              fullName: name,
              profilePicUrl: pic,
              caption: postCaption,
              shortCode: postShortCode,
              url: postUrl,
              imageUrl: postImage,
              timestamp: postTimestamp,
              sourceType: "coauthor",
              postOwner,
            }, postKey);
          }
        }
      }
    }

    // 5. Mentions array
    if (Array.isArray(post.mentions)) {
      for (const m of post.mentions) {
        const u = typeof m === "string" ? m : (m?.username || m?.name);
        if (typeof u === "string") {
          addOrMerge({
            handle: u,
            caption: postCaption,
            shortCode: postShortCode,
            url: postUrl,
            imageUrl: postImage,
            timestamp: postTimestamp,
            sourceType: "mention",
            postOwner,
          }, postKey);
        }
      }
    }

    // 6. Regex mentions in caption
    if (postCaption) {
      const captionMentions = extractCaptionMentions(postCaption);
      for (const u of captionMentions) {
        addOrMerge({
          handle: u,
          caption: postCaption,
          shortCode: postShortCode,
          url: postUrl,
          imageUrl: postImage,
          timestamp: postTimestamp,
          sourceType: "mention",
          postOwner,
        }, postKey);
      }
    }
  }

  for (const raw of rawItems) {
    if (!raw || typeof raw !== "object") continue;

    // Preserve venue calendar items untouched
    if (raw.eventTitle || raw.venueName) {
      calendarItems.push(raw);
      continue;
    }

    // If item is a profile with latestPosts (e.g. from instagram-profile-scraper)
    if (Array.isArray(raw.latestPosts) && raw.latestPosts.length > 0) {
      if (raw.username && typeof raw.username === "string") {
        addOrMerge({
          handle: raw.username,
          fullName: raw.fullName || raw.username,
          profilePicUrl: raw.profilePicUrlHD || raw.profilePicUrl,
          biography: raw.biography || raw.bio,
          followersCount: typeof raw.followersCount === "number" ? raw.followersCount : undefined,
          sourceType: "author",
        });
      }
      for (const p of raw.latestPosts) {
        if (p && typeof p === "object") processPost(p);
      }
      continue;
    }

    // Otherwise treat as an Instagram post item
    processPost(raw);
  }

  // Deduplicate calendar items by cleaned name + event
  const seenCalendar = new Set();
  const dedupedCalendar = calendarItems.filter((item) => {
    const rawName = item.artist || item.artistName || item.band || item.musician || item.fullName || item.title || item.name || "";
    const eventKey = `${String(rawName).toLowerCase().replace(/[^a-z0-9]/g, "")}:${String(item.eventTitle || "").toLowerCase().replace(/[^a-z0-9]/g, "")}`;
    if (seenCalendar.has(eventKey)) return false;
    seenCalendar.add(eventKey);
    return true;
  });

  const profiles = Array.from(profileMap.values()).map((p) => {
    const { _posts, ...rest } = p;
    return rest;
  });

  return [...profiles, ...dedupedCalendar];
}

module.exports = {
  cleanHandle,
  extractCaptionMentions,
  extractTaggedProfiles,
  IGNORED_INSTAGRAM_HANDLES,
  SOURCE_PRIORITY,
};
