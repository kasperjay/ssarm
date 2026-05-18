
const { PrismaClient } = require("../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require("dotenv").config();

async function main() {
  const pool = new Pool();
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  const activities = await prisma.activity.findMany({
    where: { type: "MESSAGE_SENT" },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  console.log(`Found ${activities.length} recent MESSAGE_SENT activities.`);
  activities.forEach(a => console.log(`- ${a.createdAt}: ${a.note.slice(0, 100)}...`));

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
