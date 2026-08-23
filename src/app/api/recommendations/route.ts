import { NextRequest, NextResponse } from 'next/server';
import { recommendationRequestSchema } from '@/lib/validation/schemas';
import { recommendationPipeline } from '@/lib/recommendations/pipeline';
import { createErrorResponse } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = recommendationRequestSchema.safeParse(body);

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid recommendation request parameters',
        parseResult.error.flatten(),
        400
      );
      return NextResponse.json(response, { status });
    }

    const recommendations = await recommendationPipeline.execute(
      parseResult.data as any,
      body.user_id
    );

    return NextResponse.json({ data: recommendations });
  } catch (error: any) {
    const isLocationError = error.message?.includes('Unable to resolve location');
    const { response, status } = createErrorResponse(
      isLocationError ? 'LOCATION_NOT_FOUND' : 'SERVER_ERROR',
      error.message || 'Failed to generate recommendations',
      { details: error.message },
      isLocationError ? 404 : 500
    );
    return NextResponse.json(response, { status });
  }
}
