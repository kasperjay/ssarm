"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitFeedback(projectId: string, token: string, content: string, fileId?: string, timestamp?: number) {
  await prisma.projectFeedback.create({
    data: {
      projectId,
      content,
      fileId: fileId || null,
      timestamp: timestamp || null,
    },
  });

  revalidatePath(`/portal/${token}`);
  revalidatePath(`/projects/${projectId}`);
}

export async function submitRating(projectId: string, token: string, rating: number, review: string) {
  await prisma.project.update({
    where: { id: projectId },
    data: {
      rating,
      review,
      status: "COMPLETED",
    },
  });

  revalidatePath(`/portal/${token}`);
  revalidatePath(`/projects/${projectId}`);
}
