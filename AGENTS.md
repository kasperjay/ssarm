# Spectral Soundworks Implementation Plan

This document tracks the current automation, data quality, outreach, and client-portal roadmap for Spectral Soundworks.

Last reevaluated: 2026-05-05

## Current Progress

The app has moved beyond the original "planned agents" phase. The repo now includes working lead ingestion, enrichment, scoring, contact discovery, message delivery, campaign reporting, duplicate detection, genre cleanup, a projects workspace, client portals, file uploads, feedback, invoices, and billing views.

The next phase should focus less on adding isolated scripts and more on making the system reliable as an operating workflow: shared scoring logic, safe data mutations, scheduled runs, surfaced notifications, and tighter handoff from lead to project to invoice.

## Implemented Automation

| Area | Status | Entry Point | Notes |
| --- | --- | --- | --- |
| Lead scoring | Consolidated | `src/lib/scoring-core.js`, `src/lib/scoring.ts`, `scripts/score-leads.js` | API and CLI scoring now use the same shared scoring core. Scores are capped at 100. |
| Event-driven scoring | Consolidated | `scripts/score-auto.js`, `/api/ingest` | Ingest and auto-scoring now use the same shared scoring core. |
| Data enrichment and staleness | Implemented, needs scheduling | `scripts/enrich-stale.js`, `/api/ingest` | Detects stale data and can re-ingest artists; needs operational scheduling and run logs. |
| Follow-up reminders | Implemented, needs UI surfacing | `scripts/followup-remind.js` | Finds due follow-ups and logs reminders; should feed a dashboard queue. |
| Contact discovery | Implemented, needs confidence persistence | `scripts/discover-contacts.js`, `src/lib/email.ts` | Finds emails but confidence is only in activity notes, not queryable structured data. |
| Campaign reporting | Implemented, recently aligned to schema | `scripts/report-campaign.js` | Now uses `WON` rather than legacy `CONVERTED`; needs export formats and dashboard integration. |
| Duplicate detection | Implemented, recently aligned to schema | `scripts/detect-duplicates.js` | Removed non-schema `bandcampUrl` merge field; should add merge audit logging. |
| Genre standardization | Implemented, recently fixed auto-fix logging | `scripts/standardize-genres.js` | Auto-fix now looks up a lead before writing Activity. |
| Message delivery | Partially implemented | `scripts/send-messages.js` | IG webhook delivery exists; email path is still placeholder behavior. |
| Discovery jobs | Implemented | `/api/discover`, `/api/discover/status` | Apify actors can be started and polled from the app. |
| Client projects and portals | Implemented | `src/app/projects`, `src/app/portal/[token]` | Strong base for delivery workflow, feedback, visibility, invoices, and completion ratings. |

## Fixes Completed In This Reevaluation

- Updated campaign reporting to use the schema's `WON` status instead of old `CONVERTED` labels.
- Updated high-performer and underperformer segments to use valid statuses: `CONTACTED`, `FOLLOW_UP`, `WON`, `NEW`, and `QUALIFIED`.
- Removed references to non-schema `bandcampUrl` from contact discovery and duplicate merge data.
- Fixed genre standardization auto-fix so Activity records include the required `leadId` when a lead exists.
- Replaced the stale and mojibake-heavy agent plan with this current implementation plan.

## Highest-Priority Next Steps

### 1. Centralize Scoring Logic

**Status:** Complete for the current API and CLI scoring paths.

**Completed:**

- Moved scoring weights, thresholds, component scoring, rationale generation, and score capping into `src/lib/scoring-core.js`.
- Updated `src/lib/scoring.ts`, `scripts/score-leads.js`, and `scripts/score-auto.js` to use the same implementation.
- Added `--all` support to `scripts/score-auto.js`.
- Capped total scores at 100 while preserving raw-score context in the rationale when a cap is applied.

**Remaining follow-up:**

- Add focused tests around score components and qualification thresholds.
- Re-run database-backed dry-run checks once local PostgreSQL is available.

### 2. Add Agent Run Logging

**Why:** Activity logs are lead-focused, but there is no durable record of agent runs, inputs, output counts, failures, duration, or dry-run status.

**Best next implementation:**

- Add an `AgentRun` model with fields for agent name, mode, startedAt, finishedAt, status, totals, and error summary.
- Wrap each script with a small shared runner helper.
- Keep lead-level Activity entries for user-facing audit history, and use AgentRun for operational observability.

### 3. Surface Action Queues In The UI

**Why:** Several agents create useful next actions, but the app should make those actions unavoidable: due follow-ups, high-confidence contacts found, stale data failures, merge candidates, and genre/manual-review items.

