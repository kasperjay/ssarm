"use client";

import { useState, useRef, useCallback } from "react";
import { formatTime } from "@/lib/utils";

interface FeedbackMarker {
    id: string;
    timestamp: number;
    content: string;
    resolved?: boolean;
    createdAt?: string;
}

interface AudioPlayerProps {
    fileUrl: string;
    fileId: string;
    projectId: string;
    token?: string;
    feedbacks: FeedbackMarker[];
    onAddFeedback: (content: string, timestamp: number) => Promise<void>;
}

export default function AudioPlayer({
    fileUrl,
    fileId,
    projectId,
    token,
    feedbacks: initialFeedbacks,
    onAddFeedback,
}: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [feedbacks, setFeedbacks] = useState<FeedbackMarker[]>(initialFeedbacks);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentTimestamp, setCommentTimestamp] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const sortedFeedbacks = [...feedbacks]
        .filter((fb) => fb.timestamp > 0)
        .sort((a, b) => a.timestamp - b.timestamp);

    const togglePlay = useCallback(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    }, [isPlaying]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const newTime = percentage * duration;
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const seekTo = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            if (!isPlaying) {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const openCommentAt = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const time = percentage * duration;
        setCommentTimestamp(time);
        setIsAddingComment(true);
        setActiveCommentId(null);
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onAddFeedback(commentText, commentTimestamp);
            setFeedbacks((prev) => [
                ...prev,
                {
                    id: `temp-${Date.now()}`,
                    timestamp: commentTimestamp,
                    content: commentText,
                    resolved: false,
                    createdAt: new Date().toISOString(),
                },
            ]);
            setCommentText("");
            setIsAddingComment(false);
        } catch {
            alert("Failed to save comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkerClick = (fb: FeedbackMarker, e: React.MouseEvent) => {
        e.stopPropagation();
        seekTo(fb.timestamp);
        setActiveCommentId(fb.id);
    };

    const handleCommentListClick = (fb: FeedbackMarker) => {
        seekTo(fb.timestamp);
        setActiveCommentId(fb.id);
    };

    return (
        <div className="audio-player mt-4 bg-white/3 border border-white/5 rounded-2xl overflow-hidden group/player transition-all hover:bg-white/4">
            <audio
                ref={audioRef}
                src={fileUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                preload="metadata"
            />

            <div className="p-6">
                <div className="flex items-center gap-4 mb-5">
                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-accent text-white shadow-xl hover:scale-105 transition-all neon-glow shrink-0"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        )}
                    </button>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-accent/80 tracking-widest tabular-nums">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                            {isAddingComment && (
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest animate-pulse">
                                    Marking {formatTime(commentTimestamp)}
                                </span>
                            )}
                        </div>

                        <div
                            className="relative h-2 w-full bg-white/5 rounded-full cursor-pointer group/timeline hover:h-3 transition-all"
                            onClick={handleTimelineClick}
                        >
                            <div
                                className="absolute top-0 left-0 h-full bg-accent rounded-full neon-glow-pink transition-[width] duration-75"
                                style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                            />
                            <div
                                className="absolute inset-x-0 -top-3 -bottom-3 opacity-0 group-hover/timeline:opacity-100 transition-opacity cursor-crosshair"
                                onClick={openCommentAt}
                            />
                            {sortedFeedbacks.map((fb, i) => {
                                const leftPercent = duration ? (fb.timestamp / duration) * 100 : 0;
                                return (
                                    <div key={fb.id} className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10" style={{ left: `${Math.min(leftPercent, 100)}%` }}>
                                        <div
                                            className={`w-4 h-4 rounded-full border-2 cursor-pointer hover:scale-150 transition-all flex items-center justify-center text-[7px] font-black ${
                                                activeCommentId === fb.id
                                                    ? "bg-accent border-white text-white shadow-[0_0_10px_rgba(255,0,128,0.6)]"
                                                    : "bg-white/80 border-accent/60 text-black/60 hover:bg-accent hover:text-white hover:border-white"
                                            }`}
                                            onClick={(e) => handleMarkerClick(fb, e)}
                                            title={`${formatTime(fb.timestamp)} – ${fb.content}`}
                                        >
                                            {i + 1}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <span className="text-[10px] font-bold text-white/10 uppercase tracking-widest shrink-0">
                        {sortedFeedbacks.length} notes
                    </span>
                </div>

                {isAddingComment && (
                    <form onSubmit={handleSubmitComment} className="flex gap-3 animate-in slide-in-from-top-2 fade-in duration-200">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="What needs attention at this moment?"
                            autoFocus
                            disabled={isSubmitting}
                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-medium text-white placeholder:text-white/15 focus:outline-none focus:border-accent transition-all"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 bg-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent/80 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? "Saving..." : "Add Note"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAddingComment(false)}
                            className="px-4 py-2.5 bg-white/5 text-white/30 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Cancel
                        </button>
                    </form>
                )}
            </div>

            {sortedFeedbacks.length > 0 && (
                <div className="border-t border-white/5 max-h-[240px] overflow-y-auto custom-scrollbar">
                    {sortedFeedbacks.map((fb, i) => (
                        <button
                            key={fb.id}
                            onClick={() => handleCommentListClick(fb)}
                            className={`w-full text-left px-6 py-3.5 flex items-start gap-4 border-b border-white/3 hover:bg-white/3 transition-colors cursor-pointer group/comment ${
                                activeCommentId === fb.id ? "bg-accent/10 border-l-2 border-l-accent" : ""
                            }`}
                        >
                            <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black mt-0.5 transition-colors ${
                                activeCommentId === fb.id
                                    ? "bg-accent text-white"
                                    : "bg-white/5 text-white/30 group-hover/comment:text-white/60"
                            }`}>
                                {i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                                        activeCommentId === fb.id ? "text-accent" : "text-white/20 group-hover/comment:text-accent/70"
                                    }`}>
                                        {formatTime(fb.timestamp)}
                                    </span>
                                    {fb.resolved && (
                                        <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-400/60 border border-emerald-400/20 rounded-md px-1.5 py-0.5">
                                            Resolved
                                        </span>
                                    )}
                                </div>
                                <p className={`text-xs leading-relaxed line-clamp-2 transition-colors ${
                                    activeCommentId === fb.id ? "text-white/90" : "text-white/50 group-hover/comment:text-white/70"
                                }`}>
                                    {fb.content}
                                </p>
                            </div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 mt-1 transition-all ${
                                activeCommentId === fb.id ? "text-accent opacity-100" : "text-white/10 opacity-0 group-hover/comment:opacity-100"
                            }`}>
                                <polygon points="5 3 19 12 5 21 5 3"/>
                            </svg>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
