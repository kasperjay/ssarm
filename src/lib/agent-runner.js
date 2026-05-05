const { PrismaClient } = require("../../prisma/generated-client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function withAgentRun(agentName, options, fn) {
  const mode = options.dryRun ? "DRY_RUN" : "LIVE";
  
  // Create initial run record
  const runRecord = await prisma.agentRun.create({
    data: {
      agentName,
      mode,
      status: "STARTED",
    }
  });

  console.log(`[AgentRun] Logged start of ${agentName} (ID: ${runRecord.id})`);

  try {
    const result = await fn();
    
    await prisma.agentRun.update({
      where: { id: runRecord.id },
      data: {
        finishedAt: new Date(),
        status: "COMPLETED",
        totals: result ? JSON.stringify(result) : null,
      }
    });

    console.log(`[AgentRun] Logged completion of ${agentName}`);
    return result;
  } catch (error) {
    await prisma.agentRun.update({
      where: { id: runRecord.id },
      data: {
        finishedAt: new Date(),
        status: "FAILED",
        error: error.message || String(error),
      }
    });
    console.error(`[AgentRun] Logged failure of ${agentName}: ${error.message}`);
    throw error;
  } finally {
    // DO NOT disconnect pool here if the main script is managing it
    // But we need to make sure Prisma connection is closed eventually
  }
}

module.exports = {
  withAgentRun,
  prisma, // export to avoid multiple instances in scripts if they want to reuse
  pool
};
