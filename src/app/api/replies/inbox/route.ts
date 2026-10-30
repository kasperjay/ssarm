import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20", 10)));
  const skip = (page - 1) * limit;

  // Fetch all REPLY_RECEIVED activities, joining lead+artist and any triage
  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where: { type: "REPLY_RECEIVED" },
      orderBy: { occurredAt: "desc" },
      skip,
      take: limit,
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
    }),
    prisma.activity.count({ where: { type: "REPLY_RECEIVED" } }),
  ]);

  // Sort: untriaged first, then triaged (most recent first within each group)
  const untriaged = activities.filter(
    (a) => !a.replyTriage || !a.replyTriage.triaged
  );
  const triaged = activities.filter((a) => a.replyTriage?.triaged === true);

  return NextResponse.json({
    items: [...untriaged, ...triaged],
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      untriagedCount: untriaged.length,
    },
  });
}
