"use client";

import { useState, useTransition } from "react";
import { updateProductionNeed, type ProductionNeedLevel } from "@/app/leads/[id]/actions";

const LEVEL_META: Record<ProductionNeedLevel, { label: string; color: string; bg: string; border: string }> = {
  NONE:     { label: "No Signal",       color: "text-white/40",    bg: "bg-white/5",         border: "border-white/10" },
  POSSIBLE: { label: "Possible Need",   color: "text-amber-300",   bg: "bg-amber-950/30",    border: "border-amber-500/30" },
  PROBABLE: { label: "Probable Need",   color: "text-emerald-300", bg: "bg-emerald-950/30",  border: "border-emerald-500/30" },
  CLEAR:    { label: "Probable Need",   color: "text-emerald-300", bg: "bg-emerald-950/30",  border: "border-emerald-500/30" },
};

const LEVEL_POINTS: Record<ProductionNeedLevel, number> = { NONE: 0, POSSIBLE: 8, PROBABLE: 12, CLEAR: 12 };

type Props = {
  leadId: string;
  currentLevel: ProductionNeedLevel;
  currentEvidence: string[];
  currentNote?: string | null;
  approvedAt: Date | null;
  autoDetectedEvidence?: string[];   // signals found by the scanner but not yet saved
};

