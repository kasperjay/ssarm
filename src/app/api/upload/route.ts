import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const projectId = formData.get("projectId") as String | null;
        const type = formData.get("type") as "WORKING" | "DELIVERABLE" | null;

        if (!file || !projectId || !type) {
            return NextResponse.json(
                { error: "Missing required fields (file, projectId, type)" },
                { status: 400 }
            );
        }

        // Ensure the uploads directory exists
        const uploadsDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadsDir, { recursive: true });

        const buffer = Buffer.from(await file.arrayBuffer());
        const uniqueKey = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = join(uploadsDir, uniqueKey);

        // Write file to public/uploads
        await writeFile(filePath, buffer);

        const publicUrl = `/uploads/${uniqueKey}`;

        // Note: The database save will fail until the prisma migration is run.
        // Saving file metadata via Prisma Client
        const newFile = await prisma.projectFile.create({
            data: {
                projectId: projectId as string,
                name: file.name,
                url: publicUrl,
                key: uniqueKey,
                size: file.size,
                mimeType: file.type,
                type: type,
            },
        });

        return NextResponse.json({ success: true, file: newFile });
    } catch (error) {
        console.error("Error saving file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
