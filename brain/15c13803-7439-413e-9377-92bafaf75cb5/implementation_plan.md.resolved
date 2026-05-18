# Fix Empire Crawler Data Quality

The Empire crawler (and venue discovery in general) is returning "bunk" results such as raves, pre-show parties, and generic showcases that are not useful for lead generation. This plan refines the `isBunkEvent` utility and `cleanArtistName` to improve data quality for Empire ATX and other venues.

## User Review Required

> [!IMPORTANT]
> I have identified several "bunk" keywords specifically from the current Empire ATX calendar that were passing through: "Rave", "Showcase", "Broadway", and generic "Party" suffixes. I am adding these to the global filter.

## Proposed Changes

### Utilities

#### [MODIFY] [utils.ts](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/lib/utils.ts)

Refine the filtering and cleaning logic:
- Add keywords to `bunkKeywords`: `Rave`, `Showcase`, `Broadway`, `Battle of the Bands`, `Night of`, `A Night with`.
- Improve regex in `isBunkEvent` to catch generic "Party" or "Event" names.
- Update `cleanArtistName` to handle "Presents:", "with", and stage-specific suffixes if they leak into the artist name.

## Verification Plan

### Automated Tests
- Create a scratch script `scratch/verify-empire-fix.js` that tests a list of Empire event titles against the updated `isBunkEvent` and `cleanArtistName`.
- Verify that:
    - `Jay Electronica with Stove God Cooks` is treated as a valid artist (maybe cleaned to Jay Electronica).
    - `Autumn Pre-Show Showcase + Party` is identified as BUNK.
    - `Big Bubble Rave` is identified as BUNK.
    - `Boogie Down Broadway` is identified as BUNK.

### Manual Verification
- Run the "Empire" search in the UI and verify the results list is cleaner.
