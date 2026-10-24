CREATE TYPE "ProductionNeedLevel" AS ENUM ('NONE', 'POSSIBLE', 'CLEAR');
CREATE TYPE "FollowUpActionType" AS ENUM ('EMAIL', 'DM', 'CALL', 'RESEARCH', 'OTHER');

ALTER TABLE "Lead"
ADD COLUMN "followUpActionType" "FollowUpActionType",
ADD COLUMN "productionNeedLevel" "ProductionNeedLevel" NOT NULL DEFAULT 'NONE',
ADD COLUMN "productionNeedEvidence" JSONB,
ADD COLUMN "productionNeedEvidenceNote" TEXT,
ADD COLUMN "productionNeedApprovedAt" TIMESTAMP(3),
ADD COLUMN "productionNeedSource" JSONB;
