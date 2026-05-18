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

const AUSTIN_AREA = ["austin","round rock","pflugerville","cedar park","georgetown","san marcos","kyle","buda","dripping springs","hutto","manor","lakeway","beecave","westlake","rollingwood","spicewood","bastrop","taylor","elgin"];

(async () => {
  // Check how many with location actually contain Austin keywords
  const withAustinInLocation = await prisma.artist.findMany({
    where: {
      location: { not: null },
      OR: [
        { city: null },
        { AND: [{ city: null }, { state: null }] }
      ]
    },
    select: { id: true, name: true, city: true, state: true, location: true }
  });

  const locationBreakdown = await prisma.artist.groupBy({
    by: ['state'],
    _count: { state: true },
    where: { state: { not: null } },
    orderBy: { _count: { state: 'desc' } }
  });

  console.log('Artists by state:');
  locationBreakdown.forEach(r => console.log(' ', r.state || 'null', ':', r._count.state));

  // How many have a real city set
  const withCityNoAustin = await prisma.artist.count({ where: { city: { not: null }, NOT: {} } });
  
  // Check how many of the 180 with location have Austin-related
  const austinMatches = [];
  for (const a of withAustinInLocation) {
    const loc = (a.location || '').toLowerCase();
    for (const city of AUSTIN_AREA) {
      if (loc.includes(city)) {
        austinMatches.push(a.name + ' | ' + a.location);
        break;
      }
    }
  }
  console.log('\nLocation field contains Austin-area keywords:', austinMatches.length);
  
  // State breakdown for those with state but no city
  const withStateNoCity = await prisma.artist.groupBy({
    by: ['state'],
    _count: { state: true },
    where: { state: { not: null }, city: null },
    orderBy: { _count: { state: 'desc' } }
  });
  console.log('\nWith state but NO city:');
  withStateNoCity.forEach(r => console.log(' ', r.state || 'null', ':', r._count.state));
  
  await prisma.$disconnect();
})();
