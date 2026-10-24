export type ProductionNeedSignal = {
  pattern: RegExp;
  label: string;
  weight: number;
};

export type ScanLeadResult = {
  level: "PROBABLE" | "POSSIBLE" | "CLEAR" | "NONE";
  evidence: string[];
  source: {
    type: string;
    signalCount: number;
    scannedAt: string;
  };
  detectedAt: Date;
};

export type ScanLeadInput = {
  bio?: string | null;
  artist?: { bio?: string | null };
  captions?: Array<string | { caption?: string | null }>;
  instagramPosts?: Array<string | { caption?: string | null }>;
  releases?: Array<{ title?: string | null; releaseDate?: Date | string | null }>;
  currentLevel?: string | null;
  productionNeedLevel?: string | null;
  approvedAt?: Date | string | null;
  productionNeedApprovedAt?: Date | string | null;
};

export const FRESHNESS_DAYS: number;
export const RELEASE_RECENCY_DAYS: number;
export const RELEASE_SIGNAL_LABEL: string;
export const CAPTION_SIGNALS: ProductionNeedSignal[];
export const BIO_SIGNALS: ProductionNeedSignal[];

export function scanText(text: string | null | undefined, rules: ProductionNeedSignal[]): Array<{ label: string; weight: number }>;

export function isClearPreserved(currentLevel: string | null | undefined, approvedAt: Date | string | null | undefined, now?: Date): boolean;

export function scanLeadForProductionNeeds(
  input: ScanLeadInput,
  postsArg?: Array<string | { caption?: string | null }>,
  releasesArg?: Array<{ title?: string | null; releaseDate?: Date | string | null }>
): ScanLeadResult;
