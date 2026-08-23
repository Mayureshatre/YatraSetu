import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';
import { tripSetupSchema } from '@/lib/validation/schemas';
import { createErrorResponse } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = tripSetupSchema.safeParse(body);

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid trip configuration',
        parseResult.error.flatten(),
        400
      );

      return NextResponse.json(response, { status });
    }

    const {
      origin_lat,
      origin_lng,
      origin_label,
      vehicle_type,
      duration_days,
    } = parseResult.data;

    // The trip setup schema allows coordinates to be omitted,
    // but the database requires numeric coordinates.
    if (
      typeof origin_lat !== 'number' ||
      typeof origin_lng !== 'number'
    ) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Valid origin latitude and longitude are required',
        undefined,
        400
      );

      return NextResponse.json(response, { status });
    }

    const trip = await db.saveTrip({
      user_id: body.user_id || 'anonymous-user',
      origin_lat,
      origin_lng,
      origin_label,
      vehicle_type,
      duration_days,
    });

    return NextResponse.json(
      { data: trip },
      { status: 201 }
    );
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to initialize trip session',
      { details: error.message },
      500
    );

    return NextResponse.json(response, { status });
  }
}