"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GlassCard } from "./GlassCard";

type AdjacentLead = {
  id: string;
  name: string;
  score: number | null;
};

type Props = {
  prevLead: AdjacentLead | null;
  nextLead: AdjacentLead | null;
  currentIndex: number;
  totalLeads: number;
};

export default function LeadBottomNavigation({
  prevLead,
  nextLead,
  currentIndex,
  totalLeads,
}: Props) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT" ||
          activeEl.getAttribute("contenteditable") === "true")
      ) {
        return;
      }

      if (e.key === "ArrowLeft" && prevLead) {
        e.preventDefault();
        router.push(`/leads/${prevLead.id}`);
      } else if (e.key === "ArrowRight" && nextLead) {
        e.preventDefault();
        router.push(`/leads/${nextLead.id}`);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prevLead, nextLead, router]);

  return (
    <GlassCard className="p-4 sm:p-5 bg-white/2 border-white/10 mt-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Previous Lead */}
        <div className="w-full sm:w-auto flex-1 flex justify-start">
          {prevLead ? (
            <Link
              href={`/leads/${prevLead.id}`}
              className="group flex w-full sm:w-auto items-center gap-3.5 rounded-xl border border-white/10 bg-white/4 px-4 py-3 hover:border-accent/40 hover:bg-accent/10 transition-all duration-200"
              title="Navigate to previous lead (← key)"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30 group-hover:border-accent/30 group-hover:text-accent transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </div>
              <div className="text-left min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-accent/80 transition-colors">
                  Previous Lead
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-accent transition-colors truncate max-w-[180px] sm:max-w-[200px]">
                  {prevLead.name}
                  {prevLead.score !== null && (
                    <span className="ml-1.5 text-[11px] font-normal text-white/40">
                      ({Math.round(prevLead.score)} pts)
                    </span>
                  )}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex w-full sm:w-auto items-center gap-3.5 rounded-xl border border-white/5 bg-white/1 px-4 py-3 opacity-30 cursor-not-allowed">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-black/10 text-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">Previous Lead</p>
                <p className="text-xs sm:text-sm font-semibold text-white/30">Start of List</p>
              </div>
            </div>
          )}
        </div>

        {/* Center Indicator */}
        <div className="flex flex-col items-center justify-center gap-1.5 shrink-0 px-2 py-1">
          <span className="text-xs font-mono font-bold text-white/70 tracking-wider">
            {currentIndex + 1} <span className="text-white/25">/</span> {totalLeads}
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/leads"
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors flex items-center gap-1.5 hover:underline underline-offset-4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              All Leads
            </Link>
            <span className="text-white/20 hidden sm:inline">·</span>
            <span className="text-[9px] text-white/30 hidden sm:inline">
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono">←</kbd> / <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono">→</kbd> keys
            </span>
          </div>
        </div>

        {/* Next Lead */}
        <div className="w-full sm:w-auto flex-1 flex justify-end">
          {nextLead ? (
            <Link
              href={`/leads/${nextLead.id}`}
              className="group flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3.5 rounded-xl border border-white/10 bg-white/4 px-4 py-3 hover:border-accent/40 hover:bg-accent/10 transition-all duration-200 text-right"
              title="Navigate to next lead (→ key)"
            >
              <div className="text-left sm:text-right min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover:text-accent/80 transition-colors">
                  Next Lead
                </p>
                <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-accent transition-colors truncate max-w-[180px] sm:max-w-[200px]">
                  {nextLead.name}
                  {nextLead.score !== null && (
                    <span className="ml-1.5 text-[11px] font-normal text-white/40">
                      ({Math.round(nextLead.score)} pts)
                    </span>
                  )}
                </p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-black/30 group-hover:border-accent/30 group-hover:text-accent transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </Link>
          ) : (
            <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3.5 rounded-xl border border-white/5 bg-white/1 px-4 py-3 opacity-30 cursor-not-allowed text-right">
              <div className="text-left sm:text-right">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">Next Lead</p>
                <p className="text-xs sm:text-sm font-semibold text-white/30">End of List</p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-black/10 text-white/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
