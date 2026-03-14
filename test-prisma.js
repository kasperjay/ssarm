const { PrismaClient } = require("./src/generated/prisma");
const prisma = new PrismaClient();
prisma.$connect()
    .then(() => {
        console.log("Connected to Prisma!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Failed to connect:", err);
        process.exit(1);
    });
