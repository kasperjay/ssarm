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
  templateId?: string;
  dueAt?: string;
  tax?: string;
  notes?: string;
  stripePaymentUrl?: string;
  venmoHandle?: string;
  paypalUrl?: string;
  chimeTag?: string;
  lineItems: InvoiceLineItemPayload[];
};

export async function toggleDeliverablePaywall(projectId: string, paywallDeliverables: boolean) {
  const project = await prisma.project.update({
    where: { id: projectId },
    data: { paywallDeliverables },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/portal/${project.portalToken}`);
  return project;
}

export async function markInvoicePaid(
  projectId: string,
  paymentMethod: "STRIPE" | "APPLE_PAY" | "PAYPAL" | "VENMO" | "CHIME" | "CASH_APP" | "WIRE" | "OTHER" = "STRIPE",
  reference?: string
) {
  const now = new Date();

  const [invoice, project] = await prisma.$transaction(async (tx) => {
    const inv = await tx.projectInvoice.update({
      where: { projectId },
      data: {
        paidAt: now,
        status: "PAID",
        selectedPaymentMethod: paymentMethod,
        paymentReference: reference?.trim() || "Manual studio confirmation",
      },
    });

    const proj = await tx.project.findUnique({
      where: { id: projectId },
      select: { portalToken: true },
    });

    await tx.projectActivityLog.create({
      data: {
        projectId,
        actorRole: "ENGINEER",
        action: "INVOICE_MARKED_PAID",
        metadata: {
          invoiceNumber: inv.invoiceNumber,
          amountCents: inv.totalCents,
          method: paymentMethod,
          paidAt: now.toISOString(),
        },
      },
    });

    return [inv, proj];
  });

  revalidatePath(`/projects/${projectId}`);
  if (project?.portalToken) {
    revalidatePath(`/portal/${project.portalToken}`);
    revalidatePath(`/portal/${project.portalToken}/invoice`);
    revalidatePath(`/portal/${project.portalToken}/billing`);
  }

  return invoice;
}

export async function updateProjectWorkflowStage(
  projectId: string,
  workflowStage: "IN_MIXING" | "MIX_APPROVED" | "IN_MASTERING" | "MASTERED" | "COMPLETED"
) {
  const project = await prisma.project.update({
    where: { id: projectId },
    data: { workflowStage },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/portal/${project.portalToken}`);
  return project;
}

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

  let resolvedTemplateId: string | null = null;
  const rawTemplate = payload.templateId?.trim();
  if (rawTemplate) {
    const matched = await prisma.invoiceTemplate.findFirst({
      where: {
        OR: [{ id: rawTemplate }, { code: rawTemplate }],
      },
    });
    resolvedTemplateId = matched?.id || null;
  }

  await prisma.projectInvoice.upsert({
    where: { projectId },
    create: {
      projectId,
      invoiceNumber: generateInvoiceNumber(projectId),
      templateId: resolvedTemplateId,
      dueAt,
      currency: "USD",
      lineItems: totals.lineItems,
      subtotalCents: totals.subtotalCents,
      taxCents: totals.taxCents,
      totalCents: totals.totalCents,
      notes: payload.notes?.trim() || null,
      stripePaymentUrl,
      venmoHandle: payload.venmoHandle?.trim() || null,
      paypalUrl: payload.paypalUrl?.trim() || null,
      chimeTag: payload.chimeTag?.trim() || null,
    },
    update: {
      dueAt,
      templateId: resolvedTemplateId !== null ? resolvedTemplateId : (existing?.templateId || null),
      lineItems: totals.lineItems,
      subtotalCents: totals.subtotalCents,
      taxCents: totals.taxCents,
      totalCents: totals.totalCents,
      notes: payload.notes?.trim() || null,
      stripePaymentUrl,
      venmoHandle: payload.venmoHandle?.trim() || null,
      paypalUrl: payload.paypalUrl?.trim() || null,
      chimeTag: payload.chimeTag?.trim() || null,
      invoiceNumber: existing?.invoiceNumber || generateInvoiceNumber(projectId),
    },
  });

  revalidatePath(`/projects/${projectId}`);
  revalidatePath(`/portal/${project.portalToken}`);
  revalidatePath(`/portal/${project.portalToken}/invoice`);
  revalidatePath(`/portal/${project.portalToken}/billing`);
}

