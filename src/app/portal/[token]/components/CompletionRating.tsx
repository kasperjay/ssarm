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
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-3xl transition-colors hover:scale-110 ${rating >= star ? "text-[var(--accent)]" : "text-white/10 hover:text-white/30"
              }`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        name="review"
        placeholder="Any final words about the project or the deliverables? (Optional)"
        rows={3}
        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
      ></textarea>

      <button
        type="submit"
        disabled={loading || rating === 0}
        className="w-full bg-[var(--accent)] text-black font-medium py-3 rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Completing Project..." : "Approve & Complete Project"}
      </button>

      <p className="text-xs text-center text-white/40 mt-3 px-4">
        Clicking this marks the project as finished. You will retain access to this page and your files forever.
      </p>
    </form>
  );
}
