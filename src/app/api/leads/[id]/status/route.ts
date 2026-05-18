import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { LeadStatus } from "local-prisma-client";

export async function POST(req: Request) {
  const url = new URL(req.url);
  console.log("URL pathname:", url.pathname);
  const segments = url.pathname.split("/");
  console.log("Segments:", segments);
  const id = segments[3]; // ['','api','leads','{id}','status']

  const formData = await req.formData();
  const status = formData.get("status") as string;
  console.log("Form data - id:", id, "status:", status);

  if (!id || !status) {
    return NextResponse.json({ error: "Missing leadId or status", receivedId: id, receivedStatus: status }, { status: 400 });
  }

  try {
    const lead = await prisma.lead.update({
      where: { id },
      data: { status: status as LeadStatus },
    });

    // Create activity record
    await prisma.activity.create({
      data: {
        leadId: id,
        type: "STATUS_CHANGE",
        note: `Status updated to ${status}`,
      },
    });

    // Revalidate to refresh UI
    revalidatePath(`/leads/${id}`);
    revalidatePath("/");
    revalidatePath("/leads");

    return NextResponse.json({ success: true, status: lead.status });
  } catch (error: any) {
    console.error("Status update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}