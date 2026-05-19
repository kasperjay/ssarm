export type LeadStatus =
  | "NEW"
  | "QUALIFIED"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "WON"
  | "LOST";

export type ActivityType =
  | "MESSAGE_SENT"
  | "REPLY_RECEIVED"
  | "FOLLOW_UP_SET"
  | "STATUS_CHANGE"
  | "NOTE";

export type LeadPayload = {
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
