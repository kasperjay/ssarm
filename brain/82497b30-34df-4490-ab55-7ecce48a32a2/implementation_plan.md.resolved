# Improve Mohawk Crawler Result Quality

The Mohawk crawler is returning a lot of non-artist events like DJ sets, parties, quizzo, and sports. I will implement a filtering logic to identify and exclude "bunk" results from the discovery feed.

## User Review Required

> [!IMPORTANT]
> Some terms like "Sports" or "Dance" could theoretically be band names. I will use a list of common "noisy" keywords to filter these out, but there is always a small risk of false positives. I'll focus on terms that are 99% likely to be non-artist events in this context.

## Proposed Changes

### Logic & Utilities

#### [MODIFY] [utils.ts](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/lib/utils.ts)
- Implement `isBunkEvent(name: string, description?: string): boolean`
- Keywords to filter:
    - Events: `DJ Set`, `Quizzo`, `Trivia`, `Happy Hour`, `Yoga`, `Karaoke`, `Open Mic`, `Brunch`, `Party`, `Closing Early`, `NCAA`, `NFL`, `NBA`, `MLB`.
    - Generic: `Sports`, `Dance`, `the Dead` (unless it's a specific band name, but usually it's "the Dead" as a category/theme).
    - Phrases: `Hosted by`, `Kickoff Show` (maybe?), `Album Release` (we usually want artists, but generic "Album Release" without an artist name might be tricky - though Mohawk usually lists the artist).

### Discovery Page

#### [MODIFY] [page.tsx](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/leads/discover/page.tsx)
- Apply the filter when processing results from Apify.
- Log how many bunk items were filtered.

## Verification Plan

### Automated Tests
- Create `scratch/test-filter.js` to verify the logic against the user's provided samples.

### Manual Verification
- Re-run Mohawk discovery and check the filtered list.
