"use client";

import { useState } from "react";
import { createProject } from "../actions";
import { useRouter } from "next/navigation";
import { NeonButton } from "@/components/NeonButton";

export default function CreateProjectForm({
    artists,
}: {
    artists: { id: string; name: string }[];
}) {
    const [loading, setLoading] = useState(false);
    const [artistSelect, setArtistSelect] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const artistId = formData.get("artistId") as string;
        const customArtistName = formData.get("customArtistName") as string | undefined;
        const title = formData.get("title") as string;

        try {
            const project = await createProject(artistId, title, customArtistName);
            if (!project?.id) {
                throw new Error("Project was created but no project ID was returned");
            }
            router.push(`/projects/${project.id}`);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Failed to create project");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label
                    htmlFor="artistId"
                    className="block text-xs font-bold uppercase tracking-[0.3em] text-white/30 ml-1"
                >
                    Target Artist
                </label>
                <div className="relative group/select">
                    <select
                        id="artistId"
                        name="artistId"
                        required
                        value={artistSelect}
                        onChange={(e) => setArtistSelect(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#0b0b10] p-4 pr-12 text-[13px] font-bold tracking-tight focus:border-accent focus:outline-none text-white/95 appearance-none transition-all cursor-pointer hover:bg-[#111118] shadow-inner"
                    >
                        <option value="" disabled className="bg-[#0b0b10] text-white/55">-- Select an Artist --</option>
                        <option value="custom" className="bg-[#0b0b10] text-accent">++ NEW CUSTOM ARTIST ++</option>
                        {artists.map((artist) => (
                            <option key={artist.id} value={artist.id} className="bg-[#0b0b10] text-white">
                                {artist.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover/select:text-accent transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
            </div>

            {artistSelect === "custom" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label htmlFor="customArtistName" className="block text-xs font-bold uppercase tracking-[0.3em] text-accent ml-1">
                        New Artist Name
                    </label>
                    <input
                        type="text"
                        id="customArtistName"
                        name="customArtistName"
                        required
                        placeholder="Enter custom artist name..."
                        className="w-full rounded-2xl border border-accent/20 bg-black/40 p-4 text-sm font-bold tracking-tight text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/20"
                    />
                </div>
            )}

            <div className="space-y-2">
                <label
                    htmlFor="title"
                    className="block text-xs font-bold uppercase tracking-[0.3em] text-white/30 ml-1"
                >
                    Project Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g. EP Release Campaign"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-bold tracking-tight text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/10"
                />
            </div>

            {error && (
                <div className="pt-4">
                    <div className="bg-red-500/60 text-white p-3 rounded-2xl text-center text-xs">
                        {error}
                    </div>
                </div>
            )}

            <div className="pt-4">
                <NeonButton
                    type="submit"
                    disabled={loading}
                    variant="lime"
                    size="lg"
                    className="w-full justify-center text-xs! tracking-[0.3em]! font-bold!"
                >
                    {loading ? "Creating..." : "Create Project"}
                </NeonButton>
            </div>
        </form>
    );
}
