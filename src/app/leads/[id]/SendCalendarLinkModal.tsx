"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { sendCalendarLink } from "./actions";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

type SendCalendarLinkModalProps = {
  leadId: string;
  artistName: string;
  bookingUrl: string;
};

export default function SendCalendarLinkModal({
  leadId,
  artistName,
  bookingUrl,
}: SendCalendarLinkModalProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const reset = () => {
    setError(null);
    setSuccess(null);
    setCopied(false);
  };

  const openModal = () => {
    reset();
    setOpen(true);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(bookingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Couldn't copy to clipboard. Select and copy manually.");
    }
  };

  const sendViaIg = () => {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const result = await sendCalendarLink({ leadId, channel: "ig" });
      if (!result?.ok) {
        setError(result?.error || "Failed to send booking link via IG.");
      } else {
        setSuccess("Booking link sent via IG DM.");
        setTimeout(() => {
          setOpen(false);
          reset();
        }, 1200);
      }
    });
  };

  return (
    <>
      <NeonButton
        variant="purple"
        size="sm"
        onClick={openModal}
        className="gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4" />
          <path d="M8 2v4" />
          <path d="M3 10h18" />
          <path d="M12 14v6" />
          <path d="M9 17h6" />
        </svg>
        Send Booking Link
      </NeonButton>

      {open && mounted
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
              <div className="relative w-full max-w-xl animate-in zoom-in-95 duration-200">
                <GlassCard variant="strong" className="p-8 space-y-6">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold uppercase tracking-widest text-accent-secondary">
                        Calendar Booking
                      </p>
                      <h3 className="text-xl font-bold tracking-tight">
                        Send link to {artistName}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="rounded-full bg-white/5 p-2 text-muted hover:text-foreground transition-colors"
                      aria-label="Close"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {error ? (
                    <div className="rounded-xl border border-error/20 bg-error/10 p-4 text-xs font-bold text-error uppercase tracking-widest">
                      Error: {error}
                    </div>
                  ) : null}

                  {success ? (
                    <div className="rounded-xl border border-success/20 bg-success/10 p-4 text-xs font-bold text-success uppercase tracking-widest">
                      {success}
                    </div>
                  ) : null}

                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted">
                      Google Calendar booking link
                    </label>
                    <div className="flex items-stretch gap-2">
                      <input
                        readOnly
                        value={bookingUrl}
                        onFocus={(e) => e.currentTarget.select()}
                        className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-xs font-mono text-foreground/80 outline-none focus:border-accent transition-colors"
                      />
                      <button
                        type="button"
                        onClick={copyLink}
                        className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-4 text-xs font-bold uppercase tracking-widest text-white/70 hover:border-accent/40 hover:text-accent transition-colors"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="text-xs text-muted italic">
                      Opens a pre-filled Google Calendar event for the lead to
                      pick a time. They'll book directly into your connected
                      calendar.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold uppercase tracking-widest text-white/50 hover:text-accent transition-colors"
                    >
                      Preview link →
                    </a>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <NeonButton
                        disabled={isPending}
                        onClick={sendViaIg}
                        variant="purple"
                        size="md"
                      >
                        {isPending ? "Sending..." : "Send via IG DM"}
                      </NeonButton>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}