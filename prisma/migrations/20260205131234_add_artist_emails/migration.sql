-- AlterTable
ALTER TABLE "Artist" ADD COLUMN     "emails" TEXT[] DEFAULT ARRAY[]::TEXT[];
