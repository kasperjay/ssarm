export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { prisma } from "@/lib/prisma";
import { centsToCurrency } from "@/lib/invoice";

export default async function PortalBillingHistoryPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const currentProject = await prisma.project.findUnique({
    where: { portalToken: token },
    include: { artist: true },
  });

  if (!currentProject) notFound();

  // Query all projects associated with this artist
  const allProjects = await prisma.project.findMany({
    where: { artistId: currentProject.artistId },
    include: {
      invoice: true,
      files: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Query all billing history for this artist
  const billingHistory = await prisma.projectInvoice.findMany({
    where: {
      project: {
        artistId: currentProject.artistId,
      },
    },
    include: {
      project: {
        select: { portalToken: true, title: true, status: true },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  const totalPaidCents = billingHistory
    .filter((inv) => Boolean(inv.paidAt))
    .reduce((sum, inv) => sum + inv.totalCents, 0);

  const completedProjectsCount = allProjects.filter((p) => p.status === "COMPLETED").length;

  return (
    <div className="relative min-h-screen bg-background selection:bg-accent/30 selection:text-white">
      <div className="mx-auto max-w-4xl space-y-12 px-6 py-24 relative z-10">
        <header className="space-y-6 text-center">
          <div className="flex justify-center">
            <Link
              href={`/portal/${token}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-white/50 transition-all hover:text-white hover:border-white/20"
            >
              <span>←</span>
              <span>Back to Current Project</span>
            </Link>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent/70">Artist Dashboard</div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white">
              Project & Payment <span className="premium-gradient-text italic">History</span>
            </h1>
            <p className="text-sm text-white/40 font-medium">
              Complete project archive and financial ledger for <strong className="text-white">{currentProject.artist.name}</strong>
            </p>
          </div>
        </header>

        {/* Studio Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-6! border-white/10 bg-white/3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Total Projects</p>
            <p className="font-display text-3xl font-bold text-white mt-1">{allProjects.length}</p>
            <p className="text-[10px] text-white/30 mt-1">{completedProjectsCount} Completed · {allProjects.length - completedProjectsCount} Active</p>
          </GlassCard>

          <GlassCard className="p-6! border-white/10 bg-white/3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Total Invoices</p>
            <p className="font-display text-3xl font-bold text-white mt-1">{billingHistory.length}</p>
            <p className="text-[10px] text-white/30 mt-1">{billingHistory.filter(i => Boolean(i.paidAt)).length} Settled</p>
          </GlassCard>

          <GlassCard className="p-6! border-accent/20 bg-accent/2 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">Total Settled</p>
            <p className="font-display text-3xl font-bold text-accent mt-1">{centsToCurrency(totalPaidCents)}</p>
            <p className="text-[10px] text-accent/60 mt-1">Direct Studio Investment</p>
          </GlassCard>
        </div>

        {/* Project History Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
              Project Lifecycle History ({allProjects.length})
            </h2>
          </div>

          <div className="space-y-3">
            {allProjects.map((proj) => {
              const isCurrent = proj.id === currentProject.id;
              return (
                <Link
                  key={proj.id}
                  href={`/portal/${proj.portalToken}`}
                  className={`block rounded-2xl border p-5 transition-all ${
                    isCurrent
                      ? "bg-accent/5 border-accent/30 shadow-[0_0_15px_rgba(0,242,255,0.1)]"
                      : "bg-white/3 border-white/8 hover:bg-white/6 hover:border-white/20"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-white tracking-tight">
                        {proj.title || `Project #${proj.id.slice(-6).toUpperCase()}`}
                      </p>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent text-[9px] font-bold uppercase tracking-widest">
                          Viewing Now
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        proj.status === "COMPLETED"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-accent/20 text-accent border border-accent/30"
                      }`}
                    >
                      {proj.status === "COMPLETED" ? "✓ Completed" : "Active Session"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/40">
                    <div className="flex items-center gap-4">
                      <span>{proj.files.length} Files</span>
                      {proj.mixApprovedForMastering && (
                        <span className="text-emerald-400">✓ Mix Approved</span>
                      )}
                      {proj.rating && (
                        <span className="text-amber-300">★ {proj.rating}/5 Stars</span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-white/30">
                      Started {new Date(proj.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Invoices & Payment Ledger */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
              Payment & Invoice Ledger ({billingHistory.length})
            </h2>
          </div>

          <GlassCard className="p-8! border-accent/20 bg-accent/2 shadow-xl">
            {billingHistory.length === 0 ? (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/25 text-center py-4">
                No invoices recorded yet.
              </p>
            ) : (
              <div className="space-y-3">
                {billingHistory.map((inv) => {
                  const isPaid = Boolean(inv.paidAt);
                  return (
                    <Link
                      key={inv.id}
                      href={`/portal/${inv.project.portalToken}/invoice`}
                      className="block rounded-2xl border border-white/8 bg-white/3 p-5 hover:bg-white/6 hover:border-accent/30 transition-all"
                    >
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                            {inv.invoiceNumber}
                          </p>
                          {inv.selectedPaymentMethod && (
                            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50">
                              {inv.selectedPaymentMethod}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${
                            isPaid
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {isPaid ? "Paid & Settled" : "Unpaid"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                        <span className="truncate pr-3">{inv.project.title || "Project Session"}</span>
                        <span className="text-accent font-mono text-sm">{centsToCurrency(inv.totalCents, inv.currency)}</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-white/30 mt-3 pt-2 border-t border-white/5 font-mono">
                        <span>Issued {new Date(inv.issuedAt).toLocaleDateString()}</span>
                        {isPaid && inv.paidAt && (
                          <span className="text-emerald-400">Paid on {new Date(inv.paidAt).toLocaleDateString()}</span>
                        )}
                        {!isPaid && inv.dueAt && (
                          <span className="text-amber-300">Due {new Date(inv.dueAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
