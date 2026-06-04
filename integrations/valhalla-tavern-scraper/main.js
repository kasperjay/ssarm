// Valhalla Tavern Calendar Scraper
// Scrapes event data from the Valhalla Tavern Milkshake (msha.ke) link-in-bio page.
// Each "card" on the page is a separate event with date, title, description, lineup, and links.

import { Actor } from 'apify';
import { CheerioCrawler, sleep } from 'crawlee';
import * as cheerio from 'cheerio';

await Actor.init();

const input = await Actor.getInput() || {};
const url = input.url || 'https://msha.ke/valhallatavern';
const requestTimeoutSecs = input.requestTimeoutSecs || 30;

const requestQueue = await Actor.openRequestQueue();
await requestQueue.addRequest({ url });

const crawler = new CheerioCrawler({
    requestQueue,
    maxRequestsPerCrawl: 1,
    requestTimeoutSecs,
    handlePageTimeoutSecs: 30,
    additionalMimeTypes: ['text/html'],

    async handlePageFunction({ $, request, pushData }) {
        console.log(`Processing: ${request.url}`);

        const pageTitle = $('title').text().trim();
        const siteName = pageTitle.split('•')[0].trim() || 'Valhalla Tavern';

        // The Milkshake page puts each event in a separate JSON-LD script block
        // AND in <article class="swiper-slide"> elements.
        // We parse the structured JSON-LD data and enrich with HTML where needed.

        const events = [];

        // Parse all JSON-LD BlogPosting blocks
        $('script[type="application/ld+json"]').each((i, el) => {
            try {
                const raw = $(el).html();
                if (!raw) return;
                const data = JSON.parse(raw);
                // Could be a single object or array
                const items = Array.isArray(data) ? data : [data];
                for (const item of items) {
                    if (item['@type'] === 'BlogPosting') {
                        events.push({
                            headline: item.headline || '',       // e.g. "Saturday May 30th"
                            description: item.description || '',  // e.g. "Chrome Zero, Blemish, Peace Attack"
                            url: item.url || '',
                            datePublished: item.datePublished || '',
                            dateModified: item.dateModified || '',
                            image: Array.isArray(item.image) ? item.image[0] : (item.image || ''),
                            isPartOf: item.isPartOf?.url || '',
                        });
                    }
                }
            } catch (e) {
                // some JSON-LD blocks may be malformed; skip
            }
        });

        // If JSON-LD didn't yield results, fall back to parsing HTML article cards
        if (events.length === 0) {
            $('article.swiper-slide').each((i, article) => {
                const $article = $(article);
                const hash = $article.data('hash') || '';
                const uuid = $article.data('uuid') || '';

                // Extract the image
                const imgEl = $article.find('img').first();
                const image = imgEl.attr('src') || imgEl.attr('data-src') || '';

                // Extract heading (date/title)
                const heading = $article.find('h1, h2, h3').first().text().trim();

                // Extract subheading / event title (often in a specific div pattern)
                const subheading = $article.find('[class*="subheading"], [class*="subtitle"]').first().text().trim();

                // Extract description / lineup text from paragraphs
                const paragraphs = [];
                $article.find('p').each((j, p) => {
                    const text = $(p).text().trim();
                    if (text) paragraphs.push(text);
                });
                const descriptionText = paragraphs.join('\n');

                // Extract all links
                const links = [];
                $article.find('a[href]').each((j, a) => {
                    const href = $(a).attr('href') || '';
                    const label = $(a).text().trim();
                    if (href && !href.startsWith('#')) {
                        links.push({ label, url: href });
                    }
                });

                // Extract covercharge and age info from text patterns
                const fullText = $article.text();
                const coverMatch = fullText.match(/\$(\d+)\s*cover/i);
                const ageMatch = fullText.match(/(\d+)\s*and\s*up/i);

                events.push({
                    headline: heading || subheading,
                    subheading: subheading,
                    description: descriptionText,
                    links,
                    image,
                    cover: coverMatch ? `$${coverMatch[1]}` : '',
                    ageLimit: ageMatch ? `${ageMatch[1]}+` : '21+',
                    hash,
                    uuid,
                });
            });
        }

        // Clean and normalize
        for (const event of events) {
            // Skip non-event cards (e.g. "Made with Milkshake" footer card)
            if (!event.headline || event.headline.toLowerCase().includes('made with milkshake')) {
                continue;
            }

            // Extract lineup artists from description or links
            const lineupArtists = [];
            if (event.description) {
                // Lineup items are often separated by newlines with time prefixes like "9pm BandName"
                const lines = event.description.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    // Match patterns like "9pm Band Name" or "9:30pm Band Name"
                    const timeBandMatch = trimmed.match(/^\d{1,2}(?::\d{2})?\s*(?:am|pm|AM|PM)?\s+(.+)/);
                    if (timeBandMatch) {
                        const bandName = timeBandMatch[1].trim();
                        if (bandName.length > 1 && bandName.length < 100) {
                            lineupArtists.push({ time: trimmed.split(/\s/)[0], name: bandName });
                        }
                    }
                }
            }

            // Also extract artist names from links that look like band profiles
            const artistLinks = [];
            if (event.links) {
                for (const link of event.links) {
                    const label = link.label || '';
                    // Skip generic labels
                    if (['ticket link', 'view event', 'view profile', 'get your own website', 'report this website'].includes(label.toLowerCase())) {
                        continue;
                    }
                    if (label.length > 1 && label.length < 80) {
                        artistLinks.push(link);
                    }
                }
            }

            // Parse the date from headline (e.g. "Saturday May 30th" or "Thursday June 4th")
            let eventDate = '';
            if (event.datePublished) {
                eventDate = event.datePublished;
            } else if (event.headline) {
                // Try to parse from headline text
                const dateMatch = event.headline.match(/(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:st|nd|rd|th)?/i);
                if (dateMatch) {
                    // The Milkshake page uses relative dates; the current year context is needed
                    const parsedDate = new Date(dateMatch[0] + ' ' + new Date().getFullYear());
                    if (!isNaN(parsedDate.getTime())) {
                        eventDate = parsedDate.toISOString();
                    }
                }
            }

            const result = {
                venue: 'Valhalla Tavern',
                venueName: 'Valhalla Tavern',
                venueUrl: 'https://msha.ke/valhallatavern',
                eventName: event.description || event.headline || '',
                eventTitle: [event.headline, event.description].filter(Boolean).join(' — '),
                eventDate: event.eventDate || eventDate || '',
                date: event.eventDate || eventDate,
                dateHeadline: event.headline || '',
                cover: event.cover || '',
                ageLimit: event.ageLimit || '21+',
                lineup: lineupArtists,
                artistLinks,
                ticketLinks: event.links?.filter(l =>
                    l.label.toLowerCase().includes('ticket') ||
                    l.url.includes('ticketleap') ||
                    l.url.includes('ticketmaster') ||
                    l.url.includes('dice.fm') ||
                    l.url.includes('eventbrite')
                ) || [],
                artistName: lineupArtists[0]?.name || event.description || event.headline || '',
                band: event.description || '',
                name: event.description || event.headline || '',
                image: event.image || '',
                imageUrl: event.image || '',
                eventUrl: event.url || '',
                url: event.url || '',
                sourceUrl: url,
                scrapedAt: new Date().toISOString(),
            };

            await pushData(result);
        }

        console.log(`Extracted ${events.length} events from ${request.url}`);
    },

    async handleFailedRequestFunction({ request, error }) {
        console.error(`Request ${request.url} failed:`, error.message);
    },
});

await crawler.run();

// Open dataset for output
const dataset = await Actor.openDataset();
const { itemCount } = await dataset.getInfo();
console.log(`Done. ${itemCount} items pushed to dataset.`);

await Actor.exit();
