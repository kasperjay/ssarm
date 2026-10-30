# Product Requirements Document (PRD)

**Project**: Spectral Soundworks — Client Project Portal & Invoicing Architecture  
**Document Version**: 2.0.0  
**Status**: APPROVED FOR IMPLEMENTATION  
**Target Stack**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Prisma 7, PostgreSQL  
**Date**: 2026-10-25  

---

## 1. Executive Summary
The Spectral Soundworks Client Project Portal is the core client-facing collaboration and monetization interface for audio engineering clients (recording artists, producers, and record labels). It replaces disjointed Google Drive folders, email threads, and manual payment requests with an integrated, high-fidelity experience featuring:
1. Interactive audio waveform playback with millisecond-accurate timestamped revision comments.
2. Formal Mix Approval sign-off gate before entering mastering.
3. Dual-layer deliverable gating (paywall protection against unpaid stems + mandatory 0-5 star review collection).
4. Global multi-format download matrix (WAV, MP3, 44.1 kHz, 48 kHz, stems, track-outs).
5. Multi-rail payment checkout (Stripe, Apple Pay, PayPal, Venmo, Chime) with studio package invoice presets.
6. Unified artist project and payment history ledger.

---

## 2. Problem Statement & User Personas

### 2.1 Problem Statement
- **Revision Ambiguity**: Artists leave vague revision notes ("make the vocal pop around the chorus") without exact time markers, causing multiple unnecessary revision iterations.
- **Mastering Premature Starts**: Mastering begins before the artist finishes mix tweaks, resulting in re-mastering fees and wasted studio compute time.
- **Revenue Leakage & Uncollected Testimonials**: Unprotected download links allow clients to download final master files before settling remaining balances, and clients rarely return to leave star ratings/reviews once they possess files.
- **Format Inefficiency**: Audio deliverables need multiple formats (streaming 44.1kHz, film/sync 48kHz, lossless WAV, MP3 previews, multitrack stems). Artists are confused by file lists and must repeatedly request specific formats.
- **Payment Friction**: Rigid card-only invoicing causes delays for indie artists who prefer Venmo, PayPal, or Chime peer-to-peer rails.

### 2.2 Target Personas

| Persona | Role | Key Needs | Pain Points |
|---|---|---|---|
| **Marcus Vance** | Independent Hip-Hop / R&B Artist | Wants to listen to mix bounces on mobile/desktop, leave notes at specific beat drops, pay with Apple Pay or Venmo, and download 24-bit WAV masters + instrumental tracks. | Annoyed when engineers miss feedback timecodes; forgets which files are final masters vs rough bounces. |
| **Elena Rostova** | Indie Label Producer / Manager | Manages 3 artist projects simultaneously; needs clean invoice breakdowns, downloadable tax receipts, stem packages for sync licensing (48 kHz 24-bit), and official mix sign-offs. | Struggles tracking invoice payment statuses across multiple singles; needs official approval timestamps for contract milestones. |
| **Julian Cole** | Chief Audio Engineer (Spectral Soundworks) | Wants to protect high-res masters behind paid invoices, collect portfolio reviews automatically, streamline revision queues, and issue studio package invoices in 10 seconds. | Chasing unpaid invoices after delivering masters; repeatedly re-exporting different sample rates on demand. |

---

## 3. Goals & Non-Functional Requirements (NFR) Budgets

### 3.1 Business & Product Goals
1. **Reduce Revision Turnaround Time by 50%**: Exact waveform timestamp markers eliminate ambiguous feedback loops.
2. **100% Invoice Settlement Prior to Final Delivery**: Zero deliverable master files accessed without invoice payment clearance (when paywall enabled).
3. **90%+ Review Capture Rate**: Mandatory rating gate collects 0-5 star feedback and testimonials at the moment of highest client satisfaction (file delivery).
4. **Sub-60s Invoice Generation**: Studio package presets (Single Mix, Single Master, Mix & Master, EP) auto-fill line items and pricing instantly.

### 3.2 Non-Functional Requirements (NFR)