**Best next implementation:**

- Create an Operations page or dashboard section for action queues.
- Start with due follow-ups and high-score uncontacted leads.
- Add filters for "needs data", "needs contact", "ready to message", "possible duplicate", and "stale enrichment".

### 4. Harden Destructive And Semi-Destructive Jobs

**Why:** Duplicate merge and genre standardization change production data. They should be safer and easier to review.

**Best next implementation:**

- Make dry-run the default for duplicate merging and genre changes.
- Persist proposed merge groups before applying them.
- Add merge Activity notes for all affected leads.
- Add rollback notes or snapshots for merged artist fields.

### 5. Complete Message Delivery

**Why:** The outreach loop is only partially closed. IG webhook delivery exists, but email sending is still not implemented in the delivery agent.

**Best next implementation:**

- Implement email delivery through `src/lib/email.ts` or a small SMTP/provider module.
- Store channel and delivery provider result in Activity notes or a structured message delivery table.
- Add daily send limits by channel.
- Add a preview/send approval step in the UI.

## Near-Term Bug And Quality Backlog

| Priority | Item | Suggested Fix |
| --- | --- | --- |
| Done | Scoring config drift | Consolidated scoring into `src/lib/scoring-core.js`. |
| Done | Score can exceed 100 | Enforced `Math.min(total, 100)` in the shared scoring core. |
| High | No test suite for agents | Add focused smoke tests for scoring, reporting segments, duplicate merge preview, and genre standardization. |
| Medium | Agent output contains mixed Unicode/encoding artifacts | Normalize script console output to ASCII or ensure UTF-8 everywhere. |
| Medium | Contact confidence is not structured | Add fields or a related table for discovered contacts, confidence, source URL, and discoveredAt. |
| Medium | Duplicate merge lacks audit trail | Log a NOTE on all moved leads and record merged artist IDs. |
| Medium | Staleness checks use Activity notes for follower history | Add a proper metric snapshot table for followerCount, lastPostAt, release count, and source freshness. |
| Low | README is still create-next-app boilerplate | Replace with project setup, env vars, scripts, data model, and operations docs. |

## New Roadmap Ideas

These ideas build on existing project and portal features. Secure client links already exist through `Project.portalToken`, and timestamped file feedback already exists through `ProjectFeedback.timestamp` plus the portal audio player.

### Pipeline Health Agent

Create a daily job that reports data health across the whole system: missing email, missing city, missing genre, stale Instagram, stale Spotify, unscored leads, selected drafts not sent, and leads stuck in a status too long.

### Lead-to-Project Conversion Agent

When a lead becomes `WON`, suggest or auto-create a project shell using the existing secure portal token, starter invoice, and default delivery folders. This turns sales success into an operational handoff.

### Outreach QA Agent

Before sending, inspect selected message drafts for missing personalization, duplicate phrasing, overly long copy, missing artist name, unavailable channel, or too-frequent outreach.

### Reply Triage Agent

Add an inbox or manual import workflow that classifies replies into interested, not now, pricing request, wrong contact, unsubscribed, or booked. The result should update lead status and next action.

### Local Scene Intelligence

Build a lightweight venue/event signal collector for Austin/Texas artists: recent show announcements, common venues, upcoming releases, and collaboration signals. Feed those signals into score rationale and draft personalization.

### Client Delivery Follow-Up

After a project file is uploaded, timestamped feedback is left, or an invoice is issued, create reminders for unresolved feedback, payment follow-up, revision status, and completion rating. This extends the existing portal workflow into delivery operations.

### Forecasting And Capacity View

Use lead scores, follow-up stage, active projects, invoices, and project status to estimate upcoming workload and likely revenue. This would make the dashboard useful for planning, not just tracking.

## Suggested Implementation Order

1. Consolidate scoring and add tests around score components.
2. Add AgentRun logging and wrap the existing scripts.
3. Build an Operations queue page for due follow-ups and high-score uncontacted leads.
4. Complete email sending and delivery logging.
5. Add structured contact confidence and source tracking.
6. Harden duplicate merge with persisted proposals and audit trails.
7. Replace README boilerplate with real setup and operations documentation.

## Operating Notes

- Keep all agents runnable by CLI and safe to schedule.
- Prefer dry-run defaults for data cleanup and merging jobs.
- Every substantive data change should leave either a lead-level Activity record or an AgentRun record.
- Shared business logic should live in `src/lib` or a small shared package-style module, with scripts acting as thin wrappers.
- The app should become the review surface for agent output, not just the place where final records appear.
