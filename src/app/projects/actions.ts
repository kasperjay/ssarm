"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProject(artistId: string, title?: string, customArtistName?: string) {
    let finalArtistId = artistId;

    if (artistId === "custom" && customArtistName) {
        const newArtist = await prisma.artist.create({
            data: { name: customArtistName }
        });
        finalArtistId = newArtist.id;
    }

    const project = await prisma.project.create({
        data: {
            artistId: finalArtistId,
            title: title || null, // Will use default logic in UI if null
        },
    });

    revalidatePath("/projects");
    return project;
}

export async function getProjects() {
    return await prisma.project.findMany({
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
    // Also revalidate portal if possible, but we don't have the token here easily 
    // without a separate query. For now, let's assume the management side 
    // update is enough or the portal token is unique and we can revalidate by tag if we had one.
}

