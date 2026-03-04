"use client";

import { useState } from "react";
import { createProject } from "../actions";
import { useRouter } from "next/navigation";

export default function CreateProjectForm({
    artists,
}: {
    artists: { id: string; name: string }[];
}) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const artistId = formData.get("artistId") as string;
        const title = formData.get("title") as string;

        try {
            const project = await createProject(artistId, title);
            router.push(`/projects/${project.id}`);
        } catch (error) {
            console.error(error);
            alert("Failed to create project");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="artistId"
                    className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                    Select Client
                </label>
                <select
                    id="artistId"
                    name="artistId"
                    required
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                >
                    <option value="">-- Choose Artist --</option>
                    {artists.map((artist) => (
                        <option key={artist.id} value={artist.id}>
                            {artist.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-[var(--foreground-muted)] mb-1"
                >
                    Project Title (Optional)
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g. Summer EP Mixes"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--border)]"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--primary)] text-[var(--background)] font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {loading ? "Creating..." : "Create Project"}
            </button>
        </form>
    );
}
