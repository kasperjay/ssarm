require('dotenv').config();
const { PrismaClient } = require('./prisma/generated-client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/spectral?schema=public";
  const pool = new Pool({ connectionString: databaseUrl });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const username = 'kasgotthatsound';

  const artist = await prisma.artist.findFirst({
    where: { instagramHandle: { equals: username, mode: 'insensitive' } },
  });

  if (!artist) {
    console.error("Artist not found. Run add-test-lead.js first.");
    process.exit(1);
  }

  const lead = await prisma.lead.findFirst({
    where: { artistId: artist.id },
  });

  if (!lead) {
    console.error("Lead not found.");
    process.exit(1);
  }

  console.log(`Creating selected draft for @${username}...`);
  await prisma.messageDraft.create({
    data: {
      leadId: lead.id,
      body: "Hey Kas! This is a test message from the Spectral Soundworks bot. Reply to this to test the webhook!",
      selected: true,
      tone: "ig",
    },
  });

  console.log("✅ Selected draft created. Now run 'node scripts/send-messages.js'.");

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
