"use client";

import { useMemo, useState } from "react";
import { upsertProjectInvoice, markInvoicePaid } from "../actions";
import { centsToCurrency } from "@/lib/invoice";
import { INVOICE_PACKAGE_TEMPLATES } from "@/lib/invoice-templates";
import { STUDIO_PAYMENT_CONFIG } from "@/lib/payment-config";

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
  paidAt?: Date | null;
  currency: string;
  taxCents: number;
  notes: string | null;
  stripePaymentUrl: string | null;
  venmoHandle?: string | null;
  paypalUrl?: string | null;
  chimeTag?: string | null;
  selectedPaymentMethod?: string | null;
  lineItems: ExistingLineItem[];
  subtotalCents: number;
  totalCents: number;
};

function toInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function InvoiceEditor({
  projectId,
  invoice,
}: {
  projectId: string;
  invoice: ExistingInvoice | null;
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("CUSTOM");
  const [lineItems, setLineItems] = useState<LineItem[]>(
    invoice?.lineItems?.length
      ? invoice.lineItems.map((item) => ({
          description: item.description,
          quantity: String(item.quantity),
          unitPrice: (item.unitPriceCents / 100).toFixed(2),
        }))
      : [{ description: "Full Stereo Mixdown & Production Polish", quantity: "1", unitPrice: "250.00" }],
  );
  const [dueAt, setDueAt] = useState(toInputValue(invoice?.dueAt));
  const [tax, setTax] = useState(((invoice?.taxCents ?? 0) / 100).toFixed(2));
  const [notes, setNotes] = useState(invoice?.notes ?? "");
  const [stripePaymentUrl, setStripePaymentUrl] = useState(invoice?.stripePaymentUrl ?? "");
  const [venmoHandle, setVenmoHandle] = useState(invoice?.venmoHandle ?? STUDIO_PAYMENT_CONFIG.venmo.handle);
  const [paypalUrl, setPaypalUrl] = useState(invoice?.paypalUrl ?? STUDIO_PAYMENT_CONFIG.paypal.meUrl);
  const [chimeTag, setChimeTag] = useState(invoice?.chimeTag ?? STUDIO_PAYMENT_CONFIG.chime.tag);
  const [saving, setSaving] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
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

  function handleSelectTemplate(code: string) {
    setSelectedTemplate(code);
    if (code === "CUSTOM") {
      setLineItems([{ description: "", quantity: "1", unitPrice: "0.00" }]);
      return;
    }

    const template = INVOICE_PACKAGE_TEMPLATES.find((t) => t.code === code);
    if (template) {
      setLineItems(
        template.lineItems.map((item) => ({
          description: item.description,
          quantity: String(item.quantity),
          unitPrice: (item.unitPriceCents / 100).toFixed(2),
        }))
      );
      if (!notes || notes.trim() === "") {
        setNotes(template.description);
      }
    }
  }

  function updateLineItem(index: number, patch: Partial<LineItem>) {
    setLineItems((current) =>
      current.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    );
  }

  function removeLineItem(index: number) {
    setLineItems((current) => current.filter((_, i) => i !== index));
  }

  async function handleMarkPaid() {
    if (!confirm("Are you sure you want to mark this invoice as PAID? This will instantly unlock deliverables in client portal if gated.")) {
      return;
    }
    setMarkingPaid(true);
    setError(null);
    setSuccess(null);
    try {
      await markInvoicePaid(projectId, "STRIPE", "Studio engineer confirmed payment");
      setSuccess("Invoice marked as PAID! Client portal deliverables are now unlocked.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark invoice as paid");
    } finally {
      setMarkingPaid(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      templateId: selectedTemplate !== "CUSTOM" ? selectedTemplate : undefined,
      dueAt,
      tax,
      notes,
      stripePaymentUrl,
      venmoHandle,
      paypalUrl,
      chimeTag,
      lineItems,
    };

    try {
      await upsertProjectInvoice(projectId, payload);
      setSuccess("Invoice successfully saved!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save invoice");
    } finally {
      setSaving(false);
    }
  }

  const isPaid = Boolean(invoice?.paidAt);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Invoice Status Banner */}
      {invoice && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${isPaid ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-amber-500/10 border-amber-500/30 text-amber-300"}`}>
          <div className="flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${isPaid ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`} />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">{invoice.invoiceNumber} · {isPaid ? "PAID" : "UNPAID"}</p>
              {isPaid && invoice.paidAt && (
                <p className="text-[10px] text-white/50">Settled on {new Date(invoice.paidAt).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          {!isPaid && (
            <button
              type="button"
              disabled={markingPaid}
              onClick={handleMarkPaid}
              className="px-3 py-1.5 rounded-xl border border-emerald-400/40 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest hover:bg-emerald-500/30 transition-all disabled:opacity-50"
            >
              {markingPaid ? "Updating..." : "Mark as Paid"}
            </button>
          )}
        </div>
      )}

      {/* Package Template Quick Loader */}
      <div className="p-4 rounded-2xl bg-white/4 border border-white/10 space-y-2">
        <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-accent">
          Pre-Populated Package Templates
        </label>
        <p className="text-xs text-white/40">Select a popular studio package or start with a custom blank template:</p>
        <select
          value={selectedTemplate}
          onChange={(e) => handleSelectTemplate(e.target.value)}
          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2.5 text-xs font-bold text-white uppercase tracking-wider focus:border-accent focus:outline-none"
        >
          <option value="CUSTOM">-- Custom Blank Invoice (Create from scratch) --</option>
          {INVOICE_PACKAGE_TEMPLATES.map((tmpl) => (
            <option key={tmpl.code} value={tmpl.code}>
              {tmpl.name} — {centsToCurrency(tmpl.suggestedPriceCents)}
            </option>
          ))}
        </select>
      </div>

      {/* Line Items Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50">Line Items</p>
          <button
            type="button"
            onClick={() => setLineItems((current) => [...current, { description: "", quantity: "1", unitPrice: "0.00" }])}
            className="rounded-xl border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-accent hover:bg-accent/20 transition-all"
          >
            + Add Line Item
          </button>
        </div>

        <div className="space-y-2.5">
          {lineItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-black/20 p-2 rounded-xl border border-white/5">
              <input
                value={item.description}
                onChange={(e) => updateLineItem(idx, { description: e.target.value })}
                placeholder="Item description (e.g., Stereo Mixdown)"
                className="col-span-6 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white placeholder:text-white/20"
              />
              <input
                value={item.quantity}
                onChange={(e) => updateLineItem(idx, { quantity: e.target.value })}
                placeholder="Qty"
                inputMode="decimal"
                className="col-span-2 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white text-center"
              />
              <div className="col-span-3 relative">
                <span className="absolute left-2.5 top-2 text-xs text-white/40">$</span>
                <input
                  value={item.unitPrice}
                  onChange={(e) => updateLineItem(idx, { unitPrice: e.target.value })}
                  placeholder="0.00"
                  inputMode="decimal"
                  className="w-full rounded-lg border border-white/10 bg-black/40 pl-6 pr-3 py-2 text-xs font-medium text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => removeLineItem(idx)}
                className="col-span-1 flex items-center justify-center h-8 rounded-lg border border-red-500/20 bg-red-500/10 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-all"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Due Date & Tax */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Due Date</label>
          <input
            type="date"
            value={dueAt}
            onChange={(e) => setDueAt(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Tax ($)</label>
          <input
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            inputMode="decimal"
            placeholder="0.00"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-medium text-white"
          />
        </div>
      </div>

      {/* Multi-Channel Payment Options */}
      <div className="p-4 rounded-2xl bg-white/3 border border-white/8 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/60">
          Payment Rails & Integration Settings
        </p>

        <div>
          <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-accent/80">Stripe Payment Link (Cards & Apple Pay)</label>
          <input
            value={stripePaymentUrl}
            onChange={(e) => setStripePaymentUrl(e.target.value)}
            placeholder="https://buy.stripe.com/..."
            className="w-full rounded-xl border border-accent/30 bg-black/40 px-3 py-2 text-xs text-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">PayPal Me URL</label>
            <input
              value={paypalUrl}
              onChange={(e) => setPaypalUrl(e.target.value)}
              placeholder="https://paypal.me/..."
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Venmo Handle</label>
            <input
              value={venmoHandle}
              onChange={(e) => setVenmoHandle(e.target.value)}
              placeholder="@SpectralSoundworks"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">Chime Tag</label>
            <input
              value={chimeTag}
              onChange={(e) => setChimeTag(e.target.value)}
              placeholder="$SpectralSoundworks"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Notes / Instructions */}
      <div>
        <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Invoice Notes / Instructions</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Includes full mix, 2 revisions, and uncompressed 24-bit masters..."
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white"
        />
      </div>

      {/* Totals Summary */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs font-semibold text-white/80 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{centsToCurrency(previewTotals.subtotalCents)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{centsToCurrency(previewTotals.taxCents)}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-accent pt-1 border-t border-white/5">
          <span>Total</span>
          <span>{centsToCurrency(previewTotals.totalCents)}</span>
        </div>
      </div>

      {error && <p className="text-xs font-bold text-red-400">{error}</p>}
      {success && <p className="text-xs font-bold text-emerald-400">{success}</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-2xl border border-accent/40 bg-accent/20 py-3.5 text-xs font-bold uppercase tracking-[0.3em] text-accent hover:bg-accent/30 transition-all disabled:opacity-50"
      >
        {saving ? "Saving…" : invoice ? "Update Invoice" : "Create Invoice"}
      </button>
    </form>
  );
}
