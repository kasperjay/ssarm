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

  const project = await prisma.project.findUnique({
    where: { portalToken: token },
    include: { artist: true },
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
        select: { portalToken: true, title: true },
      },
    },
    orderBy: { issuedAt: "desc" },
  });

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
              <span>Back to Portal</span>
            </Link>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent/70">Billing History</div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white">
              {project.artist.name}
            </h1>
            <p className="text-sm text-white/40 font-medium">All invoices ever sent for this artist</p>
          </div>
        </header>

        <GlassCard className="p-8! border-accent/20 bg-accent/2 shadow-xl">
          {billingHistory.length === 0 ? (
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/25">No invoices sent yet.</p>
          ) : (
            <div className="space-y-3">
              {billingHistory.map((inv) => {
                const isPaid = Boolean(inv.paidAt);
                return (
                  <Link
                    key={inv.id}
                    href={`/portal/${inv.project.portalToken}/invoice`}
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
  );
}
