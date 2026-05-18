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

(async () => {
  const total = await prisma.artist.count();
  const withCity = await prisma.artist.count({ where: { city: { not: null } } });
  const withLocation = await prisma.artist.count({ where: { location: { not: null } } });
  const withState = await prisma.artist.count({ where: { state: { not: null } } });
  const withCountry = await prisma.artist.count({ where: { country: { not: null } } });
  const withCityOrLocation = await prisma.artist.count({ where: { OR: [{ city: { not: null } }, { location: { not: null } }] } });
  
  const missingAll = await prisma.artist.findMany({ 
    where: { AND: [{ city: null }, { location: null }, { state: null }] },
    select: { id: true, name: true, instagramHandle: true, city: true, location: true, state: true, country: true },
    take: 20
  });
  
  console.log('Total artists:', total);
  console.log('With city:', withCity, '(' + Math.round(withCity/total*100) + '%)');
  console.log('With location:', withLocation);
  console.log('With state:', withState);
  console.log('With country:', withCountry);
  console.log('With city OR location:', withCityOrLocation);
  console.log('---');
  console.log('Missing city AND location AND state:', missingAll.length);
  if (missingAll.length > 0) {
    console.log('\nSample missing:');
    missingAll.forEach(a => console.log(' -', a.name, '| IG:', a.instagramHandle || 'none', '| city:', a.city, '| location:', a.location, '| state:', a.state, '| country:', a.country));
  }
  
  await prisma.$disconnect();
})();
