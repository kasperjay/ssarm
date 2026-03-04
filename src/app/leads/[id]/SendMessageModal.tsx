"use client";

import { useState, useTransition } from "react";
import { sendMessage } from "./actions";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

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

  return (
    <>
      <NeonButton
        variant={variant === "primary" ? "cyan" : "outline"}
        size="sm"
        onClick={openModal}
      >
        {label}
      </NeonButton>
      {open ? (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
          <div className="relative w-full max-w-2xl animate-in zoom-in-95 duration-200">
            <GlassCard variant="strong" className="p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Transmission Interface</p>
                  <h3 className="text-xl font-bold tracking-tight">Outgoing Communication</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-white/5 p-2 text-muted hover:text-foreground transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>

              {error ? (
                <div className="rounded-xl border border-error/20 bg-error/10 p-4 text-[10px] font-bold text-error uppercase tracking-widest">
                  [ Critical Failure ]: {error}
                </div>
              ) : null}

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted">Message Payload</label>
                  <span className="text-[10px] font-mono text-muted/50">{body.length} CHR</span>
                </div>
                <textarea
                  value={body}
                  onChange={(event) => setBody(event.target.value)}
                  rows={10}
                  className="w-full rounded-2xl border border-white/10 bg-black/40 p-5 text-sm leading-relaxed text-foreground/90 outline-none focus:border-accent transition-colors resize-none scrollbar-hide font-serif italic"
                />
                <p className="text-[10px] text-muted italic">
                  Transmission will be logged to activity history. AI analysis will scan for efficacy.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-muted hover:text-foreground transition-colors"
                >
                  Abort
                </button>
                <NeonButton
                  disabled={isPending}
                  onClick={handleSubmit}
                  variant="cyan"
                  size="lg"
                >
                  {isPending ? "Syncing..." : "Execute Uplink"}
                </NeonButton>
              </div>
            </GlassCard>
          </div>
        </div>
      ) : null}
    </>
  );
}
