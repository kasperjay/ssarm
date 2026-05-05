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


// Canonical genre taxonomy
const GENRE_TAXONOMY = {
  electronic: [
    "edm",
    "house",
    "techno",
    "dnb",
    "drum and bass",
    "drum&bass",
    "d&b",
    "dubstep",
    "trap",
    "glitch",
    "ambient",
    "downtempo",
    "chillout",
    "synthwave",
    "synthpop",
  ],
  hip_hop: ["hiphop", "hip hop", "rap", "trap", "grime", "drill"],
  rock: ["alternative", "alt rock", "indie rock", "punk", "metal", "prog rock", "psychedelic", "garage rock"],
  pop: ["pop", "indie pop", "synth pop", "dance pop", "teen pop", "bubblegum pop"],
  rnb: ["r&b", "rnb", "soul", "neo soul", "funk", "disco"],
  country: ["country", "bluegrass", "americana", "folk", "outlaw country"],
  jazz: ["jazz", "fusion", "bebop", "modal jazz"],
  classical: ["classical", "orchestral", "chamber", "opera", "baroque", "contemporary classical"],
  folk: ["folk", "singer-songwriter", "indie folk", "acoustic", "traditional"],
  metal: ["metal", "heavy metal", "death metal", "black metal", "doom metal", "metalcore"],
  reggae: ["reggae", "dancehall", "dub", "roots reggae"],
  indie: ["indie", "indie rock", "indie pop", "art rock"],
  experimental: ["experimental", "noise", "musique concrète", "avant garde", "electroacoustic"],
};

// Reverse mapping for quick lookup
const GENRE_MAP = {};
for (const [canonical, aliases] of Object.entries(GENRE_TAXONOMY)) {
  GENRE_MAP[canonical] = canonical;
  for (const alias of aliases) {
    GENRE_MAP[alias.toLowerCase()] = canonical;
  }
}

function standardizeGenre(rawGenre) {
  if (!rawGenre) return { original: null, standardized: null, found: false };

  const normalized = rawGenre.toLowerCase().trim();

  // Check for exact match first
  if (GENRE_MAP[normalized]) {
    return { original: rawGenre, standardized: GENRE_MAP[normalized], found: true };
  }

  // Try partial matches (check if any canonical genre is substring)
  for (const [canonical, aliases] of Object.entries(GENRE_TAXONOMY)) {
    if (normalized.includes(canonical.replace("_", " "))) {
      return { original: rawGenre, standardized: canonical, found: true, partial: true };
    }
    for (const alias of aliases) {
      if (normalized.includes(alias)) {
        return { original: rawGenre, standardized: canonical, found: true, aliased: true };
      }
    }
  }

  // No match found
  return { original: rawGenre, standardized: null, found: false };
}

function getGenreIssues(artists) {
  const issues = {
    missing: [],
    invalid: [],
    standardizable: [],
    already_standard: [],
  };

  for (const artist of artists) {
    if (!artist.genre) {
      issues.missing.push(artist);
      continue;
    }

    const result = standardizeGenre(artist.genre);

    if (!result.found) {
      issues.invalid.push({ artist, original: artist.genre });
    } else if (result.standardized !== artist.genre) {
      issues.standardizable.push({
        artist,
        original: artist.genre,
        standardized: result.standardized,
        aliased: result.aliased,
      });
    } else {
      issues.already_standard.push(artist);
    }
  }

  return issues;
}

