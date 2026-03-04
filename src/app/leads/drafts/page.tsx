import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/GlassCard";
import { NeonButton } from "@/components/NeonButton";

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
        <div className="relative min-h-screen pb-20">
            <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-12">
                <header className="relative w-full">
                    <div className="flex flex-col gap-4 border-b border-white/10 pb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 group text-[10px] font-bold uppercase tracking-widest text-muted hover:text-accent transition-colors"
                        >
                            <span className="transition-transform group-hover:-translate-x-1">←</span> Command Center
                        </Link>
                        <div className="flex items-center justify-between">
                            <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                                Neural Queues
                            </h1>
                            <div className="text-right">
                                <span className="block text-[10px] font-mono text-muted uppercase tracking-widest">Buffer Status</span>
                                <span className="text-sm font-bold text-accent">{drafts.length} ACTIVE_DRAFTS</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="space-y-8">
                    {drafts.length === 0 ? (
                        <GlassCard className="py-20 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">No neural drafts detected in the buffer.</p>
                            <Link href="/leads/discovery" className="mt-6 inline-block">
                                <NeonButton variant="outline">Initiate Discovery</NeonButton>
                            </Link>
                        </GlassCard>
                    ) : (
                        <div className="grid gap-6">
                            {drafts.map((draft) => (
                                <GlassCard
                                    key={draft.id}
                                    className="group p-8! transition-all hover:border-accent/30"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-6 mb-8 border-b border-white/5 pb-6">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Target Entity</span>
                                            <h3 className="text-2xl font-bold tracking-tight text-foreground">
                                                <Link
                                                    href={`/leads/${draft.leadId}`}
                                                    className="hover:text-accent transition-colors underline decoration-accent/20 decoration-2 underline-offset-4"
                                                >
                                                    {draft.lead.artist.name}
                                                </Link>
                                            </h3>
                                            <p className="text-[10px] font-mono text-muted uppercase tracking-widest">
                                                LOC: {draft.lead.artist.city || "REMOTE_NODE"} // ZONE: {draft.lead.artist.country || "GLOBAL"}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted">Acoustic Mode</span>
                                            <div className="px-3 py-1 rounded-lg bg-accent/10 border border-accent/20 text-[10px] font-bold uppercase tracking-widest text-accent">
                                                MODE_{draft.tone || "GENERAL"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative group/body">
                                        <div className="absolute -inset-4 bg-white/2 rounded-2xl opacity-0 group-hover/body:opacity-100 transition-opacity" />
                                        <div className="relative font-serif italic text-lg leading-relaxed text-foreground/80 pl-4 border-l-2 border-accent/30">
                                            "{draft.body}"
                                        </div>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                                        <span className="text-[8px] font-mono text-muted uppercase tracking-widest">
                                            GEN_TS: {new Date(draft.createdAt).toLocaleTimeString()} // DRAFT_HASH_{draft.id.slice(-6).toUpperCase()}
                                        </span>
                                        <Link href={`/leads/${draft.leadId}`}>
                                            <NeonButton variant="cyan" size="sm">
                                                ACCESS_UPLINK →
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
