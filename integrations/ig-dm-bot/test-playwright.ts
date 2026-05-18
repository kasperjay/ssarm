
import { chromium } from 'playwright';

async function run() {
  console.log('Launching...');
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  console.log('Launched!');
  const page = await browser.newPage();
  await page.goto('https://example.com');
  console.log('Title:', await page.title());
  await browser.close();
  console.log('Closed!');
}

run().catch(console.error);
