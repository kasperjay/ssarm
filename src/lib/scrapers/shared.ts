import { JSDOM, VirtualConsole } from "jsdom";
import type { MVPVenue } from "./config";

const TIME_ZONE = "America/Chicago";
const SCRAPER_TIMEOUT_MS = 30_000;
const EVENT_DETAIL_CONCURRENCY = 4;
const GLOBAL_HTTP_CONCURRENCY = 8;
const WEEKDAYS: Record<string, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

type HttpWaiter = {
  signal: AbortSignal;
  resolve: () => void;
  reject: (error: Error) => void;
  onAbort: () => void;
};

let activeHttpRequests = 0;
const httpWaiters: HttpWaiter[] = [];

function scraperTimeoutError(): Error {
  return new Error("Venue scraper timed out after 30 seconds.");
}

function releaseHttpRequestSlot(): void {
  const waiter = httpWaiters.shift();
  if (!waiter) {
    activeHttpRequests -= 1;
    return;
  }

  waiter.signal.removeEventListener("abort", waiter.onAbort);
  if (waiter.signal.aborted) {
    waiter.reject(scraperTimeoutError());
    releaseHttpRequestSlot();
    return;
  }
  waiter.resolve();
}

async function acquireHttpRequestSlot(signal: AbortSignal): Promise<void> {
  if (signal.aborted) throw scraperTimeoutError();
  if (activeHttpRequests < GLOBAL_HTTP_CONCURRENCY) {
    activeHttpRequests += 1;
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const waiter = {} as HttpWaiter;
    waiter.signal = signal;
    waiter.resolve = resolve;
    waiter.reject = reject;
    waiter.onAbort = () => {
      const index = httpWaiters.indexOf(waiter);
      if (index !== -1) httpWaiters.splice(index, 1);
      reject(scraperTimeoutError());
    };
    signal.addEventListener("abort", waiter.onAbort, { once: true });
    httpWaiters.push(waiter);
  });
}

export type ScrapedArtistEvent = {
  artist: string;
  artistProfileUrl?: string;
  eventTitle: string;
  eventDate: string;
  eventDateOnly: boolean;
  venueName: string;
  eventUrl: string;
  sourceUrl: string;
  description?: string;
};

export type VenueScrapeResult = {
  items: ScrapedArtistEvent[];
  eventsFound: number;
  eventPagesRead: number;
  warnings: string[];
};

type CalendarEvent = {
  title: string;
  startDate: string;
  startDateOnly: boolean;
  eventUrl: string;
  recurringWeekday?: number;
};

type Performer = {
  name: string;
  url?: string;
};

type EventDetails = {
  performers: Performer[];
  description?: string;
  failed: boolean;
};

function normalizeText(value: string | null | undefined): string {
  return (value || "").replace(/\s+/g, " ").trim();
}

function datePartsInZone(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
  };
}

function monthsBetween(start: Date, end: Date): number {
  const from = datePartsInZone(start);
  const to = datePartsInZone(end);
  return Math.max(0, (to.year - from.year) * 12 + to.month - from.month);
}

function chicagoOffsetMinutes(year: number, month: number, day: number): number {
  const probe = new Date(Date.UTC(year, month - 1, day, 18));
  const zoneName = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    timeZoneName: "shortOffset",
  }).formatToParts(probe).find((part) => part.type === "timeZoneName")?.value;
  const match = zoneName?.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);
  if (!match) throw new Error("Could not determine the Austin time-zone offset.");
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] || 0));
}

function chicagoDateTimeIso(year: number, month: number, day: number, hour: number, minute: number, second = 0): string {
  const offset = chicagoOffsetMinutes(year, month, day);
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second) - offset * 60_000).toISOString();
}

type EventOccurrence = {
  eventDate: string;
  dateOnly: boolean;
};

function parseCalendarDate(value: string): EventOccurrence | null {
  const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const utcMidnight = value.match(/^(\d{4})-(\d{2})-(\d{2})T00:00(?::00(?:\.0+)?)?(?:Z|\+00:00)$/i);
  const localDate = dateOnly || utcMidnight;
  if (localDate) {
    const eventDate = chicagoDateTimeIso(Number(localDate[1]), Number(localDate[2]), Number(localDate[3]), 0, 0);
    return { eventDate, dateOnly: true };
  }

  const localDateTime = value.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (localDateTime) {
    const eventDate = chicagoDateTimeIso(
      Number(localDateTime[1]),
      Number(localDateTime[2]),
      Number(localDateTime[3]),
      Number(localDateTime[4]),
      Number(localDateTime[5]),
      Number(localDateTime[6] || 0),
    );
    return { eventDate, dateOnly: false };
  }

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? { eventDate: new Date(timestamp).toISOString(), dateOnly: false } : null;
}

