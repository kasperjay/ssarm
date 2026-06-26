export const dynamic = "force-dynamic";

import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import {
  listUpcomingEvents,
  formatEventTime,
  type CalendarEvent,
} from "@/lib/google-calendar";

export const metadata = {
  title: "Calendar | Spectral Soundworks",
};

const formatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

const groupByDate = (events: CalendarEvent[]) => {
  const buckets = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = new Date(event.start).toDateString();
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(event);
  }
  return Array.from(buckets.entries()).sort(
    ([a], [b]) => new Date(a).getTime() - new Date(b).getTime()
  );
};

const isToday = (iso: string) => {
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
};

export default async function CalendarPage() {
  const result = await listUpcomingEvents({ maxResults: 25, daysAhead: 30 });
  const today = new Date();
  const todayLabel = formatter.format(today);

  let body: React.ReactNode;

  if (!result.ok) {
    body = (
      <GlassCard className="p-8! bg-white/2 border-white/5 text-center space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/40"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight text-white">
            Calendar webhook not connected yet
          </h3>
          <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
            To show your Google Calendar events here, deploy the Apps Script in
            <code className="mx-1 px-1.5 py-0.5 rounded bg-white/5 text-accent/80">
              APPS_SCRIPT_CALENDAR.md
            </code>
            and set
            <code className="mx-1 px-1.5 py-0.5 rounded bg-white/5 text-accent/80">
              GOOGLE_CALENDAR_WEBHOOK_URL
            </code>
            in your environment.
          </p>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/25">
          Error: {result.error}
        </p>
      </GlassCard>
    );
  } else if (result.events.length === 0) {
    body = (
      <GlassCard className="p-12! bg-white/2 border-white/5 text-center space-y-3">
        <h3 className="text-xl font-bold tracking-tight text-white">
          No upcoming sessions
        </h3>
        <p className="text-sm text-white/50 max-w-md mx-auto">
          When you send a booking link from a lead detail page, the booked
          session will show up here automatically.
        </p>
        <Link href="/leads" className="inline-block pt-2">
          <NeonButton variant="outline" size="sm">
            Go to leads
          </NeonButton>
        </Link>
      </GlassCard>
    );
  } else {
    const groups = groupByDate(result.events);
    body = (
      <div className="space-y-6">
        {groups.map(([dateKey, events]) => {
          const dateObj = new Date(dateKey);
          const dateLabel = formatter.format(dateObj);
          const isTodayDate = isToday(dateKey);
          return (
            <section key={dateKey} className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <h3
                  className={`text-xs font-bold uppercase tracking-[0.25em] ${
                    isTodayDate ? "text-accent" : "text-white/35"
                  }`}
                >
                  {isTodayDate ? "Today" : dateLabel.split(",")[0]}
                </h3>
                <span className="text-xs text-white/30">
                  {dateLabel.split(",").slice(1).join(",").trim()}
                </span>
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                  {events.length} {events.length === 1 ? "event" : "events"}
                </span>
              </div>
              <div className="space-y-3">
                {events.map((event) => (
                  <GlassCard
                    key={event.id}
                    className="p-5! bg-white/2 border-white/5 hover:border-accent/30 transition-all group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 w-20 text-center">
                        <div
                          className={`text-2xl font-black tracking-tight ${
                            isTodayDate ? "text-accent" : "text-white/90"
                          }`}
                        >
                          {formatEventTime(event.start, event.allDay) || "—"}
                        </div>
                        {!event.allDay && event.end && (
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">
                            → {formatEventTime(event.end)}
                          </div>
                        )}
                        {event.allDay && (
                          <div className="text-[10px] font-bold uppercase tracking-widest text-white/30 mt-1">
                            All day
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 border-l border-white/10 pl-4 space-y-2">
                        <h4 className="text-base font-bold tracking-tight text-white truncate">
                          {event.title}
                        </h4>
                        {event.location && (
                          <div className="flex items-center gap-1.5 text-xs text-white/50">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                        {event.attendees && event.attendees.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {event.attendees.slice(0, 3).map((email) => (
                              <span
                                key={email}
                                className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white/50 border border-white/10"
                              >
                                {email}
                              </span>
                            ))}
                            {event.attendees.length > 3 && (
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                                +{event.attendees.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        {event.description && (
                          <p className="text-xs text-white/40 line-clamp-2 leading-relaxed">
                            {event.description}
                          </p>
                        )}
                      </div>
                      {event.htmlLink && (
                        <a
                          href={event.htmlLink}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-accent transition-colors"
                        >
                          Open →
                        </a>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="relative mx-auto flex max-w-5xl flex-col gap-8 px-6 pt-12">
        <div className="space-y-2">
          <h1
            className="text-[2.5rem] leading-[1] font-black tracking-tight text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Calendar
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
            {todayLabel} · Upcoming sessions
          </p>
        </div>
        {body}
      </div>
    </div>
  );
}