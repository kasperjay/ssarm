"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

const ACTOR_VENUES = [
    { id: "spectral-soundworks/come-and-take-it-calendar-scraper", url: "https://comeandtakeitproductions.com/live" },
    { id: "spectral-soundworks/mohawk-calendar-scraper", url: "https://mohawkaustin.com/" },
    { id: "spectral-soundworks/hotelvegas-calendar-scraper", url: "https://texashotelvegas.com/calendar/" },
    { id: "spectral-soundworks/empire-atx-calendar-scraper", url: "https://empireatx.com/calendar/" },
    { id: "spectral-soundworks/haute-spot-calendar-scraper", url: "https://hautespot.live/calendar" },
    { id: "spectral-soundworks/parkerjazz-calendar-scraper", url: "https://parker-jazz.turntabletickets.com/" },
    { id: "spectral-soundworks/the-cut-calendar-scraper", url: "https://partners-endpoint.dice.fm/api/v2/events" },
    { id: "spectral-soundworks/scootinn-calendar-scraper", url: "https://www.scootinnaustin.com/shows" },
    { id: "spectral-soundworks/saxon-pub-calendar-scraper", url: "https://thesaxonpub.com/events/" },
    { id: "spectral-soundworks/elephant-room-calendar-scraper", url: "https://elephantroom.com/calendar" },
    { id: "spectral-soundworks/continental-gallery-calendar-scraper", url: "https://timelyapp.time.ly/api/calendars/54714987/events" },
    { id: "spectral-soundworks/cboys-calendar-scraper", url: "https://timelyapp.time.ly/api/calendars/54714969/events" },
    { id: "spectral-soundworks/continental-club-calendar-scraper", url: "https://timelyapp.time.ly/api/calendars/54714987/events" },
    { id: "spectral-soundworks/broken-spoke-calendar-scraper", url: "https://www.brokenspokeaustintx.net/events-calendar" },
    { id: "spectral-soundworks/antones-calendar-scraper", url: "https://antonesnightclub.com/calendar/" },
    { id: "spectral-soundworks/3ten-calendar-scraper", url: "https://www.3tenaustin.com/calendar" }
];

