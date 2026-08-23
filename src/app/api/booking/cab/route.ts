import { NextRequest, NextResponse } from 'next/server';
import { cabBookingAdapter } from '@/lib/booking/cab-booking-adapter';
import { createErrorResponse } from '@/lib/utils';
import { z } from 'zod';

const cabQuerySchema = z.object({
  origin_city: z.string().min(1).max(100),
  destination_city: z.string().min(1).max(100),
  distance_km: z.coerce.number().min(0).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parseResult = cabQuerySchema.safeParse({
      origin_city: searchParams.get('origin_city'),
      destination_city: searchParams.get('destination_city'),
      distance_km: searchParams.get('distance_km'),
    });

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid cab booking query parameters',
        parseResult.error.flatten(),
        400
      );
      return NextResponse.json(response, { status });
    }

    const redirectInfo = cabBookingAdapter.generateRedirectInfo({
      origin_city: parseResult.data.origin_city,
      destination_city: parseResult.data.destination_city,
      distance_km: parseResult.data.distance_km,
      provider: 'rapido',
    });

    return NextResponse.json({ data: redirectInfo });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to generate cab redirect',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}
