"use client";

import { useState, useTransition } from "react";
import { sendMessage } from "./actions";

type SendMessageModalProps = {
  leadId: string;
  label: string;
  defaultBody?: string;
  source?: string;
  variant?: "primary" | "ghost";
};

export default function SendMessageModal({
  leadId,
  label,
  defaultBody = "",
  source,
  variant = "ghost",
}: SendMessageModalProps) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState(defaultBody);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const openModal = () => {
    setBody(defaultBody);
    setError(null);
    setOpen(true);
  };

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await sendMessage({ leadId, body, source });
      if (result?.ok) {
        setOpen(false);
      } else {
        setError(result?.error || "An unexpected error occurred.");
      }
    });
  };

  const buttonClassName =
    variant === "primary"
      ? "rounded-full bg-(--accent) px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-(--accent-strong)"
      : "rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-(--muted) transition hover:border-(--accent)";

  return (
    <>
      <button type="button" className={buttonClassName} onClick={openModal}>
        {label}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-black/10 bg-(--surface-strong) p-6 shadow-[0_40px_80px_-50px_rgba(12,63,56,0.6)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground">
                Send Message
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-(--muted)"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-(--muted)">
              Edit the message before sending. This will log a MESSAGE_SENT activity.
            </p>
            {error ? (
              <div className="mt-4 rounded-xl bg-red-500/10 p-3 text-xs text-red-500 border border-red-500/20">
                <strong>Send Failed:</strong> {error}
              </div>
            ) : null}
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={8}
              className="mt-4 w-full rounded-2xl border border-black/10 bg-(--surface) p-4 text-sm text-foreground outline-none focus:border-(--accent)"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-(--muted)"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleSubmit}
                className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-(--surface) transition hover:bg-black/80 disabled:opacity-60"
              >
                {isPending ? "Sending" : "Send"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
