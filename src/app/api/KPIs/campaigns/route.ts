export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const campaigns = await prisma.outreachCampaign.findMany({
      include: {
        _count: {
          select: { attempts: true }
        },
        attempts: {
          where: { responseType: { not: null } }
        }
      },
      orderBy: { startDate: "desc" }
    });

    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch campaigns" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, channel, targetCount, startDate, endDate, status } = body;

    if (!name || !type || !channel || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const campaign = await prisma.outreachCampaign.create({
      data: {
        name,
        type,
        channel,
        targetCount: parseInt(targetCount.toString()),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status || "ACTIVE"
      }
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: "Failed to create campaign" },
      { status: 500 }
    );
  }
}