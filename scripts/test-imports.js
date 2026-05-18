const { PrismaClient } = require('../prisma/generated-client');
const { ApifyClient } = require('apify-client');

async function test() {
  console.log('Testing PrismaClient...');
  try {
    const prisma = new PrismaClient();
    console.log('✅ PrismaClient instantiated successfully.');
  } catch (e) {
    console.error('❌ PrismaClient instantiation failed:', e.message);
  }

  console.log('Testing ApifyClient...');
  try {
    const client = new ApifyClient({ token: 'test' });
    console.log('✅ ApifyClient instantiated successfully.');
  } catch (e) {
    console.error('❌ ApifyClient instantiation failed:', e.message);
  }
}

test();
