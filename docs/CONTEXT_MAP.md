# Context Map & Downstream Subagent Execution Contracts

**Target Subagents**: `fullstack-craftsman`, `quality-guardian`  
**Application**: Spectral Soundworks (`ss-app`)  
**Stack**: Next.js 16, React 19, Tailwind CSS v4, Prisma 7, PostgreSQL  
**Version**: 2.0.0  
**Date**: 2026-10-25  

---

## 1. Domain Types & Shared Enums (`src/lib/types.ts`)

```typescript
export type ProjectWorkflowStage =
  | "IN_MIXING"
  | "MIX_APPROVED"
  | "IN_MASTERING"
  | "MASTERED"
  | "COMPLETED";

export type FileCategory =
  | "FINAL_MASTER"
  | "FINAL_MIX"
  | "STEMS"
  | "TRACK_OUTS"
  | "INSTRUMENTAL"
  | "ACAPELLA"
  | "REFERENCE"
  | "OTHER";

export type AudioFormat =
  | "WAV"
  | "MP3"
  | "AIFF"
  | "FLAC"
  | "ZIP"
  | "OTHER";

export type SampleRate =
  | "SR_44_1_KHZ"
  | "SR_48_KHZ"
  | "SR_88_2_KHZ"
  | "SR_96_KHZ"
  | "NOT_APPLICABLE";

export type BitDepth =
  | "BIT_16"
  | "BIT_24"
  | "BIT_32_FLOAT"
  | "NOT_APPLICABLE";

export type FeedbackAuthorRole = "ARTIST" | "ENGINEER";

export type PaymentMethod =
  | "STRIPE"
  | "APPLE_PAY"
  | "PAYPAL"
  | "VENMO"
  | "CHIME"
  | "CASH_APP"
  | "WIRE"
  | "OTHER";

export type InvoiceStatus = "DRAFT" | "ISSUED" | "PAID" | "VOID";

export interface FeedbackMarker {
  id: string;
  fileId: string;
  timestamp: number;
  content: string;
  resolved: boolean;
  authorRole: FeedbackAuthorRole;
  authorName?: string | null;
  createdAt: string;
  replies?: FeedbackMarker[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPriceCents: number;
  amountCents: number;
}

export interface InvoiceTemplatePreset {
  id: string;
  name: string;
  code: string;
  description: string;
  category: "MIXING" | "MASTERING" | "PACKAGES" | "CUSTOM";
  lineItems: InvoiceLineItem[];
  suggestedPriceCents: number;
}
```

---

## 2. Server Action API Contracts

### 2.1 Artist Portal Server Actions (`src/app/portal/[token]/actions.ts`)

```typescript
"use server";

/**
 * 1. Submit Timestamped Feedback Note on an Audio Track
 */
export async function submitFeedback(
  projectId: string,
  token: string,
  content: string,
  fileId?: string,
  timestamp?: number,
  authorRole: FeedbackAuthorRole = "ARTIST",
  authorName?: string,
  parentFeedbackId?: string
): Promise<{ success: boolean; feedbackId: string }>;

/**
 * 2. Mix Approval for Mastering Sign-off
 * Transitions workflowStage to 'MIX_APPROVED', marks mixApprovedForMastering = true,
 * and records signer audit log.
 */
export async function approveMixForMastering(
  projectId: string,
  token: string,
  signerName: string,
  approvalNotes?: string
): Promise<{ success: boolean; approvedAt: string }>;

/**
 * 3. Mandatory Rating & Review Submission Gate
 * Unlocks deliverables by fulfilling Gate 2. Sets rating, review, and ratingSubmittedAt.
 */
export async function submitRating(
  projectId: string,
  token: string,
  rating: number, // 0 to 5
  review?: string
): Promise<{ success: boolean; completedAt: string }>;

/**
 * 4. Submit Payment Method Intent or Confirmation Reference
 * Records peer-to-peer transaction reference (Venmo, PayPal, Chime) or notifies engineer.
 */
export async function submitPaymentReference(
  projectId: string,
  token: string,
  method: PaymentMethod,
  paymentReference?: string,
  paymentNotes?: string
): Promise<{ success: boolean }>;
```

### 2.2 Studio Engineer Actions (`src/app/projects/actions.ts`)

```typescript
"use server";

/**
 * 1. Toggle Deliverables Paywall Protection
 */
export async function toggleDeliverablePaywall(
  projectId: string,
  paywallDeliverables: boolean
): Promise<{ success: boolean; paywallDeliverables: boolean }>;

/**
 * 2. Update Project Workflow Stage
 */
export async function updateProjectWorkflowStage(
  projectId: string,
  stage: ProjectWorkflowStage
): Promise<{ success: boolean; stage: ProjectWorkflowStage }>;

/**
 * 3. Mark Invoice as Paid & Log Settlement Rail
 */
export async function recordInvoicePayment(
  invoiceId: string,
  projectId: string,
  paymentMethod: PaymentMethod,
  paymentReference?: string,
  paymentNotes?: string
): Promise<{ success: boolean; paidAt: string }>;

/**
 * 4. Upsert Project Invoice with Template Support
 */
export async function upsertProjectInvoice(
  projectId: string,
  payload: {
    templateId?: string;
    dueAt?: string;
    tax?: string;
    notes?: string;
    stripePaymentUrl?: string;
    venmoHandle?: string;
    paypalUrl?: string;
    chimeTag?: string;
    lineItems: Array<{
      description: string;
      quantity: string;
      unitPrice: string;
    }>;
  }
): Promise<{ success: boolean }>;

/**
 * 5. Update File Metadata (Category, Format, SampleRate)
 */
export async function updateProjectFileMetadata(
  fileId: string,
  projectId: string,
  patch: {
    category?: FileCategory;
    format?: AudioFormat;
    sampleRate?: SampleRate;
    bitDepth?: BitDepth;
  }
): Promise<{ success: boolean }>;
```

