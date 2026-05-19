import { NextResponse } from "next/server";
import { LeadIngestService, LeadPayload } from "@/lib/lead-ingest-service";

export async function POST(request: Request) {
  try {
    const payload: LeadPayload = await request.json();
    const service = new LeadIngestService();
    const result = await service.ingestLead(payload);
    
    return NextResponse.json({ 
      success: true, 
      ...result 
    }, { status: 200 });
  } catch (error: any) {
    console.error("[INGEST_ROUTE_ERROR]:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Internal Server Error" 
    }, { status: 500 });
  }
}
