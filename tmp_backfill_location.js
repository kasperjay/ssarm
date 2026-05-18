const fs = require('fs');
const path = require('path');
const envPath = path.join(process.cwd(), '.env');
const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const idx = trimmed.indexOf('=');
  if (idx === -1) continue;
  const key = trimmed.slice(0, idx).trim();
  const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
  if (key && process.env[key] === undefined) process.env[key] = val;
}

const { PrismaClient } = require('./prisma/generated-client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Known Austin-area cities to detect in location strings
const AUSTIN_AREA = ["austin","round rock","pflugerville","cedar park","georgetown","san marcos","kyle","buda","dripping springs","hutto","manor","lakeway","beecave","westlake","rollingwood","spicewood","bastrop","taylor","elgin","austin tx","austin, tx","atx"];

// State abbreviation map
const STATE_ABBREV = { "tx":"Texas","ca":"California","ny":"New York","fl":"Florida","il":"Illinois","wa":"Washington","co":"Colorado","tn":"Tennessee","md":"Maryland","ga":"Georgia","or":"Oregon","az":"Arizona","nv":"Nevada","ma":"Massachusetts","pa":"Pennsylvania","oh":"Ohio","mi":"Michigan","nc":"North Carolina","va":"Virginia","ok":"Oklahoma","la":"Louisiana","ar":"Arkansas","nm":"New Mexico","ks":"Kansas","ne":"Nebraska","sd":"South Dakota","nd":"North Dakota","mn":"Minnesota","ia":"Iowa","mo":"Missouri","wi":"Wisconsin","mi":"Michigan","in":"Indiana","ky":"Kentucky","al":"Alabama","ms":"Mississippi","sc":"South Carolina","wv":"West Virginia","pa":"Pennsylvania","me":"Maine","nh":"New Hampshire","vt":"Vermont","ri":"Rhode Island","ct":"Connecticut","nj":"New Jersey","de":"Delaware","hi":"Hawaii","ak":"Alaska","dc":"Washington D.C." };

function parseLocation(loc) {
  if (!loc || typeof loc !== 'string') return null;
  loc = loc.trim();
  
  // Detect Austin-area
  for (const city of AUSTIN_AREA) {
    if (loc.toLowerCase().includes(city)) {
      const cityName = city.charAt(0).toUpperCase() + city.slice(1).split(' ')[0].replace(/,.*$/,'');
      return { city: cityName, state: 'TX' };
    }
  }
  
  // Try "City, STATE" or "City, ST" pattern
  const commaMatch = loc.match(/^(.+?),\s*([A-Za-z]{2,})$/);
  if (commaMatch) {
    const cityPart = commaMatch[1].trim();
    const statePart = commaMatch[2].trim();
    const stateFull = STATE_ABBREV[statePart.toLowerCase()] || (statePart.length > 2 ? statePart : null);
    return { city: cityPart, state: stateFull || statePart };
  }
  
  // Try "City State" (no comma)
  const twoWordMatch = loc.match(/^(.+?)\s+([A-Za-z]{2})$/);
  if (twoWordMatch) {
    const cityPart = twoWordMatch[1].trim();
    const statePart = twoWordMatch[2].trim();
    const stateFull = STATE_ABBREV[statePart.toLowerCase()];
    if (stateFull) return { city: cityPart, state: stateFull };
  }
  
  return null;
}

(async () => {
  // Find artists missing city but have location
  const artists = await prisma.artist.findMany({
    where: { city: null, location: { not: null } },
    select: { id: true, name: true, location: true, city: true, state: true }
  });
  
  console.log(`Found ${artists.length} artists with location but no city.\n`);
  
  let updated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const artist of artists) {
    const parsed = parseLocation(artist.location);
    if (parsed) {
      try {
        await prisma.artist.update({
          where: { id: artist.id },
          data: {
            city: parsed.city,
            state: parsed.state
          }
        });
        console.log(`  ✓ ${artist.name}`);
        console.log(`    location: "${artist.location}" → city: "${parsed.city}", state: "${parsed.state}"`);
        updated++;
      } catch(e) {
        console.error(`  ✗ ${artist.name}: ${e.message}`);
        errors++;
      }
    } else {
      skipped++;
    }
  }
  
  console.log(`\nDone: ${updated} updated, ${skipped} skipped (no parse), ${errors} errors`);
  await prisma.$disconnect();
})();
