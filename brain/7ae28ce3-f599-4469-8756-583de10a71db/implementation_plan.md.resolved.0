# Finalize Fixes for DB Loading and Lead Discovery

The user reported that the database is not loading and lead discovery actors are doing nothing. Additionally, uncommitted changes are blocking the "Move Worktree Changes" workflow.

## User Review Required

> [!IMPORTANT]
> I will be running `git restore .` to clear tracked changes in the main workspace that are blocking the merge/move process. I have already stashed the previous edits, so they can be recovered if needed.

## Proposed Changes

### [Component] Git & Environment
- Clear remaining tracked changes to unblock the worktree move.
- Ensure the portable Node environment is used reliably.

### [Component] Backend API (Next.js)

#### [MODIFY] [route.ts](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/api/discover/route.ts)
- Update token prioritization: Always check `APIFY_ORG_TOKEN` first, as some actors (like the Mohawk scraper) require it.

#### [MODIFY] [status/route.ts](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/api/discover/status/route.ts)
- Similar update for the status endpoint to ensure consistency.

## Verification Plan

### Automated Tests
- Run a test discovery call using `Invoke-WebRequest` to verify the actor starts successfully with the correct token.
- Run a `check-db.js` scratch script to verify Prisma can load leads from the database.

### Manual Verification
- User to navigate to `Lead Discovery` and trigger a search.
- User to verify the `Inbox` page loads the seeded leads (Billie Eilish, Phoebe Bridgers, Tycho).
