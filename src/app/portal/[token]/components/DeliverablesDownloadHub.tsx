"use client";

import { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import AudioPlayer from "@/app/projects/components/AudioPlayer";
import StarRatingModal from "./StarRatingModal";
import PaymentMethodModal from "./PaymentMethodModal";
import { submitFeedback } from "../actions";

interface DeliverableFile {
  id: string;
  name: string;
  key: string;
  size: number;
  mimeType: string;
  category?: string;
  format?: string;
  sampleRate?: string;
}

interface FeedbackMarker {
  id: string;
  timestamp: number;
  content: string;
  resolved?: boolean;
  createdAt?: string;
  fileId?: string | null;
}

interface DeliverablesDownloadHubProps {
  projectId: string;
  token: string;
  artistName: string;
  files: DeliverableFile[];
  feedbacks: FeedbackMarker[];
  paywallDeliverables: boolean;
  invoice: {
    id: string;
    invoiceNumber: string;
    totalCents: number;
    currency: string;
    paidAt: string | null;
    stripePaymentUrl?: string | null;
    venmoHandle?: string | null;
    paypalUrl?: string | null;
    chimeTag?: string | null;
  } | null;
  rating: number | null;
}

type AudioFormatChoice = "wav" | "mp3";
type SampleRateChoice = "44100" | "48000";
type CategoryFilter = "ALL" | "MASTER" | "MIX" | "STEMS" | "TRACKOUTS";

export default function DeliverablesDownloadHub({
  projectId,
  token,
  artistName,
  files,
  feedbacks,
  paywallDeliverables,
  invoice,
  rating,
}: DeliverablesDownloadHubProps) {
  const [selectedFormat, setSelectedFormat] = useState<AudioFormatChoice>("wav");
  const [selectedRate, setSelectedRate] = useState<SampleRateChoice>("48000");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("ALL");
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Dual-Layer Gating Logic
  const isInvoicePaid = Boolean(invoice?.paidAt);
  const isPaywallLocked = paywallDeliverables && Boolean(invoice) && !isInvoicePaid && (invoice?.totalCents ?? 0) > 0;
  const isRatingLocked = rating === null || rating < 0;
  const isFullyUnlocked = !isPaywallLocked && !isRatingLocked;

  // Filter files by category
  const filteredFiles = files.filter((f) => {
    if (activeCategory === "ALL") return true;
    const nameLower = f.name.toLowerCase();
    const cat = f.category || "";

    if (activeCategory === "MASTER") {
      return cat === "FINAL_MASTER" || nameLower.includes("master");
    }
    if (activeCategory === "MIX") {
      return cat === "FINAL_MIX" || nameLower.includes("mix");
    }
    if (activeCategory === "STEMS") {
      return cat === "STEMS" || nameLower.includes("stem");
    }
    if (activeCategory === "TRACKOUTS") {
      return cat === "TRACK_OUTS" || nameLower.includes("trackout") || nameLower.includes("track out");
    }
    return true;
  });

  function getDownloadUrl(fileId: string) {
    return `/api/portal/${token}/download/${fileId}?format=${selectedFormat}&rate=${selectedRate}`;
  }

  function handleDownloadClick(e: React.MouseEvent) {
    if (isPaywallLocked) {
      e.preventDefault();
      setIsPaymentModalOpen(true);
      return;
    }
    if (isRatingLocked) {
      e.preventDefault();
      setIsRatingModalOpen(true);
      return;
    }
  }

  return (
    <section className="space-y-8 animate-fade-in">
      {/* Header with Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent neon-glow-pink shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Final Deliverables</h2>
            <p className="text-xs font-bold text-white/40 uppercase tracking-[0.25em]">Master Files, Stems & Track-Outs</p>
          </div>
        </div>

        {/* Global Status Pill */}
        <div className="flex items-center gap-3">
          {isFullyUnlocked ? (
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Access Granted
            </span>
          ) : isPaywallLocked ? (
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-widest hover:bg-amber-500/25 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Locked: Payment Required
            </button>
          ) : (
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/15 border border-accent/40 text-accent text-xs font-bold uppercase tracking-widest hover:bg-accent/25 transition-all shadow-[0_0_10px_rgba(0,242,255,0.2)]"
            >
              ⭐ Locked: Rating Required
            </button>
          )}
        </div>
      </div>

      {/* Paywall Lock Callout */}
      {isPaywallLocked && (
        <GlassCard className="p-6! border-amber-500/40 bg-amber-500/5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-300">Deliverables Locked Behind Studio Paywall</p>
                <p className="text-xs text-white/50 mt-0.5">
                  Final masters and stems require payment of invoice #{invoice?.invoiceNumber}. Settle via Stripe, Apple Pay, PayPal, Venmo, or Chime.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="px-5 py-2.5 rounded-xl border border-amber-400/50 bg-amber-400 text-black font-black text-xs uppercase tracking-widest hover:bg-amber-300 transition-all shrink-0 shadow-lg"
            >
              Pay Now to Unlock →
            </button>
          </div>
        </GlassCard>
      )}

      {/* Mandatory Rating Lock Callout */}
      {!isPaywallLocked && isRatingLocked && (
        <GlassCard className="p-6! border-accent/40 bg-accent/5 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 text-accent flex items-center justify-center shrink-0 text-xl font-bold">
                ⭐
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-accent">Mandatory Feedback Required for Deliverable Access</p>
                <p className="text-xs text-white/50 mt-0.5">
                  Your stems, track-outs, and master bounces are ready. Submit your 0–5 star review to instantly unlock downloads.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsRatingModalOpen(true)}
              className="px-5 py-2.5 rounded-xl border border-accent/50 bg-accent text-black font-black text-xs uppercase tracking-widest hover:bg-accent/90 transition-all shrink-0 shadow-[0_0_15px_rgba(0,242,255,0.3)]"
            >
              Rate & Unlock Downloads →
            </button>
          </div>
        </GlassCard>
      )}

      {/* Global Tabs / Selectors Bar (Format, Sample Rate, and Category) */}
      <div className="p-5 rounded-2xl bg-white/3 border border-white/8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Format & Sample Rate Preferences (Set Once, Applies Everywhere) */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Format Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Format:</span>
              <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/10">
                {(["wav", "mp3"] as AudioFormatChoice[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedFormat === fmt
                        ? "bg-accent text-black font-black shadow-md"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Rate Selector */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Sample Rate:</span>
              <div className="inline-flex rounded-xl bg-black/40 p-1 border border-white/10">
                {(["44100", "48000"] as SampleRateChoice[]).map((rate) => (
                  <button
                    key={rate}
                    onClick={() => setSelectedRate(rate)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedRate === rate
                        ? "bg-accent text-black font-black shadow-md"
                        : "text-white/50 hover:text-white"
                    }`}
                  >
                    {rate === "48000" ? "48 kHz" : "44.1 kHz"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Current Selection Summary */}
          <div className="text-[10px] font-mono text-accent uppercase tracking-widest">
            Downloading as {selectedFormat.toUpperCase()} ({selectedRate === "48000" ? "48kHz" : "44.1kHz"})
          </div>
        </div>

        {/* Category Filters (All, Master, Mix, Stems, Track Outs) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
          {[
            { id: "ALL" as CategoryFilter, label: `All Files (${files.length})` },
            { id: "MASTER" as CategoryFilter, label: "Final Masters" },
            { id: "MIX" as CategoryFilter, label: "Final Mixes" },
            { id: "STEMS" as CategoryFilter, label: "Stems" },
            { id: "TRACKOUTS" as CategoryFilter, label: "Track Outs" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeCategory === cat.id
                  ? "bg-white/15 text-white border border-white/20"
                  : "bg-white/3 text-white/40 hover:text-white hover:bg-white/8"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <GlassCard className="p-10! text-center bg-white/2 border-white/5 border-dashed">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/30">
            No files in this category yet.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredFiles.map((file) => {
            const downloadUrl = getDownloadUrl(file.id);
            const fileFeedbacks = feedbacks.filter((fb) => fb.fileId === file.id);

            return (
              <div key={file.id} className="space-y-3">
                <GlassCard className={`p-6! border-accent/20 bg-accent/2 transition-all duration-300 shadow-xl overflow-hidden ${isFullyUnlocked ? "hover:border-accent/40 hover:bg-accent/4" : "opacity-75"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="font-bold text-base text-white truncate tracking-tight">{file.name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.15em]">
                        <span className="text-accent/80 px-2 py-0.5 rounded-md bg-accent/10">
                          {file.category || "Deliverable"}
                        </span>
                        <span>{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                        <span>·</span>
                        <span className="text-white/60">{selectedFormat.toUpperCase()} ({selectedRate === "48000" ? "48k" : "44.1k"})</span>
                      </div>
                    </div>

                    {/* Download Button / Lock Trigger */}
                    {isFullyUnlocked ? (
                      <a
                        href={downloadUrl}
                        download
                        className="px-4 py-2 rounded-xl bg-accent text-black font-black text-xs uppercase tracking-widest hover:bg-accent/80 transition-all shrink-0 flex items-center gap-2 shadow-[0_0_12px_rgba(0,242,255,0.3)]"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                        Download
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={handleDownloadClick}
                        className="px-4 py-2 rounded-xl bg-white/10 text-white/60 font-bold text-xs uppercase tracking-widest hover:bg-white/20 hover:text-white transition-all shrink-0 flex items-center gap-2 border border-white/15"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        Locked
                      </button>
                    )}
                  </div>
                </GlassCard>

                {/* Audio Player is NOT nested inside an <a> tag! */}
                {file.mimeType.startsWith("audio/") && (
                  <AudioPlayer
                    fileUrl={`/api/uploads/${file.key}`}
                    fileId={file.id}
                    projectId={projectId}
                    token={token}
                    feedbacks={fileFeedbacks.map((fb) => ({
                      id: fb.id,
                      timestamp: fb.timestamp || 0,
                      content: fb.content,
                      resolved: fb.resolved,
                      createdAt: fb.createdAt,
                    }))}
                    onAddFeedback={async (content, timestamp) => {
                      await submitFeedback(projectId, token, content, file.id, timestamp);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <StarRatingModal
        isOpen={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        projectId={projectId}
        token={token}
        artistName={artistName}
      />

      {invoice && (
        <PaymentMethodModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          projectId={projectId}
          token={token}
          invoice={invoice}
        />
      )}
    </section>
  );
}
