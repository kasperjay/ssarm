"use client";

import { useState } from "react";
import { toggleDeliverablePaywall } from "../actions";

interface PaywallToggleProps {
  projectId: string;
  initialValue: boolean;
  hasInvoice: boolean;
  isPaid: boolean;
}

export default function PaywallToggle({
  projectId,
  initialValue,
  hasInvoice,
  isPaid,
}: PaywallToggleProps) {
  const [enabled, setEnabled] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);

  async function handleToggle() {
    const nextVal = !enabled;
    setIsUpdating(true);
    try {
      await toggleDeliverablePaywall(projectId, nextVal);
      setEnabled(nextVal);
    } catch {
      alert("Failed to update paywall lock state");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/3 border border-white/8">
      <div className="space-y-1 pr-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            Deliverable Paywall Gate
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
              enabled
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : "bg-white/10 text-white/40"
            }`}
          >
            {enabled ? "Locked by Invoice" : "Open / Unlocked"}
          </span>
        </div>
        <p className="text-[11px] text-white/40 leading-relaxed">
          {enabled
            ? isPaid
              ? "Invoice is marked PAID. Deliverables are unlocked for client."
              : hasInvoice
              ? "Deliverables are locked. Client must settle invoice to access downloads."
              : "Paywall active (create an invoice to enforce payment barrier)."
            : "Deliverables are not paywalled. Client can download files freely."}
        </p>
      </div>

      <button
        type="button"
        disabled={isUpdating}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
          enabled ? "bg-accent" : "bg-white/10"
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
