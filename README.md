Spectral Soundworks lead desk for managing artist outreach, enrichment, and scoring.

## Overview
- Lead desk dashboard at `/`
- Full leads list with filters at `/leads`
- Lead detail pages at `/leads/[id]`
- Instagram data is refreshed via `/api/ingest` and Apify scrapers

## Recent Changes
- Added full leads list with filters at `/leads`
- Added Instagram handle update modal to re-fetch posts
- Added Instagram image backfill script

## Getting Started

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` with your browser.

## Instagram Notes
- Post image URLs must be direct `scontent...` CDN URLs to render.
- Use the “Update handle” modal on the lead detail page to fix incorrect handles and re-fetch posts.
- Backfill existing posts with direct image URLs using `npm run backfill:ig-images`.

## Scripts
- `npm run backfill:ig-images` refreshes Instagram post images
- `npm run enrich:stale` refreshes stale artist data
- `npm run score` scores unscored leads

## Environment
- `APIFY_TOKEN` required for Instagram scraping
- `APIFY_IG_POSTS_ACTOR_ID` optional override (defaults to `apify/instagram-scraper`)
- `APIFY_IG_PROFILE_ACTOR_ID` optional override (defaults to `apify/instagram-profile-scraper`)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
