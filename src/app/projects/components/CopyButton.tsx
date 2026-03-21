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
            className={`px-4 py-2 rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] transition-all border shadow-lg ${copied
                    ? "bg-accent/20 text-accent border-accent/40 neon-glow-pink"
                    : "bg-white/5 text-white/40 border-white/5 hover:border-white/20 hover:text-white/60"
                }`}
        >
            {copied ? "COPIED_TO_BUFFER" : "COPY_ACCESS_LINK"}
        </button>
    );
}
