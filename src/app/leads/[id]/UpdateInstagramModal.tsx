"use client";

import { useState, useTransition } from "react";
import { updateInstagramHandle } from "./actions";

type UpdateInstagramModalProps = {
  leadId: string;
  currentHandle?: string | null;
};

export default function UpdateInstagramModal({
  leadId,
  currentHandle,
}: UpdateInstagramModalProps) {
  const [open, setOpen] = useState(false);
  const [handle, setHandle] = useState(currentHandle ?? "");
  const [isPending, startTransition] = useTransition();

  const openModal = () => {
    setHandle(currentHandle ?? "");
    setOpen(true);
  };

  const handleSubmit = () => {
    startTransition(async () => {
      await updateInstagramHandle({ leadId, handle });
      setOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-[color:var(--muted)] transition hover:border-[color:var(--accent)] hover:text-[color:var(--accent-strong)]"
      >
        Update handle
      </button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-black/10 bg-[color:var(--surface-strong)] p-6 shadow-[0_40px_80px_-50px_rgba(12,63,56,0.6)]">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-[color:var(--foreground)]">
                Update Instagram Handle
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
              Enter the correct Instagram handle and we’ll re-fetch posts.
            </p>
            <input
              value={handle}
              onChange={(event) => setHandle(event.target.value)}
              placeholder="@bandhandle"
              className="mt-4 w-full rounded-2xl border border-black/10 bg-[color:var(--surface)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none focus:border-[color:var(--accent)]"
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
                {isPending ? "Updating" : "Save & Refresh"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
