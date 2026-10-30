"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";

type ReplyIntent =
  | "INTERESTED"
  | "NOT_NOW"
  | "PRICING_REQUEST"
  | "WRONG_CONTACT"
  | "UNSUBSCRIBED"
  | "BOOKED"
  | "UNCLEAR";

type LeadStatus =
  | "NEW"
  | "QUALIFIED"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "WON"
  | "LOST"
  | "PAUSED";

interface ReplyTriageData {
  id: string;
  activityId: string;
  intent: ReplyIntent;
  note: string | null;
  triaged: boolean;
  triagedAt: string | null;
}

export interface ReplyItem {
  id: string; // activity id
  note: string | null;
  occurredAt: string;
  lead: {
    id: string;
    status: LeadStatus;
    nextActionAt: string | null;
    artist: {
      name: string;
      instagramHandle: string | null;
      instagramProfileImageUrl: string | null;
    };
  };
  replyTriage: ReplyTriageData | null;
}

const INTENT_OPTIONS: {
  value: ReplyIntent;
  label: string;
  color: string;
  desc: string;
}[] = [
  {
    value: "INTERESTED",
    label: "Interested",
    color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10",
    desc: "Ready to talk / wants more info",
  },
  {
    value: "PRICING_REQUEST",
    label: "Pricing",
    color: "text-sky-400 border-sky-400/30 bg-sky-400/10",
    desc: "Asking about rates or availability",
  },
  {
    value: "BOOKED",
    label: "Booked",
    color: "text-violet-400 border-violet-400/30 bg-violet-400/10",
    desc: "Confirmed — close as WON",
  },
  {
    value: "NOT_NOW",
    label: "Not Now",
    color: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    desc: "Interested later — pause 90 days",
  },
  {
    value: "UNCLEAR",
    label: "Unclear",
    color: "text-white/40 border-white/10 bg-white/5",
    desc: "Reply received, intent ambiguous",
  },
  {
    value: "WRONG_CONTACT",
    label: "Wrong Contact",
    color: "text-rose-400 border-rose-400/30 bg-rose-400/10",
    desc: "Not the right person / artist",
  },
  {
    value: "UNSUBSCRIBED",
    label: "Unsubscribed",
    color: "text-rose-400 border-rose-400/30 bg-rose-400/10",
    desc: "Asked to stop outreach",
  },
];

const INTENT_MAP: Record<ReplyIntent, { label: string; color: string }> =
  Object.fromEntries(
    INTENT_OPTIONS.map((o) => [o.value, { label: o.label, color: o.color }])
  ) as Record<ReplyIntent, { label: string; color: string }>;

