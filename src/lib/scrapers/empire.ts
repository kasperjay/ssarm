import type { VenueScrapeResult } from "./shared";

export async function scrapeEmpire(): Promise<VenueScrapeResult> {
  return { items: [], eventsFound: 0, eventPagesRead: 0, warnings: ["Empire Control Room & Garage is archived because the venue has closed."] };
}
