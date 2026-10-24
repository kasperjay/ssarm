export type QueueKind = "outreach" | "follow-up";
export type QueueItem = {
  lead: {
    id: string;
    status: string;
    score: number | null;
    nextActionAt?: Date | string | null;
    artist: { name: string; genre?: string | null; emails: string[]; instagramHandle: string | null };
    [key: string]: unknown;
  };
  kind: QueueKind;
  priority: {
    score: number;
    components: { baseScore: number; productionNeed: number };
    productionNeed: { points: number; needsReview: boolean; expired: boolean; reasons: string[] };
    reasons: string[];
    topReasons: string[];
  };
  eligibility: { actionable: boolean; cleanup: string[]; paths?: string[] };
  dueReason: string | null;
};
export function buildQueueItem(lead: QueueItem["lead"], kind: QueueKind, now?: Date): QueueItem;
export function comparePriority(a: QueueItem, b: QueueItem): number;
export function isNonLocalWithPastGigOnly(lead: unknown, now?: Date): boolean;
