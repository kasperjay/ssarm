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

// Email utilities (mirrors src/lib/email.ts)
const EMAIL_REGEX = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

const LINK_HUB_HOSTS = new Set([
  "linktr.ee", "linkin.bio", "beacons.ai", "lnk.to", "solo.to",
  "carrd.co", "bio.link", "fanlink.to", "hyperfollow.com",
]);

const SOCIAL_HOSTS = new Set([
  "instagram.com", "www.instagram.com", "facebook.com", "m.facebook.com",
  "www.facebook.com", "tiktok.com", "www.tiktok.com", "youtube.com",
  "www.youtube.com", "twitter.com", "x.com", "soundcloud.com",
  "open.spotify.com", "spotify.com", "music.apple.com",
]);

const normalizeUrl = (value) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  try {
    if (!/^https?:\/\//i.test(trimmed)) {
      return new URL(`https://${trimmed}`).toString();
    }
    return new URL(trimmed).toString();
  } catch {
    return null;
  }
};

const extractEmailsFromText = (value) => {
  if (!value) return [];
  const matches = value.match(EMAIL_REGEX) || [];
  return matches.map((email) => email.toLowerCase());
};

const extractLinks = (html, baseUrl) => {
  const links = new Set();
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let match;
  while ((match = hrefRegex.exec(html))) {
    const raw = match[1];
    if (!raw || raw.startsWith("#") || raw.startsWith("mailto:")) continue;
    try {
      const url = new URL(raw, baseUrl);
      links.add(url.toString());
    } catch {}
  }
  return Array.from(links);
};

const isSocialHost = (url) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return SOCIAL_HOSTS.has(host);
  } catch {
    return true;
  }
};

const isLinkHubHost = (url) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return LINK_HUB_HOSTS.has(host);
  } catch {
    return false;
  }
};

const sameHost = (a, b) => {
  try {
    return new URL(a).hostname.toLowerCase() === new URL(b).hostname.toLowerCase();
  } catch {
    return false;
  }
};

const fetchHtml = async (url, timeoutMs = 6000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "spectral-soundworks-bot/1.0" },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
};

const pickContactLinks = (links, baseUrl) => {
  const keywords = ["contact", "booking", "press", "management", "inquiries", "inquiry", "connect", "about"];
  return links.filter((link) => {
    if (!sameHost(link, baseUrl)) return false;
    const path = new URL(link).pathname.toLowerCase();
    return keywords.some((keyword) => path.includes(keyword));
  });
};

const pickExternalLinks = (links) =>
  links.filter((link) => !isSocialHost(link) && !isLinkHubHost(link));

const discoverEmailsFromUrls = async (urls) => {
  const normalized = urls
    .map((value) => normalizeUrl(value))
    .filter((value) => Boolean(value));

  const emails = new Set();
  const visited = new Set();
  const queue = [...normalized];
  const maxPages = Number.parseInt(process.env.EMAIL_SCRAPE_MAX_PAGES || "5", 10) || 5;

  while (queue.length && visited.size < maxPages) {
    const url = queue.shift();
    if (!url || visited.has(url)) continue;
    visited.add(url);

    const html = await fetchHtml(url);
    if (!html) continue;

    for (const email of extractEmailsFromText(html)) {
      emails.add(email);
    }

    if (emails.size > 0) continue;

    const links = extractLinks(html, url);

    if (isLinkHubHost(url)) {
      const external = pickExternalLinks(links).slice(0, 3);
      queue.push(...external);
      continue;
    }

    const contactLinks = pickContactLinks(links, url).slice(0, 3);
    queue.push(...contactLinks);
  }

  return Array.from(emails);
};

// Contact confidence scoring
function scoreContactConfidence(email, discoveryMethod) {
  let score = 0;
  let confidence = "uncertain";

  // Method-based scoring
  if (discoveryMethod === "official-website") {
    score = 90;
    confidence = "verified";
  } else if (discoveryMethod === "verified-db") {
    score = 85;
    confidence = "verified";
  } else if (discoveryMethod === "band-website") {
    score = 75;
    confidence = "verified";
  } else if (discoveryMethod === "contact-page") {
    score = 70;
    confidence = "inferred";
  } else if (discoveryMethod === "social-profile") {
    score = 60;
    confidence = "inferred";
  } else if (discoveryMethod === "pattern-match") {
    score = 40;
    confidence = "uncertain";
  }

  // Email format checks
  const localPart = email.split("@")[0].toLowerCase();
  if (
    localPart.includes("booking") ||
    localPart.includes("contact") ||
    localPart.includes("info") ||
    localPart.includes("hello")
  ) {
    score = Math.min(score + 10, 95);
  } else if (
    localPart.includes("noreply") ||
    localPart.includes("no-reply") ||
    localPart.includes("bounce")
  ) {
    score = Math.max(score - 30, 20);
  }

  return { score, confidence };
}

