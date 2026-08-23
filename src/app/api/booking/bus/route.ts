import { NextRequest, NextResponse } from 'next/server';
import { busBookingQuerySchema } from '@/lib/validation/schemas';
import { busBookingAdapter } from '@/lib/booking/bus-booking-adapter';
import { createErrorResponse } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parseResult = busBookingQuerySchema.safeParse({
      origin_city: searchParams.get('origin_city') || '',
      destination_city: searchParams.get('destination_city') || '',
      travel_date: searchParams.get('travel_date') || undefined,
      provider: searchParams.get('provider') || 'redbus',
    });

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid bus booking parameters',
        parseResult.error.flatten(),
        400
      );
      return NextResponse.json(response, { status });
    }

    const redirectInfo = busBookingAdapter.generateRedirectInfo(parseResult.data);
    return NextResponse.json({ data: redirectInfo });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to generate bus booking redirect',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}
