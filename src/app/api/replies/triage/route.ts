import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import type { LeadStatus, ReplyIntent } from "local-prisma-client";

const INTENT_STATUS_MAP: Record<ReplyIntent, LeadStatus> = {
  INTERESTED: "FOLLOW_UP",
  NOT_NOW: "PAUSED",
  PRICING_REQUEST: "FOLLOW_UP",
  WRONG_CONTACT: "LOST",
  UNSUBSCRIBED: "LOST",
  BOOKED: "WON",
  UNCLEAR: "FOLLOW_UP",
};

const BodySchema = z.object({
  activityId: z.string().min(1),
  leadId: z.string().min(1),
  intent: z.enum([
    "INTERESTED",
    "NOT_NOW",
    "PRICING_REQUEST",
    "WRONG_CONTACT",
    "UNSUBSCRIBED",
    "BOOKED",
    "UNCLEAR",
  ]),
  note: z.string().optional(),
  nextActionAt: z.string().datetime().optional(),
  newStatus: z
    .enum(["NEW", "QUALIFIED", "CONTACTED", "FOLLOW_UP", "WON", "LOST", "PAUSED"])
    .optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { activityId, leadId, intent, note, nextActionAt, newStatus } = parsed.data;

  // Verify activity exists and belongs to the lead
  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    select: { id: true, leadId: true, type: true },
  });

  if (!activity || activity.leadId !== leadId) {
    return NextResponse.json({ error: "Activity not found for this lead" }, { status: 404 });
  }

  if (activity.type !== "REPLY_RECEIVED") {
    return NextResponse.json(
      { error: "Only REPLY_RECEIVED activities can be triaged" },
      { status: 400 }
    );
  }

  // Determine new lead status
  const targetStatus: LeadStatus = newStatus ?? INTENT_STATUS_MAP[intent as ReplyIntent];

  // Derive nextActionAt for intent types that warrant scheduling
  const resolvedNextAction = nextActionAt
    ? new Date(nextActionAt)
    : intent === "NOT_NOW"
      ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      : undefined;

  const [triage, updatedLead] = await prisma.$transaction(async (tx) => {
    // Upsert triage record (idempotent re-triage)
    const existingTriage = await tx.replyTriage.findUnique({
      where: { activityId },
    });

    const triageRecord = existingTriage
      ? await tx.replyTriage.update({
          where: { activityId },
          data: {
            intent: intent as ReplyIntent,
            note: note ?? null,
            triaged: true,
            triagedAt: new Date(),
          },
        })
      : await tx.replyTriage.create({
          data: {
            activityId,
            leadId,
            intent: intent as ReplyIntent,
            note: note ?? null,
            triaged: true,
            triagedAt: new Date(),
          },
        });

    // Update lead status and next action
    const lead = await tx.lead.update({
      where: { id: leadId },
      data: {
        status: targetStatus,
        ...(resolvedNextAction ? { nextActionAt: resolvedNextAction } : {}),
      },
      include: {
        artist: { select: { name: true, instagramHandle: true } },
      },
    });

    // Log the status change as an Activity
    const intentLabel = intent.replace(/_/g, " ").toLowerCase();
    await tx.activity.create({
      data: {
        leadId,
        type: "STATUS_CHANGE",
        note: `Reply triaged as "${intentLabel}" → status updated to ${targetStatus}${note ? `. Note: ${note}` : ""}`,
        occurredAt: new Date(),
      },
    });

    return [triageRecord, lead];
  });

  return NextResponse.json({ ok: true, triage, lead: updatedLead });
}
