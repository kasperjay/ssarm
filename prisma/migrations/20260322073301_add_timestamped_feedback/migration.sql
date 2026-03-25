-- AlterTable
ALTER TABLE "ProjectFeedback" ADD COLUMN     "fileId" TEXT,
ADD COLUMN     "timestamp" DOUBLE PRECISION;

-- AddForeignKey
ALTER TABLE "ProjectFeedback" ADD CONSTRAINT "ProjectFeedback_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "ProjectFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
