import { getProjects } from "./actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateProjectForm from "./components/CreateProjectForm";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { StatusPill } from "@/components/StatusPill";

export default async function ProjectsDashboard() {
    const projects = await getProjects();
    // Fetch artists for the create dropdown
    const artists = await prisma.artist.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });

    return (
        <div className="relative min-h-screen bg-transparent">
            
            <div className="mx-auto max-w-7xl space-y-12 px-6 py-24">
                <header className="flex flex-col gap-8 relative">
                    <div className="absolute -top-24 -left-24 h-96 w-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="flex flex-wrap items-end justify-between gap-8 pb-10 border-b border-white/5 relative z-10">
                        <div className="space-y-4">
                            <Link href="/" className="inline-flex items-center gap-2 group text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all">
                                <span className="transition-transform group-hover:-translate-x-1 text-lg leading-none">←</span> 
                                Dashboard
                            </Link>
                            <h1 className="font-display text-5xl font-bold tracking-tighter md:text-6xl lg:text-7xl text-white">
                                Project <span className="premium-gradient-text italic">Management</span>
                            </h1>
                            <p className="text-white/40 text-sm max-w-lg font-medium leading-relaxed">
                                Manage active deliverables, secure client portals, and track feedback for all ongoing artist collaborations.
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 relative z-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                            <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white">Active Projects</h2>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>

                        {projects.length === 0 ? (
                            <GlassCard className="p-12! text-center border-dashed border-white/10 bg-white/2">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20">
                                    No active projects found.
                                </p>
                            </GlassCard>
                        ) : (
                            <div className="grid gap-6">
                                {projects.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={`/projects/${project.id}`}
                                        className="block group"
                                    >
                                        <GlassCard className="p-8! transition-all hover:bg-white/4 border-white/5 hover:border-accent/30 shadow-xl group-hover:-translate-y-1">
                                            <div className="flex justify-between items-start gap-6">
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <h2 className="text-2xl font-bold tracking-tight text-white group-hover:text-accent transition-colors">
                                                            {project.title || "Untitled Project"}
                                                        </h2>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Client:</span>
                                                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest">{project.artist.name}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <StatusPill status={project.status} />
                                                        <div className="h-1 w-1 rounded-full bg-white/10" />
                                                        <span className="text-[9px] font-sans font-bold text-white/20 uppercase tracking-[0.2em]">
                                                            Ref: {project.id.slice(-8).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-3">
                                                    <div className="flex items-center gap-4 px-4 py-2 rounded-xl bg-white/2 border border-white/5 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                                        <div className="flex items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>
                                                            {project.files.length}
                                                        </div>
                                                        <div className="h-3 w-px bg-white/10" />
                                                        <div className="flex items-center gap-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                                                            {project.feedbacks.length}
                                                        </div>
                                                    </div>
                                                    {project.feedbacks.length > 0 && (
                                                        <span className="flex items-center gap-2 text-[8px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                                                            <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                                                            Needs Review
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </GlassCard>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Management</h2>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        
                        <GlassCard className="p-8! border-accent/20 bg-accent/2">
                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 text-white/60">Create New Project</h3>
                            <CreateProjectForm artists={artists} />
                        </GlassCard>
                    </div>
                </div>
            </div>
        </div>
    );
}
