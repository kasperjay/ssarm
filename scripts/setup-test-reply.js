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
    console.error("Artist not found.");
    process.exit(1);
  }

  const lead = await prisma.lead.findFirst({
    where: { artistId: artist.id },
  });

  if (!lead) {
    console.error("Lead not found.");
    process.exit(1);
  }

  console.log(`Setting up test state for lead: ${lead.id} (@${username})`);

  // 1. Create a MessageDraft marked as selected
  await prisma.messageDraft.create({
    data: {
      leadId: lead.id,
      body: "Hey Kas! This is a test message to trigger the webhook flow. Reply to this!",
      channel: "instagram",
      selected: true,
      status: "PENDING"
    }
  });

  // 2. Ensure lead is CONTACTED
  await prisma.lead.update({
    where: { id: lead.id },
    data: { status: "CONTACTED" }
  });

  console.log("✅ Test draft created and lead status set to CONTACTED.");
  console.log("Now running send-messages.js to attempt delivery...");

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
