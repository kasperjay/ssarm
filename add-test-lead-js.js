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

  let artist = await prisma.artist.findFirst({
    where: { instagramHandle: { equals: username, mode: 'insensitive' } },
  });

  if (!artist) {
    console.log(`Creating artist: @${username}...`);
    artist = await prisma.artist.create({
      data: {
        name: 'Kas (Test User)',
        instagramHandle: username,
      },
    });
  } else {
    console.log(`Artist @${username} already exists (ID: ${artist.id}).`);
  }

  let lead = await prisma.lead.findFirst({
    where: { artistId: artist.id },
  });

  if (!lead) {
    console.log(`Creating lead for artist...`);
    lead = await prisma.lead.create({
      data: {
        artistId: artist.id,
        status: 'CONTACTED',
        score: 85,
        scoreRationale: 'Test lead for verifying Instagram DM webhook integration.',
      },
    });
  } else {
    console.log(`Updating lead to 'CONTACTED' status (ID: ${lead.id})...`);
    lead = await prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'CONTACTED' },
    });
  }

  console.log(`\n✅ Success! You now have a lead in the database.`);
  console.log(`Artist Name: ${artist.name}`);
  console.log(`Instagram Handle: @${artist.instagramHandle}`);
  console.log(`Lead Status: ${lead.status}`);
  console.log(`\nWhen they reply, the webhook will automatically bump their status to FOLLOW_UP.`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