| Metric | Target Budget | Enforcement Strategy |
|---|---|---|
| **Audio Waveform First Paint** | < 150 ms | Store precomputed 100-point normalized waveform peaks (`waveformPeaks` JSON) in DB; render SVG/Canvas immediately without downloading entire audio buffer. |
| **Seek & Scrub Latency** | < 50 ms | Direct HTML5 Audio `currentTime` manipulation; memoized active feedback marker collisions. |
| **Download Gate Authorization** | < 80 ms | Next.js Server Route checks project paywall status and rating status in a single indexed query before streaming file or issuing presigned URL. |
| **Mobile Responsiveness** | 100% viewport compliant | Touch-friendly waveform scrubbing (minimum 44px hit-target), bottom sheet comments, sticky payment CTA. |
| **Security & Authorization** | Zero Leakage | Signed portal token access (`portalToken` cuid); deliverable files routed through protected download proxy enforcing paywall + rating checks. |

---

## 4. System Feature Specifications

### 4.1 Feature 1: Audio Player & Timestamped Revision Comments
- **Functional Requirements**:
  1. Displays an interactive audio player with waveform visualization, playback controls (Play/Pause, Seek, Current Time, Duration, Mute/Volume).
  2. Pinpoints comments directly on the waveform timeline using circular numbered badge markers.
  3. Clicking any comment marker on the waveform or any item in the revision feed immediately seeks the audio player to that exact millisecond (`audio.currentTime = fb.timestamp`) and begins playback.
  4. Active timestamp marker highlights in accent color `#00f2ff` / `#ff0080` with smooth transition.
  5. Artist can pause or scrub to any position, click "Add Note at [mm:ss]", enter revision notes, and submit.
  6. Feedback items support engineer resolution status (`resolved: Boolean`), timestamp formatting (`[mm:ss]`), author name, and optional reply threads.
- **Acceptance Criteria**:
  - Clicking a comment at `01:42` sets audio player `currentTime` to `102` seconds and triggers playback.
  - Waveform scrubber smoothly tracks playback progress without UI stutter (60 FPS requestAnimationFrame).
  - Works on both desktop and mobile browsers.

### 4.2 Feature 2: Mix Approval for Mastering Workflow
- **Functional Requirements**:
  1. Project lifecycle tracking via `workflowStage`:
     `IN_MIXING` ➔ `MIX_APPROVED` ➔ `IN_MASTERING` ➔ `MASTERED` ➔ `COMPLETED`.
  2. In the Client Portal, when `workflowStage === 'IN_MIXING'`, a prominent **"Approve Mix for Mastering"** sign-off banner appears.
  3. Clicking initiates a confirmation modal detailing:
     - All resolved/unresolved revision notes.
     - Confirmation checkbox: *"I confirm that this mix bounce is finalized and ready for the mastering chain."*
     - Artist signer name input and optional sign-off notes.
  4. Upon submission:
     - Sets `Project.mixApprovedForMastering = true`.
     - Records `Project.mixApprovedAt = now()`, `Project.mixApprovedBy = name`, `Project.mixApprovalNotes = notes`.
     - Transitions `Project.workflowStage = 'MIX_APPROVED'`.
     - Logs milestone to `ProjectActivityLog`.
     - Replaces sign-off button with a read-only verified milestone badge: *"Mix approved for mastering on [Date] by [Signer]"*.
     - Alerts the studio engineer via project activity and dashboard notifications.

