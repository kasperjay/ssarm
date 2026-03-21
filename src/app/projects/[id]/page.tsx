import { getProjectById, deleteFileFromProject } from "../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import FileUploadArea from "../components/FileUploadArea";
import CopyButton from "../components/CopyButton";
import VisibilityToggle from "../components/VisibilityToggle";
import ResolveButton from "../components/ResolveButton";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { StatusPill } from "@/components/StatusPill";
import { formatRelativeDate } from "@/lib/utils";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  // Dynamic Origin check via ENV or fallback
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const portalUrl = `${appUrl}/portal/${project.portalToken}`;

  const workingFiles = project.files.filter((f) => f.type === "WORKING");
  const deliverables = project.files.filter((f) => f.type === "DELIVERABLE");

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      
      <div className="mx-auto max-w-7xl space-y-12 px-6 py-24">
        {/* Header section */}
        <header className="flex flex-col gap-8 relative">
          <div className="absolute -top-24 -left-24 h-96 w-96 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="flex flex-wrap items-end justify-between gap-8 pb-10 border-b border-white/5 relative z-10">
            <div className="space-y-4">
              <Link href="/projects" className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all">
                <span className="transition-transform group-hover:-translate-x-1 text-lg leading-none">←</span> 
                Projects
              </Link>
              <div className="flex items-center gap-4">
                <h1 className="font-display text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl">
                  {project.title || `Project Alpha`}
                </h1>
                <StatusPill status={project.status} />
              </div>
              <p className="text-white/40 text-sm max-w-lg font-medium leading-relaxed">
                Project overview for <span className="text-accent font-bold uppercase tracking-widest">{project.artist.name}</span>. 
                Monitoring deliverable status and incoming client feedback.
              </p>
            </div>

            <GlassCard className="p-6! border-accent/20 bg-accent/2 min-w-[320px] shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">
                  Secure Portal
                </span>
                <CopyButton text={portalUrl} />
              </div>
              <div className="flex gap-2 items-center mb-3">
                <div className="flex-1 bg-black/40 rounded-xl border border-white/5 p-3 text-xs font-sans font-bold text-white/40 truncate">
                  {portalUrl}
                </div>
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-all font-bold text-xs uppercase tracking-widest"
                >
                  View Portal
                </a>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/20 font-bold uppercase tracking-widest italic px-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent/40"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                Portal visibility is currently active
              </div>
            </GlassCard>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 relative z-10">

          {/* Main Files Area */}
          <div className="space-y-12">

            {/* Work in Progress */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-white/20" />
                <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white/80">Working Files</h2>
                <span className="text-xs font-sans font-bold text-white/10 uppercase tracking-widest ml-auto">{workingFiles.length} Files</span>
                <div className="h-px w-20 bg-white/5" />
              </div>

              <FileUploadArea projectId={project.id} type="WORKING" />

              <div className="grid gap-4 mt-6">
                {workingFiles.map((file) => (
                  <GlassCard key={file.id} className="p-4! border-white/5 hover:border-white/10 hover:bg-white/4 group/file transition-all">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover/file:text-accent transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-bold text-sm text-white/90 truncate tracking-tight">{file.name}</p>
                            <VisibilityToggle fileId={file.id} isPublic={file.isPublic} projectId={project.id} />
                          </div>
                          <div className="flex items-center gap-3 text-xs font-sans font-bold text-white/20 uppercase tracking-widest">
                            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span className="h-1 w-1 rounded-full bg-white/5" />
                            <span>{formatRelativeDate(file.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <form action={async () => {
                        "use server";
                        await deleteFileFromProject(file.id, project.id);
                      }}>
                        <button className="text-[9px] font-bold text-red-500/40 hover:text-red-500 uppercase tracking-widest p-2 transition-colors">Delete</button>
                      </form>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white">Final Deliverables</h2>
                <span className="text-xs font-sans font-bold text-accent-warm/40 uppercase tracking-widest ml-auto">{deliverables.length} Files</span>
                <div className="h-px w-20 bg-accent/10" />
              </div>

              <FileUploadArea projectId={project.id} type="DELIVERABLE" />

              <div className="grid gap-4 mt-6">
                {deliverables.map((file) => (
                  <GlassCard key={file.id} className="p-5! border-accent/10 bg-accent/2 hover:border-accent/30 hover:bg-accent/4 group/file transition-all shadow-xl">
                    <div className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent neon-glow-pink">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-4 mb-2">
                            <p className="font-bold text-lg text-white group-hover/file:text-accent transition-colors truncate tracking-tighter">{file.name}</p>
                            <VisibilityToggle fileId={file.id} isPublic={file.isPublic} projectId={project.id} />
                          </div>
                          <div className="flex items-center gap-4 text-xs font-sans font-bold text-white/40 uppercase tracking-[0.2em]">
                            <span className="text-accent/60">MASTER</span>
                            <span className="h-1 w-1 rounded-full bg-white/10" />
                            <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span className="h-1 w-1 rounded-full bg-white/10" />
                            <span>{formatRelativeDate(file.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <form action={async () => {
                        "use server";
                        await deleteFileFromProject(file.id, project.id);
                      }}>
                        <button className="text-[9px] font-bold text-red-500/40 hover:text-red-500 uppercase tracking-widest p-2 transition-colors">DELETE</button>
                      </form>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar - Feedback */}
          <div className="space-y-8">
            <div className="flex items-center gap-4 mb-2">
              <h2 className="text-xs font-bold text-white/20 uppercase tracking-[0.3em]">Client Feedback</h2>
              <div className="h-px flex-1 bg-white/5" />
            </div>

            <GlassCard className="p-8! bg-white/2 group transition-all">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <span className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">Recent Notes</span>
                <span className="px-3 py-1 rounded-lg bg-white/5 text-xs font-sans font-bold text-white/60">
                  {project.feedbacks.length}
                </span>
              </div>

              {project.feedbacks.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/2 border border-dashed border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/10"><path d="M21 15a2 2 0 0 1-2 2H7l4-4V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/20 leading-relaxed">
                    No feedback received yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {project.feedbacks.map((fb) => (
                    <div 
                      key={fb.id} 
                      className={`relative p-6 rounded-[24px] border transition-all duration-500 ${
                        fb.resolved 
                          ? 'bg-black/20 border-white/5 opacity-40 grayscale' 
                          : 'bg-white/5 border-white/10 hover:border-accent/30 shadow-lg group/fb'
                      }`}
                    >
                      {!fb.resolved && <div className="absolute top-0 left-0 w-1 h-full bg-accent/20 rounded-l-full" />}
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <span className="text-xs font-sans font-bold text-white/20 uppercase tracking-widest">
                          {formatRelativeDate(fb.createdAt)}
                        </span>
                        {!fb.resolved && <ResolveButton feedbackId={fb.id} projectId={project.id} />}
                      </div>
                      <p className="text-sm font-medium leading-relaxed text-white/70 italic">&quot;{fb.content}&quot;</p>
                      {fb.resolved && (
                        <div className="mt-4 flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-accent" />
                          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Resolved</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

        </div>
      </div>
    </div>
  );
}
