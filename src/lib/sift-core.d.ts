export type SiftItem = Record<string, any>;

export interface SiftNormalizedItem {
  index: number;
  rawName: string;
  name: string;
  eventTitle?: string;
  venueName?: string;
  handle?: string;
  sourceType: string;
  desc: string;
  bio?: string;
  externalUrl?: string;
  categoryName?: string;
  businessCategoryName?: string;
  taggedCount?: number;
  postOwner?: string;
  caption?: string;
  profileSignals?: string[];
  profileDisqualifiers?: string[];
}

export interface ItemEvaluation {
  index: number;
  isArtist: boolean;
  cleanName: string;
  reason?: string;
}

export interface SiftResult {
  results: boolean[];
  mode: "ai" | "fallback";
  cleanedNames: Record<number, string>;
}

export declare const NON_ARTIST_EVENT_PATTERNS: RegExp[];
export declare const KNOWN_PROMOTER_OR_VENUE_NAMES: RegExp[];
export declare const NON_MUSIC_HANDLE_PATTERNS: RegExp[];
export declare const MUSIC_BIO_ROLE_PATTERNS: RegExp[];
export declare const MUSIC_BIO_GENRE_PATTERNS: RegExp[];
export declare const MUSIC_BIO_RELEASE_PATTERNS: RegExp[];
export declare const MUSIC_BIO_TOUR_PATTERNS: RegExp[];
export declare const MUSIC_URL_PATTERNS: RegExp[];
export declare const MUSIC_CATEGORY_PATTERNS: RegExp[];
export declare const NON_MUSIC_BIO_DISQUALIFIERS: RegExp[];

export declare function extractVenueCaptionContext(
  caption?: string,
  handle?: string
): {
  isLineupPerformer: boolean;
  isCreditDisqualified: boolean;
  creditReason?: string;
};

export declare function checkProfileMusicSignals(item: Record<string, any>): {
  isArtist: boolean | null;
  signals: string[];
  disqualifiers: string[];
  reason: string;
};

export declare function normalizeSiftItem(
  item: SiftItem,
  index: number
): SiftNormalizedItem;

export declare function evaluateItemHeuristic(
  item: SiftNormalizedItem
): ItemEvaluation;

export declare function siftItems(
  rawItems: any[] | null | undefined
): Promise<SiftResult>;