### 4.3 Feature 3: Mandatory Feedback & 0-5 Star Rating Gate + Paywall Protection
- **Functional Requirements**:
  1. **Deliverable Paywall Gate**:
     - `Project.paywallDeliverables: Boolean` (configurable by engineer in `/projects/[id]`, default `true`).
     - If `paywallDeliverables === true`, deliverables are locked until `ProjectInvoice.paidAt !== null` (or project has no invoice).
     - Locked status displays an Amber Lock Card: *"Deliverables Locked — Invoice #INV-XXX Pending ($Total). Settle payment to unlock your master files."* with a "Pay Now" button linking to `/portal/[token]/invoice`.
  2. **Mandatory 0-5 Star Rating Gate**:
     - Even after invoice payment (or if paywall is disabled), final deliverables remain locked until the artist submits a rating (0 to 5 stars) and optional feedback note.
     - Displays an Cyan Review Card: *"Deliverables Locked — Final Quality Review Required. Please rate your experience with Spectral Soundworks to immediately unlock all master downloads."*
     - Clicking triggers an interactive Star Rating Modal (0 to 5 glowing neon stars + testimonial text area).
     - Submitting saves `Project.rating` (Int 0-5), `Project.review` (String), `Project.ratingSubmittedAt` (DateTime), and transitions status to `COMPLETED`.
  3. **Instant Unlock**:
     - Once both gates pass (`(!paywallDeliverables || isPaid) && ratingSubmitted`), deliverable cards transition to "Unlocked" state, revealing active download links and multi-format batch selectors.
  4. **Server-Side Enforcement**:
     - Direct file download URL `/api/portal/[token]/download/[fileId]` performs server-side checks. Requests to locked deliverable files are blocked with HTTP `403 Forbidden`.

### 4.4 Feature 4: Multi-Format Downloads (Stems, Track Outs, Final Mix, Final Master)
- **Functional Requirements**:
  1. Project files are classified by:
     - `category`: `FINAL_MASTER` | `FINAL_MIX` | `STEMS` | `TRACK_OUTS` | `INSTRUMENTAL` | `ACAPELLA` | `REFERENCE` | `OTHER`
     - `format`: `WAV` | `MP3` | `AIFF` | `FLAC` | `ZIP` | `OTHER`
     - `sampleRate`: `SR_44_1_KHZ` (44.1 kHz) | `SR_48_KHZ` (48 kHz) | `SR_88_2_KHZ` (88.2 kHz) | `SR_96_KHZ` (96 kHz) | `NOT_APPLICABLE`
     - `bitDepth`: `BIT_16` | `BIT_24` | `BIT_32_FLOAT` | `NOT_APPLICABLE`
  2. **Global Filter Bar**:
     - Above the deliverables grid, three sticky filter segments allow the artist to configure their download view in one click:
       - **Category Segment**: `[All Assets]` | `[Masters]` | `[Mixes]` | `[Stems]` | `[Track Outs]` | `[Instrumentals]`
       - **Format Segment**: `[All Formats]` | `[WAV (Lossless)]` | `[MP3 (320k)]`
       - **Sample Rate Segment**: `[All Rates]` | `[44.1 kHz (Streaming)]` | `[48 kHz (Film/Video)]`
     - Selection is preserved across portal navigation via URL query params or local state.
  3. **Batch Download Action**:
     - A master "Download Filtered Package" button triggers sequential downloads or calls `/api/portal/[token]/bundle?format=...&sampleRate=...` to generate a dynamic ZIP archive containing all matching deliverables.

### 4.5 Feature 5: Invoicing & Payment Integrations
- **Functional Requirements**:
  1. **Selectable Payment Method Modal**:
     - When an artist clicks "Pay Now" on `/portal/[token]/invoice`, a modern payment method selection sheet opens with 5 rails:
       1. **Stripe (Card / Apple Pay / Google Pay)**: Direct integration with Stripe Checkout or Stripe Elements.
       2. **Apple Pay**: Dedicated Express Apple Pay trigger via Stripe Web SDK.
       3. **PayPal**: Opens studio PayPal checkout link or displays PayPal QR code with `paypal.me/spectralsoundworks/[amount]`.
       4. **Venmo**: Displays studio Venmo handle (`@spectralsoundworks`), clickable deep link `venmo://paycharge?txn=pay&recipients=spectralsoundworks&amount=[amount]&note=[invoiceNumber]`, and QR code.
       5. **Chime**: Displays Chime tag (`$SpectralSoundworks`), routing/account instructions, and one-click copy button.
     - Artist can select their method, view instructions, and submit transaction confirmation reference.
     - Studio engineer can verify and mark invoice as paid with one click in `/projects/[id]/invoice`, logging the payment method and transaction ID.
  2. **Pre-Populated Studio Package Invoice Templates**:
     - Studio engineer has access to package presets in `/projects/[id]/invoice`:
       - **Single Track Mix**: 1 Track, up to 48 stems, 3 revision rounds ($300.00).
       - **Single Track Master**: 1 Track, WAV (44.1/48kHz), 320kbps MP3, streaming specs ($85.00).
       - **Mix & Master Single Package**: Full Mix + Stereo Master + Instrumental + Stems ($375.00).
       - **EP Production Package (4-5 Songs)**: Multi-track mix & master bundle ($1,400.00).
       - **Full Album Package (10-12 Songs)**: Complete mix & master, DDP image ($3,200.00).
       - **Custom Blank Template**: Empty line item builder.
     - Selecting a template replaces/appends line items, unit prices, notes, and suggested payment links.

