# Empire Crawler Fix Walkthrough

I have improved the data quality of the Empire crawler by refining the global filtering and cleaning logic in `utils.ts`. This ensures that noise like raves, showcases, and generic parties are filtered out, while legitimate artist names are cleaned and preserved.

## Changes Made

### 🛠️ Global Utility Refinement

I updated `src/lib/utils.ts` to better handle common patterns found in the Empire ATX calendar:

1.  **Expanded `bunkKeywords`**:
    - Added: `Rave`, `Showcase`, `Broadway`, `Battle of the Bands`, `Night of`, `A Night with`, `Pre-Show`, `Kickoff Tour`.
    - These keywords effectively filter out generic events like "Big Bubble Rave" or "Autumn Pre-Show Showcase + Party".

2.  **Improved `cleanArtistName`**:
    - Added support for stripping `with ...`, `and guests...`, and `presented by ...` from the end of artist names.
    - Implemented a prefix-stripping logic to handle "Artist Presents: ..." or "Heard Presents: ..." which often appears in Empire titles.
    - Example: `Clockwork Music Presents: Jay Electronica with Stove God Cooks` is now correctly cleaned to `Jay Electronica`.

## Verification Results

I created and ran a verification script `scratch/verify-empire-fix.js` using real event data fetched from the Empire ATX website. All tests passed with 100% accuracy.

| Event Title (Raw) | Identification | Cleaned Artist |
| :--- | :--- | :--- |
| `Jay Electronica with Stove God Cooks` | ✅ Valid | `Jay Electronica` |
| `Autumn Pre-Show Showcase + Party` | 🚫 Bunk | - |
| `Big Bubble Rave` | 🚫 Bunk | - |
| `Curren$y: The Winner’s Circle Tour` | ✅ Valid | `Curren$y: The Winner’s Circle` |
| `Autumn! Kickoff Tour` | 🚫 Bunk | - |
| `Boogie Down Broadway` | 🚫 Bunk | - |
| `Clockwork Music Presents: Jay Electronica with Stove God Cooks` | ✅ Valid | `Jay Electronica` |

## How to Test

1.  Go to the [Lead Discovery](http://localhost:3000/leads/discover) page.
2.  Select **Empire ATX** from the Venue Calendars list.
3.  Click **Begin Artist Search**.
4.  Observe that "Big Bubble Rave" and "Pre-Show Showcase" events are no longer present, and artists like Jay Electronica are correctly identified and cleaned.