async function discoverContactsForLead(lead, dryRun = false) {
  const discoveryResults = {
    leadId: lead.id,
    artistName: lead.artist.name,
    emailsFound: [],
    contactMethods: [],
    confidence: "uncertain",
    activityLogged: false,
  };

  // Gather potential URLs
  const urlsToCheck = [
    lead.artist.officialSiteUrl,
    lead.artist.bandcampUrl,
    lead.artist.instagramHandle && `https://instagram.com/${lead.artist.instagramHandle}`,
  ].filter(Boolean);

  if (urlsToCheck.length === 0) {
    return discoveryResults;
  }

  try {
    // Discover emails from URLs
    const discoveredEmails = await discoverEmailsFromUrls(urlsToCheck);

    if (discoveredEmails.length > 0) {
      // Score each email
      const scoredEmails = discoveredEmails.map((email) => {
        const { score, confidence } = scoreContactConfidence(
          email,
          lead.artist.officialSiteUrl ? "band-website" : "social-profile"
        );
        return { email, score, confidence };
      });

      // Sort by score
      scoredEmails.sort((a, b) => b.score - a.score);

      discoveryResults.emailsFound = scoredEmails;
      discoveryResults.confidence = scoredEmails[0]?.confidence || "uncertain";

      // Update lead if not a dry run
      if (!dryRun) {
        // Get existing emails
        const existingEmails = lead.artist.emails || [];
        const newEmails = scoredEmails
          .map((e) => e.email)
          .filter((e) => !existingEmails.includes(e));

        if (newEmails.length > 0) {
          await prisma.artist.update({
            where: { id: lead.artist.id },
            data: {
              emails: [...existingEmails, ...newEmails],
            },
          });

          // Log discovery activity
          const emailsList = newEmails.join(", ");
          await prisma.activity.create({
            data: {
              leadId: lead.id,
              type: "NOTE",
              note: `[AUTO-DISCOVER] Found contact: ${emailsList}. Confidence: ${discoveryResults.confidence}`,
            },
          });

          discoveryResults.activityLogged = true;
        }
      }
    }
  } catch (error) {
    console.error(`Error discovering contacts for ${lead.artist.name}:`, error.message);
  }

  return discoveryResults;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const limitIndex = process.argv.indexOf("--limit");
  const limit = limitIndex !== -1 ? parseInt(process.argv[limitIndex + 1], 10) : 50;
  const onlyMissing = process.argv.includes("--missing");

  console.log("📧 Contact Intelligence & Email Discovery");
  console.log(`Mode: ${dryRun ? "DRY RUN" : "LIVE"} | Limit: ${limit}`);
  if (onlyMissing) console.log("Filter: Only artists with missing emails");
  console.log();

  // Find leads to process
  let query = {
    include: { artist: true },
    take: limit,
    orderBy: { updatedAt: "desc" },
  };

  if (onlyMissing) {
    query.where = {
      artist: {
        emails: { equals: [] },
      },
    };
  }

  const leads = await prisma.lead.findMany(query);

  if (leads.length === 0) {
    console.log("✓ No leads to process");
    await prisma.$disconnect();
    process.exit(0);
  }

  console.log(`Processing ${leads.length} leads...`);
  console.log();

  const results = {
    total: leads.length,
    discovered: 0,
    verified: 0,
    inferred: 0,
    uncertain: 0,
    totalEmails: 0,
    errors: 0,
  };

  const discoveries = [];

  for (const lead of leads) {
    try {
      const discovery = await discoverContactsForLead(lead, dryRun);

      if (discovery.emailsFound.length > 0) {
        results.discovered++;
        results.totalEmails += discovery.emailsFound.length;

        if (discovery.confidence === "verified") results.verified++;
        else if (discovery.confidence === "inferred") results.inferred++;
        else results.uncertain++;

        discoveries.push(discovery);
      }
    } catch (error) {
      console.error(`Error processing lead ${lead.id}:`, error.message);
      results.errors++;
    }
  }

  // Display results
  console.log("📊 Results:");
  console.log(`  Leads processed: ${results.total}`);
  console.log(`  Contacts discovered: ${results.discovered}`);
  console.log(`  Total emails found: ${results.totalEmails}`);
  console.log();

  if (results.discovered > 0) {
    console.log("Confidence Breakdown:");
    console.log(`  Verified: ${results.verified}`);
    console.log(`  Inferred: ${results.inferred}`);
    console.log(`  Uncertain: ${results.uncertain}`);
    console.log();

    console.log("Sample discoveries (first 5):");
    discoveries.slice(0, 5).forEach((d) => {
      console.log(`  ${d.artistName}:`);
      d.emailsFound.slice(0, 2).forEach((e) => {
        console.log(`    ${e.email} (${e.confidence}, ${e.score}%)`);
      });
    });
  }

  if (dryRun) {
    console.log();
    console.log("⚠️  DRY RUN: No emails saved to database");
  }

  await prisma.$disconnect();
  process.exit(results.errors > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("Fatal error:", error.message);
  process.exit(1);
});
