import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { routeServicesAdapter } from "@/lib/services/services-adapter";
import { createErrorResponse } from "@/lib/utils";
import { vehicleTypeEnum } from "@/lib/validation/schemas";
import { z } from "zod";

const servicesQuerySchema = z.object({
  origin_lat: z.coerce.number().min(-90).max(90).optional(),
  origin_lng: z.coerce.number().min(-180).max(180).optional(),
  origin_label: z.string().optional(),
  vehicle_type: vehicleTypeEnum.default("car"),
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
        `Destination with id '${id}' not found`,
        undefined,
        404,
      );
      return NextResponse.json(response, { status });
    }

    const { searchParams } = new URL(req.url);
    const parseResult = servicesQuerySchema.safeParse({
      origin_lat: searchParams.get("origin_lat") || undefined,
      origin_lng: searchParams.get("origin_lng") || undefined,
      origin_label: searchParams.get("origin_label") || undefined,
      vehicle_type: searchParams.get("vehicle_type") || "car",
    });

    const originLat =
      parseResult.success && parseResult.data.origin_lat !== undefined
        ? parseResult.data.origin_lat
        : 23.2599; // Default central anchor
    const originLng =
      parseResult.success && parseResult.data.origin_lng !== undefined
        ? parseResult.data.origin_lng
        : 77.4126;
    const originLabel =
      (parseResult.success && parseResult.data.origin_label) ||
      "Starting Point";
    const vehicleType =
      (parseResult.success && parseResult.data.vehicle_type) || "car";

    const services = await routeServicesAdapter.getRouteServices(
      destination.id,
      destination.latitude,
      destination.longitude,
      destination.name,
      originLat,
      originLng,
      originLabel,
      vehicleType as any,
    );

    return NextResponse.json({ data: services });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to retrieve route services",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
