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
            className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider transition-all disabled:opacity-50 ${isPublic
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "bg-white/5 text-white/40"
                }`}
        >
            {isPublic ? "Public" : "Draft"}
        </button>
    );
}
