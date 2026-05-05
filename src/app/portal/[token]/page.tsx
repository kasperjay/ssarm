export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import FeedbackForm from "./components/FeedbackForm";
import CompletionRating from "./components/CompletionRating";
import { GlassCard } from "@/components/GlassCard";
import { formatRelativeDate, formatTime } from "@/lib/utils";
import AudioPlayer from "@/app/projects/components/AudioPlayer";
import { submitFeedback } from "./actions";

export default async function CustomerPortalPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;

    const project = await prisma.project.findUnique({
        where: { portalToken: token },
        include: {
            artist: true,
            files: {
                orderBy: { createdAt: "desc" },
            },
            feedbacks: {
                orderBy: { createdAt: "desc" },
            },
            invoice: true,
        },
    });

    if (!project) notFound();

    const workingFiles = project.files.filter((f) => f.type === "WORKING" && f.isPublic);
    const deliverables = project.files.filter((f) => f.type === "DELIVERABLE" && f.isPublic);

    return (
        <div className="relative min-h-screen bg-background selection:bg-accent/30 selection:text-white">
            <div className="mx-auto max-w-6xl space-y-20 px-6 py-24 relative z-10">

                {/* Header */}
                <header className="text-center space-y-6 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
                    <div className="flex flex-col items-center gap-4 relative z-10">
                        <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-[0.4em] text-white/40 mb-2">
                            Secure Client Portal
                        </div>
                        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-white">
                            {project.title || "Project Review"}
                        </h1>
                        <div className="h-px w-24 bg-accent/30 shadow-[0_0_10px_rgba(0,242,255,0.4)]" />
                        <p className="text-lg text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
                            Welcome, <span className="text-white/80 uppercase tracking-widest">{project.artist.name}</span>. 
                            Access your latest session files, download final masters, and share your feedback.
                        </p>
                    </div>
                </header>


                <header className="flex justify-center">
                    {project.invoice ? (
                        <div className="flex items-center gap-3">
                            <Link
                                href={`/portal/${token}/billing`}
                                className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.3em] text-white/70 transition-all hover:bg-white/10 hover:border-white/20"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/></svg>
                                Billing History
                            </Link>
                            <Link
                                href={`/portal/${token}/invoice`}
                                className="inline-flex items-center gap-3 rounded-2xl border border-accent/20 bg-accent/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.3em] text-accent transition-all hover:bg-accent/10 hover:border-accent/40"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                                View Invoice
                            </Link>
                        </div>
                    ) : (
                        <Link
                            href={`/portal/${token}/billing`}
                            className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-xs font-bold uppercase tracking-[0.3em] text-white/70 transition-all hover:bg-white/10 hover:border-white/20"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M7 15h4"/></svg>
                            Billing History
                        </Link>
                    )}
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">

                    {/* Left Column: Files Area */}
                    <div className="space-y-20">

                        {/* Deliverables Section */}
                        {deliverables.length > 0 && (
                            <section className="space-y-8 animate-fade-in">
                                <div className="flex items-center gap-6 border-b border-white/5 pb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent neon-glow-pink">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                                    </div>
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Final Deliverables</h2>
                                        <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Master files for download</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {deliverables.map((file) => (
                                        <a
                                            key={file.id}
                                            href={file.url}
                                            download
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group relative"
                                        >
                                            <GlassCard className="p-6! border-accent/20 bg-accent/2 group-hover:border-accent/40 group-hover:bg-accent/4 transition-all duration-500 shadow-xl overflow-hidden">
                                                <div className="absolute top-0 right-0 p-3 text-accent opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                                </div>
                                                <div className="space-y-4">
                                                    <p className="font-bold text-lg text-white group-hover:text-accent transition-colors truncate pr-8 tracking-tighter">{file.name}</p>
                                                    <div className="flex items-center gap-4 text-xs font-sans font-bold text-white/40 uppercase tracking-[0.2em]">
                                                        <span className="text-accent/60 px-2 py-0.5 rounded-md bg-accent/5">Master</span>
                                                        <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                                                    </div>
                                                </div>
                                            </GlassCard>
                                            {file.mimeType.startsWith("audio/") && (
                                                <AudioPlayer
                                                    fileUrl={file.url}
                                                    fileId={file.id}
                                                    projectId={project.id}
                                                    token={token}
                                                    feedbacks={project.feedbacks
                                                        .filter(fb => fb.fileId === file.id)
                                                        .map(fb => ({
                                                            id: fb.id,
                                                            timestamp: fb.timestamp || 0,
                                                            content: fb.content
                                                        }))
                                                    }
                                                    onAddFeedback={async (content, timestamp) => {
                                                        "use server";
                                                        await submitFeedback(project.id, token, content, file.id, timestamp);
                                                    }}
                                                />
                                            )}
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Working Files Section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-6 border-b border-white/5 pb-6">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold uppercase tracking-widest text-white/80">Session Bounces</h2>
                                    <p className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Review latest work-in-progress</p>
                                </div>
                            </div>

                            {workingFiles.length === 0 ? (
                                <GlassCard className="p-12! text-center bg-white/2 border-white/5 border-dashed">
                                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/20 leading-relaxed">
                                        No files available for review at this time.
                                    </p>
                                </GlassCard>
                            ) : (
                                <div className="grid gap-4">
                                    {workingFiles.map((file) => (
                                        <a
                                            key={file.id}
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group"
                                        >
                                            <GlassCard className="p-5! flex items-center justify-between bg-white/2 border-white/5 hover:border-white/10 group-hover:bg-white/4 transition-all">
                                                <div className="min-w-0 flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-accent transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-white/90 group-hover:text-white transition-colors">{file.name}</p>
                                                        <p className="text-[9px] font-sans font-bold text-white/20 uppercase tracking-widest mt-1">
                                                            {(file.size / 1024 / 1024).toFixed(1)} MB • {formatRelativeDate(file.createdAt)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-20 group-hover:opacity-100 group-hover:border-accent group-hover:text-accent transition-all">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                                </div>
                                            </GlassCard>
                                            {file.mimeType.startsWith("audio/") && (
                                                <AudioPlayer
                                                    fileUrl={file.url}
                                                    fileId={file.id}
                                                    projectId={project.id}
                                                    token={token}
                                                    feedbacks={project.feedbacks
                                                        .filter(fb => fb.fileId === file.id)
                                                        .map(fb => ({
                                                            id: fb.id,
                                                            timestamp: fb.timestamp || 0,
                                                            content: fb.content
                                                        }))
                                                    }
                                                    onAddFeedback={async (content, timestamp) => {
                                                        "use server";
                                                        await submitFeedback(project.id, token, content, file.id, timestamp);
                                                    }}
                                                />
                                            )}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Feedback & Review Area */}
                    <aside className="space-y-12">
                        {/* Feedback Form */}
                        {project.status !== "COMPLETED" && (
                            <div className="space-y-8 sticky top-12">
                                <div className="space-y-2">
                                    <h3 className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Request Changes</h3>
                                    <div className="h-px w-12 bg-accent/30" />
                                </div>
                                
                                <GlassCard className="p-8! bg-white/2 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute -top-10 -right-10 h-32 w-32 bg-accent/5 blur-3xl rounded-full" />
                                    <FeedbackForm projectId={project.id} token={project.portalToken} />

                                    {/* Previous Notes Log */}
                                    {project.feedbacks.length > 0 && (
                                        <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
                                            <h4 className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Review History</h4>
                                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {project.feedbacks.map(fb => (
                                                    <div key={fb.id} className={`p-5 rounded-2xl border transition-all ${fb.resolved ? 'bg-black/20 border-white/5 opacity-30 grayscale' : 'bg-white/4 border-white/10 group/item'}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                             <span className="text-xs font-sans font-bold text-white/20 uppercase tracking-widest">{formatRelativeDate(fb.createdAt)}</span>
                                                             {fb.timestamp !== null && (
                                                                <span className="text-[10px] font-bold text-accent uppercase tracking-widest">
                                                                    [{formatTime(fb.timestamp)}]
                                                                </span>
                                                             )}
                                                        </div>
                                                        <p className="text-xs font-medium text-white/60 leading-relaxed italic">&quot;{fb.content}&quot;</p>
                                                        {fb.resolved && (
                                                            <div className="mt-3 flex items-center gap-2">
                                                                <div className="h-1 w-1 rounded-full bg-accent" />
                                                                 <span className="text-xs font-bold uppercase tracking-widest text-accent">Resolved</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </GlassCard>

                                {/* Project Completion Rating */}
                                {deliverables.length > 0 && (
                                    <GlassCard className="p-8! border-accent/20 bg-accent/2 shadow-2xl">
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                                                <h3 className="text-xs font-bold text-accent uppercase tracking-[0.3em]">Project Completion</h3>
                                            </div>
                                            <p className="text-xs text-white/40 leading-relaxed font-medium">
                                                If the current deliverables meet your expectations, you can mark this project as complete.
                                            </p>
                                            <CompletionRating projectId={project.id} token={project.portalToken} />
                                        </div>
                                    </GlassCard>
                                )}
                            </div>
                        )}

                        {/* Completed State */}
                        {project.status === "COMPLETED" && (
                            <GlassCard className="p-10! border-accent/20 bg-accent/2 text-center shadow-2xl relative overflow-hidden">
                                <div className="absolute -top-12 -left-12 h-40 w-40 bg-accent/10 blur-[80px] rounded-full" />
                                <div className="relative z-10 space-y-8">
                                    <div className="w-20 h-20 bg-accent/10 rounded-[32px] border border-accent/20 flex items-center justify-center mx-auto text-accent neon-glow-pink">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold uppercase tracking-widest text-white">Project Complete</h3>
                                        <p className="text-xs text-white/40 leading-relaxed font-medium px-4">
                                            This project has been successfully archived. You can still access your files at any time. Thank you for collaborating with <span className="text-accent font-bold">Spectral Soundworks</span>.
                                        </p>
                                    </div>
                                    {project.rating && (
                                        <div className="flex justify-center gap-2 py-4 border-y border-white/5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <svg 
                                                    key={star} 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    width="20" height="20" 
                                                    viewBox="0 0 24 24" 
                                                    fill={star <= project.rating! ? "currentColor" : "none"} 
                                                    stroke="currentColor" 
                                                    strokeWidth="1.5" 
                                                    className={star <= project.rating! ? "text-accent drop-shadow-[0_0_8px_rgba(255,0,128,0.4)]" : "text-white/10"}
                                                >
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                                                </svg>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        )}
                    </aside>

                </div>
            </div>
        </div>
    );
}
