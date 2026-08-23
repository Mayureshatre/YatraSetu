import { NextRequest, NextResponse } from 'next/server';
import { mapsAdapter } from '@/lib/maps/maps-adapter';
import { db } from '@/lib/db/supabase';
import { vehicleTypeEnum } from '@/lib/validation/schemas';
import { createErrorResponse } from '@/lib/utils';
import { VehicleType } from '@/types';
import { z } from 'zod';

const singleRouteQuerySchema = z.object({
  origin_lat: z.coerce.number().min(-90).max(90),
  origin_lng: z.coerce.number().min(-180).max(180),
  dest_lat: z.coerce.number().min(-90).max(90),
  dest_lng: z.coerce.number().min(-180).max(180),
  vehicle_type: vehicleTypeEnum.default('car'),
});

const batchRouteSchema = z.object({
  origin: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    label: z.string().optional(),
  }),
  destinationIds: z.array(z.string()).optional(),
  destinations: z.array(z.object({
    id: z.string(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })).optional(),
  travelMode: z.string().optional(),
  vehicle_type: vehicleTypeEnum.optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parseResult = singleRouteQuerySchema.safeParse({
      origin_lat: searchParams.get('origin_lat'),
      origin_lng: searchParams.get('origin_lng'),
      dest_lat: searchParams.get('dest_lat'),
      dest_lng: searchParams.get('dest_lng'),
      vehicle_type: searchParams.get('vehicle_type') || 'car',
    });

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid coordinates or vehicle type in route query',
        parseResult.error.flatten(),
        400
      );
      return NextResponse.json(response, { status });
    }

    const { origin_lat, origin_lng, dest_lat, dest_lng, vehicle_type } = parseResult.data;
    const route = await mapsAdapter.calculateRoute(
      origin_lat,
      origin_lng,
      dest_lat,
      dest_lng,
      vehicle_type
    );

    return NextResponse.json({ data: route });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to calculate vehicle route',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = batchRouteSchema.safeParse(body);

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid batch route request payload',
        parseResult.error.flatten(),
        400
      );
      return NextResponse.json(response, { status });
    }

    const { origin, destinationIds, destinations: directDestinations } = parseResult.data;
    const vehicleType: VehicleType = (
      parseResult.data.vehicle_type ||
      (parseResult.data.travelMode?.toLowerCase() === 'two_wheeler' ? 'bike' : 'car')
    ) as VehicleType;

    let targetDestinations: Array<{ id: string; latitude: number; longitude: number }> = [];

    if (directDestinations && directDestinations.length > 0) {
      targetDestinations = directDestinations;
    } else if (destinationIds && destinationIds.length > 0) {
      const allDests = await db.getDestinations();
      const destMap = new Map(allDests.map(d => [d.id, d]));
      for (const id of destinationIds) {
        const dest = destMap.get(id);
        if (dest) {
          targetDestinations.push({ id: dest.id, latitude: dest.latitude, longitude: dest.longitude });
        }
      }
    } else {
      const allDests = await db.getDestinations();
      targetDestinations = allDests.map(d => ({ id: d.id, latitude: d.latitude, longitude: d.longitude }));
    }

    const routeResults = await Promise.all(
      targetDestinations.map(async (target) => {
        const route = await mapsAdapter.calculateRoute(
          origin.latitude,
          origin.longitude,
          target.latitude,
          target.longitude,
          vehicleType
        );

        return {
          destinationId: target.id,
          distanceMeters: route.distance_m,
          distanceKm: route.distance_km,
          durationSeconds: route.duration_s,
          durationFormatted: route.duration_formatted,
          durationMinutes: Math.round(route.duration_s / 60),
          status: 'OK',
          source: route.source,
          routeSummary: route.route_summary,
        };
      })
    );

    return NextResponse.json({
      data: routeResults,
      meta: {
        origin,
        vehicleType,
        count: routeResults.length,
      },
    });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to calculate batch routes',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}
