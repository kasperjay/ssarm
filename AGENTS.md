# Automated Agents

This document describes the automated agents and scripts available for operating Spectral Soundworks.

## ✅ Implemented Agents

### Lead Scoring Agent

**File:** `scripts/score-leads.js`

**Purpose:** Automatically calculate lead quality scores based on artist metrics.

**Scoring Algorithm** (0-100 scale):

- Follower Count: 0-30 points
- Release Recency: 0-20 points
- Release Count: 0-20 points
- Data Completeness: 0-15 points
- Engagement Signals: 0-10 points
- Genre Bonus: 0-5 points

**CLI Usage:**

```bash
npm run score                          # Score pending leads
npm run score -- --all                 # Score all leads
npm run score -- --limit 50            # Score 50 leads
npm run score -- --filter-status NEW   # Score specific statuses
npm run score -- --dry-run             # Preview changes
```

---

## 🚀 Planned Agents (TIER 1)

### 1. Data Enrichment & Staleness Agent

**File:** `scripts/enrich-stale.js`

**Status:** ✅ COMPLETE

**Purpose:** Keep artist profiles fresh by detecting stale data and triggering automatic enrichment.

**Features:**

- Detect stale Instagram data (>60 days since last post)
- Detect missing releases (>6 months)
- Detect engagement drops (follower count declining)
- Auto-trigger Spotify/Instagram refresh via `/api/ingest`
- Log all enrichment activities for audit trail
- Flag artists needing manual review

**CLI Usage:**

```bash
npm run enrich:stale                   # Check & refresh stale data
npm run enrich:stale -- --dry-run      # Preview changes
npm run enrich:stale -- --limit 20     # Limit to 20 artists
```

---

### 2. Event-Driven Lead Scoring

**File:** `scripts/score-auto.js`

**Status:** ✅ COMPLETE

**Purpose:** Automatically score leads when they're created or their data changes.

**Features:**

- Score new leads immediately upon creation
- Auto-flag QUALIFIED leads (score ≥60)
- Auto-update lead status based on score
- Maintain Activity log for audit trail
- Prevent duplicate scoring

**CLI Usage:**

```bash
npm run score:auto                     # Score pending leads
npm run score:auto -- --dry-run        # Preview changes
npm run score:auto -- --limit 50       # Score 50 leads
```

---

### 3. Follow-Up Reminder & Sequencing

**File:** `scripts/followup-remind.js`

**Status:** ✅ COMPLETE

**Purpose:** Ensure no leads fall through cracks; automate follow-up workflow.

**Features:**

- Monitor `nextActionAt` field across all leads
- Generate notifications for due follow-ups
- Suggest next contact tone based on recency
- Prevent duplicate outreach (check Activity log)
- Auto-transition stale leads from FOLLOW_UP → LOST
- Create activity logs for all actions
- Categorize by priority (high/normal)

**Tone Suggestions:**

- 0-3 days: "warm" (light touch)
- 4-7 days: "check-in" (friendly reminder)
- 8-14 days: "escalation" (more direct)
- 14+ days: "final-attempt" (persistence)

**CLI Usage:**

```bash
npm run followup:remind                # Check due follow-ups
npm run followup:remind -- --dry-run   # Preview changes
```

---

## Implementation Status

| Agent                       | Status      | File                            | Effort |
| --------------------------- | ----------- | ------------------------------- | ------ |
| Lead Scoring                | ✅ Complete | `scripts/score-leads.js`        | Done   |
| Data Enrichment & Staleness | ✅ Complete | `scripts/enrich-stale.js`       | Done   |
| Event-Driven Scoring        | ✅ Complete | `scripts/score-auto.js`         | Done   |
| Follow-Up Reminder          | ✅ Complete | `scripts/followup-remind.js`    | Done   |
| Contact Intelligence        | ✅ Complete | `scripts/discover-contacts.js`  | Done   |
| Campaign Analytics          | ✅ Complete | `scripts/report-campaign.js`    | Done   |
| Duplicate Detection         | ✅ Complete | `scripts/detect-duplicates.js`  | Done   |
| Genre Standardization       | ✅ Complete | `scripts/standardize-genres.js` | Done   |

---

## Architecture Notes

All agents:

