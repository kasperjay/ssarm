export type ParsedShow = {
  rawNote: string;
  title: string;
  venue?: string;
  eventDate: Date;
  dateStr: string;
  isUpcoming: boolean;
  daysDiff: number;
  url?: string;
};

export type ShowContext = {
  upcomingShow: ParsedShow | null;
  recentPastShow: ParsedShow | null;
};

export function parseShowActivity(
  note?: string | null,
  now?: Date
): ParsedShow | null;

export function getBestShowContext(
  activities?: Array<{ type?: string; note?: string | null }> | null,
  now?: Date
): ShowContext;

export function formatPostWithTimestamp(
  post: { caption?: string | null; postedAt?: Date | null },
  now?: Date
): string | null;

export function isArtistAustinLocal(
  artist?: {
    city?: string | null;
    state?: string | null;
    location?: string | null;
    country?: string | null;
    bio?: string | null;
    name?: string | null;
  } | null
): boolean;

export function isNonLocalWithPastGigOnly(
  lead?: {
    artist?: {
      city?: string | null;
      state?: string | null;
      location?: string | null;
      country?: string | null;
      bio?: string | null;
      name?: string | null;
    } | null;
    city?: string | null;
    location?: string | null;
    activities?: Array<{ type?: string; note?: string | null }> | null;
  } | null,
  now?: Date
): boolean;
