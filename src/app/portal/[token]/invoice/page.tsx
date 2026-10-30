export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PortalInvoiceCard from "../components/PortalInvoiceCard";

export default async function PortalInvoicePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const project = await prisma.project.findUnique({
    where: { portalToken: token },
    include: {
      artist: true,
      invoice: true,
    },
  });

  if (!project || !project.invoice) notFound();

  const invoice = project.invoice;

  const invoiceLineItems = Array.isArray(invoice.lineItems)
    ? (invoice.lineItems as {
        description: string;
        quantity: number;
        unitPriceCents: number;
        amountCents: number;
      }[])
    : [];

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
            <div className="text-xs font-bold uppercase tracking-[0.35em] text-accent/70">Invoice</div>
            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-white">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-sm text-white/40 font-medium">
              {project.artist.name} · {project.title || "Project"}
            </p>
          </div>
        </header>

        <PortalInvoiceCard
          projectId={project.id}
          token={token}
          artistName={project.artist.name}
          projectTitle={project.title || "Project Review"}
          invoice={{
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            subtotalCents: invoice.subtotalCents,
            taxCents: invoice.taxCents,
            totalCents: invoice.totalCents,
            currency: invoice.currency,
            dueAt: invoice.dueAt ? invoice.dueAt.toISOString() : null,
            paidAt: invoice.paidAt ? invoice.paidAt.toISOString() : null,
            notes: invoice.notes,
            stripePaymentUrl: invoice.stripePaymentUrl,
            venmoHandle: invoice.venmoHandle,
            paypalUrl: invoice.paypalUrl,
            chimeTag: invoice.chimeTag,
            selectedPaymentMethod: invoice.selectedPaymentMethod,
            lineItems: invoiceLineItems,
          }}
        />
      </div>
    </div>
  );
}