function recurrenceDates(event: CalendarEvent, now: Date, end: Date): EventOccurrence[] {
  if (event.recurringWeekday === undefined) {
    const parsed = parseCalendarDate(event.startDate);
    const timestamp = parsed ? Date.parse(parsed.eventDate) : Number.NaN;
    return parsed && timestamp >= now.getTime() && timestamp <= end.getTime() ? [parsed] : [];
  }

  const time = event.startDate.match(/T(\d{2}):(\d{2})/);
  const hour = time ? Number(time[1]) : 0;
  const minute = time ? Number(time[2]) : 0;
  const { year, month, day } = datePartsInZone(now);
  const firstDate = Date.UTC(year, month - 1, day);
  const daysToScan = Math.ceil((end.getTime() - now.getTime()) / 86_400_000) + 2;
  const occurrences: EventOccurrence[] = [];

  for (let offset = 0; offset <= daysToScan; offset += 1) {
    const civilDate = new Date(firstDate + offset * 86_400_000);
    if (civilDate.getUTCDay() !== event.recurringWeekday) continue;
    const iso = chicagoDateTimeIso(
      civilDate.getUTCFullYear(),
      civilDate.getUTCMonth() + 1,
      civilDate.getUTCDate(),
      hour,
      minute,
    );
    const timestamp = Date.parse(iso);
    if (timestamp >= now.getTime() && timestamp <= end.getTime()) {
      occurrences.push({ eventDate: iso, dateOnly: event.startDateOnly });
    }
  }

  return occurrences;
}

function parseCalendarEvents(html: string, pageUrl: string): CalendarEvent[] {
  const document = new JSDOM(html, {
    url: pageUrl,
    virtualConsole: new VirtualConsole(),
  }).window.document;
  const events: CalendarEvent[] = [];

  for (const card of document.querySelectorAll('[itemprop="event"]')) {
    const title = normalizeText(
      card.querySelector('[itemprop="name"]')?.textContent ||
      card.querySelector(".ds-title, h2, h3, h4")?.textContent,
    );
    const dateElement = card.querySelector('[itemprop="startDate"]');
    const startDate =
      dateElement?.getAttribute("content") ||
      dateElement?.getAttribute("datetime") ||
      dateElement?.getAttribute("startDate") ||
      "";
    const anchor = card.querySelector('a[itemprop="url"]') || card.querySelector('a[href*="/events/"]');
    const href = anchor?.getAttribute("href");

    if (!title || !startDate || !href) continue;

    let url: URL;
    try {
      url = new URL(href, pageUrl);
    } catch {
      continue;
    }
    if (url.protocol !== "https:" || url.hostname !== "family.do512.com" || !url.pathname.startsWith("/events/")) {
      continue;
    }

    const weekly = url.pathname.match(/\/events\/weekly\/(sun|mon|tue|wed|thu|fri|sat)\//i);
    const startDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(startDate) ||
      /^\d{4}-\d{2}-\d{2}T00:00(?::00(?:\.0+)?)?(?:Z|\+00:00)$/i.test(startDate);
    events.push({
      title,
      startDate,
      startDateOnly,
      eventUrl: url.toString(),
      recurringWeekday: weekly ? WEEKDAYS[weekly[1].toLowerCase()] : undefined,
    });
  }

  return events;
}

function cleanArtistName(value: string): string {
  return normalizeText(value)
    .replace(/\s*\([^)]*\b(?:Austin|TX|Texas|USA|United States|EP release|album release|single release)\b[^)]*\)/gi, "")
    .replace(/\s+([!?,.:;])/g, "$1")
    .replace(/^(?:and|&|feat\.?|featuring)\s+/i, "")
    .replace(/\s+(?:21\+|18\+|all ages)$/i, "")
    .trim();
}

function isNonArtistEvent(value: string): boolean {
  return /\b(?:movie|film|screening|trivia(?: night)?|karaoke|dance class|drag show|bingo|market|open mic|happy hour|watch party|costume contest|anniversary|book club|comedy show|football|soccer match|which witch wednesdays|cumbia night)\b/i.test(value) ||
    /^(?:blue monday|hotel vegas movie club|free week|lezfest|primos on the patio|the rocky horror drag show)\b/i.test(value);
}

