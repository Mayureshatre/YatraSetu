import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { createErrorResponse } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const region = searchParams.get("region");
    const query = searchParams.get("q")?.toLowerCase();

    let destinations = await db.getDestinations();

    if (category) {
      destinations = destinations.filter(
        (d) => d.category.toLowerCase() === category.toLowerCase(),
      );
    }
    if (region) {
      destinations = destinations.filter(
        (d) => d.region.toLowerCase() === region.toLowerCase(),
      );
    }
    if (query) {
      destinations = destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.category.toLowerCase().includes(query),
      );
    }

    return NextResponse.json({
      data: destinations,
      meta: { count: destinations.length },
    });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to retrieve destinations",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
