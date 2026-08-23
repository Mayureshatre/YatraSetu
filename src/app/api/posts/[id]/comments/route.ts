import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';
import { commentCreateSchema } from '@/lib/validation/schemas';
import { createErrorResponse } from '@/lib/utils';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parseResult = commentCreateSchema.safeParse(body);

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid comment text',
        parseResult.error.flatten(),
        400
      );
      return NextResponse.json(response, { status });
    }

    const post = await db.getPostById(params.id);
    if (!post) {
      const { response, status } = createErrorResponse(
        'NOT_FOUND',
        `Post '${params.id}' not found`,
        undefined,
        404
      );
      return NextResponse.json(response, { status });
    }

    const comment = await db.addComment(
      params.id,
      body.user_id || 'traveler-user-01',
      body.user_name || 'Fellow Traveler',
      parseResult.data.body,
      body.parent_id || null
    );

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to post comment',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}
