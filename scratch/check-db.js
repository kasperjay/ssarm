const { PrismaClient } = require("../prisma/generated-client");
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to Prisma!");
    
    const artistCount = await prisma.artist.count();
    const leadCount = await prisma.lead.count();
    
    console.log(`Artist count: ${artistCount}`);
    console.log(`Lead count: ${leadCount}`);
    
    if (artistCount > 0) {
      const artists = await prisma.artist.findMany({ take: 5 });
      console.log("Sample artists:", JSON.stringify(artists, null, 2));
    }
  } catch (err) {
    console.error("Failed to connect or query:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
