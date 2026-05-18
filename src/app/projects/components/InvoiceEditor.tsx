"use client";

import { useMemo, useState } from "react";
import { upsertProjectInvoice } from "../actions";
import { centsToCurrency } from "@/lib/invoice";

type LineItem = {
  description: string;
  quantity: string;
  unitPrice: string;
};

type ExistingLineItem = {
  description: string;
  quantity: number;
  unitPriceCents: number;
  amountCents: number;
};

type ExistingInvoice = {
  id: string;
  invoiceNumber: string;
  dueAt: Date | null;
  currency: string;
  taxCents: number;
  notes: string | null;
  stripePaymentUrl: string | null;
  lineItems: ExistingLineItem[];
  subtotalCents: number;
  totalCents: number;
};

function toInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function InvoiceEditor({
  projectId,
  invoice,
}: {
  projectId: string;
  invoice: ExistingInvoice | null;
}) {
  const [lineItems, setLineItems] = useState<LineItem[]>(
    invoice?.lineItems?.length
      ? invoice.lineItems.map((item) => ({
          description: item.description,
          quantity: String(item.quantity),
          unitPrice: (item.unitPriceCents / 100).toFixed(2),
        }))
      : [{ description: "Final master delivery", quantity: "1", unitPrice: "0.00" }],
  );
  const [dueAt, setDueAt] = useState(toInputValue(invoice?.dueAt));
  const [tax, setTax] = useState(((invoice?.taxCents ?? 0) / 100).toFixed(2));
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [stripePaymentUrl, setStripePaymentUrl] = useState(invoice?.stripePaymentUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const previewTotals = useMemo(() => {
    const subtotalCents = lineItems.reduce((sum, item) => {
      const quantity = Number(item.quantity || "0");
      const unitPrice = Number(item.unitPrice || "0");
      if (!Number.isFinite(quantity) || !Number.isFinite(unitPrice)) return sum;
      return sum + Math.round(quantity * unitPrice * 100);
    }, 0);

    const taxCents = Math.max(0, Math.round(Number(tax || "0") * 100));
    const totalCents = subtotalCents + (Number.isFinite(taxCents) ? taxCents : 0);
    return { subtotalCents, taxCents, totalCents };
  }, [lineItems, tax]);

  function updateLineItem(index: number, patch: Partial<LineItem>) {
    setLineItems((current) =>
      current.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function removeLineItem(index: number) {
    setLineItems((current) => current.filter((_, i) => i !== index));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      dueAt,
      tax,
      notes,
      stripePaymentUrl,
      lineItems,
    };

    try {
      await upsertProjectInvoice(projectId, payload);
      setSuccess("Invoice saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save invoice");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/30">Line Items</p>
        <div className="space-y-3">
          {lineItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2">
              <input
                value={item.description}
                onChange={(e) => updateLineItem(idx, { description: e.target.value })}
                placeholder="Description"
                className="col-span-6 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
              />
              <input
                value={item.quantity}
                onChange={(e) => updateLineItem(idx, { quantity: e.target.value })}
                placeholder="Qty"
                inputMode="decimal"
                className="col-span-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
              />
              <input
                value={item.unitPrice}
                onChange={(e) => updateLineItem(idx, { unitPrice: e.target.value })}
                placeholder="Unit $"
                inputMode="decimal"
                className="col-span-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
              />
              <button
                type="button"
                onClick={() => removeLineItem(idx)}
                className="col-span-1 rounded-xl border border-red-500/30 bg-red-500/10 text-xs font-bold text-red-400"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setLineItems((current) => [...current, { description: "", quantity: "1", unitPrice: "0.00" }])}
          className="mt-2 rounded-xl border border-white/20 px-3 py-2 text-xs font-bold uppercase tracking-widest text-white/70"
        >
          Add line
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Due date</label>
          <input
            type="date"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Tax ($)</label>
          <input
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            inputMode="decimal"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Stripe payment link</label>
        <input
          value={stripePaymentUrl}
          onChange={(e) => setStripePaymentUrl(e.target.value)}
          placeholder="https://buy.stripe.com/..."
          className="w-full rounded-xl border border-accent/30 bg-black/30 px-3 py-2 text-sm text-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white"
        />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 space-y-1">
        <p>Subtotal: {centsToCurrency(previewTotals.subtotalCents)}</p>
        <p>Tax: {centsToCurrency(previewTotals.taxCents)}</p>
        <p className="font-bold">Total: {centsToCurrency(previewTotals.totalCents)}</p>
      </div>

      {error && <p className="text-xs font-bold text-red-400">{error}</p>}
      {success && <p className="text-xs font-bold text-emerald-400">{success}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-2xl border border-accent/40 bg-accent/20 py-3 text-xs font-bold uppercase tracking-[0.3em] text-accent disabled:opacity-50"
      >
        {saving ? "Saving…" : invoice ? "Update invoice" : "Create invoice"}
      </button>
    </form>
  );
}
