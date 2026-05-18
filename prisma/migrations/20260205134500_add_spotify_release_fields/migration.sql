-- Add Spotify release metadata
ALTER TABLE "Release" ADD COLUMN "spotifyReleaseId" TEXT;
ALTER TABLE "Release" ADD COLUMN "releaseType" TEXT;

CREATE UNIQUE INDEX "Release_spotifyReleaseId_key" ON "Release"("spotifyReleaseId");