async function main() {
  // Default to dry-run; pass --live to actually apply changes
  const dryRun = !process.argv.includes("--live");
  const autoFix = process.argv.includes("--auto-fix");
  const showTaxonomy = process.argv.includes("--taxonomy");

  console.log("🏷️  Genre Standardization Agent");
  console.log(`Mode: ${dryRun ? "DRY RUN (pass --live to apply)" : "LIVE"}`);
  console.log();

  if (showTaxonomy) {
    console.log("📚 Canonical Genre Taxonomy:");
    for (const [canonical, aliases] of Object.entries(GENRE_TAXONOMY)) {
      console.log(`  ${canonical.replace(/_/g, " ")}: ${aliases.slice(0, 3).join(", ")}${aliases.length > 3 ? ", ..." : ""}`);
    }
    console.log();
  }

  // Fetch all artists
  const artists = await prisma.artist.findMany({
    include: {
      _count: { select: { leads: true } },
    },
  });

  if (artists.length === 0) {
    console.log("✓ No artists to check");
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log(`Analyzing genres for ${artists.length} artists...`);
  console.log();

  const issues = getGenreIssues(artists);

  console.log("📊 Genre Analysis:");
  console.log(`  Already standard: ${issues.already_standard.length}`);
  console.log(`  Standardizable: ${issues.standardizable.length}`);
  console.log(`  Invalid/Unknown: ${issues.invalid.length}`);
  console.log(`  Missing: ${issues.missing.length}`);
  console.log();

  if (issues.standardizable.length > 0) {
    console.log("🔄 Standardizable genres:");
    issues.standardizable.slice(0, 10).forEach((item) => {
      const flag = item.aliased ? "📌" : "📝";
      console.log(`  ${flag} "${item.original}" → "${item.standardized}" (${item.artist.name})`);
    });
    if (issues.standardizable.length > 10) {
      console.log(`  ... and ${issues.standardizable.length - 10} more`);
    }
    console.log();
  }

  if (issues.invalid.length > 0) {
    console.log("❓ Invalid/Unknown genres:");
    issues.invalid.slice(0, 5).forEach((item) => {
      console.log(`  "${item.original}" (${item.artist.name})`);
    });
    if (issues.invalid.length > 5) {
      console.log(`  ... and ${issues.invalid.length - 5} more`);
    }
    console.log();
  }

  if (issues.missing.length > 0) {
    console.log("⚠️  Missing genres (needs manual input):");
    issues.missing.slice(0, 5).forEach((artist) => {
      console.log(`  ${artist.name} (${artist._count.leads} leads)`);
    });
    if (issues.missing.length > 5) {
      console.log(`  ... and ${issues.missing.length - 5} more`);
    }
    console.log();
  }

  // Auto-fix if enabled
  if (autoFix && !dryRun && issues.standardizable.length > 0) {
    console.log("🔧 Auto-fixing standardizable genres...");
    let fixed = 0;
    for (const item of issues.standardizable) {
      try {
        const lead = await prisma.lead.findFirst({
          where: { artistId: item.artist.id },
          orderBy: { createdAt: "asc" },
        });

        await prisma.artist.update({
          where: { id: item.artist.id },
          data: { genre: item.standardized },
        });

        if (lead) {
          await prisma.activity.create({
            data: {
              leadId: lead.id,
              type: "NOTE",
              note: `[AUTO-FIX] Genre standardized: "${item.original}" -> "${item.standardized}"`,
            },
          });
        }

        fixed++;
        console.log(`  ✓ ${item.artist.name}: "${item.original}" → "${item.standardized}"`);
      } catch (error) {
        console.error(`  ✗ Failed to fix ${item.artist.name}: ${error.message}`);
      }
    }
    console.log(`\nFixed ${fixed} artists`);
  } else if (autoFix && dryRun) {
    console.log("⚠️  DRY RUN: Would auto-fix standardizable genres");
  }

  console.log();
  console.log("📈 Summary:");
  console.log(`  Total artists: ${artists.length}`);
  console.log(`  Fixable via standardization: ${issues.standardizable.length}`);
  console.log(`  Manual review needed: ${issues.invalid.length + issues.missing.length}`);
  console.log(`  Data quality: ${((issues.already_standard.length / artists.length) * 100).toFixed(1)}%`);

  if (!autoFix && issues.standardizable.length > 0) {
    console.log("\n💡 Tip: Run with --live --auto-fix to apply standardizations");
  }

  return { fixed: autoFix && !dryRun ? issues.standardizable.length : 0, needsReview: issues.invalid.length + issues.missing.length };
}

withAgentRun("standardize-genres", { dryRun: !process.argv.includes("--live") }, main)
  .catch((error) => {
    console.error("Fatal error:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
