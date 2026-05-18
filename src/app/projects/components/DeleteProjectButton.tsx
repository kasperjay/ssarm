"use client";

import { useState } from "react";
import { deleteProject } from "../actions";
import { useRouter } from "next/navigation";

export default function DeleteProjectButton({ projectId, isDetail }: { projectId: string, isDetail?: boolean }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (window.confirm("Are you sure you want to completely delete this project? This action cannot be undone and will delete all associated feedback and file records!")) {
            setIsDeleting(true);
            try {
                await deleteProject(projectId);
                if (isDetail) {
                    router.push("/projects");
                }
            } catch (err) {
                console.error("Failed to delete project:", err);
                setIsDeleting(false);
            }
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl text-red-500 font-bold uppercase tracking-[0.2em] text-[11px] bg-red-500/10 hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/40 group-delete relative z-20"
            title="Delete Project"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={isDeleting ? "animate-spin" : "group-hover-delete:rotate-12 transition-transform"}>
                {isDeleting ? (
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                ) : (
                    <>
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </>
                )}
            </svg>
            <span>{isDeleting ? "Deleting..." : "Delete Project"}</span>
        </button>
    );
}
