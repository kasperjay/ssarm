import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const EnrollBodySchema = z.object({
  leadId: z.string().min(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: sequenceId } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = EnrollBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { leadId } = parsed.data;

  // Verify sequence and lead both exist
  const [sequence, lead] = await Promise.all([
    prisma.followUpSequence.findUnique({ where: { id: sequenceId } }),
    prisma.lead.findUnique({
      where: { id: leadId },
      include: { artist: { select: { name: true } } },
    }),
  ]);

  if (!sequence) {
    return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
  }
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  const [enrollment] = await prisma.$transaction(async (tx) => {
    const enr = await tx.leadSequenceEnrollment.upsert({
      where: { leadId_sequenceId: { leadId, sequenceId } },
      create: {
        leadId,
        sequenceId,
        currentStep: 0,
        status: "ACTIVE",
        startedAt: new Date(),
      },
      update: {
        status: "ACTIVE",
        currentStep: 0,
        startedAt: new Date(),
        completedAt: null,
        pausedAt: null,
      },
    });

    await tx.activity.create({
      data: {
        leadId,
        type: "NOTE",
        note: `Enrolled in follow-up sequence "${sequence.name}" (${(sequence.steps as Array<{ dayOffset: number }>).length} steps).`,
        occurredAt: new Date(),
      },
    });

    return [enr];
  });

  return NextResponse.json({ ok: true, enrollment }, { status: 201 });
}
