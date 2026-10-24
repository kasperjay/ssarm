# Original User Request

## 2026-10-24T03:53:35Z

Wire up the production need qualification aspect of the lead scoring mechanism in Spectral Soundworks so that an automatic scan of available lead data identifies production-need signals and assigns a "POSSIBLE" qualification, while manual operator review and editing in the UI can elevate or adjust the qualification to "CLEAR".

Working directory: /home/workspace/ss-app
Integrity mode: development

## Requirements

### R1. Automatic Production Need Signal Screening
Implement shared signal detection logic that scans available lead data (Instagram post captions, artist bio, recent Spotify releases) for production-need signals. When signals are detected automatically, the lead's production need level must be set to `POSSIBLE` (never automatically promoted to `CLEAR`), and all detected evidence items and scan timestamp must be recorded. Leads with no matching signals remain `NONE`.

### R2. Automatic Triggering During Scoring & CLI Workflows
Ensure the automatic signal scan runs whenever a lead is scored or re-scored (`src/lib/scoring.ts`, `scripts/score-leads.js`, `scripts/score-auto.js`) and via the standalone screening script (`scripts/screen-production-needs.js`). Re-scoring must preserve existing manual `CLEAR` qualifications unless explicitly reset or expired per freshness rules (45-day cutoff).

### R3. Integration with Lead Scoring Core (`scoring-core.js`)
Incorporate production need into `calculateLeadScoreFromData` in `src/lib/scoring-core.js` and its type definitions. Production need levels award designated points (+8 points for `POSSIBLE`, +25 points for `CLEAR`, 0 for `NONE`), subject to the overall 100-point score cap. Include production need points and evidence in `scoreRationale`.

### R4. Manual Operator Review & Elevation to "CLEAR"
Ensure the UI (`src/components/ProductionNeedPanel.tsx`) and underlying server actions (`src/app/leads/[id]/actions.ts`) allow operators to view detected signals, elevate a `POSSIBLE` qualification to `CLEAR`, adjust evidence items, add review notes, or reset to `NONE`. Any manual edit must update `productionNeedLevel`, `productionNeedApprovedAt`, trigger score re-calculation, and log an activity audit note.

### R5. Automated Test Suite
Provide comprehensive automated tests covering:
- Signal scanner logic (detecting caption, bio, and release signals; verifying that automated scans only assign `POSSIBLE` and never `CLEAR`).
- Score calculation in `scoring-core` with `POSSIBLE` (+8) and `CLEAR` (+25), verifying the 100-point cap and score rationale text.
- Freshness / expiration rules for production need points.
- Manual transition state updates from `POSSIBLE` to `CLEAR`.

## Acceptance Criteria

### Signal Scanner & Automation
- [ ] Automated scanner inspects Instagram captions, artist bio, and Spotify release activity for production-need keywords and patterns.
- [ ] Automated screening assigns `POSSIBLE` when one or more signals match; it never assigns `CLEAR`.
- [ ] Leads with no signals remain at `NONE` (0 pts).
- [ ] Both automated lead scoring workflows (`src/lib/scoring.ts`, `scripts/score-auto.js`, `scripts/score-leads.js`) and `scripts/screen-production-needs.js` execute the screening logic.
- [ ] Detected evidence items and approval/scan timestamps are stored in `Lead.productionNeedEvidence` and `Lead.productionNeedApprovedAt`.

### Lead Scoring Core Integration
- [ ] `calculateLeadScoreFromData` accepts production need input and adds +8 points for `POSSIBLE` and +25 points for `CLEAR`.
- [ ] Total lead score is strictly capped at 100 points regardless of base score and production need points.
- [ ] `scoreRationale` includes an explicit explanation of production need points and evidence.
- [ ] Expired production need qualifications (older than 45 days) award 0 points until re-evaluated or re-approved.

### Manual Review & UI
- [ ] Operators can promote a lead from `POSSIBLE` to `CLEAR` or edit evidence lines via the Lead Details UI (`ProductionNeedPanel`).
- [ ] Manual changes update `productionNeedApprovedAt`, re-calculate the lead's score, and log an activity record.

### Verification & Test Suite
- [ ] Automated test suite (e.g. `npm run test` or `node --test`) passes with tests covering signal detection, scoring points, cap enforcement, and qualification transitions.
- [ ] Existing scoring tests and priority queue tests continue to pass without regression.
