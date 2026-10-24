// src/lib/show-parser.js
// Specialized show, event, and activity note temporal parser for Spectral Soundworks.

const {
  AUSTIN_AREA_CITIES,
  parseLocationString,
  extractLocationFromText,
  isAustinVenue,
} = require("./location-parser");

const MONTH_REGEX = /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i;
const NUM_DATE_REGEX = /\b\d{4}[-/]\d{1,2}[-/]\d{1,2}\b|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b/;

/**
 * Parses an activity note to check if it represents a venue/show calendar event.
 * Compares the event date against `now` to determine whether it is in the future (upcoming)
 * or in the past.
 *
 * @param {string | null | undefined} note
 * @param {Date} [now]
 * @returns {null | {
 *   rawNote: string;
 *   title: string;
 *   venue?: string;
 *   eventDate: Date;
 *   dateStr: string;
 *   isUpcoming: boolean;
 *   daysDiff: number;
 *   url?: string;
 * }}
 */
function parseShowActivity(note, now = new Date()) {
  if (!note || typeof note !== "string") return null;

  const trimmed = note.trim();
  // Ignore system/audit notes that start with brackets
  if (trimmed.startsWith("[")) return null;

  // Show notes generally use ' · ' delimiter from ingestion
  let parts = trimmed.split(" · ").map((p) => p.trim());
  if (parts.length < 2) {
    if (trimmed.includes(" | ")) {
      parts = trimmed.split(" | ").map((p) => p.trim());
    } else {
      return null;
    }
  }

  let eventDate = null;
  let datePartIndex = -1;
  let dateStr = "";

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (MONTH_REGEX.test(part) || NUM_DATE_REGEX.test(part)) {
      const clean = part.split("|")[0].trim();
      const d = new Date(clean);
      if (!Number.isNaN(d.getTime())) {
        const year = d.getFullYear();
        if (year >= 2020 && year <= 2035) {
          eventDate = d;
          datePartIndex = i;
          dateStr = clean;
          break;
        }
      }
    }
  }

  if (!eventDate || datePartIndex === -1) return null;

  const urlPart = parts.find((p) => /^https?:\/\//i.test(p));
  const rawTitle = parts[0];
  const title = rawTitle.split("|")[0].trim();

  let venue;
  if (datePartIndex > 1) {
    venue = parts[1];
  } else if (parts.length > 2 && parts[1] !== dateStr) {
    venue = parts[1];
  }

  if (venue) {
    venue = venue.split("|")[0].trim();
  }

  const daysDiff = Math.round((eventDate.getTime() - now.getTime()) / 86400000);
  const isUpcoming = eventDate.getTime() > now.getTime();

  return {
    rawNote: trimmed,
    title,
    venue,
    eventDate,
    dateStr,
    isUpcoming,
    daysDiff,
    url: urlPart,
  };
}

/**
 * Evaluates all activities for a lead to identify:
 * 1. The closest upcoming show (if any event is in the future).
 * 2. The most recent past show (if no upcoming shows exist and the event was within the last 30 days).
 *
 * @param {Array<{ type?: string; note?: string | null }> | null | undefined} activities
 * @param {Date} [now]
 * @returns {{
 *   upcomingShow: ReturnType<typeof parseShowActivity>;
 *   recentPastShow: ReturnType<typeof parseShowActivity>;
 * }}
 */
function getBestShowContext(activities, now = new Date()) {
  if (!activities || !Array.isArray(activities)) {
    return { upcomingShow: null, recentPastShow: null };
  }

  const parsedShows = [];

  for (const activity of activities) {
    if (activity.type !== "NOTE" || !activity.note) continue;
    const show = parseShowActivity(activity.note, now);
    if (show) {
      parsedShows.push(show);
    }
  }

  if (parsedShows.length === 0) {
    return { upcomingShow: null, recentPastShow: null };
  }

  const upcomingShows = parsedShows.filter((s) => s.isUpcoming);
  const pastShows = parsedShows.filter((s) => !s.isUpcoming);

  let upcomingShow = null;
  if (upcomingShows.length > 0) {
    upcomingShows.sort((a, b) => a.eventDate.getTime() - b.eventDate.getTime());
    upcomingShow = upcomingShows[0];
  }

  let recentPastShow = null;
  if (!upcomingShow && pastShows.length > 0) {
    pastShows.sort((a, b) => b.eventDate.getTime() - a.eventDate.getTime());
    const mostRecent = pastShows[0];
    if (mostRecent.daysDiff >= -30) {
      recentPastShow = mostRecent;
    }
  }

  return { upcomingShow, recentPastShow };
}

