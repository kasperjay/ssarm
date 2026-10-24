# Priority Action Queue Implementation Plan

## Open questions

- None. The approved design fixes the field semantics, 45-day freshness window, queue exclusions, ranking order, and `/operations` destination.

## Task checklist

### Phase 1 — Shared priority model and schema

- [x] Add production-need and follow-up action enums/fields to `prisma/schema.prisma`, generate the Prisma migration, and regenerate the client.
- [x] Add `src/lib/priority-queue.js` and its declaration file with normalization, freshness, eligibility, scoring, reasons, and deterministic comparators.
- [x] Add `src/lib/priority-queue.test.js` covering qualification, freshness, malformed data, eligibility, ranking, and explanations.

### Phase 2 — Operations queue view

- [x] Replace the two-column `src/app/operations/page.tsx` queries with shared-helper-backed New Outreach and Follow-ups view models.
- [x] Add `src/components/OperationsQueue.tsx` for tabs, counts, timestamps, empty/cleanup states, lead links, inline reasons, and expandable score breakdowns.
- [x] Keep existing lead detail links and status behavior while surfacing missing contact/action data explicitly.

### Phase 3 — Validation and documentation

- [x] Update `README.md` with the queue behavior and new lead fields.
- [ ] Run scoring and priority unit tests, lint, and the production build; fix failures caused by this feature. (Tests and targeted lint pass; the full build is blocked by a pre-existing Next.js route type error in `src/app/api/KPIs/campaigns/[id]/route.ts`.)

## Phase 1 — Shared priority model and schema

**Affected files**

- `prisma/schema.prisma` — add neutral-default production-need fields, evidence metadata, approval timestamp, and nullable follow-up action type to `Lead`.
- `prisma/migrations/<timestamp>_priority_action_queue/migration.sql` — create the corresponding PostgreSQL enum types and nullable/default columns.
- `prisma/generated-client/*` — regenerate Prisma types and runtime metadata from the updated schema.
- `src/lib/priority-queue.js` — implement pure queue and scoring functions.
- `src/lib/priority-queue.d.ts` — expose typed input/output contracts to TypeScript callers.
- `src/lib/priority-queue.test.js` — test the pure business rules with fixed `now` values.

Use `ProductionNeedLevel` values `NONE`, `POSSIBLE`, and `CLEAR`, defaulting to `NONE`, plus `FollowUpActionType` values `EMAIL`, `DM`, `CALL`, `RESEARCH`, and `OTHER`. Store the evidence checklist and suggestion/source metadata as JSON, the approved evidence note as nullable text, and the approval timestamp as nullable `DateTime`; unapproved suggestions never contribute points. A qualification contributes only when its level is valid, evidence is present, approval is present, and the approval is no older than 45 days. Invalid or incomplete data contributes zero and returns a `Needs review` explanation.

The helper should accept a lead-shaped value and an injected current time, then return a stable view model containing eligibility, cleanup reasons, final score, component values, top reasons, and the complete breakdown. Reuse `lead.score` as the base score and do not duplicate `scoring-core.js` rules. Treat hard exclusions as eligibility outcomes, detect usable email/Instagram contact paths, require both `nextActionAt` and a valid action type for follow-ups, and sort by priority score with stable lead-id tie-breaking. Overdue duration and contact path belong in explanations, not hidden score penalties.

Tests should assert all three production-need levels, approval/evidence requirements, the exact 45-day boundary, malformed values, contact-path detection, `WON`/`LOST` and recent-contact exclusions, missing follow-up fields, tab-specific eligibility, score capping, deterministic ties, and top-versus-full reason output.

## Phase 2 — Operations queue view

**Affected files**

- `src/app/operations/page.tsx` — query the minimal lead/artist/activity data needed by the helper, build independently ranked queue models, and pass them to the view.
- `src/components/OperationsQueue.tsx` — render the two tabs and interactive expandable score details as a client component.

Query active leads broadly enough to expose cleanup counts rather than filtering away missing data in SQL. Build New Outreach from `NEW`/`QUALIFIED` leads with no prior contact and a usable path; build Follow-ups from active leads with complete next-action data; retain separate cleanup collections for unreachable outreach candidates and incomplete follow-ups. Apply the shared comparator independently to each actionable tab. Preserve database errors as page errors rather than returning empty success-shaped queues.

The component should show actionable counts, follow-up oldest-due information, a last-updated timestamp, explicit empty states, lead links, final score out of 100, two or three inline reasons, and a “Why this score?” disclosure with all components and review/freshness details. Use existing `GlassCard` and visual conventions, and keep mutations out of scope; action controls link to the existing lead workflow.

## Phase 3 — Validation and documentation

**Affected files**

- `README.md` — document the two queue tabs, eligibility rules, supported action types, and production-need approval fields.

Run `npm test` to preserve the existing scoring suite and execute the new pure priority tests, then run `npm run lint` and `npm run build`. Resolve only failures introduced by the queue/schema work; do not alter unrelated in-progress files.
