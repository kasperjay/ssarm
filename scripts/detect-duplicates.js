#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("../prisma/generated-client");
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

const { withAgentRun, prisma, pool } = require("../src/lib/agent-runner");


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

async function mergeArtists(primaryArtistId, duplicateArtistId, proposalId, dryRun = true) {
  const primary = await prisma.artist.findUnique({ where: { id: primaryArtistId } });
  const duplicate = await prisma.artist.findUnique({ where: { id: duplicateArtistId }, include: { leads: true } });

  if (!primary || !duplicate) {
    return { success: false, error: "Artist not found" };
  }

  const mergedData = {
    name: primary.name,
    instagramHandle: primary.instagramHandle || duplicate.instagramHandle,
    spotifyArtistId: primary.spotifyArtistId || duplicate.spotifyArtistId,
    genre: primary.genre || duplicate.genre,
    city: primary.city || duplicate.city,
    bio: primary.bio || duplicate.bio,
    officialSiteUrl: primary.officialSiteUrl || duplicate.officialSiteUrl,
    emails: [...new Set([...(primary.emails || []), ...(duplicate.emails || [])])],
  };

  if (!dryRun) {
    const snapshot = JSON.stringify({
      id: duplicate.id,
      name: duplicate.name,
      instagramHandle: duplicate.instagramHandle,
      spotifyArtistId: duplicate.spotifyArtistId,
      genre: duplicate.genre,
      city: duplicate.city,
      bio: duplicate.bio,
      emails: duplicate.emails,
    });

    // Move all leads, releases, Instagram posts from duplicate to primary
    await prisma.lead.updateMany({ where: { artistId: duplicateArtistId }, data: { artistId: primaryArtistId } });
    await prisma.release.updateMany({ where: { artistId: duplicateArtistId }, data: { artistId: primaryArtistId } });
    await prisma.instagramPost.updateMany({ where: { artistId: duplicateArtistId }, data: { artistId: primaryArtistId } });

    // Update primary with merged data
    await prisma.artist.update({ where: { id: primaryArtistId }, data: mergedData });

    // Leave audit Activity on any lead now associated with primary
    const primaryLeads = await prisma.lead.findMany({ where: { artistId: primaryArtistId }, take: 5 });
    for (const lead of primaryLeads) {
      await prisma.activity.create({
        data: {
          leadId: lead.id,
          type: "NOTE",
          note: `[MERGE] Merged duplicate artist "${duplicate.name}" (${duplicate.id}) into this record. Snapshot: ${snapshot}`,
        },
      });
    }

    // Mark the proposal as applied
    if (proposalId) {
      await prisma.mergeProposal.update({
        where: { id: proposalId },
        data: { status: "APPLIED" },
      });
    }

    // Delete the duplicate
    await prisma.artist.delete({ where: { id: duplicateArtistId } });

    return { success: true, primaryId: primaryArtistId, merged: duplicateArtistId };
  }

  return { success: true, primaryId: primaryArtistId, merged: duplicateArtistId, dryRun: true, preview: mergedData };
}


