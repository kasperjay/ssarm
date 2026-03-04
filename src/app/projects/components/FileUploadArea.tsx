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
                className={`block w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${loading
                    ? "border-[var(--border)] opacity-50 cursor-not-allowed"
                    : type === "DELIVERABLE"
                        ? "border-[var(--accent)] hover:bg-[var(--accent)]/5"
                        : "border-[var(--primary)] hover:bg-[var(--primary)]/5"
                    }`}
            >
                <div className="text-sm font-medium mb-1">
                    {loading ? "Uploading..." : `Click to upload a ${type.toLowerCase()} file`}
                </div>
                {!loading && (
                    <div className="text-xs text-[var(--foreground-muted)]">
                        MP3, WAV, ZIP up to 500MB
                    </div>
                )}
            </label>
        </div>
    );
}
