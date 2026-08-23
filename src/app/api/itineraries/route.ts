import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';
import { itineraryRequestSchema } from '@/lib/validation/schemas';
import { aiAdapter } from '@/lib/ai/ai-adapter';
import { createErrorResponse } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = itineraryRequestSchema.safeParse(body);

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid itinerary request data',
        parseResult.error.flatten(),
        400
      );

      return NextResponse.json(response, { status });
    }

    const destination = await db.getDestinationById(
      parseResult.data.destination_id
    );

    if (!destination) {
      const { response, status } = createErrorResponse(
        'NOT_FOUND',
        `Destination '${parseResult.data.destination_id}' not found`,
        undefined,
        404
      );

      return NextResponse.json(response, { status });
    }

    const { summary, items, source } =
      await aiAdapter.generateItinerary({
        destination_name: destination.name,
        destination_category: destination.category,
        description: destination.description,
        duration_days: parseResult.data.duration_days,
        vehicle_type: parseResult.data.vehicle_type,
      });

    // Normalize AI-generated itinerary items so every item
    // contains the sequence required by the database model.
    const normalizedItems = items.map((item, index) => ({
      ...item,
      sequence: index + 1,
    }));

    const savedItinerary = await db.saveItinerary({
      trip_id: parseResult.data.trip_id,
      destination_id: destination.id,
      destination_name: destination.name,
      summary,
      duration_days: parseResult.data.duration_days,
      generated_by: source,
      items: normalizedItems,
    });

    return NextResponse.json(
      { data: savedItinerary },
      { status: 201 }
    );
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to generate flexible itinerary',
      { details: error.message },
      500
    );

    return NextResponse.json(response, { status });
  }
}