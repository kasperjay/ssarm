"use client";

import { useState } from "react";
import { submitRating } from "../actions";

export default function CompletionRating({
  projectId,
  token,
}: {
  projectId: string;
  token: string;
}) {
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const review = formData.get("review") as string;

    try {
      await submitRating(projectId, token, rating, review);
    } catch (error) {
      console.error(error);
      alert("Failed to submit rating");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-center gap-3 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`transition-all duration-300 transform hover:scale-125 ${rating >= star ? "text-accent drop-shadow-[0_0_8px_rgba(255,0,128,0.4)]" : "text-white/10 hover:text-white/30"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill={rating >= star ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Final_Review_Node</label>
        <textarea
          name="review"
          placeholder="Neural feedback summary (optional). Any final insights regarding the project trajectory..."
          rows={3}
          className="w-full bg-black/40 border border-white/10 rounded-[20px] p-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 transition-all resize-none shadow-inner"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full group relative overflow-hidden bg-accent/20 border-2 border-accent/40 hover:bg-accent/30 text-accent font-bold py-5 rounded-[24px] transition-all disabled:opacity-30 text-[11px] uppercase tracking-[0.4em] neon-glow-pink shadow-2xl"
      >
        <span className="relative z-10">{loading ? "FINALIZING_PROTOCOL..." : "APPROVE_&_COMPLETE_PROJECT"}</span>
      </button>

      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-center text-white/20 mt-4 px-6 leading-relaxed">
        Marking project as <span className="text-accent">FINALIZED</span>. Perpetual uplink to all public nodes will remain active.
      </p>
    </form>
  );
}
