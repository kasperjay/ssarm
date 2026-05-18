
const { PrismaClient } = require("../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require("dotenv").config();

async function main() {
  const pool = new Pool();
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  console.log("--- Latest Message Drafts ---");
  const drafts = await prisma.messageDraft.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  console.log(JSON.stringify(drafts, null, 2));

  console.log("\n--- Latest Activities ---");
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  });
  console.log(JSON.stringify(activities, null, 2));

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
