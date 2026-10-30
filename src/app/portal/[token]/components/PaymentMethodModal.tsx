"use client";

import { useState } from "react";
import { GlassCard } from "@/components/GlassCard";
import { centsToCurrency } from "@/lib/invoice";
import { submitPaymentNotice } from "../actions";

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  token: string;
  invoice: {
    id: string;
    invoiceNumber: string;
    totalCents: number;
    currency: string;
    stripePaymentUrl?: string | null;
    venmoHandle?: string | null;
    paypalUrl?: string | null;
    chimeTag?: string | null;
  };
}

type PaymentRail = "STRIPE" | "APPLE_PAY" | "PAYPAL" | "VENMO" | "CHIME";

export default function PaymentMethodModal({
  isOpen,
  onClose,
  projectId,
  token,
  invoice,
}: PaymentMethodModalProps) {
  const [selectedRail, setSelectedRail] = useState<PaymentRail>("STRIPE");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noticeSent, setNoticeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const venmoHandle = invoice.venmoHandle || "@SpectralSoundworks";
  const chimeTag = invoice.chimeTag || "$SpectralSoundworks";
  const paypalUrl = invoice.paypalUrl || "https://paypal.me/SpectralSoundworks";
  const stripeUrl = invoice.stripePaymentUrl || "#";

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  }

  async function handleConfirmSent() {
    setIsSubmitting(true);
    setError(null);
    try {
      await submitPaymentNotice(projectId, token, selectedRail, reference);
      setNoticeSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to record payment notice");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl">
        <GlassCard className="p-8! border-accent/30 bg-black/90 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Select Payment Rail</p>
              <h2 className="text-2xl font-bold tracking-tight text-white mt-0.5">
                Pay {centsToCurrency(invoice.totalCents, invoice.currency)}
              </h2>
              <p className="text-xs text-white/40 mt-1">Invoice #{invoice.invoiceNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
            >
              ✕
            </button>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { id: "STRIPE" as PaymentRail, label: "Card / Stripe", icon: "💳" },
              { id: "APPLE_PAY" as PaymentRail, label: "Apple Pay", icon: "" },
              { id: "PAYPAL" as PaymentRail, label: "PayPal", icon: "🅿️" },
              { id: "VENMO" as PaymentRail, label: "Venmo", icon: "✌️" },
              { id: "CHIME" as PaymentRail, label: "Chime", icon: "🟢" },
            ].map((rail) => (
              <button
                key={rail.id}
                onClick={() => {
                  setSelectedRail(rail.id);
                  setNoticeSent(false);
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  selectedRail === rail.id
                    ? "bg-accent/20 border-accent text-white shadow-[0_0_15px_rgba(0,242,255,0.2)]"
                    : "bg-white/4 border-white/8 text-white/50 hover:bg-white/8 hover:text-white"
                }`}
              >
                <div className="text-xl mb-1">{rail.icon}</div>
                <div className="text-[10px] font-bold tracking-tight truncate">{rail.label}</div>
              </button>
            ))}
          </div>

          {/* Rail Detail Body */}
          <div className="p-6 rounded-2xl bg-white/3 border border-white/8 space-y-4">
            {/* Stripe Rail */}
            {selectedRail === "STRIPE" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-2xl">💳</span>
                  <div>
                    <p className="text-sm font-bold">Credit & Debit Card (Instant Processing)</p>
                    <p className="text-xs text-white/40">Secure checkout powered by Stripe. Instant receipt and deliverable unlock.</p>
                  </div>
                </div>
                {stripeUrl && stripeUrl !== "#" ? (
                  <a
                    href={stripeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/20 py-3 text-xs font-bold uppercase tracking-[0.25em] text-accent hover:bg-accent/30 transition-all shadow-lg"
                  >
                    Proceed to Stripe Checkout →
                  </a>
                ) : (
                  <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-center text-xs text-white/40">
                    A direct Stripe payment link is being prepared by the studio engineer. You may also select Venmo, PayPal, or Chime below.
                  </div>
                )}
              </div>
            )}

            {/* Apple Pay Rail */}
            {selectedRail === "APPLE_PAY" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-2xl"></span>
                  <div>
                    <p className="text-sm font-bold">Apple Pay</p>
                    <p className="text-xs text-white/40">1-touch checkout on compatible Apple devices via Stripe.</p>
                  </div>
                </div>
                {stripeUrl && stripeUrl !== "#" ? (
                  <a
                    href={stripeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white text-black py-3 text-xs font-bold uppercase tracking-[0.25em] hover:bg-white/90 transition-all shadow-lg"
                  >
                     Pay with Apple Pay
                  </a>
                ) : (
                  <div className="p-4 rounded-xl bg-white/2 border border-white/5 text-center text-xs text-white/40">
                    Apple Pay checkout is integrated through our Stripe checkout link.
                  </div>
                )}
              </div>
            )}

            {/* PayPal Rail */}
            {selectedRail === "PAYPAL" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-2xl">🅿️</span>
                  <div>
                    <p className="text-sm font-bold">PayPal Transfer</p>
                    <p className="text-xs text-white/40">Send directly via PayPal balance or linked bank.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <span className="text-white/60">PayPal Link:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-accent font-bold truncate max-w-[200px]">{paypalUrl}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(paypalUrl, "paypal")}
                      className="px-2 py-1 rounded bg-white/10 text-[10px] font-bold text-white hover:bg-white/20 transition-all"
                    >
                      {copiedKey === "paypal" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
                <a
                  href={paypalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-blue-500/20 py-3 text-xs font-bold uppercase tracking-[0.25em] text-blue-300 hover:bg-blue-500/30 transition-all"
                >
                  Open PayPal.me →
                </a>
              </div>
            )}

            {/* Venmo Rail */}
            {selectedRail === "VENMO" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-2xl">✌️</span>
                  <div>
                    <p className="text-sm font-bold">Venmo</p>
                    <p className="text-xs text-white/40">Direct peer-to-peer mobile transfer.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <span className="text-white/60">Studio Handle:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-accent font-bold text-sm">{venmoHandle}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(venmoHandle, "venmo")}
                      className="px-2 py-1 rounded bg-white/10 text-[10px] font-bold text-white hover:bg-white/20 transition-all"
                    >
                      {copiedKey === "venmo" ? "Copied!" : "Copy Handle"}
                    </button>
                  </div>
                </div>
                <div className="text-[11px] text-white/40 leading-relaxed">
                  Open your Venmo app, send {centsToCurrency(invoice.totalCents, invoice.currency)} to <strong className="text-white">{venmoHandle}</strong> with memo <strong className="text-white">Inv #{invoice.invoiceNumber}</strong>.
                </div>
              </div>
            )}

            {/* Chime Rail */}
            {selectedRail === "CHIME" && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-2xl">🟢</span>
                  <div>
                    <p className="text-sm font-bold">Chime (Pay Anyone)</p>
                    <p className="text-xs text-white/40">Instant member-to-member payment with 0 fees.</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 text-xs">
                  <span className="text-white/60">ChimeTag:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-emerald-400 font-bold text-sm">{chimeTag}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(chimeTag, "chime")}
                      className="px-2 py-1 rounded bg-white/10 text-[10px] font-bold text-white hover:bg-white/20 transition-all"
                    >
                      {copiedKey === "chime" ? "Copied!" : "Copy Tag"}
                    </button>
                  </div>
                </div>
                <div className="text-[11px] text-white/40 leading-relaxed">
                  Send {centsToCurrency(invoice.totalCents, invoice.currency)} to <strong className="text-emerald-300">{chimeTag}</strong> in your Chime app.
                </div>
              </div>
            )}

            {/* Offline Confirmation Reference for PayPal/Venmo/Chime */}
            {["PAYPAL", "VENMO", "CHIME"].includes(selectedRail) && (
              <div className="border-t border-white/10 pt-4 space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                  Notify Studio Team After Sending
                </p>
                <input
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Your Name, Venmo Username, or Txn ID"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white placeholder:text-white/30"
                />
                {noticeSent ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold text-center">
                    ✓ Notification sent! The studio engineer has been notified to verify your payment.
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmSent}
                    className="w-full rounded-xl border border-white/20 bg-white/10 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/20 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "I Have Sent Payment"}
                  </button>
                )}
                {error && <p className="text-xs text-red-400">{error}</p>}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
            >
              Close
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
