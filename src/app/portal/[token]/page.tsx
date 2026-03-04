import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import FeedbackForm from "./components/FeedbackForm";
import CompletionRating from "./components/CompletionRating";

export default async function CustomerPortalPage({
    params,
}: {
    params: { token: string };
}) {
    // Await params object
    const resolvedParams = await Promise.resolve(params);

    const project = await prisma.project.findUnique({
        where: { portalToken: resolvedParams.token },
        include: {
            artist: true,
            files: {
                orderBy: { createdAt: "desc" },
            },
            feedbacks: {
                orderBy: { createdAt: "desc" },
            },
        },
    });

    if (!project) notFound();

    const workingFiles = project.files.filter((f) => f.type === "WORKING" && f.isPublic);
    const deliverables = project.files.filter((f) => f.type === "DELIVERABLE" && f.isPublic);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[var(--primary)] selection:text-white">
            {/* Background ambient gradient */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-[var(--primary)] rounded-full mix-blend-screen filter blur-[150px] opacity-30 animate-pulse-slow"></div>
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[var(--accent)] rounded-full mix-blend-screen filter blur-[120px] opacity-20"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-16">

                {/* Header */}
                <header className="text-center space-y-4">
                    <p className="text-sm tracking-[0.2em] text-white/50 uppercase">
                        Spectral Soundworks Portal
                    </p>
                    <h1 className="text-5xl md:text-6xl font-display font-medium bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent pb-2">
                        {project.title || `Project for ${project.artist.name}`}
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto">
                        Welcome to your dedicated client portal. Access your latest bounces, review final deliverables, and leave mix notes all in one place.
                    </p>
                </header>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Files Area */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Deliverables Section (Only show if there are some, or project is completed) */}
                        {deliverables.length > 0 && (
                            <section className="space-y-6 animate-fade-in">
                                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                                        ⭐
                                    </div>
                                    <h2 className="text-2xl font-light text-[var(--accent)]">Final Deliverables</h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {deliverables.map((file) => (
                                        <a
                                            key={file.id}
                                            href={file.url}
                                            download
                                            target="_blank"
                                            rel="noreferrer"
                                            className="group p-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[var(--accent)]/40 rounded-2xl transition-all duration-300 backdrop-blur-sm"
                                        >
                                            <div className="flex flex-col h-full justify-between gap-4">
                                                <div className="flex items-start justify-between">
                                                    <p className="font-medium truncate pr-4">{file.name}</p>
                                                    <svg className="w-5 h-5 text-white/30 group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-white/40 uppercase tracking-widest">
                                                        {file.mimeType.split('/')[1] || 'FILE'} &bull; {(file.size / 1024 / 1024).toFixed(1)} MB
                                                    </p>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Working Files Section */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                                    🎵
                                </div>
                                <h2 className="text-2xl font-light">Working Bounces</h2>
                            </div>

                            {workingFiles.length === 0 ? (
                                <div className="p-8 text-center bg-white/[0.02] border border-white/5 rounded-2xl text-white/40">
                                    No working files uploaded yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {workingFiles.map((file) => (
                                        <a
                                            key={file.id}
                                            href={file.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between p-4 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 hover:border-[var(--primary)]/30 rounded-xl transition-all group"
                                        >
                                            <div className="min-w-0 pr-4">
                                                <p className="font-medium truncate group-hover:text-[var(--primary)] transition-colors">{file.name}</p>
                                                <p className="text-xs text-white/40 mt-1">
                                                    {(file.size / 1024 / 1024).toFixed(1)} MB
                                                </p>
                                            </div>
                                            <div className="shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[var(--primary)] group-hover:text-black transition-colors">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.5 10.5L19 6m0 0h-4.5M19 6v4.5M5 19h14" />
                                                </svg>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column: Feedback & Review Area */}
                    <div className="space-y-8">
                        {/* Feedback Form */}
                        {project.status !== "COMPLETED" && (
                            <div className="bg-white/[0.03] border border-white/10 p-6 rounded-3xl backdrop-blur-xl sticky top-8">
                                <h3 className="text-xl font-medium mb-2">Mix Notes</h3>
                                <p className="text-sm text-white/50 mb-6">
                                    Hear something that needs tweaking? Leave your revision requests below.
                                </p>
                                <FeedbackForm projectId={project.id} token={project.portalToken} />

                                {/* Previous Notes Log */}
                                {project.feedbacks.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
                                        <h4 className="text-sm font-medium text-white/50 uppercase tracking-widest">Previous Notes</h4>
                                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                            {project.feedbacks.map(fb => (
                                                <div key={fb.id} className={`p-3 rounded-lg text-sm ${fb.resolved ? 'bg-white/5 text-white/40' : 'bg-[var(--primary)]/10 text-white/90 border border-[var(--primary)]/20'}`}>
                                                    <p>{fb.content}</p>
                                                    {fb.resolved && <p className="text-[10px] mt-2 uppercase tracking-wider text-[var(--accent)]">Resolved</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Project Completion Rating */}
                        {project.status !== "COMPLETED" && deliverables.length > 0 && (
                            <div className="bg-gradient-to-br from-[var(--surface-strong)] to-[#111] border border-[var(--accent)]/30 p-6 rounded-3xl mt-8">
                                <h3 className="text-xl font-medium text-[var(--accent)] mb-2">Project Complete?</h3>
                                <p className="text-sm text-white/60 mb-6">
                                    If the final deliverables are approved, you can officially wrap up the project.
                                </p>
                                <CompletionRating projectId={project.id} token={project.portalToken} />
                            </div>
                        )}

                        {/* Completed State */}
                        {project.status === "COMPLETED" && (
                            <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 p-8 rounded-3xl text-center">
                                <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center text-3xl mx-auto mb-4 text-[#0A0A0A]">
                                    ✓
                                </div>
                                <h3 className="text-xl font-medium text-[var(--accent)] mb-2">Project Completed</h3>
                                <p className="text-sm text-white/60">
                                    Thank you for trusting Spectral Soundworks. Your final files will remain accessible here indefinitely.
                                </p>
                                {project.rating && (
                                    <div className="flex justify-center gap-1 mt-6">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <span key={star} className={`text-2xl ${star <= project.rating! ? "text-[var(--accent)]" : "text-white/10"}`}>★</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div >
        </div >
    );
}
