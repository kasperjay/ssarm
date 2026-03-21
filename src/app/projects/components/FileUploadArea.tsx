"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FileUploadArea({
    projectId,
    type,
}: {
    projectId: string;
    type: "WORKING" | "DELIVERABLE";
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectId);
        formData.append("type", type);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            // Clear input
            e.target.value = "";

            // Refresh page to show new file
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("Failed to upload file");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative">
            <input
                type="file"
                id={`file-upload-${type}`}
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
            />
            <label
                htmlFor={`file-upload-${type}`}
                className={`block w-full border-2 border-dashed rounded-[32px] p-8 text-center cursor-pointer transition-all relative overflow-hidden group ${loading
                    ? "border-white/5 bg-white/2 opacity-50 cursor-not-allowed"
                    : type === "DELIVERABLE"
                        ? "border-accent/20 bg-accent/2 hover:border-accent/40 hover:bg-accent/5 neon-glow-pink"
                        : "border-white/10 bg-white/2 hover:border-white/20 hover:bg-white/5 shadow-inner"
                    }`}
            >
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform ${loading ? "animate-pulse" : ""}`}>
                        {loading ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent/60"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20 group-hover:text-accent/60 transition-colors"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                        )}
                    </div>
                    <div className="space-y-1 mt-2">
                        <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/60">
                            {loading ? "Uploading File..." : `Upload ${type === "DELIVERABLE" ? "Deliverable" : "Working File"}`}
                        </div>
                        {!loading && (
                            <div className="text-xs font-sans font-bold text-white/20 uppercase tracking-widest">
                                MP3 / WAV / ZIP • Max 500MB
                            </div>
                        )}
                    </div>
                </div>
                {!loading && (
                    <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/2 pointer-events-none" />
                )}
            </label>
        </div>
    );
}