export function splitArtistTitle(value: string): string[] {
  let title = normalizeText(value);
  title = title.replace(/^[^:]{1,90}\bpresents?\s*:\s*/i, "");
  title = title.replace(/^(?:presented by|presents?)\s+/i, "");
  title = title.replace(/\s*[,&+]\s*(?:free\s+)?(?:cumbia\s+)?dance class\b.*$/i, "");
  title = title.replace(/\s+(?:on|at)\s+(?:the\s+)?(?:hotel vegas|volstead(?: lounge)?|mohawk(?: austin)?|continental(?: gallery| club)?|antone'?s|come and take it(?: live)?)(?:\s+patio)?\s*$/i, "");
  if (!title) return [];

  const sections = title.split(/\s+(?:w\/|with|ft\.?|feat(?:uring)?\.?)\s+/i);
  const names: string[] = [];
  sections.forEach((section, index) => {
    const commaSeparated = section.split(/\s*[;,]\s*/);
    for (const [partIndex, part] of commaSeparated.entries()) {
      const candidates = index > 0 || partIndex > 0 ? part.split(/\s+(?:&|and)\s+/i) : [part];
      for (const candidate of candidates) {
        const name = cleanArtistName(candidate.replace(/^(?:and|&|plus)\s+/i, ""));
        if (!name || isNonArtistEvent(name) || /^(?:tba|to be announced|various artists|more bands?)$/i.test(name)) continue;
        if (!names.some((existing) => existing.toLowerCase().replace(/[^a-z0-9]/g, "") === name.toLowerCase().replace(/[^a-z0-9]/g, ""))) names.push(name);
      }
    }
  });

  return names;
}

function addJsonLdPerformers(value: unknown, performers: Performer[]): void {
  if (Array.isArray(value)) {
    value.forEach((item) => addJsonLdPerformers(item, performers));
    return;
  }
  if (!value || typeof value !== "object") return;

  const record = value as Record<string, unknown>;
  if (record.performer) {
    const people = Array.isArray(record.performer) ? record.performer : [record.performer];
    for (const person of people) {
      if (typeof person === "string") {
        const name = cleanArtistName(person);
        if (name) performers.push({ name });
      } else if (person && typeof person === "object") {
        const artist = person as Record<string, unknown>;
        const name = cleanArtistName(typeof artist.name === "string" ? artist.name : "");
        const url = typeof artist.url === "string" ? artist.url : undefined;
        if (name) performers.push({ name, url });
      }
    }
  }
  Object.values(record).forEach((item) => addJsonLdPerformers(item, performers));
}

function parseEventDetails(html: string, eventUrl: string): Omit<EventDetails, "failed"> {
  const document = new JSDOM(html, {
    url: eventUrl,
    virtualConsole: new VirtualConsole(),
  }).window.document;
  const performers: Performer[] = [];

  for (const element of document.querySelectorAll('[itemprop="performer"]')) {
    const name = cleanArtistName(
      element.querySelector('[itemprop="name"]')?.textContent || element.textContent || "",
    );
    const href = element.querySelector('a[itemprop="url"]')?.getAttribute("href");
    if (name) {
      let url: string | undefined;
      if (href) {
        try {
          url = new URL(href, eventUrl).toString();
        } catch {
          url = undefined;
        }
      }
      performers.push({ name, url });
    }
  }

  for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      addJsonLdPerformers(JSON.parse(script.textContent || ""), performers);
    } catch {
      continue;
    }
  }

  const unique = new Map<string, Performer>();
  for (const performer of performers) {
    const key = performer.name.toLowerCase();
    if (!unique.has(key)) unique.set(key, performer);
  }

  return {
    performers: [...unique.values()],
    description: normalizeText(document.querySelector('meta[name="description"]')?.getAttribute("content")) || undefined,
  };
}

async function fetchHtml(url: string, signal: AbortSignal): Promise<string> {
  await acquireHttpRequestSlot(signal);
  try {
    const response = await fetch(url, {
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      redirect: "follow",
      signal,
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`Calendar request returned ${response.status}.`);
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) throw new Error("Calendar returned a non-HTML response.");
    return await response.text();
  } finally {
    releaseHttpRequestSlot();
  }
}

async function mapLimit<T, U>(items: T[], limit: number, signal: AbortSignal, task: (item: T) => Promise<U>): Promise<U[]> {
  const output = new Array<U>(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) {
      if (signal.aborted) throw new Error("Venue scraper timed out after 30 seconds.");
      const index = nextIndex;
      nextIndex += 1;
      if (index >= items.length) return;
      output[index] = await task(items[index]);
    }
  });
  await Promise.all(workers);
  return output;
}

