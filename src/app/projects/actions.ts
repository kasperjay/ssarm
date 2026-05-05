"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  calculateInvoiceTotals,
  generateInvoiceNumber,
  parseMoneyToCents,
} from "@/lib/invoice";

export async function createProject(artistId: string, title?: string, customArtistName?: string) {
    const normalizedArtistId = artistId?.trim();
    const normalizedTitle = title?.trim();
    const normalizedCustomArtistName = customArtistName?.trim();

    if (!normalizedArtistId) {
        throw new Error("Please select an artist");
    }

    const project = await prisma.$transaction(async (tx) => {
        let finalArtistId = normalizedArtistId;

        if (normalizedArtistId === "custom") {
            if (!normalizedCustomArtistName) {
                throw new Error("Please enter a custom artist name");
            }

            const newArtist = await tx.artist.create({
                data: { name: normalizedCustomArtistName },
            });
            finalArtistId = newArtist.id;
        } else {
            const artist = await tx.artist.findUnique({ where: { id: normalizedArtistId } });
            if (!artist) {
                throw new Error("Selected artist not found");
            }
        }

        return tx.project.create({
            data: {
                artistId: finalArtistId,
                title: normalizedTitle || null,
                status: "ACTIVE",
            },
            select: { id: true },
        });
    });

    revalidatePath("/projects");
    return project;
}

export async function getProjects() {
    return await prisma.project.findMany({
        where: { status: "ACTIVE" },
        include: {
            artist: true,
            files: true,
            feedbacks: {
                where: { resolved: false },
            },
        },
        orderBy: { updatedAt: "desc" },
    });
}

export async function getProjectById(projectId: string) {
    return await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            artist: true,
            files: {
                orderBy: { createdAt: "desc" },
            },
            feedbacks: {
                orderBy: { createdAt: "desc" },
            },
            invoice: true,
        },
    });
}

export async function deleteProject(projectId: string) {
    await prisma.project.delete({
        where: { id: projectId },
    });
    revalidatePath("/projects");
}

export async function deleteFileFromProject(fileId: string, projectId: string) {
    // In a full implementation, you'd also delete the actual file from public/uploads here using fs/promises unlink
    await prisma.projectFile.delete({
        where: { id: fileId },
    });
    revalidatePath(`/projects/${projectId}`);
}

export async function resolveFeedback(feedbackId: string, projectId: string) {
    await prisma.projectFeedback.update({
        where: { id: feedbackId },
        data: { resolved: true },
    });
    revalidatePath(`/projects/${projectId}`);
}

export async function updateFileVisibility(fileId: string, isPublic: boolean, projectId: string) {
    await prisma.projectFile.update({
        where: { id: fileId },
        data: { isPublic },
    });
    revalidatePath(`/projects/${projectId}`);
}

export async function addProjectFeedback(projectId: string, content: string, fileId?: string, timestamp?: number) {
    await prisma.projectFeedback.create({
        data: {
            projectId,
            content,
            fileId: fileId || null,
            timestamp: timestamp || null,
        },
    });
    revalidatePath(`/projects/${projectId}`);
}

type InvoiceLineItemPayload = {
  description: string;
  quantity: string;
  unitPrice: string;
};

type UpsertInvoicePayload = {
  dueAt?: string;
  tax?: string;
  notes?: string;
  stripePaymentUrl?: string;
  lineItems: InvoiceLineItemPayload[];
};

export async function upsertProjectInvoice(projectId: string, payload: UpsertInvoicePayload) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) {
    throw new Error("Project not found");
  }

  const rawItems = payload.lineItems
    .map((item) => ({
      description: item.description,
      quantity: Number(item.quantity),
      unitPriceCents: parseMoneyToCents(item.unitPrice),
    }))
    .filter((item) => item.description.trim().length > 0);

  const taxCents = payload.tax ? parseMoneyToCents(payload.tax) : 0;
  const totals = calculateInvoiceTotals(rawItems, taxCents);

  const dueAt = payload.dueAt ? new Date(`${payload.dueAt}T00:00:00.000Z`) : null;
  if (dueAt && Number.isNaN(dueAt.getTime())) {
    throw new Error("Invalid due date");
  }

  const stripePaymentUrl = payload.stripePaymentUrl?.trim() || null;
  if (stripePaymentUrl) {
    try {
      const parsed = new URL(stripePaymentUrl);
      if (!parsed.hostname.includes("stripe.com")) {
        throw new Error("Stripe link must be a stripe.com URL");
      }
    } catch {
      throw new Error("Invalid Stripe payment link");
    }
  }

  const existing = await prisma.projectInvoice.findUnique({ where: { projectId } });

  await prisma.projectInvoice.upsert({
    where: { projectId },
    create: {
      projectId,
      invoiceNumber: generateInvoiceNumber(projectId),
      dueAt,
      currency: "USD",
      lineItems: totals.lineItems,
      subtotalCents: totals.subtotalCents,
      taxCents: totals.taxCents,
      totalCents: totals.totalCents,
      notes: payload.notes?.trim() || null,
      stripePaymentUrl,
    },
    update: {
      dueAt,
      lineItems: totals.lineItems,
      subtotalCents: totals.subtotalCents,
      taxCents: totals.taxCents,
      totalCents: totals.totalCents,
      notes: payload.notes?.trim() || null,
      stripePaymentUrl,
      invoiceNumber: existing?.invoiceNumber || generateInvoiceNumber(projectId),
    },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/portal/${project.portalToken}`);
}

