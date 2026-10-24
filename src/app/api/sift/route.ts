export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { siftItems } from "@/lib/sift-core";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !Array.isArray(body.items)) {
      return NextResponse.json({ error: "items array is required" }, { status: 400 });
    }

    const response = await siftItems(body.items);
    return NextResponse.json(response);
  } catch (error) {
    console.error("/api/sift error:", error);
    return NextResponse.json({ error: "Failed to sift items." }, { status: 500 });
  }
}
