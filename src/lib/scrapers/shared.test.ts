import { afterEach, describe, expect, it, vi } from "vitest";
import { MVP_VENUES } from "./config";
import { scrapeDo512Venue, splitArtistTitle } from "./shared";

afterEach(() => {
  vi.unstubAllGlobals();
});

function calendarCard(title: string, date: string, slug: string): string {
  return `<article itemprop="event"><h3 itemprop="name">${title}</h3><time itemprop="startDate" datetime="${date}"></time><a itemprop="url" href="/events/${slug}">Details</a></article>`;
}

describe("direct venue calendar scrapers", () => {
  it("keeps the six approved MVP venues, including Come and Take It Live", () => {
    expect(MVP_VENUES.map((venue) => venue.name)).toEqual([
      "Come and Take It Live",
      "Continental Club",
      "Continental Gallery",
      "Hotel Vegas",
      "Antone's",
      "Mohawk",
    ]);
  });

  it("splits each lineup artist separately and excludes non-music events", () => {
    expect(splitArtistTitle("Headliner w/ Support One, Support Two")).toEqual([
      "Headliner",
      "Support One",
      "Support Two",
    ]);
    expect(splitArtistTitle("Trivia Night at Hotel Vegas")).toEqual([]);
  });

  it("filters the rolling 30-day window, follows event pages, and falls back to event-title lineups", async () => {
    const now = new Date("2026-01-10T18:00:00.000Z");
    const withinWindow = calendarCard("Night Show", "2026-01-20T20:00:00-06:00", "night-show");
    const fallback = calendarCard("Headliner w/ Support One, Support Two", "2026-02-01T20:00:00-06:00", "fallback-show");
    const outsideWindow = calendarCard("Too Late", "2026-03-01T20:00:00-06:00", "outside-window");
    const calendarHtml = `${withinWindow}${fallback}${outsideWindow}${calendarCard("Movie Club", "2026-01-21T20:00:00-06:00", "movie-club")}`;
    const detailHtml = `
      <meta name="description" content="A live music bill">
      <div itemprop="performer"><a itemprop="url" href="/artists/artist-one"><span itemprop="name">Artist One</span></a></div>
      <script type="application/ld+json">{"@type":"MusicEvent","performer":[{"@type":"MusicGroup","name":"Artist Two","url":"https://do512.com/artists/artist-two"}]}</script>
    `;
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/month_events")) {
        return new Response(calendarHtml, { headers: { "content-type": "text/html; charset=utf-8" } });
      }
      if (url.endsWith("/events/night-show")) {
        return new Response(detailHtml, { headers: { "content-type": "text/html; charset=utf-8" } });
      }
      if (url.endsWith("/events/fallback-show")) {
        return new Response("blocked", { status: 503, headers: { "content-type": "text/html" } });
      }
      throw new Error(`Unexpected URL: ${url}`);
    });
    vi.stubGlobal("fetch", fetchMock);

    const venue = MVP_VENUES.find((item) => item.id === "come-and-take-it")!;
    const result = await scrapeDo512Venue(venue, now);

    expect(result.eventsFound).toBe(3);
    expect(result.items.map((item) => item.artist).sort()).toEqual([
      "Artist One",
      "Artist Two",
      "Headliner",
      "Support One",
      "Support Two",
    ]);
    expect(result.items.find((item) => item.artist === "Artist One")).toMatchObject({
      eventTitle: "Night Show",
      eventUrl: "https://family.do512.com/events/night-show",
      artistProfileUrl: "https://family.do512.com/artists/artist-one",
      description: "A live music bill",
    });
    expect(result.eventPagesRead).toBe(1);
    expect(result.warnings).toContain("1 event detail page(s) could not be loaded; event titles were used as fallback.");
    expect(fetchMock).not.toHaveBeenCalledWith(expect.stringContaining("outside-window"), expect.anything());
    expect(fetchMock).not.toHaveBeenCalledWith(expect.stringContaining("movie-club"), expect.anything());
  });
});
