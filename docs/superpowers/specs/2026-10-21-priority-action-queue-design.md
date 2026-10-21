# Priority Action Queue Design

**Date:** 2026-10-21  
**Project:** Spectral Soundworks CRM  
**Status:** Approved for specification review

## Goal

Turn the existing `/operations` page into a trustworthy daily action queue. It should answer two separate questions:

1. Which reachable leads should receive first outreach next?
2. Which existing follow-ups should be handled next?

The queue must explain its ranking instead of presenting an opaque score. Booking likelihood is the dominant signal, with approved production need acting as the strongest additional buying-intent signal.

## Protected existing behavior

- Keep `/operations` as the destination; do not create a competing `/priority` route.
- Preserve the existing `LeadStatus` values and existing lead detail links.
- Preserve the current base score and its shared implementation in `src/lib/scoring-core.js`.
- Preserve hard pipeline exclusions: `WON`, `LOST`, opted-out leads when that data exists, paused leads when that data exists, and leads contacted too recently.
- Do not change unrelated in-progress work in the repository.

## User experience

### Queue layout

Replace the current two-column presentation with two independently ranked tabs:

- **New Outreach:** first-contact opportunities only.
- **Follow-ups:** leads with an outstanding next action.

Each tab displays:

- actionable item count;
- the oldest due indicator for follow-ups;
- last-updated time;
- an explicit empty state;
- a lead row linking to `/leads/[id]`;
- final priority score out of 100;
- the top two or three ranking reasons inline;
- an expandable “Why this score?” section with the full breakdown;
- a clear action button or link to the lead workflow.

### New Outreach eligibility

Include only leads that:

- have status `NEW` or `QUALIFIED`;
- have never been contacted;
- have at least one usable contact path, such as an email or Instagram handle;
- are not blocked by a hard exclusion.

Exclude leads missing contact information from the actionable list. They remain discoverable through a visible cleanup state or future filter, but they must not appear as ready-to-contact items.

### Follow-up eligibility

Include leads that:

- have an active pipeline status other than `WON` or `LOST`;
- have a due `nextActionAt`;
- have a required next-action type.

Supported action types are `EMAIL`, `DM`, `CALL`, `RESEARCH`, and `OTHER`. A follow-up without either a due date or action type is not ranked as actionable; it appears in a cleanup state with the missing field identified.

Follow-ups are ranked by booking likelihood first. Overdue state is prominent and sortable as a visible urgency attribute, but overdue age must not automatically outrank a materially stronger opportunity.

## Priority model

The existing base lead score remains the foundation. A new shared priority helper produces:

- final priority score;
- score components;
- top reasons;
- full reason list;
- eligibility and cleanup status.

### Production-need qualification

Production need is a structured, approved qualification separate from general popularity:

- `NONE`: `+0`
- `POSSIBLE`: `+8`
- `CLEAR`: `+25`

The qualification must include supporting evidence and an approval timestamp before it affects priority. Evidence is represented as a checklist with these initial signal types:

- upcoming release;
- active show cycle;
- unreleased material or demos;
- explicit production, mixing, or mastering request;
- recent studio activity;
- custom evidence note.

Automation may suggest evidence and a qualification level, but only an approved qualification changes the ranked queue. A clear need is a major boost, capped within the final 0–100 score so it cannot bypass hard exclusions or create an automatic winner.

Approved production-need evidence expires for ranking purposes after 45 days. Expired evidence remains visible for audit/history but contributes zero points until re-approved. The helper must expose freshness and expiry in its breakdown.

### Ranking and reasons

The final score is deterministic for the same lead data and current time. It combines the existing base score with the approved production-need contribution and any explicitly defined supporting priority factors. The implementation must avoid duplicating base-score rules in the page.

Reasons must identify concrete contributors, for example:

- `Clear production need (+25): explicit mixing request`
- `Austin proximity (+...)`
- `Recent activity (+...)`
- `Contact path: email`
- `Follow-up overdue by 3 days`

Hard exclusions are eligibility rules, not negative score points. Missing or malformed qualification data produces a visible “Needs review” reason and no positive production-need points.

## Data model changes

Extend `Lead` with structured fields for:

- approved production-need level;
- production-need evidence checklist;
- production-need evidence note;
- production-need approval timestamp;
- production-need source or suggestion metadata sufficient to distinguish automated suggestions from approved values;
- follow-up next-action type.

Use repository-consistent Prisma types and migration practices. Existing rows must remain valid with neutral defaults: no production-need boost and no follow-up action type. Do not infer approval from an unapproved suggestion.

## Architecture

Add shared server-side priority and queue helpers under `src/lib/`. The helpers should have narrow responsibilities:

1. normalize and validate production-need data;
2. determine freshness and approved contribution;
3. determine contact-path and queue eligibility;
4. validate follow-up action completeness;
5. calculate priority and explainable reasons;
6. provide deterministic ranking comparators.

The `/operations` server component queries only the data required by those helpers and renders the resulting view model. The page must not contain scoring formulas or eligibility rules that could drift from scripts and future automations.

## Error handling

- Missing contact information is an explicit non-actionable state, not a silent omission in diagnostics.
- Missing follow-up action data is an explicit cleanup state.
- Invalid enum values or malformed evidence are treated as unapproved/neutral and surfaced as “Needs review.”
- Database/query failures must follow the app’s existing error behavior; do not return success-shaped empty queues.
- UI actions must link to existing lead workflows unless a separate mutation is explicitly added and tested.

## Testing and validation

Add targeted tests covering:

- all production-need levels;
- approval requirement;
- evidence and approval freshness, including the 45-day boundary;
- neutral behavior for malformed or unapproved data;
- contact-path detection;
- hard exclusions;
- follow-up action completeness;
- independent tab eligibility;
- deterministic ranking and tie behavior;
- top-reason and full-breakdown output.

Run:

- the existing scoring tests;
- the new queue/priority unit tests;
- lint;
- a production build.

The implementation is complete only when existing scoring behavior remains passing and the operations page builds with the new shared view model.

## Out of scope

- Automated approval of production need.
- Sending messages directly from the queue.
- A new `/priority` route.
- A full inbox or reply-triage system.
- Revenue forecasting or capacity planning.
- Reworking unrelated lead, discovery, project, portal, or invoice features.
