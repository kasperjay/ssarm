# Plan: all active venue-calendar scrapers

## Checklist

### Phase 1 — Active venue catalog and selection
- [x] Expose all 16 active venues in the search UI and API, retaining the original six as the named MVP subset.
- [x] Keep closed Empire Control Room & Garage archived and out of active searches.

### Phase 2 — Source adapters and parsing
- [x] Support event-detail links on both Family and standard Do512 hosts.
- [x] Add The Cut's official calendar adapter and wire every active Do512 listing to the shared scraper.
- [x] Test date windows, both Do512 hosts, artist lineups, detail enrichment, fallback behavior, retry, and timeout.

### Phase 3 — Ship and document
- [x] Update discovery documentation and preserve Apify-free calendar imports.
- [x] Build and restart the live app; verify all 16 calendar scrapers and the mocked Import Selected success/error flow.

## Phase 1
**Files:** `src/lib/scrapers/config.ts`, `src/lib/scrapers/index.ts`, `src/app/api/discover/calendar/route.ts`, `src/app/leads/discover/page.tsx`

Use the registry as the source of truth for the 17 known locations. Expose the 16 active calendars by default and on Select all; retain the six approved MVP venues as a named subset. Mark Empire as archived rather than scraping an empty/closed calendar. Unit tests verify the active list excludes Empire and preserves the MVP order.

## Phase 2
**Files:** `src/lib/scrapers/shared.ts`, `src/lib/scrapers/the-cut.ts`, `src/lib/scrapers/valhalla-tavern.ts`, `src/lib/scrapers/shared.test.ts`

Reuse the shared bounded-fetch, 30-day window, timeout, retry, and one-row-per-artist contract. Permit only same-host event links across `family.do512.com` and `do512.com`. The Cut reads its public event rows and follows same-host ticket/detail pages; Valhalla uses its public Do512 event listing. Unit fixtures cover date-only events, invalid/out-of-window dates, separate headliner/support acts, non-music exclusions, standard-host links, and graceful detail-page fallback.

## Phase 3
**Files:** `AGENTS.md`, `README.md`, `src/lib/lead-enrichment-service.test.ts`, `src/app/leads/discover/page.tsx`

Document full active-venue coverage and keep calendar imports independent of Apify/Instagram scraping while preserving Spotify enrichment. Run automated tests and production checks; verify the import UI reports saved rows or itemized errors rather than silently returning.

## Verified on 2026-10-12
The production calendar endpoint returned HTTP 200 with all 16 venues successful and 459 artist-event rows. `npm run test:scrapers` passed 9 tests, `npm test` passed 11 tests, TypeScript passed, and the production build succeeded. The Import Selected UI was exercised with API interception, confirming the success message and calendar import flags without writing test data to the database.
