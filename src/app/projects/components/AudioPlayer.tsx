"use client";

import { useState, useRef, useEffect } from "react";
import { formatTime } from "@/lib/utils";

interface FeedbackMarker {
    id: string;
    timestamp: number;
    content: string;
}

interface AudioPlayerProps {
    fileUrl: string;
    fileId: string;
    projectId: string;
    token?: string; // For portal use
    feedbacks: FeedbackMarker[];
    onAddFeedback: (content: string, timestamp: number) => Promise<void>;
}

export default function AudioPlayer({
    fileUrl,
    fileId,
    projectId,
    token,
    feedbacks,
    onAddFeedback
}: AudioPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [commentTimestamp, setCommentTimestamp] = useState(0);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

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

    const openCommentAt = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = x / rect.width;
        const time = percentage * duration;
        
        setCommentTimestamp(time);
        setIsAddingComment(true);
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        
        await onAddFeedback(commentText, commentTimestamp);
        setCommentText("");
        setIsAddingComment(false);
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

    return (
        <div className="audio-player mt-4 bg-white/3 border border-white/5 rounded-2xl p-6 relative overflow-hidden group/player transition-all hover:bg-white/5">
            <audio
                ref={audioRef}
                src={fileUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
            />

            <div className="flex items-center gap-6 mb-6">
                <button
                    onClick={togglePlay}
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-accent text-white shadow-xl hover:scale-105 transition-all neon-glow"
                >
                    {isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-1"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    )}
                </button>

                <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-bold text-accent tracking-widest uppercase">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                        {isAddingComment && (
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                Commenting at {formatTime(commentTimestamp)}
                            </span>
                        )}
                    </div>

                    <div 
                        className="h-1.5 w-full bg-white/5 rounded-full relative cursor-pointer group/timeline hover:h-2.5 transition-all"
                        onClick={handleTimelineClick}
                    >
                        {/* Progress Bar */}
                        <div 
                            className="absolute top-0 left-0 h-full bg-accent rounded-full neon-glow-pink"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        />

                        {/* Comment Click Area */}
                        <div 
                            className="absolute inset-x-0 -top-4 -bottom-4 opacity-0 group-hover/timeline:opacity-100 transition-opacity cursor-crosshair"
                            onClick={openCommentAt}
                        />

                        {/* Feedback Markers */}
                        {feedbacks.map((fb) => (
                            <div
                                key={fb.id}
                                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full border border-accent shadow-[0_0_8px_rgba(255,255,255,0.8)] cursor-pointer hover:scale-150 transition-all z-10"
                                style={{ left: `${(fb.timestamp / duration) * 100}%` }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    seekTo(fb.timestamp);
                                }}
                                title={fb.content}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {isAddingComment && (
                <form 
                    onSubmit={handleSubmitComment}
                    className="flex gap-3 mt-4 animate-in slide-in-from-top-2 fade-in duration-300"
                >
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Type your comment here..."
                        autoFocus
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-accent transition-all"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-accent text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent/80 transition-all"
                    >
                        Add Note
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsAddingComment(false)}
                        className="px-4 py-2 bg-white/5 text-white/40 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
}
