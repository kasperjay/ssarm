#!/usr/bin/env node
// scripts/merge-duplicate-leads.js
// Safe duplicate detection and merging tool.
// Defaults to DRY-RUN mode. Pass --live to execute.

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx !== -1) {
      const k = trimmed.slice(0, idx).trim();
      const v = trimmed.slice(idx + 1).trim().replace(/^['"](.*)['"]\s*$/, "$1");
      if (k && process.env[k] === undefined) process.env[k] = v;
    }
  }
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function normalizeName(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

const STATUS_PRIORITY = {
  WON: 5,
  CONTACTED: 4,
  FOLLOW_UP: 3,
  QUALIFIED: 2,
  NEW: 1,
  LOST: 0,
  PAUSED: 0,
};

const NEED_PRIORITY = {
  CLEAR: 2,
  POSSIBLE: 1,
  NONE: 0,
};

async function main() {
  const isLive = process.argv.includes("--live");
  const onlyContacted = process.argv.includes("--only-contacted");

  console.log("=== Safe Duplicate Lead & Artist Merger ===");
  console.log(`Execution Mode: ${isLive ? "LIVE (mutating database)" : "DRY RUN (no database changes)"}`);
  if (onlyContacted) console.log("Scope: Only groups involving CONTACTED leads");
  else console.log("Scope: All duplicate groups across database");
  console.log();

  const leadsRes = await pool.query(`
    SELECT
      a.id as artist_id, a.name as artist_name, a."instagramHandle", a."spotifyArtistId",
      a.city, a.state, a.genre, a.bio, a.emails, a."officialSiteUrl", a."followerCount",
      l.id as lead_id, l.status as lead_status, l.score, l."scoreRationale",
      l."lastContactedAt", l."productionNeedLevel", l."productionNeedEvidence", l."productionNeedApprovedAt",
      l."createdAt" as lead_created_at,
      (SELECT count(*) FROM "Release" r WHERE r."artistId" = a.id) as release_count,
      (SELECT count(*) FROM "InstagramPost" ip WHERE ip."artistId" = a.id) as post_count,
      (SELECT count(*) FROM "Activity" act WHERE act."leadId" = l.id) as activity_count,
      (SELECT count(*) FROM "MessageDraft" md WHERE md."leadId" = l.id) as draft_count,
      (SELECT min("createdAt") FROM "Activity" act WHERE act."leadId" = l.id AND act.type = 'MESSAGE_SENT') as first_msg_sent_at
    FROM "Artist" a
    JOIN "Lead" l ON l."artistId" = a.id
    ORDER BY a.name ASC, l."createdAt" ASC
  `);

  const groups = new Map();
  for (const row of leadsRes.rows) {
    const key = normalizeName(row.artist_name);
    if (!key) continue;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const dupGroups = [];
  for (const [key, list] of groups.entries()) {
    if (list.length > 1) {
      const statuses = list.map((r) => r.lead_status);
      const hasContacted = statuses.includes("CONTACTED");
      if (onlyContacted && !hasContacted) continue;
      dupGroups.push({ key, list });
    }
  }

  console.log(`Found ${dupGroups.length} duplicate groups to evaluate.`);

  let mergedCount = 0;

  for (const { key, list } of dupGroups) {
    // Determine the Primary lead/artist.
    // Score based on richness of profile: releases, posts, followerCount, bio length, activities.
    const sorted = [...list].sort((a, b) => {
      const richnessA = (Number(a.release_count) * 10) + (Number(a.post_count) * 2) + (a.bio ? 20 : 0) + (a.spotifyArtistId ? 15 : 0) + (Number(a.followerCount) || 0) / 100;
      const richnessB = (Number(b.release_count) * 10) + (Number(b.post_count) * 2) + (b.bio ? 20 : 0) + (b.spotifyArtistId ? 15 : 0) + (Number(b.followerCount) || 0) / 100;
      return richnessB - richnessA;
    });

    const primary = sorted[0];
    const duplicates = sorted.slice(1);

    // Compute resolved status across all records in the group
    let resolvedStatus = primary.lead_status;
    for (const item of list) {
      if ((STATUS_PRIORITY[item.lead_status] ?? 0) > (STATUS_PRIORITY[resolvedStatus] ?? 0)) {
        resolvedStatus = item.lead_status;
      }
    }

    // Compute resolved lastContactedAt
    let resolvedContactedAt = primary.lastContactedAt;
    for (const item of list) {
      const candidateDate = item.lastContactedAt || item.first_msg_sent_at;
      if (candidateDate) {
        if (!resolvedContactedAt || new Date(candidateDate) < new Date(resolvedContactedAt)) {
          resolvedContactedAt = candidateDate;
        }
      }
    }

    // If resolved status is CONTACTED but resolvedContactedAt is null, default to earliest first_msg_sent_at or now
    if (resolvedStatus === "CONTACTED" && !resolvedContactedAt) {
      const anySent = list.map((i) => i.first_msg_sent_at).filter(Boolean);
      resolvedContactedAt = anySent.length > 0 ? anySent.sort()[0] : new Date();
    }

    // Union emails and metadata
    const allEmails = [...new Set(list.flatMap((r) => r.emails || []).filter(Boolean))];
    const resolvedHandle = primary.instagramHandle || list.find((r) => r.instagramHandle)?.instagramHandle || null;
    const resolvedSpotifyId = primary.spotifyArtistId || list.find((r) => r.spotifyArtistId)?.spotifyArtistId || null;
    const resolvedCity = primary.city || list.find((r) => r.city)?.city || null;
    const resolvedState = primary.state || list.find((r) => r.state)?.state || null;
    const resolvedGenre = primary.genre || list.find((r) => r.genre)?.genre || null;
    const resolvedBio = primary.bio || list.find((r) => r.bio)?.bio || null;
    const resolvedSite = primary.officialSiteUrl || list.find((r) => r.officialSiteUrl)?.officialSiteUrl || null;

    // Production Need level
    let resolvedNeed = primary.productionNeedLevel || "NONE";
    for (const item of list) {
      if ((NEED_PRIORITY[item.productionNeedLevel] ?? 0) > (NEED_PRIORITY[resolvedNeed] ?? 0)) {
        resolvedNeed = item.productionNeedLevel;
      }
    }
    const allEvidence = [...new Set(list.flatMap((r) => Array.isArray(r.productionNeedEvidence) ? r.productionNeedEvidence : []))];

    console.log(`\n─────────────────────────────────────────────────────────────────`);
    console.log(`Group: "${primary.artist_name}" (Key: ${key})`);
    console.log(`  Target Primary Lead: ${primary.lead_id} (Artist: ${primary.artist_id})`);
    console.log(`  Original Status: ${primary.lead_status} -> Resolved Status: ${resolvedStatus}`);
    console.log(`  Contacted At: ${resolvedContactedAt ? new Date(resolvedContactedAt).toISOString() : "null"}`);
    console.log(`  Duplicates to Merge (${duplicates.length}):`);
    for (const dup of duplicates) {
      console.log(`    • Lead ${dup.lead_id} (Artist: ${dup.artist_id}, Name: "${dup.artist_name}", Status: ${dup.lead_status}, Score: ${dup.score})`);
    }

    if (isLive) {
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        for (const dup of duplicates) {
          // Reassign activities to primary lead
          await client.query(`UPDATE "Activity" SET "leadId" = $1 WHERE "leadId" = $2`, [primary.lead_id, dup.lead_id]);

          // Reassign message drafts to primary lead
          await client.query(`UPDATE "MessageDraft" SET "leadId" = $1 WHERE "leadId" = $2`, [primary.lead_id, dup.lead_id]);

          // If duplicate has separate artist record
          if (dup.artist_id !== primary.artist_id) {
            // Reassign InstagramPosts
            await client.query(`UPDATE "InstagramPost" SET "artistId" = $1 WHERE "artistId" = $2`, [primary.artist_id, dup.artist_id]);

            // Reassign ContactInfo
            await client.query(`UPDATE "ContactInfo" SET "artistId" = $1 WHERE "artistId" = $2`, [primary.artist_id, dup.artist_id]);

            // Reassign Projects if any
            await client.query(`UPDATE "Project" SET "artistId" = $1 WHERE "artistId" = $2`, [primary.artist_id, dup.artist_id]);

            // Reassign Releases (ignore if duplicate spotifyTrackId exists on primary)
            const dupReleases = await client.query(`SELECT id, "spotifyTrackId", "spotifyReleaseId" FROM "Release" WHERE "artistId" = $1`, [dup.artist_id]);
            for (const rel of dupReleases.rows) {
              const conflict = await client.query(`
                SELECT id FROM "Release"
                WHERE "artistId" = $1
                  AND (
                    ("spotifyTrackId" IS NOT NULL AND "spotifyTrackId" = $2)
                    OR ("spotifyReleaseId" IS NOT NULL AND "spotifyReleaseId" = $3)
                  )
              `, [primary.artist_id, rel.spotifyTrackId, rel.spotifyReleaseId]);

              if (conflict.rows.length === 0) {
                await client.query(`UPDATE "Release" SET "artistId" = $1 WHERE id = $2`, [primary.artist_id, rel.id]);
              } else {
                await client.query(`DELETE FROM "Release" WHERE id = $1`, [rel.id]);
              }
            }

            // Update MergeProposal status if any referenced duplicateArtistId
            await client.query(`UPDATE "MergeProposal" SET status = 'APPLIED' WHERE "duplicateArtistId" = $1`, [dup.artist_id]);
          }

          // Leave audit activity on primary lead
          await client.query(`
            INSERT INTO "Activity" ("id", "leadId", "type", "note", "createdAt")
            VALUES ($1, $2, 'NOTE', $3, NOW())
          `, [
            `merge-act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            primary.lead_id,
            `[MERGE] Merged duplicate lead "${dup.artist_name}" (Lead ID: ${dup.lead_id}, Artist ID: ${dup.artist_id}, Previous Status: ${dup.lead_status}).`,
          ]);

          // Delete duplicate lead
          await client.query(`DELETE FROM "Lead" WHERE id = $1`, [dup.lead_id]);

          // Delete duplicate artist if different
          if (dup.artist_id !== primary.artist_id) {
            await client.query(`DELETE FROM "Artist" WHERE id = $1`, [dup.artist_id]);
          }
        }

        // Update primary lead with resolved status, contactedAt, and production need
        await client.query(`
          UPDATE "Lead"
          SET
            status = $1,
            "lastContactedAt" = $2,
            "productionNeedLevel" = $3,
            "productionNeedEvidence" = $4::jsonb,
            "updatedAt" = NOW()
          WHERE id = $5
        `, [
          resolvedStatus,
          resolvedContactedAt ? new Date(resolvedContactedAt) : null,
          resolvedNeed,
          JSON.stringify(allEvidence),
          primary.lead_id,
        ]);

        // Update primary artist with merged metadata
        await client.query(`
          UPDATE "Artist"
          SET
            emails = $1,
            "instagramHandle" = COALESCE("instagramHandle", $2),
            "spotifyArtistId" = COALESCE("spotifyArtistId", $3),
            city = COALESCE(city, $4),
            state = COALESCE(state, $5),
            genre = COALESCE(genre, $6),
            bio = COALESCE(bio, $7),
            "officialSiteUrl" = COALESCE("officialSiteUrl", $8),
            "updatedAt" = NOW()
          WHERE id = $9
        `, [
          allEmails,
          resolvedHandle,
          resolvedSpotifyId,
          resolvedCity,
          resolvedState,
          resolvedGenre,
          resolvedBio,
          resolvedSite,
          primary.artist_id,
        ]);

        await client.query("COMMIT");
        mergedCount++;
        console.log(`  ✓ LIVE: Successfully merged duplicate into lead ${primary.lead_id}`);
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`  ✗ ERROR merging group ${key}:`, err.message);
      } finally {
        client.release();
      }
    } else {
      mergedCount++;
      console.log(`  [DRY RUN] Would merge into lead ${primary.lead_id} with status ${resolvedStatus}`);
    }
  }

  console.log(`\n=== Done: Evaluated ${dupGroups.length} groups, ${mergedCount} processed (${isLive ? "LIVE" : "DRY RUN"}). ===`);
  await pool.end();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  pool.end();
  process.exit(1);
});
