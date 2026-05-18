"use client";

import { useTransition } from "react";
import { resolveFeedback } from "../actions";

export default function ResolveButton({
    feedbackId,
    projectId
}: {
    feedbackId: string,
    projectId: string
}) {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => {
                startTransition(async () => {
                    await resolveFeedback(feedbackId, projectId);
                });
            }}
            disabled={isPending}
            className="px-3 py-1 rounded-lg text-[9px] uppercase font-bold tracking-[0.2em] transition-all border border-accent/20 bg-accent/10 text-accent hover:bg-accent/20 neon-glow-pink disabled:opacity-50"
        >
            {isPending ? "..." : "RESOLVE_NODE"}
        </button>
    );
}
