export const dynamic = "force-dynamic";
import React from "react";
import { prisma } from "@/lib/prisma";
import OperationsQueue from "@/components/OperationsQueue";
import { buildQueueItem, comparePriority, isNonLocalWithPastGigOnly, QueueItem } from "@/lib/priority-queue";

function toClientItem(item: QueueItem) {
  return {
    lead: {
      id: item.lead.id,
      status: item.lead.status,
      artist: {
        name: item.lead.artist.name,
        genre: item.lead.artist.genre ?? null,
      },
    },
    priority: {
      score: item.priority.score,
      components: item.priority.components,
      reasons: item.priority.reasons,
      topReasons: item.priority.topReasons,
      productionNeed: {
        expired: item.priority.productionNeed.expired,
        needsReview: item.priority.productionNeed.needsReview,
      },
    },
    dueReason: item.dueReason,
    eligibility: { cleanup: item.eligibility.cleanup },
  };
}

export default async function OperationsPage() {
  const now = new Date();
  const leads = await prisma.lead.findMany({
    where: { status: { notIn: ["WON", "LOST", "PAUSED"] } },
    include: {
      artist: {
        select: {
          name: true,
          genre: true,
          emails: true,
          instagramHandle: true,
          city: true,
          state: true,
          location: true,
          country: true,
          bio: true,
        },
      },
      activities: {
        select: { type: true, note: true },
      },
    },
  });

  // Non-local artists whose gigs in Austin have already been played are removed from the lead queue
  const activeLeads = leads.filter((lead: any) => !isNonLocalWithPastGigOnly(lead, now));

  const outreachItems = activeLeads.map((lead: any) => buildQueueItem(lead, "outreach", now));
  const followUpItems = activeLeads.map((lead: any) => buildQueueItem(lead, "follow-up", now));
  const outreach = {
    actionable: outreachItems.filter((item: QueueItem) => item.eligibility.actionable).sort(comparePriority),
    cleanup: outreachItems.filter((item: QueueItem) => !item.eligibility.actionable),
  };
  const followUps = {
    actionable: followUpItems.filter((item: QueueItem) => item.eligibility.actionable).sort(comparePriority),
    cleanup: followUpItems.filter((item: QueueItem) => !item.eligibility.actionable),
  };

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-8">
      <header>
        <h1 className="mb-2 text-4xl font-bold">Operations Queue</h1>
        <p className="text-white/60">The next best action, separated into first outreach and follow-ups.</p>
      </header>
      <OperationsQueue
        outreach={{
          actionable: outreach.actionable.map(toClientItem),
          cleanup: outreach.cleanup.map(toClientItem),
        }}
        followUps={{
          actionable: followUps.actionable.map(toClientItem),
          cleanup: followUps.cleanup.map(toClientItem),
        }}
        updatedAt={now.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
      />
    </main>
  );
}
