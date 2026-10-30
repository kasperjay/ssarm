"use client";

import { useState } from "react";
import { approveMixForMastering } from "../actions";
import { GlassCard } from "@/components/GlassCard";

interface MixApprovalBannerProps {
  projectId: string;
  token: string;
  mixApprovedForMastering: boolean;
  mixApprovedAt?: string | null;
  mixApprovedBy?: string | null;
  mixApprovalNotes?: string | null;
  hasWorkingFiles: boolean;
  unresolvedFeedbackCount: number;
}

export default function MixApprovalBanner({
  projectId,
  token,
  mixApprovedForMastering,
  mixApprovedAt,
  mixApprovedBy,
  mixApprovalNotes,
  hasWorkingFiles,
  unresolvedFeedbackCount,
}: MixApprovalBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [signerName, setSignerName] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (mixApprovedForMastering) {
    return (
      <GlassCard className="p-6! border-emerald-500/30 bg-emerald-500/5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-400">
                  Approved for Mastering
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-xs text-white/40">
                  {mixApprovedAt ? new Date(mixApprovedAt).toLocaleDateString() : ""}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Mix Signed Off by {mixApprovedBy || "Artist"}
              </h3>
              {mixApprovalNotes && (
                <p className="text-xs text-white/50 italic mt-1 leading-relaxed">
                  &quot;{mixApprovalNotes}&quot;
                </p>
              )}
            </div>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-center shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/40">Stage</p>
            <p className="text-xs font-bold text-accent uppercase tracking-wider">In Mastering Queue</p>
          </div>
        </div>
      </GlassCard>
    );
  }

  if (!hasWorkingFiles) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!signerName.trim()) {
      setError("Please enter your name to confirm approval.");
      return;
    }
    if (!confirmed) {
      setError("Please check the confirmation box.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await approveMixForMastering(projectId, token, signerName, notes);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve mix");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <GlassCard className="p-6! border-accent/30 bg-accent/3 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
                Mix Review Milestone
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Ready to approve this mix for mastering?
              </h3>
              <p className="text-xs text-white/45 mt-1 leading-relaxed">
                Once satisfied with the balance and arrangement, approve the mix to queue precision mastering.
                {unresolvedFeedbackCount > 0 && (
                  <span className="text-amber-400 font-medium ml-1">
                    ({unresolvedFeedbackCount} revision notes pending)
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="px-6 py-3 rounded-2xl border border-accent/40 bg-accent/20 text-xs font-bold uppercase tracking-[0.25em] text-accent hover:bg-accent/30 transition-all shadow-[0_0_15px_rgba(0,242,255,0.2)] shrink-0"
          >
            Approve Mix for Mastering →
          </button>
        </div>
      </GlassCard>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-lg">
            <GlassCard className="p-8! border-accent/30 bg-black/95 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-accent/20 text-accent flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                    Approve Mix for Mastering
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full border border-white/10 text-white/40 hover:text-white flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-white/60 leading-relaxed">
                By approving this mix, you confirm that balance, vocal levels, EQ, and instrument placement meet your artistic vision. The studio team will commence final dedicated mastering.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1.5">
                    Your Full Name / Artist Signer
                  </label>
                  <input
                    type="text"
                    required
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="e.g., Alex Rivers (Lead Artist)"
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1.5">
                    Notes for Mastering Engineer (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Reference tracks, desired loudness characteristics, or specific notes..."
                    className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2 text-xs text-white placeholder:text-white/20 focus:border-accent focus:outline-none"
                  />
                </div>

                <label className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/8 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(e) => setConfirmed(e.target.checked)}
                    className="mt-0.5 rounded border-white/20 accent-accent"
                  />
                  <span className="text-xs text-white/70 leading-relaxed select-none">
                    I confirm that the current mix bounce is ready for mastering and all revisions are addressed.
                  </span>
                </label>

                {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl border border-accent/50 bg-accent text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-accent/90 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Confirm Mix Approval"}
                  </button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      )}
    </>
  );
}
