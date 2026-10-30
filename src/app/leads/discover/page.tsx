"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { cleanArtistName } from "@/lib/utils";
import { ACTIVE_VENUES, VENUES } from "@/lib/scrapers/config";
import { extractTaggedProfiles, InstagramSourceType } from "@/lib/instagram-discovery";

type VenueRunStatus = {
    venueId: string;
    venueName: string;
    sourceUrl: string;
    status: "success" | "partial" | "failed";
    artistCount: number;
    eventCount: number;
    eventPagesRead: number;
    durationMs: number;
    warnings: string[];
    error?: string;
};
type ImportIssue = { artist: string; reason: string };
type ImportSummary = { selected: number; saved: number; issues: ImportIssue[] };
type DiscoveryItem = {
    artist?: string;
    artistName?: string;
    band?: string;
    musician?: string;
    ownerUsername?: string;
    owner?: { username?: string; full_name?: string; followersCount?: number | string; biography?: string; profile_pic_url?: string };
    username?: string;
    fullName?: string;
    title?: string;
    name?: string;
    shortCode?: string;
    url?: string;
    instagramUrl?: string;
    link?: string;
    followersCount?: number | string;
    ownerFollowersCount?: number | string;
    ownerProfilePicUrl?: string;
    ownerProfileImageUrl?: string;
    profilePicUrl?: string;
    avatarUrl?: string;
    biography?: string;
    bio?: string;
    description?: string;
    caption?: string;
    displayUrl?: string;
    imageUrl?: string;
    timestamp?: string;
    postedAt?: string;
    id?: string;
    eventTitle?: string;
    venueName?: string;
    eventDate?: string;
    eventDateOnly?: boolean;
    eventUrl?: string;
    eventURL?: string;
    sourceType?: InstagramSourceType;
    taggedCount?: number;
    postOwner?: string;
    [key: string]: unknown;
};
type ApiErrorResponse = { error?: string; detail?: string };
type CalendarSearchResponse = ApiErrorResponse & { status?: string; items?: DiscoveryItem[]; venues?: VenueRunStatus[] };
type DiscoveryStartResponse = { runId: string; datasetId: string };
type DiscoveryStatusResponse = { status: string; itemCount?: number; items?: Record<string, unknown>[] };
type SiftResponse = { results?: boolean[]; mode?: string; cleanedNames?: Record<string | number, string> };

function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}


function formatEventDate(value?: string, dateOnly = false): string {
    if (!value) return "";
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Chicago",
        month: "short",
        day: "numeric",
        year: "numeric",
        ...(dateOnly ? {} : { hour: "numeric", minute: "2-digit" }),
    }).format(date);
}

