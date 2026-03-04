"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy!", err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${copied
                    ? "bg-[var(--accent)] text-black"
                    : "bg-[var(--surface-strong)] text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-[var(--background)]"
                }`}
        >
            {copied ? "Copied!" : "Copy Link"}
        </button>
    );
}