export default function DiscoverPage() {
    const router = useRouter();
    const [actorId, setActorId] = useState(ACTOR_VENUES[0].id);
    const [inputJson, setInputJson] = useState(JSON.stringify({ url: ACTOR_VENUES[0].url }, null, 2));
    const [loading, setLoading] = useState(false);
    const [polling, setPolling] = useState(false);
    const [pollStatus, setPollStatus] = useState<string | null>(null);
    const [pollItemCount, setPollItemCount] = useState(0);
    const [expectedResults, setExpectedResults] = useState(100);
    const [results, setResults] = useState<any[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [sifting, setSifting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDiscover = async () => {
        try {
            setLoading(true);
            setError(null);
            setResults([]);
            setPollStatus("STARTING");
            setPollItemCount(0);

            let parsedInput;
            try {
                parsedInput = JSON.parse(inputJson);
            } catch (e) {
                throw new Error("Invalid JSON input format. Please check syntax.");
            }

            const limit = parsedInput.resultsLimit || parsedInput.maxItems || 100;
            setExpectedResults(limit);

            const res = await fetch("/api/discover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actorId, input: parsedInput }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || data.error || "Failed to start discovery run.");
            }

            const data = await res.json();
            const { runId, datasetId } = data;

            setPolling(true);
            pollStatusLoop(runId, datasetId);

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    const pollStatusLoop = async (runId: string, datasetId: string) => {
        try {
            const res = await fetch("/api/discover/status", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ runId, datasetId }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || data.error || "Failed to poll status.");
            }

            const data = await res.json();
            setPollStatus(data.status);
            setPollItemCount(data.itemCount || 0);

            if (data.status === "SUCCEEDED" || data.status === "FAILED" || data.status === "ABORTED") {
                setPolling(false);
                setLoading(false);
                if (data.status === "SUCCEEDED") {
                    setResults(data.items || []);
                    setSelectedIndices(new Set());
                } else {
                    setError(`Actor run ended with status: ${data.status}`);
                }
            } else {
                setTimeout(() => {
                    pollStatusLoop(runId, datasetId);
                }, 3000);
            }
        } catch (err: any) {
            setError(err.message);
            setPolling(false);
            setLoading(false);
        }
    };

    const toggleSelection = (index: number) => {
        const newSet = new Set(selectedIndices);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setSelectedIndices(newSet);
    };

    const toggleAll = () => {
        if (selectedIndices.size === results.length) {
            setSelectedIndices(new Set());
        } else {
            setSelectedIndices(new Set(results.map((_, i) => i)));
        }
    };

    const handleSift = async () => {
        if (results.length === 0) return;
        try {
            setSifting(true);
            setError(null);

            const res = await fetch("/api/sift", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: results }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || data.error || "Failed to sift results.");
            }

            const data = await res.json();
            const { results: aiResults } = data;

            if (Array.isArray(aiResults)) {
                const newSelection = new Set<number>();
                aiResults.forEach((isArtist, idx) => {
                    if (isArtist && idx < results.length) {
                        newSelection.add(idx);
                    }
                });
                setSelectedIndices(newSelection);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSifting(false);
        }
    };

    const handleImport = async () => {
        if (selectedIndices.size === 0) return;
        try {
            setImporting(true);
            setImportProgress(0);
            setError(null);

            const selectedItems = Array.from(selectedIndices).map((idx) => results[idx]);

            let count = 0;
            for (const item of selectedItems) {
                const artistName = item.fullName || item.username || item.title || item.name || item.artistName;
                if (!artistName) continue;

                const payload = {
                    isDiscoveryImport: true,
                    artist: {
                        name: artistName,
                        instagramHandle: item.username || undefined,
                        instagramProfileUrl: item.url || undefined,
                        bio: item.biography || item.bio || item.description || undefined,
                        followerCount: item.followersCount || undefined,
                    },
                    lead: {
                        status: "NEW",
                    },
                    activities: item.eventTitle ? [
                        {
                            type: "NOTE",
                            note: [
                                item.eventTitle,
                                item.venueName,
                                item.eventDate
                            ].filter(Boolean).join(" · ")
                        }
                    ] : undefined
                };

                await fetch("/api/ingest", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                count++;
                setImportProgress(count);
            }

            router.push("/");
        } catch (err: any) {
            setError(err.message);
            setImporting(false);
        }
    };

    return (
        <div className="relative min-h-screen pb-20">
            <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
                <header className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-end justify-between gap-6 pb-6 border-b border-white/10">
                        <div className="space-y-2">
                            <Link href="/" className="inline-flex items-center gap-2 group text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors">
                                <span className="transition-transform group-hover:-translate-x-1">←</span> Terminal
                            </Link>
                            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                                Data <span className="text-accent italic">Harvest</span>
                            </h1>
                        </div>
                    </div>
                </header>

                <main className="space-y-10">
                    <GlassCard variant="strong">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-2 w-2 bg-accent neon-glow rounded-full" />
                            <h2 className="text-xl font-bold tracking-tight uppercase">Configuration</h2>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-xl border border-error/20 bg-error/10 p-4 text-xs font-bold text-error uppercase tracking-widest">
                                [ Error ]: {error}
                            </div>
                        )}

                        <div className="grid gap-8 lg:grid-cols-2">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold tracking-widest text-muted mb-2">Venue Protocol</label>
                                    <select
                                        value={actorId}
                                        onChange={(e) => {
                                            const newActorId = e.target.value;
                                            setActorId(newActorId);
                                            const venue = ACTOR_VENUES.find(v => v.id === newActorId);
                                            if (venue) {
                                                setInputJson(JSON.stringify({ url: venue.url }, null, 2));
                                            }
                                        }}
                                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm focus:border-accent focus:outline-none text-white appearance-none transition-all cursor-pointer hover:bg-white/10"
                                    >
                                        {ACTOR_VENUES.map(actor => (
                                            <option key={actor.id} value={actor.id} className="bg-surface">{actor.id.replace('spectral-soundworks/', '')}</option>
                                        ))}
                                        <option value="custom" className="bg-surface">-- Custom Protocol --</option>
                                    </select>
                                    {actorId === "custom" && (
                                        <input
                                            type="text"
                                            placeholder="Enter actor handle..."
                                            className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm focus:border-accent focus:outline-none"
                                            onChange={(e) => setActorId(e.target.value)}
                                        />
                                    )}
                                </div>
                                <div className="flex justify-start">
                                    <NeonButton
                                        onClick={handleDiscover}
                                        disabled={loading}
                                        variant="cyan"
                                        size="lg"
                                        className="w-full sm:w-auto"
                                    >
                                        {loading ? "Initializing..." : "Execute Scan"}
                                    </NeonButton>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] uppercase font-bold tracking-widest text-muted mb-2">Parameters (JSON)</label>
                                <textarea
                                    value={inputJson}
                                    onChange={(e) => setInputJson(e.target.value)}
                                    className="h-[148px] w-full rounded-xl border border-white/10 bg-white/5 p-4 text-xs font-mono focus:border-accent focus:outline-none resize-none scrollbar-hide"
                                    placeholder='{ "url": "..." }'
                                />
                            </div>
                        </div>
                    </GlassCard>

                    {polling && (
                        <GlassCard className="space-y-6 border-accent/20">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Active Transmission</p>
                                    <h3 className="text-lg font-bold">Status: {pollStatus}</h3>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-2xl font-mono text-foreground">{pollItemCount}</span>
                                    <span className="text-[8px] uppercase tracking-tighter text-muted">Objects Cached</span>
                                </div>
                            </div>
                            <div className="relative w-full bg-white/5 overflow-hidden h-2 rounded-full border border-white/5">
                                <div
                                    className="bg-accent h-full rounded-full transition-all duration-500 ease-out neon-glow"
                                    style={{ width: `${Math.min(100, (pollItemCount / expectedResults) * 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-muted text-center italic tracking-widest uppercase">
                                Syncing with remote data streams... encryption in progress...
                            </p>
                        </GlassCard>
                    )}

                    {!polling && results.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 bg-accent neon-glow rounded-full" />
                                    <h2 className="text-xl font-bold tracking-tight uppercase">
                                        Scan Output ({results.length})
                                    </h2>
                                </div>
                                <div className="flex gap-4">
                                    <NeonButton
                                        onClick={handleSift}
                                        disabled={sifting}
                                        variant="outline"
                                        size="sm"
                                    >
                                        {sifting ? "Processing..." : "AI Sift"}
                                    </NeonButton>
                                    <NeonButton
                                        onClick={handleImport}
                                        disabled={selectedIndices.size === 0 || importing}
                                        variant="cyan"
                                        size="sm"
                                    >
                                        {importing ? `Importing [${importProgress}/${selectedIndices.size}]` : `Ingest Selected (${selectedIndices.size})`}
                                    </NeonButton>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-white/5 text-[10px] uppercase font-bold tracking-widest text-muted">
                                            <tr>
                                                <th className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedIndices.size === results.length}
                                                        onChange={toggleAll}
                                                        className="rounded border-white/20 bg-transparent cursor-pointer"
                                                    />
                                                </th>
                                                <th className="px-6 py-4 text-accent/60">Entity / Identity</th>
                                                <th className="px-6 py-4">Momentum</th>
                                                <th className="px-6 py-4">Intelligence Snippet</th>
                                                <th className="px-6 py-4">Source</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {results.map((item, i) => {
                                                const name = item.fullName || item.title || item.name || item.artist || item.musician || item.band || item.artistName;
                                                const isUnknown = !name;
                                                const displayName = name || "Unknown Entity";
                                                const handle = item.username || item.handle || "-";
                                                const bioSnipppet = (item.biography || item.bio || item.description || "").substring(0, 80);
                                                const url = item.url || item.eventURL || "-";

                                                return (
                                                    <tr
                                                        key={i}
                                                        className={`transition-colors ${selectedIndices.has(i) ? "bg-accent/5" : "hover:bg-white/5"}`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedIndices.has(i)}
                                                                onChange={() => toggleSelection(i)}
                                                                className="rounded border-white/20 bg-transparent text-accent cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-foreground text-sm tracking-tight">{displayName}</div>
                                                            <div className="text-[10px] font-mono text-muted/60">{handle}</div>
                                                        </td>
                                                        <td className="px-6 py-4 font-mono text-accent/80">{item.followersCount?.toLocaleString() || "-"}</td>
                                                        <td className="px-6 py-4 text-muted max-w-xs truncate italic">
                                                            {bioSnipppet}{bioSnipppet.length >= 80 && "..."}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {isUnknown ? (
                                                                <button className="text-[9px] uppercase font-bold tracking-tighter text-muted hover:text-foreground">Inspect Data</button>
                                                            ) : (
                                                                url !== "-" ? (
                                                                    <a href={url} target="_blank" rel="noreferrer" className="text-accent hover:text-highlight underline underline-offset-4 decoration-accent/30 font-bold uppercase tracking-widest text-[9px]">Uplink</a>
                                                                ) : <span className="text-muted/40 font-mono">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
