import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";
import { formatRelativeDate } from "@/lib/utils";

export default async function DraftsPage() {
    const drafts = await prisma.messageDraft.findMany({
        where: { selected: false },
        include: {
            lead: {
                include: {
                    artist: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="relative min-h-screen bg-transparent">
            
            <div className="mx-auto max-w-7xl space-y-12 px-6 py-24">
                <header className="flex flex-col gap-8 relative">
                    <div className="absolute -top-24 -right-24 h-96 w-96 bg-accent-warm/10 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="flex flex-wrap items-end justify-between gap-8 pb-10 border-b border-white/5 relative z-10">
                        <div className="space-y-4">
                            <Link href="/" className="inline-flex items-center gap-2 group text-xs font-bold uppercase tracking-[0.3em] text-white/30 hover:text-accent transition-all">
                                <span className="transition-transform group-hover:-translate-x-1 text-lg leading-none">←</span> 
                                Dashboard
                            </Link>
                            <h1 className="font-display text-5xl font-bold tracking-tighter md:text-6xl lg:text-7xl">
                                Message <span className="premium-gradient-text-warm italic">Drafts</span>
                            </h1>
                            <p className="text-white/40 text-sm max-w-lg font-medium leading-relaxed">
                                Review and refine suggested outreach messages for identified artists before sending.
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 bg-white/2 backdrop-blur-sm border border-white/5 p-6 rounded-[32px]">
                            <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Pending Review</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-sans font-extrabold text-accent-warm">{drafts.length}</span>
                                <span className="text-xs font-bold text-white/10 uppercase tracking-widest">Drafts</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="space-y-10 relative z-10">
                    {drafts.length === 0 ? (
                        <GlassCard className="py-24 text-center p-12!">
                            <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/2 border border-dashed border-white/10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/10"><path d="m21 16-4-4-4 4"/><path d="M17 12V3"/><path d="M10 3 6 7l4 4"/><path d="M6 3v9"/><path d="M4 14.7a10 10 0 1 0 15.6 0"/></svg>
                            </div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30 max-w-sm mx-auto leading-relaxed">
                                No message drafts currently available. Create new searches to generate suggestions.
                            </p>
                            <div className="mt-10">
                                <Link href="/leads/discover">
                                    <NeonButton variant="purple" size="lg" className="px-10! text-xs! tracking-[0.2em]! font-bold!">
                                        START SEARCH
                                    </NeonButton>
                                </Link>
                            </div>
                        </GlassCard>
                    ) : (
                        <div className="grid gap-8">
                            {drafts.map((draft) => (
                                <GlassCard
                                    key={draft.id}
                                    className="group p-10! transition-all hover:bg-white/4 border-white/5 hover:border-accent-warm/30 shadow-2xl"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-8 mb-10 border-b border-white/5 pb-10">
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-1.5 w-1.5 rounded-full bg-accent-warm" />
                                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Recipient</span>
                                            </div>
                                            <h3 className="text-3xl font-bold tracking-tighter">
                                                <Link
                                                    href={`/leads/${draft.leadId}`}
                                                    className="premium-gradient-text-warm hover:brightness-125 transition-all decoration-accent-warm/20 underline underline-offset-8 decoration-1"
                                                >
                                                    {draft.lead.artist.name}
                                                </Link>
                                            </h3>
                                            <div className="flex items-center gap-4 text-xs font-bold text-white/20 uppercase tracking-[0.2em]">
                                                <span>Location: {draft.lead.artist.city || "Remote"}</span>
                                                <span className="h-1 w-1 rounded-full bg-white/10" />
                                                <span>Region: {draft.lead.artist.country || "Global"}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3">
                                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">Message Tone</span>
                                            <div className="px-4 py-2 rounded-xl bg-accent-warm/5 border border-accent-warm/20 text-xs font-bold uppercase tracking-[0.2em] text-accent-warm">
                                                {draft.tone || "General"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative group/body p-8 rounded-[32px] bg-white/2 border border-white/5 hover:border-white/10 transition-all overflow-hidden mb-10">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-accent-warm/40" />
                                        <p className="relative font-serif italic text-xl leading-relaxed text-white/60 pl-4">
                                            &quot;{draft.body}&quot;
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Created At</span>
                                                <span className="text-xs font-sans font-bold text-white/40 uppercase tracking-widest">
                                                    {formatRelativeDate(draft.createdAt)}
                                                </span>
                                            </div>
                                            <div className="h-8 w-px bg-white/5" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Draft ID</span>
                                                <span className="text-xs font-sans font-bold text-white/40 uppercase tracking-widest">
                                                    #{draft.id.slice(-8).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <Link href={`/leads/${draft.leadId}`}>
                                            <NeonButton variant="pink" size="lg" className="text-xs! tracking-[0.2em]! font-bold! px-10!">
                                                View Profile →
                                            </NeonButton>
                                        </Link>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
