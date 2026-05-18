# Spectral Soundworks Progress Review & Enhancements

This plan outlines the next steps to solidify the automation and operational workflows of Spectral Soundworks, addressing the backlog from `AGENTS.md` and brainstorming new features.

## User Review Required

> [!IMPORTANT]
> The "Lead-to-Project Conversion" will automatically create a project shell when a lead is marked `WON`. Please confirm if this should be fully automatic or if a "Review and Create Project" step is preferred.

> [!NOTE]
> The Pipeline Health Agent will generate a daily report. We need to decide where this report should be surfaced (e.g., Email, Dashboard, or both).

## Proposed Changes

### 1. Operations UI Enhancements
Add a "Merge Proposals" section to the `/operations` page to allow manual review and application of artist merges.

#### [MODIFY] [page.tsx](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/operations/page.tsx)
- Fetch `MergeProposal` records with `PENDING` status.
- Add a new section for Reviewing and Applying/Rejecting proposals.
- Implement server actions to handle apply/reject logic.

### 2. Data Reliability & Metrics
Implement the suggested metric snapshot table to track follower history and release frequency properly.

#### [MODIFY] [schema.prisma](file:///c:/Users/kp/Documents/spectral-soundworks-app/prisma/schema.prisma)
- [NEW] `ArtistMetric` model to store snapshots of followers, post counts, etc.
- Relation from `Artist` to `ArtistMetric`.

### 3. Pipeline Health Agent
A new automation script to audit the system for data gaps and bottlenecks.

#### [NEW] [pipeline-health.js](file:///c:/Users/kp/Documents/spectral-soundworks-app/scripts/pipeline-health.js)
- Checks for:
    - Missing contact info (email/IG) for high-score leads.
    - Stale artist data (> 30 days since last enrichment).
    - Unscored leads.
    - Leads stuck in `QUALIFIED` or `CONTACTED` for > 14 days without activity.
- Generates a summary report (can be logged to `AgentRun`).

### 4. Lead-to-Project Conversion
Ensure sales success transitions smoothly into delivery.

#### [MODIFY] [actions.ts](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/leads/%5Bid%5D/actions.ts)
- Update `updateLeadStatus` to trigger `createProjectShell` when status is set to `WON`.
- [NEW] `createProjectShell` helper to initialize `Project`, `portalToken`, and an initial `Activity` record.

### 5. Outreach QA Agent
Inspect drafts for quality before sending.

#### [NEW] [outreach-qa.js](file:///c:/Users/kp/Documents/spectral-soundworks-app/scripts/outreach-qa.js)
- Scans `MessageDraft` table.
- Flags drafts with:
    - Missing personalization tokens.
    - Length exceeding limits.
    - Duplicate phrasing across recent messages.

## Verification Plan

### Automated Tests
- Run `prisma generate` and `prisma migrate dev` for the new `ArtistMetric` table.
- Run `scripts/pipeline-health.js --dry-run` to verify detection logic.
- Run `scripts/outreach-qa.js` to verify draft inspection.

### Manual Verification
- Mark a lead as `WON` in the UI and verify a Project is created.
- Review and Apply a `MergeProposal` from the Operations page.
