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
  const [isPending, startTransition] = useTransition();

  const openModal = () => {
    setBody(defaultBody);
    setOpen(true);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await sendMessage({ leadId, body, source });
      setOpen(false);
    });
  };

  const buttonClassName =
    variant === "primary"
      ? "rounded-full bg-[color:var(--accent)] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[color:var(--accent-strong)]"
      : "rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[color:var(--muted)] transition hover:border-[color:var(--accent)]";

  return (
    <>
      <button type="button" className={buttonClassName} onClick={openModal}>
        {label}
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-black/10 bg-[color:var(--surface-strong)] p-6 shadow-[0_40px_80px_-50px_rgba(12,63,56,0.6)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                Send Message
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Edit the message before sending. This will log a MESSAGE_SENT activity.
            </p>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              rows={8}
              className="mt-4 w-full rounded-2xl border border-black/10 bg-[color:var(--surface)] p-4 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)]"
            />
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleSubmit}
                className="rounded-full bg-[color:var(--foreground)] px-4 py-2 text-xs font-semibold text-[color:var(--surface)] transition hover:bg-black/80 disabled:opacity-60"
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
