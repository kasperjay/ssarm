"use client";

import { useTransition } from "react";
import { updateFileVisibility } from "../actions";

export default function VisibilityToggle({
    fileId,
    isPublic,
    projectId
}: {
    fileId: string,
    isPublic: boolean,
    projectId: string
}) {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            onClick={() => {
                startTransition(async () => {
                    await updateFileVisibility(fileId, !isPublic, projectId);
                });
            }}
            disabled={isPending}
            className={`px-3 py-1 rounded-xl text-[9px] uppercase font-bold tracking-[0.2em] transition-all border disabled:opacity-50 ${isPublic
                    ? "bg-accent/10 text-accent border-accent/20 neon-glow-pink"
                    : "bg-white/5 text-white/20 border-white/5 hover:border-white/10 hover:text-white/40"
                }`}
        >
            {isPending ? "Syncing..." : isPublic ? "Public" : "Private"}
        </button>
    );
}
