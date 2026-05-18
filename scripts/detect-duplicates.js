#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../src/generated/prisma");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

// Load .env
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const rawValue = trimmed.slice(index + 1).trim();
    if (key && process.env[key] === undefined) {
      const value = rawValue.replace(/^['"]|['"]$/g, "");
      process.env[key] = value;
    }
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// String similarity utilities
function normalizeString(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "") // Remove special chars
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}

function levenshteinDistance(a, b) {
  const aLen = a.length;
  const bLen = b.length;
  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  const matrix = Array(aLen + 1)
    .fill(null)
    .map(() => Array(bLen + 1).fill(0));

  for (let i = 0; i <= aLen; i++) matrix[i][0] = i;
  for (let j = 0; j <= bLen; j++) matrix[0][j] = j;

  for (let i = 1; i <= aLen; i++) {
    for (let j = 1; j <= bLen; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[aLen][bLen];
}

function calculateSimilarity(a, b) {
  const distance = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1.0;
  return 1.0 - distance / maxLen;
}

function findDuplicates(artists, similarityThreshold = 0.85) {
  const duplicates = [];
  const checked = new Set();

  for (let i = 0; i < artists.length; i++) {
    const artist1 = artists[i];
    if (checked.has(artist1.id)) continue;

    const normalized1 = normalizeString(artist1.name);

    for (let j = i + 1; j < artists.length; j++) {
      const artist2 = artists[j];
      if (checked.has(artist2.id)) continue;

      const normalized2 = normalizeString(artist2.name);
      const similarity = calculateSimilarity(normalized1, normalized2);

      if (similarity >= similarityThreshold) {
        // Additional checks: Spotify ID or Instagram handle match?
        const spotifyMatch = artist1.spotifyArtistId && artist1.spotifyArtistId === artist2.spotifyArtistId;
        const instagramMatch = artist1.instagramHandle && artist1.instagramHandle === artist2.instagramHandle;

        duplicates.push({
          primary: artist1.id,
          primaryName: artist1.name,
          duplicate: artist2.id,
          duplicateName: artist2.name,
          similarity: (similarity * 100).toFixed(1),
          spotifyMatch,
          instagramMatch,
          mergeReason: spotifyMatch ? "Spotify ID match" : instagramMatch ? "Instagram match" : "Name similarity",
        });

        checked.add(artist2.id);
      }
    }
  }

  return duplicates;
}

async function mergeArtists(primaryArtistId, duplicateArtistId, dryRun = false) {
  const primary = await prisma.artist.findUnique({ where: { id: primaryArtistId } });
  const duplicate = await prisma.artist.findUnique({ where: { id: duplicateArtistId } });

  if (!primary || !duplicate) {
    return { success: false, error: "Artist not found" };
  }

  // Merge strategy: Keep primary, take missing data from duplicate
  const mergedData = {
    name: primary.name,
    instagramHandle: primary.instagramHandle || duplicate.instagramHandle,
    spotifyArtistId: primary.spotifyArtistId || duplicate.spotifyArtistId,
    genre: primary.genre || duplicate.genre,
    city: primary.city || duplicate.city,
    bio: primary.bio || duplicate.bio,
    officialSiteUrl: primary.officialSiteUrl || duplicate.officialSiteUrl,
    bandcampUrl: primary.bandcampUrl || duplicate.bandcampUrl,
    emails: [...new Set([...(primary.emails || []), ...(duplicate.emails || [])])],
  };

  if (!dryRun) {
    // Move all leads from duplicate to primary
    await prisma.lead.updateMany({
      where: { artistId: duplicateArtistId },
      data: { artistId: primaryArtistId },
    });

    // Move all releases from duplicate to primary
    await prisma.release.updateMany({
      where: { artistId: duplicateArtistId },
      data: { artistId: primaryArtistId },
    });

    // Move all Instagram posts from duplicate to primary
    await prisma.instagramPost.updateMany({
      where: { artistId: duplicateArtistId },
      data: { artistId: primaryArtistId },
    });

    // Update primary with merged data
    await prisma.artist.update({
      where: { id: primaryArtistId },
      data: mergedData,
    });

    // Delete the duplicate
    await prisma.artist.delete({
      where: { id: duplicateArtistId },
    });

    return { success: true, primaryId: primaryArtistId, merged: duplicateArtistId };
  }

  return {
    success: true,
    primaryId: primaryArtistId,
    merged: duplicateArtistId,
    dryRun: true,
    preview: mergedData,
  };
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const thresholdIndex = process.argv.indexOf("--threshold");
  const threshold = thresholdIndex !== -1 ? parseFloat(process.argv[thresholdIndex + 1]) : 0.85;
  const autoMerge = process.argv.includes("--auto-merge");

  console.log("🔍 Duplicate Artist Detection & Merging");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"} | Similarity Threshold: ${(threshold * 100).toFixed(0)}%`);
  if (autoMerge) console.log("Strategy: Auto-merge HIGH confidence duplicates");
  console.log();

  // Fetch all artists
  const artists = await prisma.artist.findMany({
    include: {
      _count: {
        select: { leads: true, releases: true },
      },
    },
  });

  if (artists.length === 0) {
    console.log("✓ No artists to check");
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log(`Checking ${artists.length} artists for duplicates...`);
  console.log();

  const duplicates = findDuplicates(artists, threshold);

  if (duplicates.length === 0) {
    console.log("✅ No duplicates found");
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log(`🚨 Found ${duplicates.length} potential duplicates:\n`);

  // Group by certainty
  const highConfidence = duplicates.filter((d) => d.spotifyMatch || d.instagramMatch);
  const mediumConfidence = duplicates.filter(
    (d) => !d.spotifyMatch && !d.instagramMatch && parseFloat(d.similarity) > 0.95
  );
  const lowConfidence = duplicates.filter(
    (d) => !d.spotifyMatch && !d.instagramMatch && parseFloat(d.similarity) <= 0.95
  );

  if (highConfidence.length > 0) {
    console.log("🔴 HIGH CONFIDENCE (exact IDs):");
    highConfidence.forEach((d) => {
      console.log(`  ${d.primaryName} ↔ ${d.duplicateName} (${d.similarity}%, ${d.mergeReason})`);
    });
    console.log();
  }

  if (mediumConfidence.length > 0) {
    console.log("🟡 MEDIUM CONFIDENCE (95%+ similarity):");
    mediumConfidence.forEach((d) => {
      console.log(`  ${d.primaryName} ↔ ${d.duplicateName} (${d.similarity}%)`);
    });
    console.log();
  }

  if (lowConfidence.length > 0) {
    console.log("🟢 LOW CONFIDENCE (below 95%):");
    lowConfidence.slice(0, 5).forEach((d) => {
      console.log(`  ${d.primaryName} ↔ ${d.duplicateName} (${d.similarity}%)`);
    });
    if (lowConfidence.length > 5) {
      console.log(`  ... and ${lowConfidence.length - 5} more`);
    }
    console.log();
  }

  // Auto-merge if enabled
  if (autoMerge && !dryRun) {
    console.log("🔄 Auto-merging high confidence duplicates...");
    let merged = 0;
    for (const dup of highConfidence) {
      try {
        const result = await mergeArtists(dup.primary, dup.duplicate, false);
        if (result.success) {
          merged++;
          console.log(`  ✓ Merged ${dup.duplicateName} into ${dup.primaryName}`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to merge ${dup.duplicateName}: ${error.message}`);
      }
    }
    console.log(`\nMerged ${merged} artists`);
  } else if (autoMerge && dryRun) {
    console.log("⚠️  DRY RUN: Would merge high confidence duplicates");
  }

  console.log();
  console.log("📊 Summary:");
  console.log(`  Total potential duplicates: ${duplicates.length}`);
  console.log(`  High confidence: ${highConfidence.length}`);
  console.log(`  Medium confidence: ${mediumConfidence.length}`);
  console.log(`  Low confidence: ${lowConfidence.length}`);

  if (dryRun && !autoMerge) {
    console.log("\n💡 Tip: Run with --auto-merge to merge high confidence duplicates");
  }

  await prisma.$disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
