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
