const { PrismaClient } = require('../prisma/generated-client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL not set");
    return;
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    await prisma.$connect();
    const leads = await prisma.lead.findMany({
      include: { artist: true },
      take: 5
    });
    console.log(`Found ${leads.length} leads in database.`);
    leads.forEach(l => console.log(`- ${l.artist.name} (Status: ${l.status}, Score: ${l.score})`));
  } catch (err) {
    console.error("Error checking DB:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main();
