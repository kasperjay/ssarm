import { NextResponse } from "next/server";
import { getVenueScraper, isMVPVenueId, MVP_VENUES, type MVPVenueId } from "@/lib/scrapers";

export const runtime = "nodejs";

let activeCalendarSearch = false;

export async function POST(request: Request) {
  let body: { venueIds?: unknown };
  try {
    body = await request.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const requestedIds = body.venueIds === undefined ? MVP_VENUES.map((venue) => venue.id) : body.venueIds;
  if (
    !Array.isArray(requestedIds) ||
    requestedIds.length > MVP_VENUES.length ||
    requestedIds.some((id) => typeof id !== "string" || !isMVPVenueId(id))
  ) {
    return NextResponse.json({ error: "venueIds must contain only the six supported MVP venue IDs." }, { status: 400 });
  }

  const venueIds = [...new Set(requestedIds)] as MVPVenueId[];
  if (!venueIds.length) {
    return NextResponse.json({ error: "Select at least one venue." }, { status: 400 });
  }

  if (activeCalendarSearch) {
    return NextResponse.json(
      { error: "A calendar search is already running. Wait for it to finish before starting another." },
      { status: 429 },
    );
  }

  activeCalendarSearch = true;
  try {
    const windowStart = new Date();
    const windowEnd = new Date(windowStart.getTime() + 30 * 86_400_000);
    const venueResults = await Promise.all(venueIds.map(async (venueId) => {
      const venue = MVP_VENUES.find((item) => item.id === venueId)!;
      const startedAt = Date.now();
      try {
        const result = await getVenueScraper(venueId)(windowStart);
        return {
          venueId,
          venueName: venue.name,
          sourceUrl: venue.calendarUrl,
          status: result.warnings.length ? "partial" as const : "success" as const,
          artistCount: result.items.length,
          eventCount: result.eventsFound,
          eventPagesRead: result.eventPagesRead,
          durationMs: Date.now() - startedAt,
          warnings: result.warnings,
          items: result.items,
        };
      } catch (error) {
        const detail = error instanceof Error ? error.message : "The venue scraper failed.";
        console.error(`[DISCOVER CALENDAR] ${venue.name}: ${detail}`);
        return {
          venueId,
          venueName: venue.name,
          sourceUrl: venue.calendarUrl,
          status: "failed" as const,
          artistCount: 0,
          eventCount: 0,
          eventPagesRead: 0,
          durationMs: Date.now() - startedAt,
          error: detail,
          warnings: [],
          items: [],
        };
      }
    }));

    const items = venueResults.flatMap((result) => result.items);
    const failedCount = venueResults.filter((result) => result.status === "failed").length;
    const partialCount = venueResults.filter((result) => result.status === "partial").length;

    return NextResponse.json({
      status: failedCount === venueResults.length ? "failed" : failedCount || partialCount ? "partial" : "success",
      windowStart: windowStart.toISOString(),
      windowEnd: windowEnd.toISOString(),
      items,
      venues: venueResults.map(({ items: _items, ...result }) => result),
    });
  } catch (error) {
    console.error("/api/discover/calendar error", error);
    return NextResponse.json({ error: "Calendar search failed unexpectedly." }, { status: 500 });
  } finally {
    activeCalendarSearch = false;
  }
}
