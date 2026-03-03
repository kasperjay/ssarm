"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

            // Estimate the progress bar total
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

            // Start polling
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
                // Keep polling every 3 seconds
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
                // Heuristic to extract details from an arbitrary Apify result object
                const artistName = item.fullName || item.username || item.title || item.name || item.artistName;
                if (!artistName) continue;

                const payload = {
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

            // Navigate cleanly back to home or lead list after import
            router.push("/");
        } catch (err: any) {
            setError(err.message);
            setImporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(35,211,255,0.18),transparent_55%),radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.2),transparent_45%),linear-gradient(180deg,rgba(5,7,10,0.95),rgba(5,7,10,1))] text-foreground p-6 md:p-10">
            <div className="mx-auto max-w-5xl space-y-8">
                <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-(--surface) p-8 shadow-[0_30px_80px_-60px_rgba(35,211,255,0.35)]">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <p className="text-xs uppercase tracking-[0.35em] text-(--muted)">
                                CalendarCrawlers
                            </p>
                            <h1 className="font-display text-4xl leading-tight text-foreground md:text-5xl">
                                Discover Leads
                            </h1>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/"
                                className="rounded-full border border-(--accent) px-5 py-2 text-sm font-semibold text-(--accent-strong) transition hover:bg-(--accent) hover:text-white"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="space-y-6">
                    <section className="rounded-3xl border border-white/10 bg-(--surface) p-6 shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Discovery Configuration</h2>

                        {error && (
                            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-(--muted) mb-1">Select Venue Actor</label>
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
                                    className="w-full rounded-xl border border-white/10 bg-(--surface-strong) p-3 text-sm focus:border-(--accent) focus:outline-none text-white appearance-none"
                                >
                                    {ACTOR_VENUES.map(actor => (
                                        <option key={actor.id} value={actor.id}>{actor.id.replace('spectral-soundworks/', '')}</option>
                                    ))}
                                    <option value="custom">-- Custom Actor --</option>
                                </select>
                                {actorId === "custom" && (
                                    <input
                                        type="text"
                                        placeholder="Enter custom actor ID..."
                                        className="mt-2 w-full rounded-xl border border-white/10 bg-(--surface-strong) p-3 text-sm focus:border-(--accent) focus:outline-none"
                                        onChange={(e) => setActorId(e.target.value)}
                                    />
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-(--muted) mb-1">Input Defaults (JSON)</label>
                                <textarea
                                    value={inputJson}
                                    onChange={(e) => setInputJson(e.target.value)}
                                    className="h-32 w-full rounded-xl border border-white/10 bg-(--surface-strong) p-3 text-sm font-mono focus:border-(--accent) focus:outline-none"
                                    placeholder='{ "url": "..." }'
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleDiscover}
                                    disabled={loading}
                                    className="rounded-full bg-(--accent) px-6 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong) disabled:opacity-50"
                                >
                                    {loading ? "Discovering..." : "Run Discovery"}
                                </button>
                            </div>
                        </div>
                    </section>

                    {polling && (
                        <section className="rounded-3xl border border-white/10 bg-(--surface) p-6 shadow-md space-y-4">
                            <div className="flex justify-between text-sm font-medium mb-2">
                                <span className="text-white">Actor Execution Status: <span className="text-(--accent)">{pollStatus}</span></span>
                                <span className="text-(--muted)">Found {pollItemCount} items</span>
                            </div>
                            <div className="w-full bg-black/50 overflow-hidden h-3 rounded-full">
                                <div
                                    className="bg-(--accent) h-full rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${Math.min(100, (pollItemCount / expectedResults) * 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-(--muted) text-center animate-pulse">
                                Scraping live data from the internet. This usually takes between 1-3 minutes depending on the target.
                                Please wait...
                            </p>
                        </section>
                    )}

                    {!polling && results.length > 0 && (
                        <section className="rounded-3xl border border-white/10 bg-(--surface) p-6 shadow-md space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Discovery Results ({results.length})</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSift}
                                        disabled={sifting}
                                        className="rounded-full bg-(--accent) px-5 py-2 text-sm font-semibold text-white transition hover:bg-(--accent-strong) disabled:opacity-50"
                                    >
                                        {sifting ? "Sifting..." : "Auto-select Artists (AI)"}
                                    </button>
                                    <button
                                        onClick={handleImport}
                                        disabled={selectedIndices.size === 0 || importing}
                                        className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
                                    >
                                        {importing ? `Importing & Enriching (${importProgress}/${selectedIndices.size})...` : `Import & Enrich Selected (${selectedIndices.size})`}
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-white/10">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-(--surface-strong) text-xs uppercase text-(--muted)">
                                        <tr>
                                            <th className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIndices.size === results.length}
                                                    onChange={toggleAll}
                                                    className="rounded border-white/20 bg-transparent"
                                                />
                                            </th>
                                            <th className="px-4 py-3">Raw Name / Handle</th>
                                            <th className="px-4 py-3">Followers</th>
                                            <th className="px-4 py-3">Bio snippet</th>
                                            <th className="px-4 py-3">URL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/10">
                                        {results.map((item, i) => {
                                            const name = item.fullName || item.title || item.name || item.artist || item.musician || item.band || item.artistName;
                                            const isUnknown = !name;
                                            const displayName = name || "Unknown";
                                            const handle = item.username || item.handle || "-";
                                            const bioSnipppet = (item.biography || item.bio || item.description || "").substring(0, 50);
                                            const url = item.url || item.eventURL || "-";

                                            return (
                                                <tr
                                                    key={i}
                                                    className={`transition ${selectedIndices.has(i) ? "bg-(--accent)/10" : "hover:bg-white/5"}`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIndices.has(i)}
                                                            onChange={() => toggleSelection(i)}
                                                            className="rounded border-white/20 bg-transparent text-(--accent)"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-white">{displayName}</div>
                                                        <div className="text-xs text-(--muted)">{handle}</div>
                                                    </td>
                                                    <td className="px-4 py-3">{item.followersCount || "-"}</td>
                                                    <td className="px-4 py-3 text-xs text-(--muted)">
                                                        {bioSnipppet}{bioSnipppet.length === 50 && "..."}
                                                    </td>
                                                    <td className="px-4 py-3 text-xs text-(--accent)">
                                                        {isUnknown ? (
                                                            <pre className="max-w-xs overflow-x-auto text-[10px] text-(--muted) bg-black/50 p-2 rounded">
                                                                {JSON.stringify(item, null, 2)}
                                                            </pre>
                                                        ) : (
                                                            url !== "-" ? <a href={url} target="_blank" rel="noreferrer">Link</a> : "-"
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </main>
            </div>
        </div>
    );
}
