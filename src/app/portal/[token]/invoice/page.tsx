export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { prisma } from "@/lib/prisma";
import { centsToCurrency } from "@/lib/invoice";

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

        <GlassCard className="p-8! border-accent/20 bg-accent/2 shadow-xl space-y-8">
          <div className="space-y-4">
            {invoiceLineItems.map((item, i) => (
              <div
                key={`${item.description}-${i}`}
                className="flex items-center justify-between gap-6 border-b border-white/5 pb-3 text-sm text-white/80"
              >
                <div>
                  <div className="font-semibold text-white">{item.description}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/30">
                    Qty {item.quantity} · {centsToCurrency(item.unitPriceCents, invoice.currency)} each
                  </div>
                </div>
                <div className="font-bold text-white">
                  {centsToCurrency(item.amountCents, invoice.currency)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-white/5 pt-6 text-sm text-white/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{centsToCurrency(invoice.subtotalCents, invoice.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{centsToCurrency(invoice.taxCents, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2">
              <span>Total</span>
              <span>{centsToCurrency(invoice.totalCents, invoice.currency)}</span>
            </div>
            {invoice.dueAt ? (
              <div className="pt-3 text-xs uppercase tracking-[0.25em] text-white/35">
                Due {new Date(invoice.dueAt).toLocaleDateString("en-US")}
              </div>
            ) : null}
          </div>

          {invoice.notes ? (
            <div className="rounded-2xl border border-white/5 bg-white/3 px-4 py-4 text-sm text-white/60">
              {invoice.notes}
            </div>
          ) : null}

          {invoice.stripePaymentUrl ? (
            <a
              href={invoice.stripePaymentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center rounded-2xl border border-accent/40 bg-accent/20 py-4 text-xs font-bold uppercase tracking-[0.3em] text-accent transition-all hover:bg-accent/30"
            >
              Pay with Stripe
            </a>
          ) : (
            <div className="text-center text-xs font-bold uppercase tracking-[0.25em] text-white/30">
              Payment link will appear here when ready.
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