---

## 3. REST API Route Contracts

### 3.1 Protected Download Route (`GET /api/portal/[token]/download/[fileId]`)
- **Purpose**: Verifies Dual-Gate (Paywall + Rating) before streaming file or returning storage redirect.
- **Authorization Rule**:
  ```typescript
  const isPaid = !project.paywallDeliverables || (project.invoice && project.invoice.paidAt !== null);
  const isRated = project.rating !== null && project.ratingSubmittedAt !== null;
  if (file.type === "DELIVERABLE" && (!isPaid || !isRated)) {
    return NextResponse.json(
      { error: "Deliverables are locked pending payment settlement or mandatory review" },
      { status: 403 }
    );
  }
  ```
- **Response**:
  - `200 OK`: File stream with proper `Content-Type` and `Content-Disposition: attachment; filename="..."`
  - `403 Forbidden`: Gating violation
  - `404 Not Found`: Invalid file or token

### 3.2 Dynamic Bundle Streaming (`GET /api/portal/[token]/bundle`)
- **Query Parameters**:
  - `category` (optional, default: `ALL`)
  - `format` (optional, default: `ALL`)
  - `sampleRate` (optional, default: `ALL`)
- **Authorization**: Enforces identical Dual-Gate verification as single download.
- **Response**:
  - `200 OK`: `application/zip` stream. `Content-Disposition: attachment; filename="[Project_Title]_Deliverables.zip"`.
  - `403 Forbidden`: If deliverables are locked.

### 3.3 Enhanced Upload Route (`POST /api/upload`)
- **Payload**: `FormData` containing:
  - `file`: File
  - `projectId`: string
  - `type`: `"WORKING" | "DELIVERABLE"`
  - `category`: `FileCategory` (optional)
  - `format`: `AudioFormat` (optional)
  - `sampleRate`: `SampleRate` (optional)
  - `bitDepth`: `BitDepth` (optional)
- **Action**: Extracts normalized waveform peaks (`waveformPeaks`), file duration, writes to storage, and persists `ProjectFile`.

---

## 4. UI Component Contracts

### 4.1 `AudioWaveformPlayer.tsx`
```typescript
interface AudioWaveformPlayerProps {
  fileUrl: string;
  fileId: string;
  fileName: string;
  projectId: string;
  token?: string;
  feedbacks: FeedbackMarker[];
  peaks?: number[] | null;
  onAddFeedback: (content: string, timestamp: number, authorName?: string) => Promise<void>;
  onResolveFeedback?: (feedbackId: string) => Promise<void>;
  readOnly?: boolean;
}
```

### 4.2 `MixApprovalBanner.tsx`
```typescript
interface MixApprovalBannerProps {
  projectId: string;
  portalToken: string;
  workflowStage: ProjectWorkflowStage;
  mixApprovedForMastering: boolean;
  mixApprovedAt?: string | null;
  mixApprovedBy?: string | null;
  mixApprovalNotes?: string | null;
  unresolvedFeedbackCount: number;
}
```

### 4.3 `DeliverableGatedSection.tsx`
```typescript
interface DeliverableGatedSectionProps {
  projectId: string;
  portalToken: string;
  deliverables: ProjectFileItem[];
  paywallDeliverables: boolean;
  invoice: ProjectInvoiceItem | null;
  rating: number | null;
  ratingSubmittedAt: string | null;
}
```

### 4.4 `MultiFormatFilterBar.tsx`
```typescript
interface MultiFormatFilterBarProps {
  activeCategory: "ALL" | FileCategory;
  activeFormat: "ALL" | "WAV" | "MP3";
  activeSampleRate: "ALL" | "SR_44_1_KHZ" | "SR_48_KHZ";
  onCategoryChange: (cat: "ALL" | FileCategory) => void;
  onFormatChange: (fmt: "ALL" | "WAV" | "MP3") => void;
  onSampleRateChange: (sr: "ALL" | "SR_44_1_KHZ" | "SR_48_KHZ") => void;
  totalFilteredCount: number;
  totalFilteredBytes: number;
  onDownloadAllFiltered: () => void;
  isUnlocked: boolean;
}
```

### 4.5 `PaymentMethodModal.tsx`
```typescript
interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    invoiceNumber: string;
    totalCents: number;
    currency: string;
    stripePaymentUrl?: string | null;
    venmoHandle?: string | null;
    paypalUrl?: string | null;
    chimeTag?: string | null;
  };
  portalToken: string;
  projectId: string;
  onConfirmReference: (method: PaymentMethod, reference: string) => Promise<void>;
}
```

### 4.6 `StarRatingModal.tsx`
```typescript
interface StarRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  portalToken: string;
  initialRating?: number;
  initialReview?: string;
  onSubmit: (rating: number, review: string) => Promise<void>;
}
```
