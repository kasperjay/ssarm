"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitFeedback(
  projectId: string,
  token: string,
  content: string,
  fileId?: string,
  timestamp?: number,
  authorRole: "ARTIST" | "ENGINEER" = "ARTIST",
  authorName?: string
) {
  if (!content || !content.trim()) {
    throw new Error("Feedback content cannot be empty");
  }

  await prisma.projectFeedback.create({
    data: {
      projectId,
      content: content.trim(),
      fileId: fileId || null,
      timestamp: typeof timestamp === "number" ? timestamp : null,
      authorRole,
      authorName: authorName?.trim() || null,
    },
  });

  revalidatePath(`/portal/${token}`);
  revalidatePath(`/projects/${projectId}`);
}

export async function approveMixForMastering(
  projectId: string,
  token: string,
  signerName: string,
  notes?: string
) {
  const normalizedSigner = signerName?.trim();
  if (!normalizedSigner) {
    throw new Error("Please enter your name to confirm mix approval");
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.project.update({
      where: { id: projectId },
      data: {
        mixApprovedForMastering: true,
        mixApprovedAt: now,
        mixApprovedBy: normalizedSigner,
        mixApprovalNotes: notes?.trim() || null,
        workflowStage: "MIX_APPROVED",
      },
    }),
    prisma.projectActivityLog.create({
      data: {
        projectId,
        actorRole: "ARTIST",
        actorName: normalizedSigner,
        action: "MIX_APPROVED_FOR_MASTERING",
        metadata: {
          approvedAt: now.toISOString(),
          signer: normalizedSigner,
          notes: notes?.trim() || null,
        },
      },
    }),
  ]);

  revalidatePath(`/portal/${token}`);
  revalidatePath(`/projects/${projectId}`);
}

export async function submitRating(
  projectId: string,
  token: string,
  rating: number,
  review?: string
) {
  if (typeof rating !== "number" || rating < 0 || rating > 5) {
    throw new Error("Rating must be a score between 0 and 5 stars");
  }

  const now = new Date();

  await prisma.project.update({
    where: { id: projectId },
    data: {
      rating: Math.round(rating),
      review: review?.trim() || null,
      ratingSubmittedAt: now,
      status: "COMPLETED",
      workflowStage: "COMPLETED",
    },
  });

  await prisma.projectActivityLog.create({
    data: {
      projectId,
      actorRole: "ARTIST",
      action: "RATING_SUBMITTED",
      metadata: {
        rating: Math.round(rating),
        review: review?.trim() || null,
        submittedAt: now.toISOString(),
      },
    },
  });

  revalidatePath(`/portal/${token}`);
  revalidatePath(`/projects/${projectId}`);
}

export async function submitPaymentNotice(
  projectId: string,
  token: string,
  paymentMethod: "STRIPE" | "APPLE_PAY" | "PAYPAL" | "VENMO" | "CHIME" | "CASH_APP" | "WIRE" | "OTHER",
  reference?: string,
  paymentNotes?: string
) {
  const invoice = await prisma.projectInvoice.findUnique({
    where: { projectId },
  });

  if (!invoice) {
    throw new Error("Invoice not found for this project");
  }

  await prisma.projectInvoice.update({
    where: { id: invoice.id },
    data: {
      selectedPaymentMethod: paymentMethod,
      paymentReference: reference?.trim() || null,
      paymentNotes: paymentNotes?.trim() || null,
    },
  });

  await prisma.projectActivityLog.create({
    data: {
      projectId,
      actorRole: "ARTIST",
      action: "PAYMENT_INITIATED",
      metadata: {
        method: paymentMethod,
        reference: reference?.trim() || null,
        notes: paymentNotes?.trim() || null,
      },
    },
  });

  revalidatePath(`/portal/${token}`);
  revalidatePath(`/portal/${token}/invoice`);
  revalidatePath(`/portal/${token}/billing`);
  revalidatePath(`/projects/${projectId}`);
}
