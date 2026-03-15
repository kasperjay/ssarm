"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getRandomLead() {
  const count = await prisma.lead.count({
    where: {
      status: { in: ["NEW", "QUALIFIED", "FOLLOW_UP"] },
    },
  });

  if (count === 0) return null;

  const randomOffset = Math.floor(Math.random() * count);

  const lead = await prisma.lead.findFirst({
    where: {
      status: { in: ["NEW", "QUALIFIED", "FOLLOW_UP"] },
    },
    include: {
      artist: {
        include: {
          releases: {
            orderBy: [{ releaseDate: "desc" }, { createdAt: "desc" }],
            take: 1,
          },
          instagramPosts: {
            where: {
              imageUrl: { not: "" },
              OR: [
                { caption: { not: "" } },
                { url: { not: "" } },
              ],
            },
            orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
            take: 1,
          },
        },
      },
      messages: {
        where: { selected: false },
        orderBy: { createdAt: "desc" },
        take: 2,
      },
    },
    skip: randomOffset,
  });

  return lead;
}

export async function clearAllDrafts() {
  await prisma.messageDraft.deleteMany({
    where: { selected: false }
  });
  revalidatePath('/');
}

export async function refreshInbox() {
  revalidatePath('/');
}
