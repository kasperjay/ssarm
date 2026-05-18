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
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-full border border-black/10 px-3 py-1 text-xs font-semibold text-[color:var(--muted)] transition hover:border-[color:var(--accent)]"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
