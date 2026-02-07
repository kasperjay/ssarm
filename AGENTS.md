# Agent Guide: spectral-soundworks-app

This file is for agentic coding tools working in this repo.

## Project Summary
- Next.js App Router project (React 19) with Prisma + Postgres.
- Tailwind CSS v4 via `@import "tailwindcss"` in `src/app/globals.css`.
- Prisma client generated into `src/generated/prisma` (not default output).
- IG enrichment uses Apify (optional) to populate post images.

## Key Paths
- App entry: `src/app/page.tsx`
- Lead detail: `src/app/leads/[id]/page.tsx`
- Ingest endpoint: `src/app/api/ingest/route.ts`
- Prisma schema: `prisma/schema.prisma`
- Prisma client: `src/lib/prisma.ts`
- IG scrape helper: `src/lib/instagram.ts`
- IG CLI scraper: `scripts/ig-profile-scraper.js`

## Commands

### Install
```
npm install
```

### Dev server
```
npm run dev
```

### Build
```
npm run build
```

### Start production
```
npm run start
```

### Lint
```
npm run lint
```

### Prisma
```
npx prisma migrate dev --name <migration>
npx prisma migrate deploy
npx prisma generate
```

### Seed data
```
npm run seed
npm run seed:reset
```

### IG scraping CLI (Apify)
```
npm run ig:scrape -- --usernames atxhiphop,anotherhandle
```

### Tests
- No automated test runner configured.
- If tests are added later, document the single-test command here.

## Environment

Required for DB:
- `DATABASE_URL` (Postgres)

Optional for IG enrichment:
- `APIFY_TOKEN`
- `APIFY_IG_ACTOR_ID` (default: `apify/instagram-profile-scraper`)
- `APIFY_IG_RESULTS_LIMIT` (default: 6)
- `INGEST_URL` (used by CLI script)

Example env file: `.env.example`

## Data Flow

### Ingest (`/api/ingest`)
- Accepts artist + lead + releases + IG posts + drafts + activities.
- If `instagramHandle` is present, it **always** fetches latest IG posts
  from Apify and merges them into the payload before writing to DB.
- Spotify artist images and release art are fetched via Spotify oEmbed.
- Accent colors are derived from Spotify artist images and stored.

### Prisma client
- Import from `@/lib/prisma` (wraps adapter + pooling).
- Client types are from `@/generated/prisma`.

## Code Style Guidelines

### TypeScript / React
- TypeScript strict mode is enabled (`tsconfig.json`).
- Prefer explicit types for function inputs/outputs in shared utilities.
- React Server Components by default; add `"use client"` only when needed.
- Server Actions live in `src/app/**/actions.ts` and use `"use server"`.

### Imports
- Use absolute imports via `@/` for app code.
- Group imports: framework/external first, then local modules.
- Use named imports where possible (consistent with existing files).

### Formatting
- Use double quotes for strings (repo convention).
- Use semicolons and trailing commas.
- Keep JSX indentation consistent (2 spaces).

### Naming
- Components: `PascalCase`.
- Functions/variables: `camelCase`.
- Prisma models: `PascalCase` in schema, snake-free field names.
- File names: `kebab-case` for scripts, `PascalCase` for components when used.

### Error handling
- API routes wrap logic in `try/catch` and return JSON errors with status codes.
- Avoid throwing raw errors from API handlers; return structured errors.
- Log server-side errors with a clear prefix (see `/api/ingest`).

### Prisma usage
- Use `prisma.*.findMany/findUnique/count` with explicit `where/include`.
- Use `upsert` when identifiers are stable (spotify IDs, instagram post IDs).
- For new schema fields: add migrations + regenerate the Prisma client.

### Tailwind + CSS variables
- Use CSS variables defined in `:root` in `globals.css` for theme colors.
- Prefer `bg-[color:var(--surface)]` and `text-[color:var(--foreground)]` patterns.
- Avoid hard-coded light colors; theme is dark by default.

### UI behavior
- Lead detail header uses glass panels with blur; keep blur subtle.
- Activity timeline should remain visually secondary.
- Instagram section: show images and make cards clickable.
- Releases section: first item labeled “Most Recent Release”, rest “More Releases”.

## Known Non-Goals / Cautions

- `src/generated/prisma` is generated; avoid manual edits.
- `.env` is local; do not commit secrets.
- Avoid changing `prisma.config.ts` output paths unless necessary.
- Keep migrations additive and update seed data after schema changes.

## Operational Notes

- After schema changes:
  1) `npx prisma migrate dev --name <name>`
  2) `npx prisma generate`
  3) `npm run seed:reset` (optional for local demo)

- After changes to `next.config.ts`, restart dev server.

## Copilot/Cursor Rules

- No Cursor or Copilot rules files found in this repository.
