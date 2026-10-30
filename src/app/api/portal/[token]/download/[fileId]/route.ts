export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { join } from "path";
import { existsSync } from "fs";
import { stat, readFile } from "fs/promises";
import { getOrTranscodeAudio } from "@/lib/audio-transcode";

const UPLOADS_DIR = join(process.cwd(), "public", "uploads");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string; fileId: string }> }
) {
  const { token, fileId } = await params;
  const { searchParams } = new URL(request.url);
  const requestedFormat = (searchParams.get("format") || "wav").toLowerCase() as "wav" | "mp3";
  const requestedRate = searchParams.get("rate") === "48000" ? 48000 : 44100;

  if (!token || !fileId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { portalToken: token },
    include: {
      invoice: true,
      files: {
        where: { id: fileId },
      },
    },
  });

  if (!project || project.files.length === 0) {
    return NextResponse.json({ error: "File or project not found" }, { status: 404 });
  }

  const file = project.files[0];

  // Check Dual Gating for DELIVERABLES:
  if (file.type === "DELIVERABLE") {
    // Gate 1: Paywall enforcement
    if (project.paywallDeliverables && project.invoice) {
      const isPaid = Boolean(project.invoice.paidAt);
      if (!isPaid && project.invoice.totalCents > 0) {
        return NextResponse.json(
          {
            error: "Payment required. Final deliverables are locked behind an unpaid invoice.",
            paywallLocked: true,
            invoiceNumber: project.invoice.invoiceNumber,
          },
          { status: 403 }
        );
      }
    }

    // Gate 2: Mandatory Feedback / 0-5 Star Rating enforcement
    const isRated = project.rating !== null && project.rating >= 0 && project.rating <= 5;
    if (!isRated) {
      return NextResponse.json(
        {
          error: "Mandatory rating and feedback required before accessing final deliverables.",
          ratingLocked: true,
        },
        { status: 403 }
      );
    }
  }

  const sourcePath = join(UPLOADS_DIR, file.key);
  if (!existsSync(sourcePath)) {
    return NextResponse.json({ error: "Underlying file not found on disk" }, { status: 404 });
  }

  // Increment downloadCount asynchronously
  prisma.projectFile.update({
    where: { id: file.id },
    data: { downloadCount: { increment: 1 } },
  }).catch(() => {});

  try {
    let deliverPath = sourcePath;
    let deliverContentType = file.mimeType;
    let deliverFilename = file.name;

    // Transcode audio if it's an audio deliverable or working bounce
    if (file.mimeType.startsWith("audio/")) {
      const transcodeResult = await getOrTranscodeAudio(sourcePath, {
        format: requestedFormat,
        sampleRate: requestedRate,
      });
      deliverPath = transcodeResult.filePath;
      deliverContentType = transcodeResult.contentType;
      deliverFilename = transcodeResult.filename;
    }

    const fileStat = await stat(deliverPath);
    const fileBuffer = await readFile(deliverPath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": deliverContentType,
        "Content-Length": String(fileStat.size),
        "Content-Disposition": `attachment; filename="${encodeURIComponent(deliverFilename)}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error delivering audio download:", error);
    return NextResponse.json({ error: "Failed to stream download" }, { status: 500 });
  }
}
