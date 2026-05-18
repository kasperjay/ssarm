# Bunk Result Filtering for Mohawk Crawler

I have implemented a filtering system to clean up the Mohawk discovery results, which were previously cluttered with non-artist events like DJ sets, quizzo, and generic categories.

## Changes Made

### 1. Robust Filtering Logic
Implemented `isBunkEvent` in [utils.ts](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/lib/utils.ts) which detects and excludes results containing noisy keywords:
- **Events:** DJ Set, Dance Party, Quizzo, Trivia, Happy Hour, Yoga, Karaoke, Comedy Night, etc.
- **Generic Categories:** "Dance", "Sports", "the Dead".
- **Specific User Examples:** "Any Baby Can", "Austin Diaper Bank", "Kickoff Show", "Anniversary", "Album Release".
- **Sports:** NCAA, NFL, NBA, MLB.

### 2. Automatic Feed Cleanup
Integrated the filter into the [Discovery Page](file:///c:/Users/kp/Documents/spectral-soundworks-app/src/app/leads/discover/page.tsx). Now, when the Mohawk crawler (or any venue crawler) finishes:
- It automatically evaluates every result against the bunk list.
- It console logs which results were filtered for transparency.
- The final list shown in the dashboard is clean and artist-focused.

## Verification Results

| Input Sample | Result | Reason |
| :--- | :--- | :--- |
| `DJ Set from Ramesh` | ❌ Filtered | Keyword: "DJ Set" |
| `HBO QUIZZO: Mad Men` | ❌ Filtered | Keyword: "Quizzo" |
| `GOLDEN: A K Pop Kids Party` | ❌ Filtered | Keyword: "Kids Party" |
| `Sports` | ❌ Filtered | Generic Category Match |
| `The Strokes` | ✅ Kept | No bunk keywords detected |

> [!TIP]
> You can see exactly how many items were removed by checking the browser's developer console after a search finishes. It will log: `[DISCOVERY] Original: X, Filtered: Y`.
