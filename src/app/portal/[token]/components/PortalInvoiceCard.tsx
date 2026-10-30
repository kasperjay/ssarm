"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { centsToCurrency } from "@/lib/invoice";
import PaymentMethodModal from "./PaymentMethodModal";

interface PortalInvoiceCardProps {
  projectId: string;
  token: string;
  artistName: string;
  projectTitle: string;
  invoice: {
    id: string;
    invoiceNumber: string;
    subtotalCents: number;
    taxCents: number;
    totalCents: number;
    currency: string;
    dueAt: string | null;
    paidAt: string | null;
    notes: string | null;
    stripePaymentUrl: string | null;
    venmoHandle?: string | null;
    paypalUrl?: string | null;
    chimeTag?: string | null;
    selectedPaymentMethod?: string | null;
    lineItems: {
      description: string;
      quantity: number;
      unitPriceCents: number;
      amountCents: number;
    }[];
  };
}

export default function PortalInvoiceCard({
  projectId,
  token,
  artistName,
  projectTitle,
  invoice,
}: PortalInvoiceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isPaid = Boolean(invoice.paidAt);

  return (
    <>
      <GlassCard className="p-8! border-accent/20 bg-accent/2 shadow-xl space-y-8">
        {/* Invoice Status Ribbon */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${isPaid ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.5)]"}`} />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/70">
              {isPaid ? "Paid & Settled" : "Payment Due"}
            </span>
          </div>
          {isPaid && invoice.paidAt && (
            <span className="text-[11px] font-mono text-emerald-400">
              Paid on {new Date(invoice.paidAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          {invoice.lineItems.map((item, i) => (
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
              <div className="font-bold text-white font-mono">
                {centsToCurrency(item.amountCents, invoice.currency)}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 border-t border-white/5 pt-6 text-sm text-white/70">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono">{centsToCurrency(invoice.subtotalCents, invoice.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span className="font-mono">{centsToCurrency(invoice.taxCents, invoice.currency)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/5">
            <span>Total</span>
            <span className="font-mono text-accent">{centsToCurrency(invoice.totalCents, invoice.currency)}</span>
          </div>
          {invoice.dueAt && !isPaid && (
            <div className="pt-3 text-xs uppercase tracking-[0.25em] text-white/40">
              Due Date: {new Date(invoice.dueAt).toLocaleDateString("en-US")}
            </div>
          )}
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="rounded-2xl border border-white/5 bg-white/3 px-4 py-4 text-xs text-white/70 leading-relaxed italic">
            &quot;{invoice.notes}&quot;
          </div>
        )}

        {/* Payment Action Section */}
        {isPaid ? (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-300">
              ✓ Invoice Settled
            </p>
            <p className="text-[11px] text-white/50">
              Thank you for collaborating with Spectral Soundworks. Deliverables are fully accessible.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-accent/50 bg-accent/20 py-4 text-xs font-bold uppercase tracking-[0.3em] text-accent transition-all hover:bg-accent/30 hover:shadow-[0_0_20px_rgba(0,242,255,0.3)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              Pay Now (Stripe, Apple Pay, Venmo, PayPal, Chime)
            </button>
            <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/30">
              Select your preferred payment rail after clicking Pay Now
            </p>
          </div>
        )}
      </GlassCard>

      <PaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        token={token}
        invoice={invoice}
      />
    </>
  );
}
