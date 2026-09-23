import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { weatherAdapter } from "@/lib/weather/weather-adapter";
import { createErrorResponse } from "@/lib/utils";
import { z } from "zod";

const weatherQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
});

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const destination = await db.getDestinationById(id);
    if (!destination) {
      const { response, status } = createErrorResponse(
        "NOT_FOUND",
        `Destination '${id}' not found`,
        undefined,
        404,
      );
      return NextResponse.json(response, { status });
    }

    const { searchParams } = new URL(req.url);
    const parseResult = weatherQuerySchema.safeParse({
      lat: searchParams.get("lat") || undefined,
      lng: searchParams.get("lng") || undefined,
    });

    const latitude =
      parseResult.success && parseResult.data.lat !== undefined
        ? parseResult.data.lat
        : destination.latitude;
    const longitude =
      parseResult.success && parseResult.data.lng !== undefined
        ? parseResult.data.lng
        : destination.longitude;

    const weather = await weatherAdapter.getFiveDayForecast(
      latitude,
      longitude,
      destination.name,
      destination.id,
    );

    return NextResponse.json({ data: weather });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to retrieve weather forecast",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