### 4.6 Feature 6: Artist Project & Payment History
- **Functional Requirements**:
  1. **Dedicated History & Ledger View** (`/portal/[token]/history` and `/portal/[token]/billing`):
     - Displays all current and historical projects for this artist (querying by `artistId`).
     - Shows each project's title, creation date, status (`ACTIVE`, `COMPLETED`), rating given, and direct link to that project's portal.
  2. **Financial Ledger & Receipts**:
     - Chronological list of all invoices issued to this artist.
     - Displays Invoice #, Project Name, Date Issued, Amount, Status (`Paid` / `Unpaid`), and Payment Method used.
     - "View Receipt" button generates a clean, printable/downloadable receipt with studio header, date, breakdown, and transaction reference.
  3. **Project Lifecycle Timeline**:
     - Visual vertical timeline displaying milestones:
       - 🟢 Project Initiated
       - 🟢 Working Bounces Uploaded
       - 🟢 Revision Notes Resolved
       - 🟢 Mix Officially Approved for Mastering
       - 🟢 Final Master Files Uploaded
       - 🟢 Invoice Paid ($Amount via Method)
       - 🟢 5-Star Review Completed
       - 🟢 Deliverables Downloaded

---

## 5. Security, Access Control & Error Resilience
1. **Token Authentication**: Client portal routes authenticate using high-entropy `portalToken` (CUID / UUIDv4). No artist password is required, preventing login friction.
2. **Server-Side Download Authorization**:
   ```typescript
   if (file.type === "DELIVERABLE") {
     const isPaid = !project.paywallDeliverables || (project.invoice && project.invoice.paidAt !== null);
     const isRated = project.rating !== null && project.ratingSubmittedAt !== null;
     if (!isPaid || !isRated) {
       return new Response("Deliverables locked", { status: 403 });
     }
   }
   ```
3. **Idempotent Payment Actions**: Marking an invoice paid creates an immutable `ProjectActivityLog` record and updates `ProjectInvoice.paidAt`.

---

## 6. Testing & Quality Acceptance Matrix

| Feature | Test Case | Expected Behavior |
|---|---|---|
| **Audio Player** | Click comment at `01:15` | Audio jumps to 75s, waveform playhead moves to position, audio starts playing. |
| **Mix Approval** | Artist clicks "Approve Mix for Mastering" | Updates `mixApprovedForMastering = true`, records timestamp and signer, transitions stage to `MIX_APPROVED`. |
| **Paywall Gate** | `paywallDeliverables = true` & invoice unpaid | Deliverables card shows Amber Lock. Download links disabled. Server route returns 403. |
| **Rating Gate** | Invoice paid but rating is null | Deliverables card shows Cyan Lock. Submitting 5-star rating unlocks deliverables immediately. |
| **Multi-Format** | Select "WAV" + "48 kHz" filter tabs | Only files matching format `WAV` and sample rate `48 kHz` are displayed in the deliverables list. |
| **Payment Modal** | Click "Pay Now" on invoice | Modal presents Stripe, Apple Pay, PayPal, Venmo, Chime with copyable handles and QR codes. |
| **Templates** | Select "Mix & Master Single" preset | Form auto-populates 3 line items ($375.00 total) with standard studio terms. |
| **History** | Open `/portal/[token]/history` | Renders all past projects for the artist, invoice ledger, and printable receipts. |
