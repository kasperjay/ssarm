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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Transmission_Input</label>
                <textarea
                    name="content"
                    required
                    placeholder="E.G. Increase vocal presence (+1dB) in chorus segments. Neural kick drum transients require enhancement..."
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-[20px] p-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 transition-all resize-none shadow-inner"
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full group relative overflow-hidden bg-accent/10 border border-accent/20 hover:bg-accent/20 text-accent font-bold py-4 rounded-[20px] transition-all disabled:opacity-50 text-[10px] uppercase tracking-[0.3em] neon-glow-pink"
            >
                <span className="relative z-10">{loading ? "UPLINK_IN_PROGRESS" : "SUBMIT_FEEDBACK_NODE"}</span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-accent/20 group-hover:bg-accent/40 transition-all" />
            </button>
        </form>
    );
}
