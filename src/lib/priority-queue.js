// @ts-check

import showParser from "./show-parser.js";
const { isNonLocalWithPastGigOnly } = showParser;

const PRODUCTION_NEED_POINTS = { NONE: 0, POSSIBLE: 8, PROBABLE: 12, CLEAR: 12 };
const FRESHNESS_DAYS = 45;
const ACTION_TYPES = new Set(["EMAIL", "DM", "CALL", "RESEARCH", "OTHER"]);
const LEVELS = new Set(["NONE", "POSSIBLE", "PROBABLE", "CLEAR"]);

/**
 * @param {unknown} value
 * @returns {Date|null}
 */
function asDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}

/**
 * @param {Object} lead
 * @returns {string[]}
 */
function evidenceItems(lead) {
  const evidence = lead?.productionNeedEvidence;
  if (Array.isArray(evidence)) return evidence.filter((item) => typeof item === "string" && item.trim());
  if (evidence && typeof evidence === "object") {
    return Object.entries(evidence)
      .filter(([, value]) => value === true)
      .map(([key]) => key);
  }
  return [];
}

/**
 * @param {Object} lead
 * @param {Date} [now]
 * @returns {Object}
 */
function productionNeed(lead, now = new Date()) {
  const level = typeof lead?.productionNeedLevel === "string" && LEVELS.has(lead.productionNeedLevel)
    ? lead.productionNeedLevel
    : "NONE";
  const approvedAt = asDate(lead?.productionNeedApprovedAt);
  const evidence = evidenceItems(lead);
  const ageDays = approvedAt ? (now.getTime() - approvedAt.getTime()) / 86400000 : null;
  const expired = ageDays !== null && ageDays >= FRESHNESS_DAYS;
  const needsReview = lead?.productionNeedLevel != null && !LEVELS.has(lead.productionNeedLevel);
  const approved = level !== "NONE" && !expired;
  const points = approved ? (PRODUCTION_NEED_POINTS[level] || 0) : 0;
  const label = (level === "PROBABLE" || level === "CLEAR")
    ? "Probable production need"
    : level === "POSSIBLE"
      ? "Possible production need"
      : "No production-need signal";
  const reasons = [];
  if (needsReview) reasons.push("Needs review: production-need qualification is invalid");
  if (expired) reasons.push(`Production-need evidence expired ${Math.max(0, Math.floor(ageDays - FRESHNESS_DAYS))} days ago`);
  if (approved) reasons.push(`${label} (+${points}): ${evidence.join(", ")}`);
  return { level, approved, expired, needsReview, points, evidence, approvedAt, ageDays, label, reasons };
}

/**
 * @param {Object} artist
 * @returns {string[]}
 */
function contactPaths(artist) {
  const paths = [];
  if (Array.isArray(artist?.emails) && artist.emails.some((email) => typeof email === "string" && email.trim())) paths.push("email");
  if (typeof artist?.instagramHandle === "string" && artist.instagramHandle.trim()) paths.push("Instagram");
  return paths;
}

/**
 * @param {Object} lead
 * @param {Date} [now]
 * @returns {string|null}
 */
function hardExclusion(lead, now = new Date()) {
  if (["WON", "LOST", "PAUSED"].includes(lead?.status)) return `${lead.status} leads are not actionable`;
  if (lead?.optedOut === true || lead?.paused === true) return "Lead is paused or opted out";
  if (isNonLocalWithPastGigOnly(lead, now)) return "Non-local artist whose Austin gigs have already been played";
  const lastContactedAt = asDate(lead?.lastContactedAt);
  if (lastContactedAt && now.getTime() - lastContactedAt.getTime() < 12 * 60 * 60 * 1000) return "Contacted too recently";
  return null;
}

/**
 * @param {Object} lead
 * @param {Date} [now]
 * @returns {Object}
 */
function priorityForLead(lead, now = new Date()) {
  const baseScore = Math.max(0, Math.min(100, Number(lead?.score) || 0));
  const need = productionNeed(lead, now);
  const score = Math.min(100, baseScore + need.points);
  const reasons = [...need.reasons];
  if (baseScore > 0) reasons.push(`Base lead score (+${Math.round(baseScore)})`);
  const paths = contactPaths(lead?.artist);
  if (paths.length) reasons.push(`Contact path: ${paths.join(" + ")}`);
  return {
    score,
    components: { baseScore, productionNeed: need.points },
    priority: need,
    productionNeed: need,
    reasons,
    topReasons: reasons.slice(0, 3),
  };
}

/**
 * @param {Object} lead
 * @param {Date} [now]
 * @returns {Object}
 */
function outreachEligibility(lead, now = new Date()) {
  const exclusion = hardExclusion(lead, now);
  const paths = contactPaths(lead?.artist);
  const cleanup = [];
  if (!["NEW", "QUALIFIED"].includes(lead?.status)) cleanup.push("Lead is not in a new-outreach status");
  if (lead?.lastContactedAt) cleanup.push("Lead has already been contacted");
  if (!paths.length) cleanup.push("Needs contact information");
  if (exclusion) cleanup.push(exclusion);
  return { actionable: cleanup.length === 0, cleanup, paths };
}

/**
 * @param {Object} lead
 * @param {Date} [now]
 * @returns {Object}
 */
function followUpEligibility(lead, now = new Date()) {
  const cleanup = [];
  const exclusion = hardExclusion(lead, now);
  if (exclusion && !["Contacted too recently"].includes(exclusion)) cleanup.push(exclusion);
  if (!asDate(lead?.nextActionAt)) cleanup.push("Needs a due date");
  if (!ACTION_TYPES.has(lead?.followUpActionType)) cleanup.push("Needs a next-action type");
  return { actionable: cleanup.length === 0, cleanup };
}

/**
 * @param {Object} lead
 * @param {Date} [now]
 * @returns {string|null}
 */
function followUpReason(lead, now = new Date()) {
  const due = asDate(lead?.nextActionAt);
  if (!due) return null;
  const days = Math.ceil((now.getTime() - due.getTime()) / 86400000);
  return days > 0 ? `Follow-up overdue by ${days} ${days === 1 ? "day" : "days"}` : `Follow-up due ${Math.abs(days)} ${Math.abs(days) === 1 ? "day" : "days"} from now`;
}

/**
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
export function comparePriority(a, b) {
  return b.priority.score - a.priority.score || String(a.lead.id).localeCompare(String(b.lead.id));
}

/**
 * @param {Object} lead
 * @param {"outreach"|"follow-up"} kind
 * @param {Date} [now]
 * @returns {Object}
 */
export function buildQueueItem(lead, kind, now = new Date()) {
  const priority = priorityForLead(lead, now);
  const eligibility = kind === "outreach" ? outreachEligibility(lead, now) : followUpEligibility(lead, now);
  const dueReason = kind === "follow-up" ? followUpReason(lead, now) : null;
  return { lead, kind, priority, eligibility, dueReason };
}

export {
  ACTION_TYPES,
  FRESHNESS_DAYS,
  PRODUCTION_NEED_POINTS,
  productionNeed,
  priorityForLead,
  contactPaths,
  hardExclusion,
  outreachEligibility,
  followUpEligibility,
  isNonLocalWithPastGigOnly,
};