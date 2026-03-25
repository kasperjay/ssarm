const { ApifyClient } = require("apify-client");
require("dotenv").config();

async function check() {
  const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
  const run = await client.actor("apify/instagram-hashtag-scraper").call({
    hashtags: ["metalcore"],
    resultsLimit: 2
  });
  console.log("Status:", run.status);
  const dataset = await client.dataset(run.defaultDatasetId).listItems();
  console.log("Items count:", dataset.items.length);
  if (dataset.items.length > 0) {
    console.log(JSON.stringify(dataset.items[0], null, 2).substring(0, 500));
  } else {
    const log = await client.log(run.defaultKeyValueStoreId).get();
    console.log("Log excerpt:", log ? String(log).substring(log.byteLength - 500) : "No log");
  }
}
check().catch(console.error);