export async function scrapeDo512Venue(venue: MVPVenue, now = new Date()): Promise<VenueScrapeResult> {
  const end = new Date(now.getTime() + 30 * 86_400_000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SCRAPER_TIMEOUT_MS);

  try {
    const lastPeriod = monthsBetween(now, end);
    const pageResults = await Promise.allSettled(
      Array.from({ length: lastPeriod + 1 }, (_, period) => {
        const url = new URL(venue.calendarUrl);
        url.searchParams.set("period", String(period));
        return fetchHtml(url.toString(), controller.signal).then((html) => ({ html, url: url.toString() }));
      }),
    );
    const successfulPages = pageResults.flatMap((result) => result.status === "fulfilled" ? [result.value] : []);
    const pageFailures = pageResults.length - successfulPages.length;
    if (controller.signal.aborted) throw new Error("Venue scraper timed out after 30 seconds.");
    if (!successfulPages.length) throw new Error("Could not load the public event calendar.");

    const warnings: string[] = [];
    if (pageFailures) warnings.push(`${pageFailures} calendar month page(s) could not be loaded.`);

    const eventMap = new Map<string, CalendarEvent>();
    for (const page of successfulPages) {
      for (const event of parseCalendarEvents(page.html, page.url)) {
        const dates = recurrenceDates(event, now, end);
        for (const occurrence of dates) {
          const key = `${event.eventUrl}|${Date.parse(occurrence.eventDate)}`;
          if (!eventMap.has(key)) eventMap.set(key, { ...event, startDate: occurrence.eventDate, startDateOnly: occurrence.dateOnly });
        }
      }
    }

    const candidateEvents = [...eventMap.values()].sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
    const uniqueEventUrls = [...new Set(candidateEvents.filter((event) => !isNonArtistEvent(event.title)).map((event) => event.eventUrl))];
    const detailEntries: Array<EventDetails & { eventUrl: string }> = await mapLimit(uniqueEventUrls, EVENT_DETAIL_CONCURRENCY, controller.signal, async (eventUrl) => {
      try {
        const html = await fetchHtml(eventUrl, controller.signal);
        return { eventUrl, ...parseEventDetails(html, eventUrl), failed: false } satisfies EventDetails & { eventUrl: string };
      } catch (error) {
        if (controller.signal.aborted) throw error;
        return { eventUrl, performers: [], failed: true } satisfies EventDetails & { eventUrl: string };
      }
    });

    if (controller.signal.aborted) throw new Error("Venue scraper timed out after 30 seconds.");

    const detailByUrl = new Map(detailEntries.map((entry) => [entry.eventUrl, entry]));
    const detailFailures = detailEntries.filter((entry) => entry.failed).length;
    if (detailFailures) warnings.push(`${detailFailures} event detail page(s) could not be loaded; event titles were used as fallback.`);

    const items: ScrapedArtistEvent[] = [];
    const seen = new Set<string>();
    for (const event of candidateEvents) {
      const details = detailByUrl.get(event.eventUrl);
      const performers: Performer[] = details?.performers.length
        ? details.performers
        : splitArtistTitle(event.title).map((name) => ({ name }));
      const performerMap = new Map<string, Performer>();

      for (const performer of performers) {
        const artist = cleanArtistName(performer.name);
        if (!artist || isNonArtistEvent(artist) || /^(?:tba|to be announced|various artists|more bands?)$/i.test(artist)) continue;
        const performerKey = artist.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "");
        if (!performerMap.has(performerKey)) performerMap.set(performerKey, { ...performer, name: artist });
      }

      for (const performer of performerMap.values()) {
        const artist = performer.name;
        const key = `${artist.normalize("NFKD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]/g, "")}|${event.eventUrl}|${Date.parse(event.startDate)}`;
        if (seen.has(key)) continue;
        seen.add(key);
        items.push({
          artist,
          artistProfileUrl: performer.url,
          eventTitle: event.title,
          eventDate: new Date(event.startDate).toISOString(),
          eventDateOnly: event.startDateOnly,
          venueName: venue.name,
          eventUrl: event.eventUrl,
          sourceUrl: event.eventUrl,
          description: details?.description,
        });
      }
    }

    return {
      items,
      eventsFound: candidateEvents.length,
      eventPagesRead: detailEntries.length - detailFailures,
      warnings,
    };
  } catch (error) {
    if (controller.signal.aborted) throw new Error("Venue scraper timed out after 30 seconds.");
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
