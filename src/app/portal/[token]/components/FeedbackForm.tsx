"use client";

import { useState } from "react";
import { formatTime } from "@/lib/utils";
import { submitFeedback } from "../actions";

interface FileOption {
    id: string;
    name: string;
    type: string;
}

export default function FeedbackForm({
    projectId,
    token,
    files,
}: {
    projectId: string;
    token: string;
    files: FileOption[];
}) {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
    const [selectedFileId, setSelectedFileId] = useState("");
    const [timestamp, setTimestamp] = useState("");
    const [showTimestamp, setShowTimestamp] = useState(false);

    const audioFiles = files.filter((f) => f.type === "DELIVERABLE" && f.name.match(/\.(wav|mp3|ogg|flac|aac|m4a)$/i));

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const ts = timestamp.trim() ? parseFloat(timestamp) : undefined;

        try {
            await submitFeedback(
                projectId,
                token,
                content,
                selectedFileId || undefined,
                ts && !isNaN(ts) ? ts : undefined
            );
            setContent("");
            setTimestamp("");
        } catch {
            alert("Failed to submit feedback");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Message</label>
                <textarea
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe what needs attention..."
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-[20px] p-5 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 transition-all resize-none shadow-inner"
                />
            </div>

            {audioFiles.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowTimestamp(!showTimestamp)}
                            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                                showTimestamp ? "text-accent" : "text-white/20 hover:text-white/40"
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12 6 12 12 16 14"/>
                            </svg>
                            Pin to a moment
                        </button>
                    </div>

                    {showTimestamp && (
                        <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div>
                                <label className="text-[9px] font-bold text-white/15 uppercase tracking-widest block mb-1.5">Track</label>
                                <select
                                    value={selectedFileId}
                                    onChange={(e) => setSelectedFileId(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-medium text-white/60 focus:outline-none focus:border-accent/40 transition-all"
                                >
                                    <option value="">Any track</option>
                                    {audioFiles.map((f) => (
                                        <option key={f.id} value={f.id}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] font-bold text-white/15 uppercase tracking-widest block mb-1.5">
                                    Timestamp (seconds)
                                </label>
                                <input
                                    type="text"
                                    value={timestamp}
                                    onChange={(e) => setTimestamp(e.target.value.replace(/[^0-9.]/g, ""))}
                                    placeholder="e.g. 67.5"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-medium text-white placeholder:text-white/10 focus:outline-none focus:border-accent/40 transition-all"
                                />
                                {timestamp && !isNaN(parseFloat(timestamp)) && (
                                    <p className="text-[9px] font-bold text-accent/50 uppercase tracking-widest mt-1.5">
                                        ≈ {formatTime(parseFloat(timestamp))}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            <button
                type="submit"
                disabled={loading || !content.trim()}
                className="w-full group relative overflow-hidden bg-accent/10 border border-accent/20 hover:bg-accent/20 text-accent font-bold py-4 rounded-[20px] transition-all disabled:opacity-50 text-xs uppercase tracking-[0.3em] neon-glow-pink"
            >
                <span className="relative z-10">{loading ? "Submitting..." : "Submit Feedback"}</span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-accent/20 group-hover:bg-accent/40 transition-all" />
            </button>
        </form>
    );
}
