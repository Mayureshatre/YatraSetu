import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';
import { reviewCreateSchema } from '@/lib/validation/schemas';
import { createErrorResponse } from '@/lib/utils';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parseResult = reviewCreateSchema.safeParse({
      ...body,
      destination_id: params.id,
    });

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid review submission data',
        parseResult.error.flatten(),
        400
      );
      return NextResponse.json(response, { status });
    }

    const newReview = await db.createReview({
      destination_id: params.id,
      user_id: body.user_id || 'auth-traveler-01',
      user_name: body.user_name || 'Verified Explorer',
      user_avatar: body.user_avatar || null,
      overall_score: parseResult.data.overall_score,
      category_scores: parseResult.data.category_scores,
      body: parseResult.data.body || null,
    });

    return NextResponse.json({ data: newReview }, { status: 201 });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to submit destination review',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}
