import { NextRequest, NextResponse } from "next/server";
import { aiAdapter } from "@/lib/ai/ai-adapter";
import { createErrorResponse } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicle, destination } = body;

    if (!vehicle || !destination) {
      const { response, status } = createErrorResponse(
        "VALIDATION_ERROR",
        "Vehicle profile and destination terrain are required",
        undefined,
        400,
      );
      return NextResponse.json(response, { status });
    }

    const result = await aiAdapter.evaluateVehicleCompatibility({
      vehicle,
      destination,
    });

    return NextResponse.json({
      data: result.report,
      source: result.source,
    });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to compute vehicle compatibility",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