export default function ProductionNeedPanel({
  leadId,
  currentLevel,
  currentEvidence,
  currentNote,
  approvedAt,
  autoDetectedEvidence = [],
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);

  // Form state
  const [selectedLevel, setSelectedLevel] = useState<ProductionNeedLevel>(currentLevel);
  const [evidenceLines, setEvidenceLines] = useState<string[]>(
    currentEvidence.length > 0 ? currentEvidence : autoDetectedEvidence
  );
  const [newLine, setNewLine] = useState("");
  const [note, setNote] = useState(currentNote || "");
  const [saved, setSaved] = useState(false);

  const meta = LEVEL_META[currentLevel];
  const pts  = LEVEL_POINTS[currentLevel];

  const [mountTime] = useState(() => Date.now());
  const approvedDaysAgo = approvedAt
    ? Math.floor((mountTime - new Date(approvedAt).getTime()) / 86400000)
    : null;
  const isStale = approvedDaysAgo !== null && approvedDaysAgo >= 45;

  function addLine() {
    const trimmed = newLine.trim();
    if (trimmed && !evidenceLines.includes(trimmed)) {
      setEvidenceLines((prev) => [...prev, trimmed]);
    }
    setNewLine("");
  }

  function removeLine(idx: number) {
    setEvidenceLines((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSave() {
    startTransition(async () => {
      await updateProductionNeed({ leadId, level: selectedLevel, evidence: evidenceLines, note });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  function handleElevateToClear() {
    startTransition(async () => {
      const ev = currentEvidence.length > 0 ? currentEvidence : autoDetectedEvidence;
      const noteText = currentNote ? `${currentNote} (Elevated to Clear)` : "Elevated to Clear";
      await updateProductionNeed({
        leadId,
        level: "CLEAR",
        evidence: ev,
        note: noteText,
      });
      setSelectedLevel("CLEAR");
      setEvidenceLines(ev);
      setNote(noteText);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  function handleReset() {
    startTransition(async () => {
      await updateProductionNeed({ leadId, level: "NONE", evidence: [], note: "Manually reset to NONE" });
      setSelectedLevel("NONE");
      setEvidenceLines([]);
      setNote("");
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  }

  return (
    <div className={`rounded-2xl border p-5 space-y-4 transition-all ${meta.border} ${meta.bg}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/35 mb-1">
            Production Need
          </p>
          <div className="flex items-center gap-2">
            <span className={`text-base font-bold ${meta.color}`}>{meta.label}</span>
            {pts > 0 && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.border} ${meta.color}`}>
                +{pts} pts
              </span>
            )}
            {isStale && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-500/40 text-orange-300 bg-orange-950/30">
                stale
              </span>
            )}
          </div>
          {approvedAt && (
            <p className="text-[10px] text-white/30 mt-0.5">
              Approved {approvedDaysAgo === 0 ? "today" : `${approvedDaysAgo}d ago`}
              {approvedDaysAgo !== null && approvedDaysAgo >= 45 && " • expires soon"}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {currentLevel !== "NONE" && !editing && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isPending}
              className="text-[10px] px-2.5 py-1 rounded-lg border border-white/10 text-white/35 hover:text-red-400 hover:border-red-500/30 transition-all"
              title="Reset production need to NONE"
            >
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setEditing((e) => !e);
              setSelectedLevel(currentLevel);
              setEvidenceLines(currentEvidence.length > 0 ? currentEvidence : autoDetectedEvidence);
              setNote(currentNote || "");
            }}
            disabled={isPending}
            className="text-[10px] px-2.5 py-1 rounded-lg border border-white/10 text-white/50 hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all"
          >
            {editing ? "Cancel" : currentLevel === "NONE" ? "Set Manually" : "Edit"}
          </button>
        </div>
      </div>

      {/* Current evidence pills (read mode) */}
      {!editing && currentEvidence.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {currentEvidence.map((ev) => (
            <span key={ev} className={`text-[10px] px-2 py-0.5 rounded-full border ${meta.border} ${meta.color} opacity-80`}>
              {ev}
            </span>
          ))}
        </div>
      )}

      {/* Operator Review Note (read mode) */}
      {!editing && currentNote && (
        <div className="pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/35 mb-1">Review Note</p>
          <p className="text-xs text-white/70 italic bg-white/5 rounded-lg px-3 py-1.5 border border-white/5">
            &ldquo;{currentNote}&rdquo;
          </p>
        </div>
      )}

      {/* Auto-detected signals suggestion banner */}
      {!editing && currentLevel === "NONE" && autoDetectedEvidence.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300/70">
            ⚡ Auto-detected signals
          </p>
          <div className="flex flex-wrap gap-1.5">
            {autoDetectedEvidence.map((ev) => (
              <span key={ev} className="text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 text-amber-200/70">
                {ev}
              </span>
            ))}
          </div>
          <button
            type="button"
            onClick={() => { setEditing(true); setSelectedLevel("POSSIBLE"); setEvidenceLines(autoDetectedEvidence); }}
            className="text-[10px] px-3 py-1 rounded-lg border border-amber-500/30 text-amber-300 hover:bg-amber-950/50 transition-all"
          >
            Review &amp; Approve →
          </button>
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="space-y-4 pt-2 border-t border-white/8">
          {/* Level selector */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-2">Level</p>
            <div className="flex gap-2">
              {(["NONE", "POSSIBLE", "PROBABLE"] as ProductionNeedLevel[]).map((lvl) => {
                const m = LEVEL_META[lvl];
                const active = selectedLevel === lvl;
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSelectedLevel(lvl)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                      active
                        ? `${m.bg} ${m.border} ${m.color}`
                        : "border-white/10 text-white/30 hover:border-white/20 hover:text-white/50"
                    }`}
                  >
                    {m.label}
                    {LEVEL_POINTS[lvl] > 0 && (
                      <span className="block text-[9px] opacity-70">+{LEVEL_POINTS[lvl]} pts</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Evidence list */}
          {selectedLevel !== "NONE" && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-2">Evidence</p>
              <div className="space-y-1.5">
                {evidenceLines.map((ev, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="flex-1 text-xs text-white/70 bg-white/5 rounded-lg px-3 py-1.5 leading-snug">
                      {ev}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeLine(idx)}
                      className="text-white/25 hover:text-red-400 text-sm leading-none"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newLine}
                  onChange={(e) => setNewLine(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLine())}
                  placeholder="Add signal (e.g. asked about mixing in DM)"
                  className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/80 placeholder:text-white/25 focus:border-accent/40 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addLine}
                  className="px-3 py-1.5 rounded-xl border border-white/10 text-xs text-white/50 hover:text-accent hover:border-accent/30 transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Optional note */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 mb-1">
              Note (optional)
            </p>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Context for this qualification..."
              className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-1.5 text-xs text-white/80 placeholder:text-white/25 focus:border-accent/40 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-xs text-white/35 hover:text-white/60 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isPending || (selectedLevel !== "NONE" && evidenceLines.length === 0)}
              className="px-4 py-2 rounded-xl bg-accent/90 text-black text-xs font-bold hover:bg-accent transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {saved && (
        <p className="text-[10px] text-emerald-400 font-bold animate-in fade-in">✓ Saved</p>
      )}
    </div>
  );
}
