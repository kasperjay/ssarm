const { PrismaClient } = require('../prisma/generated-client');
const prisma = new PrismaClient();

async function main() {
  const username = 'kasgotthatsound';

  // Check if artist already exists
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

  // Check if lead already exists for this artist
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
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