const STATUS_COLORS: Record<LeadStatus, string> = {
  NEW: "text-white/40 bg-white/5 border-white/10",
  QUALIFIED: "text-sky-400 bg-sky-400/10 border-sky-400/20",
  CONTACTED: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  FOLLOW_UP: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  WON: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  LOST: "text-rose-400 bg-rose-400/10 border-rose-400/20",
  PAUSED: "text-white/30 bg-white/5 border-white/5",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function extractMessageText(note: string | null): string {
  if (!note) return "No message content";
  // Strip the "IG reply from @handle: " prefix if present
  const match = note.match(/IG reply from [^:]+:\s*"?(.+?)"?$/s);
  if (match) return match[1].slice(0, 280);
  return note.slice(0, 280);
}

interface Props {
  item: ReplyItem;
  initialTriaged?: boolean;
}

export function ReplyTriageCard({ item, initialTriaged = false }: Props) {
  const [isPending, startTransition] = useTransition();
  const [triaged, setTriaged] = useState(
    initialTriaged || item.replyTriage?.triaged === true
  );
  const [selectedIntent, setSelectedIntent] = useState<ReplyIntent | null>(
    item.replyTriage?.intent ?? null
  );
  const [note, setNote] = useState(item.replyTriage?.note ?? "");
  const [nextActionAt, setNextActionAt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(item.lead.status);

  const needsDatePicker =
    selectedIntent === "INTERESTED" ||
    selectedIntent === "PRICING_REQUEST" ||
    selectedIntent === "NOT_NOW";

  function handleTriage(intent: ReplyIntent) {
    setSelectedIntent(intent);
    setError(null);
  }

  function handleSubmit() {
    if (!selectedIntent) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/replies/triage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityId: item.id,
            leadId: item.lead.id,
            intent: selectedIntent,
            note: note.trim() || undefined,
            nextActionAt: nextActionAt
              ? new Date(nextActionAt).toISOString()
              : undefined,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error ?? "Failed to save triage.");
          return;
        }

        const data = await res.json();
        setCurrentStatus(data.lead?.status ?? currentStatus);
        setTriaged(true);
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  const messageText = extractMessageText(item.note);
  const intent = selectedIntent ? INTENT_MAP[selectedIntent] : null;

  if (triaged && selectedIntent) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/3 p-4 transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            {/* Avatar placeholder */}
            <div className="h-9 w-9 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/40 uppercase">
              {item.lead.artist.name.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href={`/leads/${item.lead.id}`}
                  className="text-sm font-bold text-white hover:text-[var(--accent)] transition-colors"
                >
                  {item.lead.artist.name}
                </Link>
                {item.lead.artist.instagramHandle && (
                  <span className="text-[11px] text-white/30 font-mono">
                    @{item.lead.artist.instagramHandle}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-white/40 line-clamp-1">
                {messageText}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${intent?.color}`}
            >
              {intent?.label}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${STATUS_COLORS[currentStatus]}`}
            >
              {currentStatus.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/4 p-5 space-y-4 transition-all hover:border-white/15">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white/50 uppercase">
            {item.lead.artist.name.slice(0, 2)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/leads/${item.lead.id}`}
                className="text-sm font-bold text-white hover:text-[var(--accent)] transition-colors"
              >
                {item.lead.artist.name}
              </Link>
              {item.lead.artist.instagramHandle && (
                <span className="text-[11px] text-white/30 font-mono">
                  @{item.lead.artist.instagramHandle}
                </span>
              )}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${STATUS_COLORS[item.lead.status]}`}
              >
                {item.lead.status.replace("_", " ")}
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-white/30">
              {timeAgo(item.occurredAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Message content */}
      <div className="rounded-xl bg-black/30 border border-white/6 px-4 py-3">
        <p className="text-sm text-white/70 leading-relaxed">
          &ldquo;{messageText}&rdquo;
        </p>
      </div>

      {/* Intent buttons */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/25 mb-2">
          Classify intent
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {INTENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleTriage(opt.value)}
              className={`rounded-md border px-3 py-2 text-left transition-all ${
                selectedIntent === opt.value
                  ? opt.color + " ring-1 ring-current"
                  : "border-white/8 bg-white/3 text-white/40 hover:border-white/15 hover:text-white/70"
              }`}
            >
              <div className="text-xs font-bold">{opt.label}</div>
              <div className="text-[10px] opacity-70 mt-0.5 leading-tight">
                {opt.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date + note fields (conditional) */}
      {selectedIntent && (
        <div className="space-y-3 pt-1">
          {needsDatePicker && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-white/25 block mb-1.5">
                Next action date{" "}
                <span className="text-white/15">(optional)</span>
              </label>
              <input
                type="datetime-local"
                value={nextActionAt}
                onChange={(e) => setNextActionAt(e.target.value)}
                className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-white/25 block mb-1.5">
              Note <span className="text-white/15">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any context about this reply..."
              rows={2}
              className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 placeholder:text-white/20 focus:border-[var(--accent)] focus:outline-none resize-none"
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-400 font-medium">{error}</p>
      )}

      {selectedIntent && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-white/30">
            Will set status to{" "}
            <strong className="text-white/50">
              {selectedIntent === "INTERESTED" || selectedIntent === "PRICING_REQUEST" || selectedIntent === "UNCLEAR"
                ? "FOLLOW UP"
                : selectedIntent === "NOT_NOW"
                ? "PAUSED"
                : selectedIntent === "BOOKED"
                ? "WON"
                : "LOST"}
            </strong>
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-xs font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? "Saving…" : "Save Triage"}
          </button>
        </div>
      )}
    </div>
  );
}
