"use client";

import { useState } from "react";
import { submitRating } from "../actions";
import { GlassCard } from "@/components/GlassCard";

interface StarRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  token: string;
  artistName: string;
}

export default function StarRatingModal({
  isOpen,
  onClose,
  projectId,
  token,
  artistName,
}: StarRatingModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === null || rating < 0 || rating > 5) {
      setError("Please select a star rating (0 to 5).");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await submitRating(projectId, token, rating, review);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg">
        <GlassCard className="p-8! border-accent/40 bg-black/95 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
                Mandatory Deliverable Gate
              </p>
              <h2 className="text-xl font-bold tracking-tight text-white mt-0.5">
                Rate Your Studio Experience
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full border border-white/10 text-white/40 hover:text-white flex items-center justify-center text-xs"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-white/60 leading-relaxed">
            Hi <span className="text-white font-bold">{artistName}</span>, your feedback ensures our mixing and mastering standards remain industry-leading. Submitting this 0–5 star rating unlocks your master downloads immediately.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Interactive Stars */}
            <div className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-white/3 border border-white/8">
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 focus:outline-none transition-transform hover:scale-125"
                    aria-label={`${star} star`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="34"
                      height="34"
                      viewBox="0 0 24 24"
                      fill={star <= activeRating ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className={
                        star <= activeRating
                          ? "text-accent drop-shadow-[0_0_12px_rgba(0,242,255,0.7)]"
                          : "text-white/15"
                      }
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-accent">
                {activeRating === 5 && "★★★★★ Exceptional (5/5)"}
                {activeRating === 4 && "★★★★ Great Work (4/5)"}
                {activeRating === 3 && "★★★ Satisfactory (3/5)"}
                {activeRating === 2 && "★★ Needs Improvement (2/5)"}
                {activeRating === 1 && "★ Poor (1/5)"}
                {activeRating === 0 && "0 Stars"}
              </p>
            </div>

            {/* Optional Written Comment */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1.5">
                Optional Studio Review & Comments
              </label>
              <textarea
                rows={3}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your thoughts on the sonics, communication, turnaround time, or overall experience..."
                className="w-full rounded-xl border border-white/15 bg-black/60 px-4 py-2.5 text-xs text-white placeholder:text-white/20 focus:border-accent focus:outline-none"
              />
            </div>

            {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl border border-accent/50 bg-accent text-black font-black text-xs uppercase tracking-[0.2em] hover:bg-accent/90 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)] disabled:opacity-50"
              >
                {isSubmitting ? "Unlocking..." : "Submit Rating & Unlock Deliverables"}
              </button>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
