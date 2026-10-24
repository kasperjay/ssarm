// src/lib/instagram-discovery.d.ts

export type InstagramSourceType = "tagged" | "coauthor" | "mention" | "author";

export interface ExtractedInstagramProfile {
  artist: string;
  artistName: string;
  fullName?: string;
  username: string;
  ownerUsername: string;
  handle: string;
  instagramHandle: string;
  profilePicUrl?: string;
  ownerProfilePicUrl?: string;
  avatarUrl?: string;
  biography?: string;
  bio?: string;
  followersCount?: number;
  caption?: string;
  shortCode?: string;
  url?: string;
  instagramUrl?: string;
  imageUrl?: string;
  displayUrl?: string;
  timestamp?: string;
  postedAt?: string;
  sourceType: InstagramSourceType;
  taggedCount: number;
  postOwner?: string;
  [key: string]: unknown;
}

export declare const IGNORED_INSTAGRAM_HANDLES: Set<string>;
export declare const SOURCE_PRIORITY: Record<InstagramSourceType, number>;

export declare function cleanHandle(handle: unknown): string | null;
export declare function extractCaptionMentions(caption: unknown): string[];
export declare function extractTaggedProfiles(rawItems: unknown[]): Array<Record<string, unknown>>;
