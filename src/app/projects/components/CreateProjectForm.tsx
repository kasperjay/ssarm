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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <label
                    htmlFor="artistId"
                    className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1"
                >
                    Target_Entity
                </label>
                <div className="relative group/select">
                    <select
                        id="artistId"
                        name="artistId"
                        required
                        className="w-full rounded-2xl border border-white/10 bg-white/2 p-4 pr-12 text-[13px] font-bold tracking-tight focus:border-accent focus:outline-none text-white/80 appearance-none transition-all cursor-pointer hover:bg-white/5 shadow-inner"
                    >
                        <option value="" className="bg-[#0c0c0c] text-white/40">-- DISCOVERED_UNIT --</option>
                        {artists.map((artist) => (
                            <option key={artist.id} value={artist.id} className="bg-[#0c0c0c] text-white">
                                {artist.name}
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover/select:text-accent transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="title"
                    className="block text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 ml-1"
                >
                    Strategic_Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="e.g. ALPHA_TRANSMISSION_01"
                    className="w-full rounded-2xl border border-white/10 bg-white/2 p-4 text-sm font-bold tracking-tight text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/10"
                />
            </div>

            <div className="pt-4">
                <NeonButton
                    type="submit"
                    disabled={loading}
                    variant="lime"
                    size="lg"
                    className="w-full justify-center text-[10px]! tracking-[0.3em]! font-bold!"
                >
                    {loading ? "INITIALIZING..." : "INITIALIZE_PROJECT"}
                </NeonButton>
            </div>
        </form>
    );
}
