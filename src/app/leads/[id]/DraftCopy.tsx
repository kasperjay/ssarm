"use client";

import { useState } from "react";

type DraftCopyProps = {
  text: string;
};

export default function DraftCopy({ text }: DraftCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`rounded-full border border-white/10 px-3 py-1 text-xs font-bold uppercase tracking-widest transition-all ${copied
          ? "bg-accent/20 text-accent border-accent/40"
          : "bg-white/5 text-muted hover:text-foreground hover:bg-white/10 hover:border-white/20"
        }`}
    >
      {copied ? "Copied" : "Copy Draft"}
    </button>
  );
}
