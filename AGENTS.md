# Automated Agents

This document describes the automated agents and scripts available for operating Spectral Soundworks.

## Lead Scoring Agent

**File:** `scripts/score-leads.js`

**Purpose:** Automatically calculate lead quality scores based on artist metrics.

### Scoring Algorithm

Leads are scored on a 0-100 scale based on five factors:

| Factor | Points | Calculation |
|--------|--------|-------------|
| Follower Count | 0-30 | Capped at 10k followers = 30 points |
| Release Recency | 0-20 | Based on `lastPostAt` (180-day window) |
| Release Count | 0-20 | Capped at 3+ releases = 20 points |
| Data Completeness | 0-15 | % of key fields filled (Instagram, Spotify, genre, location, bio) |
| Engagement Signals | 0-10 | Has Instagram handle, quality bio, multiple emails, official site |
| Genre Bonus | 0-5 | Award bonus if genre is populated |

**Total:** 0-100 points

### CLI Usage

```bash
# Score unscored leads (default: limit 100)
npm run score

# Score all leads (rescore existing)
npm run score -- --all

# Score specific number of leads
npm run score -- --limit 50

# Score specific lead statuses
npm run score -- --filter-status NEW,QUALIFIED

# Preview changes without saving (dry-run)
npm run score -- --dry-run

# Combine options
npm run score -- --limit 25 --filter-status NEW --dry-run
```

### Output

The script updates `Lead.score` and `Lead.scoreRationale` fields with:
- **score**: Numeric value (0-100)
- **scoreRationale**: Human-readable explanation, e.g. `"12,450 followers (30pts); active posting (14d ago, 20pts); 5 releases (20pts); ..."`

### Example

```
🎯 Lead Scoring Engine
Mode: LIVE | Unscored only | Limit: 100

Scoring 47 leads...

📊 Results:
  Scored: 47
  Updated: 47
  Errors: 0

Sample changes (first 5):
  Rising Moon: null → 82
    → 8,750 followers (26pts); active posting (8d ago, 20pts); 4 releases (20pts); ...
  Echo Valley: null → 61
    → 3,200 followers (10pts); active posting (45d ago, 16pts); 2 releases (13pts); ...
```

### Notes

- **Idempotent:** Safe to run multiple times on the same data
- **Deterministic:** Same input always produces same score
- **Rationale:** Designed for human review and lead prioritization
- **Extensible:** Easy to add new scoring factors (e.g., engagement metrics, genre affinity)

### Requirements

- PostgreSQL database with schema migrated
- All artist data should be enriched (follower counts, release info, etc.) before scoring
- Works best after running `npm run backfill:enrich` on new leads

---

## Planned Agents

- **Follow-Up Agent** — Auto-trigger follow-ups based on lead status & dates
- **Bulk Outreach Agent** — Generate & send batches of personalized messages
- **Email Discovery Agent** — Deep-scan artist sites for contact info
- **Instagram Post Analyzer** — Analyze post sentiment & engagement patterns
- **Documentation Updater** — Keep README & schema docs synchronized