/**
 * Formats an Instagram post caption with a timestamp anchor, e.g.:
 * "[Posted 3 days ago on Oct 21, 2026]: Caption text..."
 *
 * @param {{ caption?: string | null; postedAt?: Date | null }} post
 * @param {Date} [now]
 * @returns {string | null}
 */
function formatPostWithTimestamp(post, now = new Date()) {
  if (!post || !post.caption || !post.caption.trim()) return null;
  const caption = post.caption.trim();
  if (!post.postedAt) return caption;

  const postDate = new Date(post.postedAt);
  if (Number.isNaN(postDate.getTime())) return caption;

  const daysAgo = Math.floor((now.getTime() - postDate.getTime()) / 86400000);
  let timeStr = "";
  if (daysAgo <= 0) timeStr = "today";
  else if (daysAgo === 1) timeStr = "yesterday";
  else if (daysAgo < 30) timeStr = `${daysAgo} days ago`;
  else if (daysAgo < 365) {
    const months = Math.floor(daysAgo / 30);
    timeStr = `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(daysAgo / 365);
    timeStr = `${years} ${years === 1 ? "year" : "years"} ago`;
  }

  const dateStr = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(postDate);

  return `[Posted ${timeStr} on ${dateStr}]: ${caption}`;
}

/**
 * Determines if an artist is Austin-local (Austin metro area).
 *
 * @param {Object|null|undefined} artist
 * @returns {boolean}
 */
function isArtistAustinLocal(artist) {
  if (!artist) return false;

  // Direct check on city
  if (artist.city && typeof artist.city === "string") {
    const cityLower = artist.city.toLowerCase().trim();
    if (AUSTIN_AREA_CITIES.includes(cityLower)) return true;
  }

  // Check structured location string
  const rawLoc = [artist.city, artist.state, artist.location, artist.country]
    .filter((v) => typeof v === "string" && v.trim())
    .join(", ");

  if (rawLoc) {
    const parsed = parseLocationString(rawLoc);
    if (parsed && parsed.isAustinArea) return true;
  }

  // Check bio if present
  if (artist.bio && typeof artist.bio === "string") {
    const parsedBio = extractLocationFromText(artist.bio, { artistName: artist.name });
    if (parsedBio && parsedBio.isAustinArea) return true;
  }

  // Regex check for Austin or ATX
  if (artist.location && typeof artist.location === "string") {
    if (/\b(austin|atx)\b/i.test(artist.location)) return true;
  }

  return false;
}

/**
 * Determines if a lead is for a non-local artist whose Austin gigs have all
 * already been played (in the past) and has no upcoming Austin shows.
 *
 * @param {Object|null|undefined} lead
 * @param {Date} [now]
 * @returns {boolean}
 */
function isNonLocalWithPastGigOnly(lead, now = new Date()) {
  if (!lead) return false;
  const artist = lead.artist || (lead.city || lead.location ? lead : null);
  if (!artist) return false;

  // Local Austin artists live here, so they are not non-local
  if (isArtistAustinLocal(artist)) return false;

  const activities = Array.isArray(lead.activities) ? lead.activities : [];
  if (activities.length === 0) return false;

  const austinShows = [];

  for (const activity of activities) {
    if (!activity || !activity.note) continue;
    const note = activity.note;
    const isAustin = isAustinVenue(note);
    const parsed = parseShowActivity(note, now);

    if (parsed && (isAustin || isAustinVenue(parsed.venue) || isAustinVenue(parsed.title))) {
      austinShows.push(parsed);
    }
  }

  // If no Austin shows found in activities, false
  if (austinShows.length === 0) return false;

  // If any Austin show is upcoming, they still have an upcoming show in town!
  const hasUpcoming = austinShows.some((show) => show.isUpcoming);
  if (hasUpcoming) return false;

  // All Austin shows are in the past
  return true;
}

module.exports = {
  parseShowActivity,
  getBestShowContext,
  formatPostWithTimestamp,
  isArtistAustinLocal,
  isNonLocalWithPastGigOnly,
};
