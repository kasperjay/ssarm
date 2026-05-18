const { ApifyClient } = require("apify-client");
require("dotenv").config();
const client = new ApifyClient({ token: process.env.APIFY_TOKEN });

async function check() {
  const actorId = "apify/instagram-hashtag-scraper";
  console.log("Starting run...");
  const run = await client.actor(actorId).call({
    hashtags: ["metalcore"],
    resultsLimit: 2
  });
  console.log("Status:", run.status);
  const dataset = await client.dataset(run.defaultDatasetId).listItems();
  console.log("Items count:", dataset.items.length);
  if (dataset.items.length > 0) {
    console.log(JSON.stringify(dataset.items[0], null, 2).substring(0, 500));
  } else {
    // try to get the log
    const log = await client.log(run.defaultKeyValueStoreId).get();
    console.log("Log excerpt:", log ? String(log).substring(0, 500) : "No log");
  }
}
check().catch(console.error);
