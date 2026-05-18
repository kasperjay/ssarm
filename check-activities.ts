import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const activities = await prisma.activity.findMany({
    take: 50,
    orderBy: { occurredAt: 'desc' },
  });
  console.log('Recent Activities:');
  console.log(JSON.stringify(activities, null, 2));

  const artists = await prisma.artist.findMany({
    take: 10,
  });
  console.log('\nSome Artists:');
  console.log(JSON.stringify(artists, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
