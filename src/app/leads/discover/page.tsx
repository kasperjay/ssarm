"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { cleanArtistName } from "@/lib/utils";

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
    { id: "spectral-soundworks/3ten-calendar-scraper", url: "https://www.3tenaustin.com/calendar" },
    { id: "spectral-soundworks/valhalla-tavern-calendar-scraper", url: "https://msha.ke/valhallatavern" }
];

export default function DiscoverPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"venues" | "tags">("venues");
    const [instagramTag, setInstagramTag] = useState("");
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
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [siftMode, setSiftMode] = useState<"ai" | "fallback" | null>(null);

    useEffect(() => {
        const history = localStorage.getItem("ss_search_history");
        if (history) {
            try {
                setSearchHistory(JSON.parse(history));
            } catch (e) {
                console.error("Failed to parse search history", e);
            }
        }
    }, []);

    const addToHistory = (term: string) => {
        if (!term) return;
        const newHistory = [term, ...searchHistory.filter(t => t !== term)].slice(0, 10);
        setSearchHistory(newHistory);
        localStorage.setItem("ss_search_history", JSON.stringify(newHistory));
    };

    const handleDiscover = async () => {
        try {
            setLoading(true);
            setError(null);
            setResults([]);
            setPollStatus("STARTING");
            setPollItemCount(0);

            let finalActorId = actorId;
            let finalInput: any;

            if (activeTab === "tags") {
                if (!instagramTag) throw new Error("Please enter an Instagram tag or handle.");
                
                const isProfile = instagramTag.startsWith('@');
                const cleanTerm = instagramTag.replace(/^[@#]/, '');
                
                // Save to history
                addToHistory(instagramTag);

                if (isProfile) {
                    finalActorId = "apify/instagram-scraper";
                    finalInput = {
                        directUrls: [`https://www.instagram.com/${cleanTerm}/`],
                        resultsLimit: expectedResults || 50,
                        addParentData: true
                    };
                } else {
                    finalActorId = "apify/instagram-hashtag-scraper";
                    finalInput = {
                        hashtags: [cleanTerm],
                        maxPostsPerHashtag: expectedResults || 100
                    };
                }
            } else {
                try {
                    finalInput = JSON.parse(inputJson);
                } catch (e) {
                    throw new Error("Invalid JSON input format. Please check syntax.");
                }
            }

            const res = await fetch("/api/discover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    actorId: finalActorId, 
                    input: finalInput 
                }),
            });

            if (!res.ok) {
                const textBody = await res.text();
                try {
                    const data = JSON.parse(textBody);
                    throw new Error(data.detail || data.error || "Failed to start discovery run.");
                } catch (e) {
                    throw new Error(`Server returned non-JSON error (${res.status}): ${textBody.substring(0, 500)}`);
                }
            }

            const text = await res.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error(`Server returned status 200 but invalid JSON: ${text.substring(0, 500)}`);
            }
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
                const text = await res.text();
                try {
                    const data = JSON.parse(text);
                    throw new Error(data.detail || data.error || "Failed to poll status.");
                } catch (e) {
                    throw new Error(`Status check returned non-JSON error (${res.status}): ${text.substring(0, 500)}`);
                }
            }

            const textBody = await res.text();
            let data;
            try {
                data = JSON.parse(textBody);
            } catch (e) {
                throw new Error(`Status check returned status 200 but invalid JSON: ${textBody.substring(0, 500)}`);
            }
            const statusMap: Record<string, string> = {
                "SUCCEEDED": "Complete",
                "RUNNING": "Processing",
                "PENDING": "Starting",
                "FAILED": "Interrupted",
                "ABORTED": "Stopped"
            };
            const friendlyStatus = statusMap[data.status] || data.status.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
            setPollStatus(friendlyStatus);
            setPollItemCount(data.itemCount || 0);

            if (data.status === "SUCCEEDED" || data.status === "FAILED" || data.status === "ABORTED") {
                setPolling(false);
                setLoading(false);
                if (data.status === "SUCCEEDED") {
                    const flattened = (data.items || []).flatMap((rawItem: any) => {
                        const nestedKeys = Object.keys(rawItem).filter(k => !isNaN(Number(k)));
                        if (nestedKeys.length > 0 && !rawItem.artist && !rawItem.fullName && !rawItem.name) {
                            return nestedKeys.map(k => ({ ...rawItem, ...rawItem[k] }));
                        }
                        return [rawItem];
                    });
                    setResults(flattened);
                    setSelectedIndices(new Set());
                } else {
                    setError(`Search ended with status: ${data.status.toLowerCase()}`);
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
            setSiftMode(null);

            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 35000);

            const res = await fetch("/api/sift", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: results }),
                signal: controller.signal,
            });

            clearTimeout(timer);

            if (!res.ok) {
                const textBody = await res.text();
                try {
                    const data = JSON.parse(textBody);
                    throw new Error(data.detail || data.error || "Failed to sift results.");
                } catch {
                    throw new Error(`Failed to sift results (${res.status}).`);
                }
            }

            const data = await res.json();
            const { results: aiResults, mode } = data;
            if (mode === "ai" || mode === "fallback") {
                setSiftMode(mode);
            }

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
            if (err?.name === "AbortError") {
                setError("Smart selection timed out. Try again or reduce result count.");
            } else {
                setError(err.message);
            }
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
            console.log(`Starting import for ${selectedItems.length} items...`);

            let count = 0;
            const CONCURRENCY_LIMIT = 5;

            for (let i = 0; i < selectedItems.length; i += CONCURRENCY_LIMIT) {
                const batch = selectedItems.slice(i, i + CONCURRENCY_LIMIT);
                
                await Promise.all(batch.map(async (item) => {
                    const rawName = item.artist || item.artistName || item.band || item.musician || item.ownerUsername || item.owner?.username || item.owner?.full_name || item.username || item.fullName || item.title || item.name;
                    if (!rawName) {
                        console.log("Skipping item with no artist name:", item);
                        return;
                    }

                    const artistName = cleanArtistName(rawName);
                    if (!artistName) {
                        console.log("Skipping item with empty cleaned name:", rawName);
                        return;
                    }

                    console.log(`Importing artist: ${artistName}`);

                    const handle = item.ownerUsername || item.owner?.username || item.username || item.handle || item.instagramHandle;
                    const postUrl = item.shortCode ? `https://www.instagram.com/p/${item.shortCode}` : (item.url || item.instagramUrl || item.link || undefined);
                    const profileUrl = handle ? `https://www.instagram.com/${handle.replace('@', '')}` : undefined;
                    
                    // Parse followers as integer to avoid Prisma errors
                    const rawFollowers = item.followersCount || item.ownerFollowersCount || item.owner?.followersCount;
                    const followerCount = rawFollowers ? parseInt(String(rawFollowers).replace(/[^0-9]/g, '')) : undefined;

                    const payload = {
                        isDiscoveryImport: true,
                        artist: {
                            name: artistName,
                            instagramHandle: handle || undefined,
                            instagramProfileUrl: profileUrl,
                            instagramProfileImageUrl: item.ownerProfilePicUrl || item.owner?.profile_pic_url || item.profilePicUrl || item.avatarUrl || item.ownerProfileImageUrl || undefined,
                            bio: item.biography || item.owner?.biography || item.bio || item.description || item.caption || undefined,
                            followerCount: isNaN(Number(followerCount)) ? undefined : followerCount,
                        },
                        lead: {
                            status: "NEW",
                        },
                        instagramPosts: postUrl ? [
                            {
                                instagramPostId: item.id || item.shortCode || undefined,
                                caption: item.caption || undefined,
                                imageUrl: item.displayUrl || item.imageUrl || undefined,
                                postedAt: item.timestamp || item.postedAt || undefined,
                                url: postUrl
                            }
                        ] : undefined,
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

                    console.log(`Payload for ${artistName}:`, JSON.stringify(payload, null, 2));

                    const ingestRes = await fetch("/api/ingest", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    });

                    if (!ingestRes.ok) {
                        const errorText = await ingestRes.text();
                        console.error(`Failed to ingest ${artistName}:`, errorText);
                    }

                    count++;
                    setImportProgress(count);
                }));
            }

            router.push("/");
        } catch (err: any) {
            setError(err.message);
            setImporting(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-transparent pb-20 selection:bg-accent/30 selection:text-white">
            <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6">
                
                {/* Header Phase */}
                <header className="flex flex-col gap-10">
                    {error && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium">
                            {error}
                        </div>
                    )}
                    <div className="flex flex-wrap items-end justify-between gap-12 border-b border-white/5 pb-12">
                        <div className="space-y-6">
                            <Link 
                                href="/" 
                                className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all"
                            >
                                <span className="transition-transform group-hover:-translate-x-1">←</span> 
                                <span>Dashboard</span>
                            </Link>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="h-px w-8 bg-accent/40" />
                                        <p className="text-xs uppercase tracking-[0.3em] text-accent/60 font-bold">
                                            Artist Search
                                        </p>
                                </div>
                                <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight premium-gradient-text pr-4">
                                    Lead <span className="text-white/40 italic">Discovery</span>
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 pb-2">
                             <div className="flex flex-col items-end">
                                 <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Service Status</span>
                                 <span className="text-xl font-bold tracking-widest text-white">Active</span>
                            </div>
                            <div className="h-10 w-px bg-white/5 mx-4" />
                            <div className="flex items-center gap-2 text-accent/60">
                                <div className="h-2 w-2 rounded-full bg-accent" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Live Data</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="space-y-12 relative z-10">
                    {error && (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-100"></div>
                    )}
                    <GlassCard className="p-10!">
                        <div className="flex items-center gap-1 justify-between mb-10 p-1 bg-white/5 rounded-2xl border border-white/5">
                            <button
                                onClick={() => setActiveTab("venues")}
                                className={`flex-1 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all ${activeTab === "venues" ? "bg-accent text-black neon-glow" : "text-white/40 hover:text-white/60 hover:bg-white/5"}`}
                            >
                                Venue Calendars
                            </button>
                            <button
                                onClick={() => setActiveTab("tags")}
                                className={`flex-1 py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all ${activeTab === "tags" ? "bg-accent text-black neon-glow" : "text-white/40 hover:text-white/60 hover:bg-white/5"}`}
                            >
                                Instagram Tags
                            </button>
                        </div>

                        {activeTab === "venues" ? (
                            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 w-2 bg-accent neon-glow rounded-full animate-pulse" />
                                        <h2 className="text-xl font-bold uppercase tracking-widest text-white/80">Search Configuration</h2>
                                    </div>
                                    <div className="h-px flex-1 ml-10 bg-white/5 hidden md:block" />
                                </div>

                                <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <label className="block text-xs uppercase font-bold tracking-[0.3em] text-white/30 ml-1">Data Source</label>
                                            <div className="relative group/select">
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
                                                    className="w-full rounded-2xl border border-white/10 bg-white/2 p-4 pr-12 text-[13px] font-bold tracking-tight focus:border-accent focus:outline-none text-white/80 appearance-none transition-all cursor-pointer hover:bg-white/5 shadow-inner"
                                                >
                                                    {ACTOR_VENUES.map(actor => (
                                                        <option key={actor.id} value={actor.id} className="bg-[#0c0c0c] text-white">
                                                            {actor.id.split('/').pop()?.replace('-scraper', '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                        </option>
                                                    ))}
                                                     <option value="custom" className="bg-[#0c0c0c] text-white">-- Custom Data Source --</option>
                                                </select>
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover/select:text-accent transition-colors">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                                </div>
                                            </div>
                                            {actorId === "custom" && (
                                                <input
                                                    type="text"
                                                    placeholder="Enter Custom Source ID..."
                                                    className="mt-4 w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm font-bold tracking-tight text-white focus:border-accent focus:outline-none transition-all placeholder:text-white/10"
                                                    onChange={(e) => setActorId(e.target.value)}
                                                />
                                            )}
                                        </div>
                                        <div className="pt-4">
                                            <button
                                                onClick={handleDiscover}
                                                disabled={loading}
                                                className="w-full rounded-2xl font-bold uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 px-8 py-8 text-sm bg-accent text-black neon-glow hover:bg-accent/90 hover:scale-[1.02] border-2 border-accent"
                                            >
                                                {loading ? "Searching..." : "Begin Artist Search"}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-xs uppercase font-bold tracking-[0.3em] text-white/30 ml-1">Search Parameters (JSON)</label>
                                        <div className="relative group/textarea">
                                            <div className="absolute -inset-0.5 bg-accent/5 rounded-[24px] blur-sm opacity-0 group-hover/textarea:opacity-100 transition-opacity" />
                                            <textarea
                                                value={inputJson}
                                                onChange={(e) => setInputJson(e.target.value)}
                                                className="relative h-[200px] w-full rounded-[24px] border border-white/10 bg-black/40 p-6 text-[12px] font-sans font-medium text-white/70 focus:text-accent focus:border-accent focus:outline-none resize-none custom-scrollbar transition-all"
                                                placeholder='{ "url": "..." }'
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-10 animate-in fade-in duration-700">
                                <div className="flex items-center justify-between pb-6 border-b border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="h-2 w-2 bg-accent neon-glow rounded-full animate-pulse" />
                                     <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white/80">
                                         Tag Search <span className="text-accent/40 ml-2 font-sans">[1]</span>
                                     </h2>
                                </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-xs uppercase font-bold tracking-[0.3em] text-white/30 ml-1">Instagram Tag or @handle</label>
                                    <div className="relative group/textarea">
                                        <div className="absolute -inset-0.5 bg-accent/5 rounded-[24px] blur-sm opacity-0 group-hover/textarea:opacity-100 transition-opacity" />
                                        <input
                                            type="text"
                                            value={instagramTag}
                                            onChange={(e) => setInstagramTag(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleDiscover()}
                                            className="relative h-[56px] w-full rounded-[24px] border border-white/10 bg-black/40 p-6 text-[12px] font-sans font-medium text-white/70 focus:text-accent focus:border-accent focus:outline-none transition-all"
                                            placeholder="#austinmusic or @username"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button
                                        onClick={handleDiscover}
                                        disabled={loading}
                                        className="w-full rounded-2xl font-bold uppercase tracking-[0.2em] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 px-8 py-8 text-sm bg-accent text-black neon-glow hover:bg-accent/90 hover:scale-[1.02] border-2 border-accent"
                                    >
                                        {loading ? "Searching..." : "Begin Artist Search"}
                                    </button>
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <NeonButton
                                        onClick={handleSift}
                                        disabled={sifting}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs! tracking-[0.2em]! px-6!"
                                    >
                                        {sifting ? "Sifting..." : "Smart Selection"}
                                    </NeonButton>
                                    <NeonButton
                                        onClick={handleImport}
                                        disabled={selectedIndices.size === 0 || importing}
                                        variant="lime"
                                        size="sm"
                                        className="text-xs! tracking-[0.2em]! px-6!"
                                    >
                                        {importing ? `Importing [${importProgress}/${selectedIndices.size}]` : `Import Selected (${selectedIndices.size})`}
                                    </NeonButton>
                                </div>
                            </div>
                        )}
                    </GlassCard>

                    {polling && (
                        <GlassCard className="p-8! border-accent/20 animate-pulse-subtle bg-accent/2">
                            <div className="flex justify-between items-end mb-8">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-accent animate-ping" />
                                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Searching for Artists</p>
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight">Status: <span className="premium-gradient-text italic">{pollStatus}</span></h3>
                                </div>
                                 <div className="flex flex-col items-end">
                                     <span className="text-4xl font-sans font-bold text-white leading-none tracking-tighter">{pollItemCount}</span>
                                     <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/20 mt-2">New Artists</span>
                                 </div>
                            </div>
                            <div className="relative w-full bg-white/5 overflow-hidden h-3 rounded-full border border-white/5 p-0.5">
                                <div
                                    className="bg-accent h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]"
                                    style={{ width: `${Math.min(100, (pollItemCount / expectedResults) * 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex items-center justify-between mt-6">
                                 <p className="text-[9px] text-white/30 font-bold tracking-[0.2em] uppercase">
                                     Analyzing profiles and event data...
                                 </p>
                            </div>
                        </GlassCard>
                    )}

                    {!polling && results.length > 0 && (
                        <section className="space-y-8 animate-in fade-in duration-700">
                            <div className="flex items-center justify-between border-b border-white/5 pb-8 mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-2 w-2 bg-accent neon-glow rounded-full" />
                                     <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-white/80">
                                         Search Results <span className="text-accent/40 ml-2 font-sans">[{results.length}]</span>
                                     </h2>
                                </div>
                                <div className="flex gap-4">
                                    <NeonButton
                                        onClick={handleSift}
                                        disabled={sifting}
                                        variant="outline"
                                        size="sm"
                                        className="text-xs! tracking-[0.2em]! px-6!"
                                    >
                                        {sifting ? "Sifting..." : "Smart Selection"}
                                    </NeonButton>
                                    <NeonButton
                                        onClick={handleImport}
                                        disabled={selectedIndices.size === 0 || importing}
                                        variant="lime"
                                        size="sm"
                                        className="text-xs! tracking-[0.2em]! px-6!"
                                    >
                                        {importing ? `Importing [${importProgress}/${selectedIndices.size}]` : `Import Selected (${selectedIndices.size})`}
                                    </NeonButton>
                                </div>
                            </div>

                            {siftMode && (
                                <div className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                                    Smart selection mode: <span className="text-accent">{siftMode === "ai" ? "AI" : "Fallback"}</span>
                                </div>
                            )}

                            <div className="overflow-hidden rounded-[40px] border border-white/5 bg-white/2 backdrop-blur-md shadow-2xl">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left">
                                        <thead className="bg-white/5 text-xs uppercase font-bold tracking-[0.3em] text-white/20">
                                            <tr>
                                                <th className="px-8 py-6">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedIndices.size === results.length}
                                                            onChange={toggleAll}
                                                            className="h-4 w-4 rounded-lg border-white/10 bg-black/40 text-accent focus:ring-accent/20 cursor-pointer transition-all"
                                                        />
                                                    </div>
                                                </th>
                                                <th className="px-8 py-6">Artist</th>
                                                <th className="px-8 py-6 text-right">Source</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/2 space-y-2">
                                            {results.map((item, i) => {
                                                const rawName = item.artist || item.artistName || item.band || item.musician || item.ownerUsername || item.username || item.fullName || item.title || item.name;
                                                const artistName = cleanArtistName(rawName);
                                                const isUnknown = !artistName;
                                                const displayName = artistName || (item.shortCode ? `Post ${item.shortCode}` : "Unknown Artist");
                                                const handle = item.ownerUsername || item.username || item.handle || item.instagramHandle || "No Handle";
                                                const bioSnipppet = (item.biography || item.bio || item.description || item.caption || "").substring(0, 100);
                                                const url = item.shortCode ? `https://www.instagram.com/p/${item.shortCode}` : (item.url || item.eventUrl || item.eventURL || item.link || "-");

                                                return (
                                                    <tr
                                                        key={i}
                                                        className={`transition-all duration-300 group ${selectedIndices.has(i) ? "bg-accent/3" : "hover:bg-white/3"}`}
                                                    >
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedIndices.has(i)}
                                                                    onChange={() => toggleSelection(i)}
                                                                    className="h-4 w-4 rounded-lg border-white/10 bg-black/40 text-accent focus:ring-accent/20 cursor-pointer transition-all"
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                             <div className="space-y-1">
                                                                 <div className="font-bold text-white/90 text-[14px] tracking-tight group-hover:text-accent transition-colors">{displayName}</div>
                                                                 {handle !== "No Handle" && (
                                                                     <div className="text-[9px] font-bold font-sans text-white/20 uppercase tracking-[0.2em]">@{handle.replace('@', '')}</div>
                                                                 )}
                                                             </div>
                                                         </td>
                                                         <td className="px-8 py-6 text-right">
                                                            {isUnknown ? (
                                                                <span className="text-xs font-bold text-white/10 uppercase tracking-widest">NO DATA</span>
                                                            ) : (
                                                                url !== "-" ? (
                                                                    <a 
                                                                        href={url} 
                                                                        target="_blank" 
                                                                        rel="noreferrer" 
                                                                        className="inline-flex items-center gap-2 text-accent/60 hover:text-accent font-bold uppercase tracking-[0.3em] text-[9px] transition-all group/link"
                                                                    >
                                                                        {url.includes('ticketmaster') || url.includes('event') ? 'View Event' : 'View Profile'}
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-xs font-bold text-white/10 uppercase tracking-widest">No Link</span>
                                                                )
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
