export const dynamic = "force-dynamic";

import React from "react";
import { prisma } from "@/lib/prisma";
import { ReplyTriageCard, type ReplyItem } from "@/components/ReplyTriageCard";
import Link from "next/link";

async function getReplies(): Promise<{
  untriaged: ReplyItem[];
  triaged: ReplyItem[];
  total: number;
}> {
  const activities = await prisma.activity.findMany({
    where: { type: "REPLY_RECEIVED" },
    orderBy: { occurredAt: "desc" },
    take: 100,
    include: {
      lead: {
        select: {
          id: true,
          status: true,
          nextActionAt: true,
          artist: {
            select: {
              name: true,
              instagramHandle: true,
              instagramProfileImageUrl: true,
            },
          },
        },
      },
      replyTriage: true,
    },
  });

  const serialize = (a: (typeof activities)[number]): ReplyItem => ({
    id: a.id,
    note: a.note,
    occurredAt: a.occurredAt.toISOString(),
    lead: {
      id: a.lead.id,
      status: a.lead.status as ReplyItem["lead"]["status"],
      nextActionAt: a.lead.nextActionAt?.toISOString() ?? null,
      artist: {
        name: a.lead.artist.name,
        instagramHandle: a.lead.artist.instagramHandle,
        instagramProfileImageUrl:
          a.lead.artist.instagramProfileImageUrl ?? null,
      },
    },
    replyTriage: a.replyTriage
      ? {
          id: a.replyTriage.id,
          activityId: a.replyTriage.activityId,
          intent: a.replyTriage.intent as ReplyItem["replyTriage"] extends null
            ? never
            : ReplyItem["replyTriage"] extends { intent: infer I }
              ? I
              : never,
          note: a.replyTriage.note,
          triaged: a.replyTriage.triaged,
          triagedAt: a.replyTriage.triagedAt?.toISOString() ?? null,
        }
      : null,
  });

  const untriaged = activities
    .filter((a) => !a.replyTriage || !a.replyTriage.triaged)
    .map(serialize);

  const triaged = activities
    .filter((a) => a.replyTriage?.triaged === true)
    .map(serialize);

  return { untriaged, triaged, total: activities.length };
}

export default async function RepliesPage() {
  const { untriaged, triaged, total } = await getReplies();

  return (
    <main className="mx-auto max-w-3xl space-y-8 p-8">
      {/* Header */}
      <header className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.35em] text-white/30 mb-1">
            Reply Inbox
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Replies
          </h1>
          <p className="mt-1 text-sm text-white/40">
            Classify artist replies to advance leads through the pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {untriaged.length > 0 && (
            <span className="rounded-full bg-[var(--accent)] px-3 py-1 text-xs font-bold text-black tabular-nums">
              {untriaged.length} pending
            </span>
          )}
          <Link
            href="/operations"
            className="rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/60 hover:text-white hover:border-white/20 transition-colors"
          >
            Operations
          </Link>
        </div>
      </header>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Total Replies",
            value: total,
            color: "text-white",
          },
          {
            label: "Needs Triage",
            value: untriaged.length,
            color: untriaged.length > 0 ? "text-amber-400" : "text-white/40",
          },
          {
            label: "Triaged",
            value: triaged.length,
            color: "text-emerald-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/8 bg-white/3 px-4 py-3"
          >
            <div className={`text-2xl font-bold tabular-nums ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/25 mt-0.5">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Untriaged section */}
      {untriaged.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white/40">
              Needs Triage ({untriaged.length})
            </h2>
          </div>
          <div className="space-y-3">
            {untriaged.map((item) => (
              <ReplyTriageCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-2xl border border-white/8 bg-white/3 px-6 py-10 text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-emerald-400/10 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-400"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <p className="text-sm font-bold text-white/40">
            All replies triaged
          </p>
          <p className="text-xs text-white/20 mt-1">
            New replies from IG DMs will appear here.
          </p>
        </div>
      )}

      {/* Triaged section */}
      {triaged.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-white/25">
            Triaged ({triaged.length})
          </h2>
          <div className="space-y-2">
            {triaged.map((item) => (
              <ReplyTriageCard
                key={item.id}
                item={item}
                initialTriaged={true}
              />
            ))}
          </div>
        </section>
      )}

      {total === 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/3 px-6 py-16 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white/20"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-white/30">No replies yet</p>
          <p className="text-xs text-white/15 mt-1 max-w-xs mx-auto">
            When artists reply to your Instagram DMs, they&apos;ll show up here
            for triage.
          </p>
        </div>
      )}
    </main>
  );
}
