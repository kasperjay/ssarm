# Fix Bunk Results - Come and Take It & Tribute/Event Filters

The user reported that discovery results for "Come and Take It" are pulling in "bunk" data such as tribute bands, event nights ("Emo Night", "Dad Rock Night"), and city names ("Round Rock") being mistaken for artist names.

## Proposed Changes

### Logic & Helpers

#### [MODIFY] [utils.ts](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/lib/utils.ts)
- Update `isBunkEvent` to include more comprehensive filters:
    - **Tribute/Covers**: "Tribute", "Experience", "Cover Band", "Performing the music of".
    - **Event Nights**: "Emo Night", "Dad Rock Night", "Night" (when appearing as the primary name or in specific patterns), "Theme Night".
    - **Venues/Misc**: "Come and Take It", "Round Rock" (when appearing as an artist name).

#### [MODIFY] [location.ts](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/lib/location.ts)
- Update `validLocation` blacklist to include "Round Rock" if it's considered bunk in this context? 
    - *Self-correction*: "Round Rock" is a real city. If it's appearing as a *location*, it's technically valid. But if it's appearing in Stage 1 from a field like `venueName` or similar, it might be bunk.
    - I'll add "Come and Take It" to the location blacklist since it's a venue name.

## Verification Plan

### Automated Tests
- Update `scratch/test-filter.js` (or creation of a new test script) to include these new cases and verify they are correctly identified as BUNK.
- Update `scratch/test-location-fix.js` to include "Come and Take It".

### Manual Verification
- N/A (Backend logic change)
