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
            className={`px-3 py-1 rounded text-xs transition-all disabled:opacity-50 ${"bg-[var(--accent)] text-black font-medium hover:opacity-90"
                }`}
        >
            {isPending ? "..." : "Resolve"}
        </button>
    );
}
