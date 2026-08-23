import { NextRequest, NextResponse } from 'next/server';
import { mapsAdapter } from '@/lib/maps/maps-adapter';
import { createErrorResponse } from '@/lib/utils';
import { z } from 'zod';

const geocodeSchema = z.object({
  query: z.string().min(2).max(200),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || searchParams.get('query');

    const parseResult = geocodeSchema.safeParse({ query: q });
    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'A valid location name is required (at least 2 characters)',
        parseResult.error.flatten(),
        400
      );
      return NextResponse.json(response, { status });
    }

    const result = await mapsAdapter.geocodeCity(parseResult.data.query);
    if (!result) {
      const { response, status } = createErrorResponse(
        'LOCATION_NOT_FOUND',
        `Unable to resolve location "${parseResult.data.query}". Please check the spelling or enter a valid city/town name.`,
        undefined,
        404
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({ data: result });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to geocode location',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = geocodeSchema.safeParse(body);
    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'A valid location name is required (at least 2 characters)',
        parseResult.error.flatten(),
        400
      );
      return NextResponse.json(response, { status });
    }

    const result = await mapsAdapter.geocodeCity(parseResult.data.query);
    if (!result) {
      const { response, status } = createErrorResponse(
        'LOCATION_NOT_FOUND',
        `Unable to resolve location "${parseResult.data.query}". Please check the spelling or enter a valid city/town name.`,
        undefined,
        404
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({ data: result });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to geocode location',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}
