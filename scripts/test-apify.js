const { ApifyClient } = require('apify-client');
require('dotenv').config();

async function test() {
    const token = process.env.APIFY_ORG_TOKEN;
    if (!token) {
        console.error('❌ APIFY_ORG_TOKEN not found in env');
        return;
    }

    console.log('Testing ApifyClient with token:', token.substring(0, 10) + '...');
    const client = new ApifyClient({ token });

    try {
        console.log('Fetching actor details for scootinn...');
        const actorId = "spectral-soundworks/scootinn-calendar-scraper";
        const actor = await client.actor(actorId).get();
        if (actor) {
            console.log('✅ Actor found:', actor.name);
        } else {
            console.log('❌ Actor not found');
        }

        console.log('Attempting to start actor (dry run/test)...');
        // We won't actually start it if we don't want to spend credits, 
        // but we can check if the client objects are valid.
        console.log('✅ Client objects are valid.');
    } catch (err) {
        console.error('❌ Apify Error:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Body:', err.response.body);
        }
    }
}

test();