- Connect via existing Prisma client to PostgreSQL
- Log activities to Activity table for audit/compliance
- Can run scheduled or on-demand
- Use existing integration libraries (Spotify, Instagram, email)
- Generate notifications for high-priority items
- Are testable with sample data before production deployment

Integration points:

- `/api/ingest` endpoint for triggering enrichment
- Existing `scripts/` for CLI tools
- Scheduled execution via GitHub Actions or cron
- Activity logging for complete audit trail

---

## 📋 TIER 2 Agents (Medium Priority)

### 4. Contact Intelligence & Email Discovery

**File:** `scripts/discover-contacts.js`

**Status:** ✅ COMPLETE

**Purpose:** Automatically discover and validate contact information for leads.

**Features:**

- Crawl artist websites for booking/contact emails
- Score contact confidence (verified/inferred/uncertain)
- Email format validation and pattern matching
- Prevents duplicate email entries
- Logs discovery activities for audit trail

**Confidence Scoring:**

- **Verified (85-95%)**: Official website contact pages
- **Inferred (60-75%)**: Band website, social profiles
- **Uncertain (40%)**: Pattern-matched emails

**CLI Usage:**

```bash
npm run discover:contacts                # Discover contacts for all leads
npm run discover:contacts -- --dry-run   # Preview without saving
npm run discover:contacts -- --limit 20  # Process 20 leads
npm run discover:contacts -- --missing   # Only process leads with no emails
```

---

### 5. Campaign Analytics & Reporting

**File:** `scripts/report-campaign.js`

**Status:** ✅ COMPLETE

**Purpose:** Track and analyze campaign performance across all leads.

**Features:**

- Calculate conversion funnel metrics
- Score distribution analysis (excellent/strong/moderate/weak)
- Tone effectiveness tracking
- Channel performance analytics (email/Instagram/phone/in-person)
- Segment identification:
  - **High Performers**: score ≥70 + contacted
  - **Underperformers**: score ≥60 but not yet contacted
  - **At-Risk**: FOLLOW_UP status with no activity 14+ days
- Generate detailed reports with optional deep dives

**Report Metrics:**

- Qualification rate, conversion rate
- Funnel stages (Qualified → Contacted → Follow-up → Converted)
- Score distribution breakdown
- Tone and channel effectiveness
- Actionable segment lists

**CLI Usage:**

```bash
npm run report:campaign              # Generate 7-day report
npm run report:campaign -- --days 30 # Generate 30-day report
npm run report:campaign -- --details # Include artist lists
```

---

## 📋 TIER 3 Agents (Low Priority)

### 6. Duplicate Artist Detection & Merging

**File:** `scripts/detect-duplicates.js`

**Status:** ✅ COMPLETE

**Purpose:** Catch and safely merge duplicate artist records before they cause data quality issues.

**Features:**

- Levenshtein distance algorithm for name similarity detection
- Spotify ID and Instagram handle matching
- Confidence-based categorization (high/medium/low)
- Safe merging strategy: consolidates data, preserves all leads and relationships
- Prevents duplicate emails in merged records

**Confidence Levels:**

- **High**: Exact Spotify ID or Instagram match
- **Medium**: 95%+ name similarity
- **Low**: 85-94% name similarity

**CLI Usage:**

```bash
npm run detect:duplicates              # Find potential duplicates
npm run detect:duplicates -- --dry-run # Preview without changes
npm run detect:duplicates -- --auto-merge # Auto-merge high confidence
npm run detect:duplicates -- --threshold 0.90 # Adjust similarity threshold
```

---

### 7. Genre Standardization

**File:** `scripts/standardize-genres.js`

**Status:** ✅ COMPLETE

**Purpose:** Normalize messy genre tags to a canonical taxonomy for consistent reporting.

**Features:**

- Canonical taxonomy with 12+ primary genres and 80+ aliases
- Partial matching and alias detection
- Categorizes genres: already standard, standardizable, invalid, missing
- Shows data quality metrics
- Logs fixes with rationale

**Canonical Genres:**

- electronic, hip-hop, rock, pop, r&b, country, jazz, classical, folk, metal, reggae, indie, experimental

**CLI Usage:**

```bash
npm run standardize:genres              # Analyze genre issues
npm run standardize:genres -- --dry-run # Preview without changes
npm run standardize:genres -- --auto-fix # Apply standardizations
npm run standardize:genres -- --taxonomy # Show canonical taxonomy
```

---

## Architecture Notes