async function main() {
  // Default to dry-run unless --live is explicitly passed
  const dryRun = !process.argv.includes("--live");
  const thresholdIndex = process.argv.indexOf("--threshold");
  const threshold = thresholdIndex !== -1 ? parseFloat(process.argv[thresholdIndex + 1]) : 0.85;
  const autoMerge = process.argv.includes("--auto-merge");

  console.log("🔍 Duplicate Artist Detection & Merging");
  console.log(`Mode: ${dryRun ? "DRY RUN (default -- pass --live to apply)" : "LIVE"} | Similarity Threshold: ${(threshold * 100).toFixed(0)}%`);
  if (autoMerge) console.log("Strategy: Auto-merge HIGH confidence duplicates");
  console.log();

  const artists = await prisma.artist.findMany({
    include: { _count: { select: { leads: true, releases: true } } },
  });

  if (artists.length === 0) {
    console.log("✓ No artists to check");
    return { duplicatesFound: 0, merged: 0 };
  }

  console.log(`Checking ${artists.length} artists for duplicates...`);
  console.log();

  const duplicates = findDuplicates(artists, threshold);

  if (duplicates.length === 0) {
    console.log("✅ No duplicates found");
    return { duplicatesFound: 0, merged: 0 };
  }

  console.log(`🚨 Found ${duplicates.length} potential duplicates:\n`);

  const highConfidence = duplicates.filter((d) => d.spotifyMatch || d.instagramMatch);
  const mediumConfidence = duplicates.filter((d) => !d.spotifyMatch && !d.instagramMatch && parseFloat(d.similarity) > 0.95);
  const lowConfidence = duplicates.filter((d) => !d.spotifyMatch && !d.instagramMatch && parseFloat(d.similarity) <= 0.95);

  if (highConfidence.length > 0) {
    console.log("🔴 HIGH CONFIDENCE (exact IDs):");
    highConfidence.forEach((d) => console.log(`  ${d.primaryName} ↔ ${d.duplicateName} (${d.similarity}%, ${d.mergeReason})`));
    console.log();
  }
  if (mediumConfidence.length > 0) {
    console.log("🟡 MEDIUM CONFIDENCE (95%+ similarity):");
    mediumConfidence.forEach((d) => console.log(`  ${d.primaryName} ↔ ${d.duplicateName} (${d.similarity}%)`));
    console.log();
  }
  if (lowConfidence.length > 0) {
    console.log("🟢 LOW CONFIDENCE (below 95%):");
    lowConfidence.slice(0, 5).forEach((d) => console.log(`  ${d.primaryName} ↔ ${d.duplicateName} (${d.similarity}%)`));
    if (lowConfidence.length > 5) console.log(`  ... and ${lowConfidence.length - 5} more`);
    console.log();
  }

  // Always persist proposals to DB for review
  if (!dryRun || autoMerge) {
    console.log("💾 Persisting merge proposals to database...");
    for (const dup of duplicates) {
      const confidence = (dup.spotifyMatch || dup.instagramMatch) ? "HIGH" : parseFloat(dup.similarity) > 0.95 ? "MEDIUM" : "LOW";
      try {
        await prisma.mergeProposal.upsert({
          where: { duplicateArtistId: dup.duplicate },
          create: {
            primaryArtistId: dup.primary,
            duplicateArtistId: dup.duplicate,
            primaryName: dup.primaryName,
            duplicateName: dup.duplicateName,
            similarityScore: parseFloat(dup.similarity),
            confidence,
            reason: dup.mergeReason,
            status: "PENDING",
          },
          update: {
            primaryArtistId: dup.primary,
            primaryName: dup.primaryName,
            similarityScore: parseFloat(dup.similarity),
            confidence,
            reason: dup.mergeReason,
            status: "PENDING",
          },
        });
      } catch (err) {
        console.error(`  Failed to upsert proposal for ${dup.duplicateName}: ${err.message}`);
      }
    }
    console.log(`  Saved ${duplicates.length} proposals.\n`);
  }

  let mergedCount = 0;

  if (autoMerge && !dryRun) {
    console.log("🔄 Auto-merging high confidence duplicates...");
    for (const dup of highConfidence) {
      try {
        const proposal = await prisma.mergeProposal.findUnique({ where: { duplicateArtistId: dup.duplicate } });
        const result = await mergeArtists(dup.primary, dup.duplicate, proposal?.id || null, false);
        if (result.success) {
          mergedCount++;
          console.log(`  ✓ Merged ${dup.duplicateName} into ${dup.primaryName}`);
        }
      } catch (error) {
        console.error(`  ✗ Failed to merge ${dup.duplicateName}: ${error.message}`);
      }
    }
    console.log(`\nMerged ${mergedCount} artists`);
  } else if (autoMerge && dryRun) {
    console.log("⚠️  DRY RUN: Would merge high confidence duplicates (pass --live to apply)");
  }

  console.log();
  console.log("📊 Summary:");
  console.log(`  Total potential duplicates: ${duplicates.length}`);
  console.log(`  High confidence: ${highConfidence.length}`);
  console.log(`  Medium confidence: ${mediumConfidence.length}`);
  console.log(`  Low confidence: ${lowConfidence.length}`);

  if (dryRun && !autoMerge) {
    console.log("\n💡 Tip: Run with --live --auto-merge to apply high confidence merges");
  }

  return { duplicatesFound: duplicates.length, merged: mergedCount };
}

withAgentRun("detect-duplicates", { dryRun: !process.argv.includes("--live") }, main)
  .catch((error) => {
    console.error("Fatal error:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
