/**
 * Google Calendar integration utilities.
 *
 * Two responsibilities:
 *
 * 1. `buildBookingUrl({...})` — pure URL generator that produces a Google Calendar
 *    "create event" deep link. This is what we send to leads so they can book a
 *    session without us needing a backend calendar round-trip.
 *
 * 2. `fetchTodayEvents()` / `fetchUpcomingEvents()` — fetches the artist's
 *    calendar events via an Apps Script webhook (matches the Google Sheets
 *    pattern). The webhook URL goes in `GOOGLE_CALENDAR_WEBHOOK_URL`. If unset,
 *    the /calendar page renders an empty-state rather than crashing.
 *
 *    See /home/workspace/ss-app/APPS_SCRIPT_CALENDAR.md for the Apps Script
 *    contents to paste into Extensions → Apps Script in your Google Calendar
 *    account's bound script editor.
 *
 * Why eventCreate links instead of an Appointment Schedule?
 *   - Works with any Google account, no setup.
 *   - Lead sees a real calendar with their timezone, picks a slot, you get the
 *     invite like any other event.
 *   - The /calendar page surfaces incoming bookings so they don't get lost.
 */

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  start: string; // ISO
  end?: string | null;
  allDay?: boolean;
  attendees?: string[];
  htmlLink?: string | null;
  meetLink?: string | null;
  status?: string;
};

export type BookingLinkInput = {
  artistName: string;
  artistEmail?: string | null;
  artistHandle?: string | null;
  sessionLengthMinutes?: number; // default 30
  hostEmail?: string | null;
  notes?: string | null;
};

const DEFAULT_SESSION_LENGTH_MIN = 30;

/**
 * Build a Google Calendar `eventCreate` URL prefilled for a booking with this
 * lead. The lead clicks the link → Google Calendar opens → they pick a slot →
 * invite lands in your inbox (and on the /calendar page if the webhook is set).
 */
export function buildBookingUrl(input: BookingLinkInput): string {
  const length = input.sessionLengthMinutes ?? DEFAULT_SESSION_LENGTH_MIN;
  const title = `Spectral Session — ${input.artistName}`;
  const details = [
    input.notes?.trim(),
    "",
    `Booked via Spectral Soundworks.`,
    input.artistHandle ? `Artist IG: @${input.artistHandle.replace(/^@/, "")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details,
  });

  if (input.hostEmail) params.set("src", input.hostEmail.trim());
  if (input.artistEmail) {
    params.append("to", input.artistEmail.trim());
  }
  // Use the shorter URL form so it fits in DMs / messages.
  params.set("ctz", Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC");

  // We deliberately omit `dates` so the lead picks their own time.
  void length;

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Build a human-readable short message for sending alongside the booking link
 * via the existing IG DM pipeline.
 */
export function buildBookingMessage(input: {
  artistName: string;
  bookingUrl: string;
  sessionLengthMinutes?: number;
}): string {
  const length = input.sessionLengthMinutes ?? DEFAULT_SESSION_LENGTH_MIN;
  return (
    `Hey ${input.artistName} — would love to set up a ${length}-min session to talk through your project. ` +
    `Grab a time that works for you here:\n${input.bookingUrl}\n\n` +
    `Talk soon, Spectral`
  );
}

export function formatEventTime(
  iso: string | null | undefined,
  allDay?: boolean
): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (allDay) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

type WebhookPayload =
  | { ok: true; events: CalendarEvent[] }
  | { ok: false; error: string };

/**
 * Fetch calendar events from the Apps Script webhook.
 *
 * The Apps Script is expected to accept POST with JSON body:
 *   { action: "list", rangeStart: ISO, rangeEnd: ISO }
 * and return:
 *   { ok: true, events: CalendarEvent[] }
 *
 * See APPS_SCRIPT_CALENDAR.md for the matching Apps Script code.
 */
export async function fetchCalendarEvents(opts: {
  rangeStart: Date;
  rangeEnd: Date;
  maxResults?: number;
}): Promise<{ ok: true; events: CalendarEvent[] } | { ok: false; error: string }> {
  const webhookUrl = process.env.GOOGLE_CALENDAR_WEBHOOK_URL;
  if (!webhookUrl) {
    return { ok: false, error: "GOOGLE_CALENDAR_WEBHOOK_URL is not configured." };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "list",
        rangeStart: opts.rangeStart.toISOString(),
        rangeEnd: opts.rangeEnd.toISOString(),
        maxResults: opts.maxResults ?? 50,
      }),
    });

    const text = await response.text();
    let payload: WebhookPayload;
    try {
      payload = JSON.parse(text) as WebhookPayload;
    } catch {
      return {
        ok: false,
        error: `Calendar webhook returned non-JSON (${response.status}): ${text.slice(0, 200)}`,
      };
    }

    if (!payload.ok) {
      return { ok: false, error: payload.error };
    }
    return payload;
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error calling calendar webhook.",
    };
  }
}

export function isSameDay(a: Date | string, b: Date | string): boolean {
  const ad = typeof a === "string" ? new Date(a) : a;
  const bd = typeof b === "string" ? new Date(b) : b;
  return (
    ad.getUTCFullYear() === bd.getUTCFullYear() &&
    ad.getUTCMonth() === bd.getUTCMonth() &&
    ad.getUTCDate() === bd.getUTCDate()
  );
}

export function formatEventTimeRange(event: CalendarEvent): string {
  const start = new Date(event.start);
  const end = event.end ? new Date(event.end) : new Date(start.getTime() + 60 * 60 * 1000);
  if (event.allDay) {
    return "All day";
  }
  const fmt = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}

export async function listUpcomingEvents(opts?: {
  maxResults?: number;
  daysAhead?: number;
}): Promise<{ ok: true; events: CalendarEvent[] } | { ok: false; error: string }> {
  const webhookUrl = process.env.GOOGLE_CALENDAR_WEBHOOK_URL;
  if (!webhookUrl) {
    return { ok: false, error: "GOOGLE_CALENDAR_WEBHOOK_URL not configured" };
  }

  const params = new URLSearchParams({
    action: "listEvents",
    maxResults: String(opts?.maxResults ?? 25),
    daysAhead: String(opts?.daysAhead ?? 30),
  });

  try {
    const response = await fetch(`${webhookUrl}?${params.toString()}`, {
      method: "GET",
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return {
        ok: false,
        error: `Calendar webhook returned ${response.status}: ${text.slice(0, 120)}`,
      };
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const data = (await response.json()) as { events?: CalendarEvent[] };
      return { ok: true, events: Array.isArray(data.events) ? data.events : [] };
    }

    // Apps Script web apps sometimes return text/plain — try to parse as JSON, otherwise empty
    const text = await response.text();
    try {
      const data = JSON.parse(text) as { events?: CalendarEvent[] };
      return { ok: true, events: Array.isArray(data.events) ? data.events : [] };
    } catch {
      return { ok: true, events: [] };
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown calendar fetch error",
    };
  }
}