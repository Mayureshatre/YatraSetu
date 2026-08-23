import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { createErrorResponse } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  segmentData: { params: Promise<{ id: string }> },
) {
  try {
    const params = await segmentData.params;
    const id = params.id;

    const destinations = await db.getDestinations();
    const destination = destinations.find((d) => d.id === id);

    if (!destination) {
      return NextResponse.json(
        { error: { message: `Destination not found for id: ${id}` } },
        { status: 404 },
      );
    }

    return NextResponse.json({
      data: destination,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { message: error.message || "Server error" } },
      { status: 500 },
    );
  }
}
