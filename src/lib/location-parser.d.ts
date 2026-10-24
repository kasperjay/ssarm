export type ParsedLocation = {
  city: string | null;
  state: string | null;
  country: string | null;
  formatted: string | null;
  isAustinArea: boolean;
  isTexas: boolean;
  venueTie?: boolean;
};

export type LocationExtractOptions = {
  artistName?: string;
  instagramHandle?: string;
  allowVenue?: boolean;
};

export function parseLocationString(raw: string | null | undefined): ParsedLocation | null;
export function extractLocationFromText(
  text: string | null | undefined,
  options?: LocationExtractOptions
): ParsedLocation | null;
export function isAustinVenue(text: string | null | undefined): boolean;
export function isGarbageLocation(text: string | null | undefined): boolean;

export const AUSTIN_AREA_CITIES: string[];
export const TEXAS_CITIES: string[];
export const AUSTIN_VENUES: string[];
export const STATE_NAMES: Record<string, string>;
export const STATE_BY_NAME: Record<string, string>;
