"use client";

import { useState } from "react";
import { submitFeedback } from "../actions";

export default function FeedbackForm({
    projectId,
    token,
}: {
    projectId: string;
    token: string;
}) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const content = formData.get("content") as string;

        try {
            await submitFeedback(projectId, token, content);
            // Reset form
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error(error);
            alert("Failed to submit feedback");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
                name="content"
                required
                placeholder="e.g. Can we bring the vocals up 1db in the chorus? Also, the kick drum needs a bit more punch."
                rows={4}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
            ></textarea>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black hover:bg-[var(--primary)] font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
            >
                {loading ? "Sending..." : "Submit Notes"}
            </button>
        </form>
    );
}
