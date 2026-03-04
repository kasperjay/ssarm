import { getProjects } from "./actions";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CreateProjectForm from "./components/CreateProjectForm";

export default async function ProjectsDashboard() {
    const projects = await getProjects();
    // Fetch artists for the create dropdown
    const artists = await prisma.artist.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true },
    });

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-display font-medium text-[var(--primary)]">
                            Client Projects
                        </h1>
                        <p className="text-[var(--foreground-muted)] mt-2">
                            Manage deliverables, work-in-progress files, and client portals.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
                    >
                        &larr; Back to Lead Desk
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Main List */}
                    <div className="md:col-span-3 space-y-4">
                        {projects.length === 0 ? (
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 text-center text-[var(--foreground-muted)]">
                                No active projects found. Create one to get started.
                            </div>
                        ) : (
                            projects.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/projects/${project.id}`}
                                    className="block bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--primary)]/50 transition-colors group"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-xl font-medium group-hover:text-[var(--primary)] transition-colors">
                                                {project.title || `Project for ${project.artist.name}`}
                                            </h2>
                                            <p className="text-sm text-[var(--foreground-muted)] mt-1">
                                                Client: {project.artist.name} &bull; Status:{" "}
                                                <span className="capitalize text-[var(--accent)] font-medium">
                                                    {project.status.toLowerCase()}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm bg-[var(--surface-strong)] px-3 py-1 rounded-full text-[var(--foreground-muted)] flex items-center gap-2">
                                                <span>{project.files.length} Files</span>
                                                {project.feedbacks.length > 0 && (
                                                    <span className="w-2 h-2 rounded-full bg-[var(--error)]" title="Unresolved feedback pending"></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
                            <h3 className="font-medium text-lg mb-4 text-[var(--primary)]">
                                New Project
                            </h3>
                            <CreateProjectForm artists={artists} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
