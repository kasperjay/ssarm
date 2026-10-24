export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const campaign = await prisma.outreachCampaign.findUnique({
      where: { id },
      include: {
        attempts: {
          orderBy: { sentAt: "desc" },
          include: {
            lead: {
              include: { artist: true }
            }
          }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch campaign" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const attempt = await prisma.outreachAttempt.create({
      data: {
        campaignId: id,
        leadId: body.leadId,
        channel: body.channel,
        sentAt: body.sentAt ? new Date(body.sentAt) : new Date(),
        notes: body.notes
      }
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create attempt" },
      { status: 500 }
    );
  }

}
