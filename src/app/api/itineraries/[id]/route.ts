import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { createErrorResponse } from "@/lib/utils";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const itinerary = await db.getItineraryById(id);
    if (!itinerary) {
      const { response, status } = createErrorResponse(
        "NOT_FOUND",
        `Itinerary with id '${id}' not found`,
        undefined,
        404,
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({ data: itinerary });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to retrieve itinerary",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
