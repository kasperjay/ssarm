import { getProjectById, deleteFileFromProject } from "../actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import FileUploadArea from "../components/FileUploadArea";
import { formatDistanceToNow } from "date-fns";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // Await the entire params object before accessing id
  const resolvedParams = await Promise.resolve(params);
  const project = await getProjectById(resolvedParams.id);

  if (!project) notFound();

  // Assuming Dev Server for now; in prod replace with actual origin
  const portalUrl = `http://localhost:3000/portal/${project.portalToken}`;

  const workingFiles = project.files.filter((f) => f.type === "WORKING");
  const deliverables = project.files.filter((f) => f.type === "DELIVERABLE");

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/projects"
                className="text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
              >
                &larr; All Projects
              </Link>
              <span className="text-[var(--border)]">|</span>
              <span className="text-sm px-2 py-0.5 rounded-full bg-[var(--surface-strong)] text-[var(--foreground-muted)] capitalize">
                {project.status.toLowerCase()}
              </span>
            </div>
            <h1 className="text-4xl font-display font-medium text-[var(--primary)]">
              {project.title || `Project for ${project.artist.name}`}
            </h1>
            <p className="text-[var(--foreground-muted)] mt-1">
              Client: {project.artist.name}
            </p>
          </div>

          <div className="bg-[var(--surface)] border border-[var(--primary)]/30 rounded-lg p-4 w-full md:w-auto shadow-[0_0_15px_rgba(var(--primary-rgb),0.05)]">
            <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-2 uppercase tracking-wider">
              Client Portal Access
            </h3>
            <div className="flex gap-2 items-center">
              <code className="text-sm bg-[var(--background)] px-3 py-2 rounded border border-[var(--border)] text-[var(--primary)] break-all flex-1">
                {portalUrl}
              </code>
              <a
                href={portalUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-[var(--primary)] text-[var(--background)] px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Open &nearr;
              </a>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-2">
              Share this secure link with the client. No login required.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Files Area - 2 columns wide */}
          <div className="lg:col-span-2 space-y-8">

            {/* Work in Progress */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                <h2 className="text-2xl font-light">Working Files</h2>
                <span className="text-sm text-[var(--foreground-muted)]">{workingFiles.length} files</span>
              </div>

              <FileUploadArea projectId={project.id} type="WORKING" />

              <div className="space-y-2 mt-4">
                {workingFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-md hover:border-[var(--primary)]/50 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded bg-[var(--surface-strong)] flex items-center justify-center text-[var(--primary)] shrink-0">
                        🎵
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB &bull; Uploaded {formatDistanceToNow(new Date(file.createdAt))} ago
                        </p>
                      </div>
                    </div>
                    <form action={async () => {
                      "use server";
                      await deleteFileFromProject(file.id, project.id);
                    }}>
                      <button className="text-sm text-[var(--error)] hover:opacity-70 p-2">Delete</button>
                    </form>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center border-b border-[var(--border)] pb-2">
                <h2 className="text-2xl font-light text-[var(--accent)]">Final Deliverables</h2>
                <span className="text-sm text-[var(--foreground-muted)]">{deliverables.length} files</span>
              </div>

              <FileUploadArea projectId={project.id} type="DELIVERABLE" />

              <div className="space-y-2 mt-4">
                {deliverables.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-[var(--surface)] border border-[var(--border)] rounded-md hover:border-[var(--accent)]/50 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] shrink-0">
                        ⭐
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <p className="text-xs text-[var(--foreground-muted)]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB &bull; Uploaded {formatDistanceToNow(new Date(file.createdAt))} ago
                        </p>
                      </div>
                    </div>
                    <form action={async () => {
                      "use server";
                      await deleteFileFromProject(file.id, project.id);
                    }}>
                      <button className="text-sm text-[var(--error)] hover:opacity-70 p-2">Delete</button>
                    </form>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar - Feedback */}
          <div className="space-y-6">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 h-full">
              <h3 className="font-medium text-lg mb-4 text-[var(--primary)] flex items-center justify-between">
                <span>Client Feedback</span>
                <span className="text-xs bg-[var(--surface-strong)] px-2 py-1 rounded-full text-[var(--foreground)]">
                  {project.feedbacks.length} notes
                </span>
              </h3>

              {project.feedbacks.length === 0 ? (
                <p className="text-sm text-[var(--foreground-muted)] text-center py-8">
                  No feedback from the client yet. Mix notes and revision requests will appear here.
                </p>
              ) : (
                <div className="space-y-4">
                  {project.feedbacks.map((fb) => (
                    <div key={fb.id} className={`p-4 rounded-lg border ${fb.resolved ? 'bg-[var(--background)] border-[var(--border)] opacity-60' : 'bg-[var(--surface-strong)] border-[var(--primary)]/30'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-[var(--foreground-muted)]">
                          {formatDistanceToNow(new Date(fb.createdAt))} ago
                        </span>
                        {!fb.resolved && <span className="w-2 h-2 rounded-full bg-[var(--error)]"></span>}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{fb.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
