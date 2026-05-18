export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { centsToCurrency } from "@/lib/invoice";
import InvoiceEditor from "../../components/InvoiceEditor";

export default async function ProjectInvoiceEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      artist: true,
      invoice: true,
    },
  });

  if (!project) notFound();

  const billingHistory = await prisma.projectInvoice.findMany({
    where: {
      project: {
        artistId: project.artistId,
      },
    },
    include: {
      project: {
        select: { id: true, title: true },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-6xl space-y-10 px-6 py-24">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div className="space-y-3">
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-white/40 hover:text-accent transition-all"
            >
              <span>←</span>
              <span>Back to Project</span>
            </Link>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white">
              Invoice <span className="premium-gradient-text italic">Creation</span>
            </h1>
            <p className="text-sm text-white/45 font-medium">
              {project.artist.name} · {project.title || "Untitled Project"}
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <GlassCard className="p-8! border-accent/20 bg-accent/2">
            <InvoiceEditor
              projectId={project.id}
              invoice={
                project.invoice
                  ? {
                      ...project.invoice,
                      lineItems: Array.isArray(project.invoice.lineItems)
                        ? (project.invoice.lineItems as {
                            description: string;
                            quantity: number;
                            unitPriceCents: number;
                            amountCents: number;
                          }[])
                        : [],
                    }
                  : null
              }
            />
          </GlassCard>

          <GlassCard className="p-8! bg-white/2 border-white/5 h-fit">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <span className="text-xs font-bold text-white/35 uppercase tracking-[0.3em]">Billing History</span>
              <span className="text-xs font-bold text-accent/70 uppercase tracking-widest">{billingHistory.length}</span>
            </div>

            {billingHistory.length === 0 ? (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/25">No invoices sent yet.</p>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-2 custom-scrollbar">
                {billingHistory.map((inv) => {
                  const isPaid = Boolean(inv.paidAt);
                  return (
                    <Link
                      key={inv.id}
                      href={`/projects/${inv.project.id}/invoice`}
                      className="block rounded-2xl border border-white/8 bg-white/3 px-4 py-4 hover:bg-white/5 hover:border-accent/25 transition-all"
                    >
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">{inv.invoiceNumber}</p>
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isPaid ? "text-emerald-400" : "text-amber-300"}`}>
                          {isPaid ? "Paid" : "Unpaid"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/35">
                        <span className="truncate pr-3">{inv.project.title || "Untitled Project"}</span>
                        <span className="text-accent/80">{centsToCurrency(inv.totalCents, inv.currency)}</span>
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mt-2">
                        Issued {new Date(inv.issuedAt).toLocaleDateString("en-US")}
                      </p>
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
