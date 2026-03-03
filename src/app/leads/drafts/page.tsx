import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(35,211,255,0.18),transparent_55%),radial-gradient(circle_at_20%_20%,rgba(139,92,246,0.2),transparent_45%),linear-gradient(180deg,rgba(5,7,10,0.95),rgba(5,7,10,1))]">
            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-10">
                <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-(--surface) p-8 shadow-[0_30px_80px_-60px_rgba(35,211,255,0.35)]">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <Link href="/" className="text-xs uppercase tracking-[0.35em] text-(--muted) hover:text-(--accent-strong) transition">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="mt-2 font-display text-4xl leading-tight text-foreground md:text-5xl">
                                Queued Drafts
                            </h1>
                        </div>
                    </div>
                </header>

                <main>
                    <section className="rounded-3xl border border-white/10 bg-(--surface-strong) p-6 shadow-[0_40px_90px_-70px_rgba(139,92,246,0.35)]">
                        <div className="flex flex-col gap-4">
                            {drafts.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-white/20 bg-(--surface) p-6 text-sm text-(--muted)">
                                    No drafts currently queued. Let the AI generate some!
                                </div>
                            ) : (
                                drafts.map((draft) => (
                                    <article
                                        key={draft.id}
                                        className="rounded-2xl border border-white/10 bg-(--surface) p-6 transition hover:shadow-[0_20px_50px_-30px_rgba(35,211,255,0.35)]"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-white/10 pb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    <Link
                                                        href={`/leads/${draft.leadId}#drafts`}
                                                        className="transition hover:text-(--accent-strong)"
                                                    >
                                                        For: {draft.lead.artist.name}
                                                    </Link>
                                                </h3>
                                                <p className="text-sm text-(--muted)">
                                                    {draft.lead.artist.city || "Unknown Location"}
                                                </p>
                                            </div>
                                            <span className="rounded-full border border-white/10 bg-(--surface-strong) px-3 py-1 text-xs tracking-wide text-(--muted)">
                                                Tone: {draft.tone || "General"}
                                            </span>
                                        </div>
                                        <div className="whitespace-pre-wrap text-sm text-(--muted) bg-black/30 p-4 rounded-xl border border-white/5">
                                            {draft.body}
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <Link
                                                href={`/leads/${draft.leadId}`}
                                                className="rounded-full bg-(--accent) px-4 py-2 text-xs font-semibold text-white transition hover:bg-(--accent-strong)"
                                            >
                                                Review & Send →
                                            </Link>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
