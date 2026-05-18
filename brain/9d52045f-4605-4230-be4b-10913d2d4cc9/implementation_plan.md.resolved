# Spectral Soundworks Next Steps Implementation Plan (Part 2)

This plan covers the remaining roadmap items (5, 6, and 7) outlined in `AGENTS.md`. These tasks focus heavily on data safety, traceability, and documentation.

## Phase 3: Data Architecture & Safety (Tasks 5 & 6)

### 5. Structured Contact Confidence & Source Tracking
Currently, the contact discovery agent (`scripts/discover-contacts.js`) adds discovered emails directly to the `Artist.emails` array and creates an unstructured text note in the `Activity` feed. We will structure this to improve queryability and trust.

#### [MODIFY] `prisma/schema.prisma`
- Create a `ContactInfo` model:
  ```prisma
  model ContactInfo {
    id           String   @id @default(cuid())
    artistId     String
    email        String
    confidence   String   @default("uncertain") // verified, inferred, uncertain
    score        Int      @default(0)
    sourceUrl    String?
    sourceType   String?
    discoveredAt DateTime @default(now())

    artist       Artist   @relation(fields: [artistId], references: [id], onDelete: Cascade)
    @@unique([artistId, email])
  }
  ```
- Add the inverse `contactInfos ContactInfo[]` relation to the `Artist` model.

#### [MODIFY] `scripts/discover-contacts.js`
- Wrap the main function in `withAgentRun`.
- Update the discovery logic to insert `ContactInfo` records instead of just pushing strings to `Artist.emails`.
- Continue logging the discovery `Activity` note to the lead for user visibility.

### 6. Harden Duplicate Merge & Standardizations
Duplicate merging is inherently destructive. We need to persist proposals for review and ensure auditability when a merge does happen.

#### [MODIFY] `prisma/schema.prisma`
- Create a `MergeProposal` model:
  ```prisma
  model MergeProposal {
    id                String   @id @default(cuid())
    primaryArtistId   String
    duplicateArtistId String   @unique
    primaryName       String
    duplicateName     String
    similarityScore   Float
    confidence        String   // HIGH, MEDIUM, LOW
    reason            String
    status            String   @default("PENDING") // PENDING, APPLIED, REJECTED
    createdAt         DateTime @default(now())

    primaryArtist     Artist   @relation("PrimaryMergeProposals", fields: [primaryArtistId], references: [id], onDelete: Cascade)
    duplicateArtist   Artist   @relation("DuplicateMergeProposals", fields: [duplicateArtistId], references: [id], onDelete: Cascade)
  }
  ```

#### [MODIFY] `scripts/detect-duplicates.js`
- Change the default mode to **dry-run** (it currently defaults to live unless `--dry-run` is passed).
- Update the script to `upsert` pending `MergeProposal` records into the database when duplicates are detected.
- When a merge is actually executed (e.g., via `--auto-merge`), update the script to:
  - Add an `Activity` note to all leads associated with the primary artist noting that a merge occurred.
  - Store a JSON snapshot of the duplicate artist's fields in the Activity note for rollback purposes.
  - Mark the `MergeProposal` as `APPLIED`.
- Wrap the main execution in `withAgentRun`.

#### [MODIFY] `scripts/standardize-genres.js`
- Change the default mode to **dry-run** (unless `--live` is explicitly passed).
- Wrap the script in `withAgentRun`.

## Phase 4: Documentation (Task 7)

### 7. Replace README Boilerplate
The current repository README still contains the default `create-next-app` instructions.

#### [MODIFY] `README.md`
- Remove all Next.js boilerplate.
- Document the application architecture (Next.js, Prisma, PostgreSQL).
- Detail the environment variables required to run the system (`.env` setup).
- List and explain the available CLI Agent scripts (`npm run score`, `npm run discover:contacts`, etc.) and what they do.
- Explain the Docker-based launch process (`npm run launch`).

---

> [!IMPORTANT]
> **User Review Required**
> 
> - **Schema Migrations**: These changes involve adding two new tables (`ContactInfo` and `MergeProposal`). You will need to run the database migrations (`npm run db:migrate`) after I update the schema.
> - **Actionable Review**: This plan introduces `MergeProposals` to the database. We are not building a UI to review them in this iteration (per the roadmap), but you will be able to query them via the DB or implement a UI for them later.
> 
> Please review and approve this plan so we can execute Phases 3 and 4!