export default function DiscoverPage() {
    const [activeTab, setActiveTab] = useState<"venues" | "tags">("venues");
    const [instagramTag, setInstagramTag] = useState("");
    const [loading, setLoading] = useState(false);
    const [polling, setPolling] = useState(false);
    const [pollStatus, setPollStatus] = useState<string | null>(null);
    const [pollItemCount, setPollItemCount] = useState(0);
    const expectedResults = 100;
    const [results, setResults] = useState<DiscoveryItem[]>([]);
    const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState(0);
    const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
    const [sifting, setSifting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [siftMode, setSiftMode] = useState<"ai" | "fallback" | null>(null);
    const [concurrencyBusy, setConcurrencyBusy] = useState(false);
    const [selectedVenueIds, setSelectedVenueIds] = useState<Set<string>>(() => new Set(ACTIVE_VENUES.map((venue) => venue.id)));
    const [venueStatuses, setVenueStatuses] = useState<VenueRunStatus[]>([]);

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

    const handleCalendarDiscover = async () => {
        if (selectedVenueIds.size === 0) {
            setError("Select at least one venue.");
            return;
        }

        const controller = new AbortController();
        let timeoutId: number | undefined;
        try {
            setLoading(true);
            setPolling(true);
            setError(null);
            setImportSummary(null);
            setConcurrencyBusy(false);
            setResults([]);
            setVenueStatuses([]);
            setSelectedIndices(new Set());
            setPollStatus("Scraping selected venue calendars");
            setPollItemCount(0);

            timeoutId = window.setTimeout(() => controller.abort(), 35_000);
            const res = await fetch("/api/discover/calendar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ venueIds: [...selectedVenueIds] }),
                signal: controller.signal,
            });
            const text = await res.text();
            let parsed: unknown;
            try {
                parsed = JSON.parse(text);
            } catch {
                throw new Error(`Calendar search returned a non-JSON response (${res.status}): ${text.substring(0, 500)}`);
            }
            if (!isRecord(parsed)) throw new Error("Calendar search returned an invalid response.");
            const data = parsed as CalendarSearchResponse;
            if (!res.ok) throw new Error(data.detail || data.error || "Failed to search venue calendars.");

            const foundItems = Array.isArray(data.items) ? data.items.filter(isRecord) as DiscoveryItem[] : [];
            setResults(foundItems);
            setVenueStatuses(Array.isArray(data.venues) ? data.venues : []);
            setSelectedIndices(new Set());
            setPollItemCount(foundItems.length);
            setPollStatus(data.status === "partial" ? "Complete · some venues need attention" : "Complete");
            if (data.status === "failed") setError("All selected venue calendars failed. See the venue status details below.");
        } catch (error) {
            setError(error instanceof Error && error.name === "AbortError"
                ? "Calendar search timed out after 35 seconds. Try fewer venues or run it again."
                : getErrorMessage(error, "Calendar search failed."));
        } finally {
            if (timeoutId !== undefined) window.clearTimeout(timeoutId);
            setPolling(false);
            setLoading(false);
            setConcurrencyBusy(false);
        }
    };

    const handleDiscover = async () => {
        const term = instagramTag.trim();
        if (!term) {
            setError("Please enter an Instagram tag or handle.");
            return;
        }

        try {
            setLoading(true);
            setPolling(false);
            setError(null);
            setImportSummary(null);
            setConcurrencyBusy(false);
            setResults([]);
            setVenueStatuses([]);
            setSelectedIndices(new Set());
            setPollStatus("STARTING");
            setPollItemCount(0);

            const isProfile = term.startsWith("@");
            const cleanTerm = term.replace(/^[@#]/, "");
            addToHistory(term);

            const actorId = isProfile ? "apify/instagram-scraper" : "apify/instagram-hashtag-scraper";
            const input = isProfile
                ? { directUrls: [`https://www.instagram.com/${cleanTerm}/`], resultsLimit: expectedResults || 100, resultsType: "posts", addParentData: true }
                : { hashtags: [cleanTerm], maxPostsPerHashtag: expectedResults || 100, resultsType: "posts" };
            const res = await fetch("/api/discover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ actorId, input }),
            });

            if (!res.ok) {
                const text = await res.text();
                let data: { detail?: string; error?: string } | null = null;
                try {
                    data = JSON.parse(text);
                } catch {
                    throw new Error(`Server returned non-JSON error (${res.status}): ${text.substring(0, 500)}`);
                }
                if (res.status === 429) setConcurrencyBusy(true);
                throw new Error(data?.error || data?.detail || "Failed to start discovery run.");
            }

            const text = await res.text();
            let parsed: unknown;
            try {
                parsed = JSON.parse(text);
            } catch {
                throw new Error(`Server returned status 200 but invalid JSON: ${text.substring(0, 500)}`);
            }
            if (!isRecord(parsed) || typeof parsed.runId !== "string" || typeof parsed.datasetId !== "string") {
                throw new Error("Discovery returned an invalid run response.");
            }
            const data = parsed as DiscoveryStartResponse;
            setPolling(true);
            void pollStatusLoop(data.runId, data.datasetId);
        } catch (error) {
            setError(getErrorMessage(error, "Instagram search failed."));
            setPolling(false);
        } finally {
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
                let data: { detail?: string; error?: string } | null = null;
                try {
                    data = JSON.parse(text);
                } catch {
                    throw new Error(`Status check returned non-JSON error (${res.status}): ${text.substring(0, 500)}`);
                }
                throw new Error(data?.detail || data?.error || "Failed to poll status.");
            }

            const textBody = await res.text();
            let parsed: unknown;
            try {
                parsed = JSON.parse(textBody);
            } catch {
                throw new Error(`Status check returned status 200 but invalid JSON: ${textBody.substring(0, 500)}`);
            }
            if (!isRecord(parsed) || typeof parsed.status !== "string") {
                throw new Error("Status check returned an invalid response.");
            }
            const data = parsed as DiscoveryStatusResponse;
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
                setConcurrencyBusy(false);
                if (data.status === "SUCCEEDED") {
                    const rawList = (data.items || []).flatMap((item) => {
                        if (!isRecord(item)) return [];
                        const nestedKeys = Object.keys(item).filter((key) => !Number.isNaN(Number(key)));
                        if (nestedKeys.length > 0 && !item.artist && !item.fullName && !item.name) {
                            return nestedKeys.flatMap((key) => isRecord(item[key]) ? [{ ...item, ...item[key] } as DiscoveryItem] : []);
                        }
                        return [item as DiscoveryItem];
                    });
                    const flattened = extractTaggedProfiles(rawList) as DiscoveryItem[];
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
        } catch (error) {
            setError(getErrorMessage(error, "Status check failed."));
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
                let data: ApiErrorResponse | null = null;
                try {
                    const parsed: unknown = JSON.parse(textBody);
                    if (isRecord(parsed)) data = parsed as ApiErrorResponse;
                } catch (parseErr) {
                    console.warn("[Discover] Failed to parse API error response as JSON:", parseErr);
                }
                throw new Error(data?.detail || data?.error || `Failed to sift results (${res.status}).`);
            }

            const data = await res.json() as SiftResponse;
            const { results: aiResults, mode, cleanedNames } = data;
            if (mode === "ai" || mode === "fallback") {
                setSiftMode(mode);
            }

            if (cleanedNames && typeof cleanedNames === "object") {
                setResults((prevResults) =>
                    prevResults.map((item, idx) => {
                        const cleaned = cleanedNames[idx] || cleanedNames[String(idx)];
                        if (cleaned && typeof cleaned === "string" && cleaned.trim().length > 0) {
                            return {
                                ...item,
                                artist: cleaned.trim(),
                                artistName: cleaned.trim(),
                            };
                        }
                        return item;
                    })
                );
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
        } catch (error) {
            setError(error instanceof Error && error.name === "AbortError"
                ? "Smart selection timed out. Try again or reduce result count."
                : getErrorMessage(error, "Smart selection failed."));
        } finally {
            setSifting(false);
        }
    };

    const handleImport = async () => {
        if (selectedIndices.size === 0 || importing) return;

        const selectedItems = Array.from(selectedIndices)
            .map((index) => ({ index, item: results[index] }))
            .filter(({ item }) => item !== undefined);
        if (selectedItems.length === 0) {
            setError("No valid result rows are selected.");
            return;
        }

        try {
            setImporting(true);
            setImportProgress(0);
            setError(null);
            setImportSummary(null);

            const failedIndices: number[] = [];
            const issues: ImportIssue[] = [];
            let completed = 0;
            let saved = 0;
            const concurrencyLimit = 5;

            for (let i = 0; i < selectedItems.length; i += concurrencyLimit) {
                const batch = selectedItems.slice(i, i + concurrencyLimit);
                const outcomes = await Promise.all(batch.map(async ({ index, item }): Promise<{ index: number; artist: string; reason: string | null }> => {
                    let artistName = "Selected item";
                    try {
                        const rawName = [item.artist, item.artistName, item.band, item.musician, item.ownerUsername, item.owner?.username, item.owner?.full_name, item.username, item.fullName, item.title, item.name]
                            .find((value): value is string => typeof value === "string" && value.trim().length > 0);
                        if (!rawName) return { index, artist: artistName, reason: "No artist name was found in this result." };

                        artistName = cleanArtistName(rawName);
                        if (!artistName) return { index, artist: rawName, reason: "The artist name could not be cleaned for import." };

                        const handle = item.ownerUsername || item.owner?.username || item.username || item.handle || item.instagramHandle;
                        const postUrl = item.shortCode ? `https://www.instagram.com/p/${item.shortCode}` : (item.url || item.instagramUrl || item.link || undefined);
                        const profileUrl = handle ? `https://www.instagram.com/${String(handle).replace('@', '')}` : undefined;
                        const rawFollowers = item.followersCount || item.ownerFollowersCount || item.owner?.followersCount;
                        const followerCount = rawFollowers ? parseInt(String(rawFollowers).replace(/[^0-9]/g, '')) : undefined;
                        const isVenueCalendarItem = Boolean(item.eventTitle);
                        const payload = {
                            isDiscoveryImport: true,
                            skipApifyDiscovery: isVenueCalendarItem,
                            skipInstagramFetch: isVenueCalendarItem,
                            artist: {
                                name: artistName,
                                instagramHandle: handle || undefined,
                                instagramProfileUrl: profileUrl,
                                instagramProfileImageUrl: item.ownerProfilePicUrl || item.owner?.profile_pic_url || item.profilePicUrl || item.avatarUrl || item.ownerProfileImageUrl || undefined,
                                bio: item.biography || item.owner?.biography || item.bio || (item.eventTitle ? undefined : item.description || item.caption || undefined),
                                followerCount: isNaN(Number(followerCount)) ? undefined : followerCount,
                                location: undefined,
                                city: undefined,
                                state: undefined,
                                country: undefined,
                            },
                            lead: { status: "NEW" as const },
                            instagramPosts: postUrl ? [{
                                instagramPostId: item.id || item.shortCode || undefined,
                                caption: item.caption || undefined,
                                imageUrl: item.displayUrl || item.imageUrl || undefined,
                                postedAt: item.timestamp || item.postedAt || undefined,
                                url: postUrl,
                            }] : undefined,
                            activities: item.eventTitle ? [{
                                type: "NOTE" as const,
                                note: [item.eventTitle, item.venueName, formatEventDate(item.eventDate, item.eventDateOnly), item.eventUrl].filter(Boolean).join(" · "),
                            }] : (item.sourceType && item.postOwner ? [{
                                type: "NOTE" as const,
                                note: `Discovered as ${item.sourceType === "tagged" ? "tagged artist" : item.sourceType === "coauthor" ? "co-author" : item.sourceType === "mention" ? "mentioned artist" : "post author"} on Instagram post by @${item.postOwner}${postUrl ? ` (${postUrl})` : ""}`,
                            }] : undefined),
                        };

                        const response = await fetch("/api/ingest", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(payload),
                        });
                        const responseText = await response.text();
                        let responseData: { success?: boolean; error?: string; detail?: string } | null = null;
                        try {
                            responseData = JSON.parse(responseText);
                        } catch (parseErr) {
                            console.warn("[Discover] Failed to parse import response as JSON:", parseErr);
                        }

                        if (!response.ok || responseData?.success !== true) {
                            const reason = responseData?.error || responseData?.detail || responseText.slice(0, 300) || `Import failed (HTTP ${response.status}).`;
                            return { index, artist: artistName, reason };
                        }
                        return { index, artist: artistName, reason: null };
                    } catch (error) {
                        return { index, artist: artistName, reason: error instanceof Error ? error.message : "The import request failed." };
                    }
                }));

                for (const outcome of outcomes) {
                    completed += 1;
                    if (outcome.reason) {
                        failedIndices.push(outcome.index);
                        issues.push({ artist: outcome.artist, reason: outcome.reason });
                    } else {
                        saved += 1;
                    }
                }
                setImportProgress(completed);
            }

            setSelectedIndices(new Set(failedIndices));
            setImportSummary({ selected: selectedItems.length, saved, issues });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Import failed unexpectedly.");
        } finally {
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
                    )}                    {importSummary && (
                        <div
                            role="status"
                            aria-live="polite"
                            className={`rounded-2xl border p-4 text-sm ${importSummary.issues.length ? "border-amber-400/30 bg-amber-400/10 text-amber-100" : "border-accent/30 bg-accent/10 text-accent"}`}
                        >
                            <p className="font-semibold">
                                {importSummary.issues.length === 0
                                    ? `Saved all ${importSummary.saved} selected artists.`
                                    : `Saved ${importSummary.saved} of ${importSummary.selected} selected artists. ${importSummary.issues.length} failed.`}
                            </p>
                            {importSummary.issues.length > 0 && (
                                <>
                                    <p className="mt-2 text-xs text-amber-100/70">Failed artists remain selected so you can retry them.</p>
                                    <ul className="mt-3 space-y-2">
                                        {importSummary.issues.map((issue, index) => (
                                            <li key={`${issue.artist}-${index}`} className="text-xs">
                                                <span className="font-semibold">{issue.artist}:</span> {issue.reason}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {importSummary.saved > 0 && (
                                <Link href="/" className="mt-3 inline-block text-xs font-bold uppercase tracking-widest underline underline-offset-4">
                                    Review saved leads
                                </Link>
                            )}
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
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-100">{error}</div>
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
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <label className="block text-xs uppercase font-bold tracking-[0.3em] text-white/30 ml-1">Active Venues</label>
                                            <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                                                <button type="button" onClick={() => setSelectedVenueIds(new Set(ACTIVE_VENUES.map((venue) => venue.id)))} className="text-accent/70 hover:text-accent">Select all</button>
                                                <button type="button" onClick={() => setSelectedVenueIds(new Set())} className="text-white/30 hover:text-white/60">Clear</button>
                                            </div>
                                        </div>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {VENUES.map((venue) => venue.source === "closed" ? (
                                                <div key={venue.id} aria-label={`${venue.name}, closed`} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/10 p-4 opacity-45">
                                                    <span className="h-4 w-4 rounded border border-white/10" aria-hidden="true" />
                                                    <span className="text-sm font-semibold text-white/60">{venue.name}</span>
                                                    <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-white/40">Closed</span>
                                                </div>
                                            ) : (
                                                <label key={venue.id} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${selectedVenueIds.has(venue.id) ? "border-accent/40 bg-accent/5" : "border-white/10 bg-black/20 hover:bg-white/5"}`}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedVenueIds.has(venue.id)}
                                                        onChange={() => {
                                                            const next = new Set(selectedVenueIds);
                                                            if (next.has(venue.id)) next.delete(venue.id);
                                                            else next.add(venue.id);
                                                            setSelectedVenueIds(next);
                                                        }}
                                                        className="h-4 w-4 rounded border-white/10 bg-black/40 text-accent focus:ring-accent/20"
                                                    />
                                                    <span className="text-sm font-semibold text-white/80">{venue.name}</span>
                                                </label>
                                            ))}
                                        </div>
                                        <button
                                            onClick={handleCalendarDiscover}
                                            disabled={loading || selectedVenueIds.size === 0}
                                            className="w-full rounded-2xl border-2 border-accent bg-accent px-8 py-7 text-sm font-bold uppercase tracking-[0.2em] text-black neon-glow transition-all duration-300 hover:scale-[1.02] hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50"
                                        >
                                            {loading ? "Searching..." : `Begin Artist Search · ${selectedVenueIds.size} venues`}
                                        </button>
                                    </div>
                                    <div className="space-y-4 rounded-[24px] border border-white/5 bg-black/20 p-6">
                                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">Run behavior</h3>
                                        <ul className="space-y-4 text-sm text-white/60">
                                            <li>Searches active public venue calendars for the next 30 days.</li>
                                            <li>All selected venues run in parallel, with a 30-second limit per venue.</li>
                                            <li>Event pages are checked for lineup details; each identified artist appears separately.</li>
                                            <li>A failed venue is reported without discarding the other venues’ results.</li>
                                        </ul>
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
                                        disabled={loading || concurrencyBusy}
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
                                     {activeTab === "venues" ? "Running venue calendars and reading event lineups..." : "Analyzing profiles and event data..."}
                                 </p>
                            </div>
                        </GlassCard>
                    )}

                    {!polling && venueStatuses.length > 0 && (
                        <section className="space-y-4 rounded-[32px] border border-white/5 bg-white/2 p-6">
                            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                                <h2 className="text-sm font-bold uppercase tracking-[0.25em] text-white/60">Venue scraper status</h2>
                                <span className="text-xs font-bold text-accent">{venueStatuses.filter((venue) => venue.status !== "failed").length}/{venueStatuses.length} completed</span>
                            </div>
                            <div className="grid gap-3 md:grid-cols-2">
                                {venueStatuses.map((venue) => (
                                    <div key={venue.venueId} className="rounded-2xl border border-white/5 bg-black/20 p-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="font-semibold text-white/80">{venue.venueName}</div>
                                                <div className="mt-1 text-xs text-white/40">{venue.artistCount} artist results · {venue.eventCount} events · {venue.eventPagesRead} details read · {(venue.durationMs / 1000).toFixed(1)}s</div>
                                            </div>
                                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest ${venue.status === "failed" ? "bg-red-500/10 text-red-300" : venue.status === "partial" ? "bg-amber-400/10 text-amber-200" : "bg-accent/10 text-accent"}`}>
                                                {venue.status}
                                            </span>
                                        </div>
                                        {venue.error && <p className="mt-3 text-xs text-red-200/80">{venue.error}</p>}
                                        {venue.warnings.map((warning) => <p key={warning} className="mt-2 text-xs text-amber-100/70">{warning}</p>)}
                                        {venue.sourceUrl && <a href={venue.sourceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest text-accent/60 hover:text-accent">Open calendar</a>}
                                    </div>
                                ))}
                            </div>
                        </section>
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
                                    {selectedIndices.size > 0 && (
                                        <span className="ml-3 text-white/60">· {selectedIndices.size} of {results.length} artists separated & selected</span>
                                    )}
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
                                                const rawName = String(item.artist || item.artistName || item.band || item.musician || item.ownerUsername || item.username || item.fullName || item.title || item.name || "");
                                                const artistName = cleanArtistName(rawName);
                                                const isUnknown = !artistName;
                                                const displayName = artistName || (item.shortCode ? `Post ${item.shortCode}` : "Unknown Artist");
                                                const handle = item.ownerUsername || item.username || item.handle || item.instagramHandle || "No Handle";
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
                                                                 <div className="font-bold text-white/90 text-[14px] tracking-tight group-hover:text-accent transition-colors flex items-center gap-2 flex-wrap">
                                                                     <span>{displayName}</span>
                                                                     {item.sourceType && (
                                                                         <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                                                                             {item.sourceType === "tagged"
                                                                                 ? (item.taggedCount && Number(item.taggedCount) > 1 ? `Tagged in ${item.taggedCount} posts` : "Tagged in Post")
                                                                                 : item.sourceType === "coauthor"
                                                                                 ? "Co-author"
                                                                                 : item.sourceType === "mention"
                                                                                 ? "Mentioned"
                                                                                 : "Post Author"}
                                                                         </span>
                                                                     )}
                                                                 </div>
                                                                 {(item.eventTitle || item.venueName || item.eventDate) && (
                                                                     <div className="text-[10px] text-white/40">{[item.eventTitle, item.venueName, formatEventDate(item.eventDate, item.eventDateOnly)].filter(Boolean).join(" · ")}</div>
                                                                 )}
                                                                 {handle !== "No Handle" && (
                                                                     <div className="text-[9px] font-bold font-sans text-white/20 uppercase tracking-[0.2em]">@{String(handle).replace(/^@/, '')}</div>
                                                                 )}
                                                             </div>
                                                         </td>
                                                         <td className="px-8 py-6 text-right">
                                                            {isUnknown ? (
                                                                <span className="text-xs font-bold text-white/10 uppercase tracking-widest">NO DATA</span>
                                                            ) : (
                                                                <div className="inline-flex items-center gap-4 justify-end">
                                                                    {handle !== "No Handle" && (
                                                                        <a 
                                                                            href={`https://www.instagram.com/${String(handle).replace(/^@/, '')}/`} 
                                                                            target="_blank" 
                                                                            rel="noreferrer" 
                                                                            className="inline-flex items-center gap-1.5 text-accent/60 hover:text-accent font-bold uppercase tracking-[0.2em] text-[9px] transition-all group/link"
                                                                        >
                                                                            Profile
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                                                                        </a>
                                                                    )}
                                                                    {url !== "-" && (
                                                                        <a 
                                                                            href={url} 
                                                                            target="_blank" 
                                                                            rel="noreferrer" 
                                                                            className="inline-flex items-center gap-1.5 text-white/40 hover:text-white font-bold uppercase tracking-[0.2em] text-[9px] transition-all group/link"
                                                                        >
                                                                            {item.eventTitle ? 'Event' : 'Post'}
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                                                                        </a>
                                                                    )}
                                                                </div>
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
