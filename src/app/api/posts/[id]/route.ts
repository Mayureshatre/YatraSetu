import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';
import { createErrorResponse } from '@/lib/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await db.getPostById(params.id);
    if (!post) {
      const { response, status } = createErrorResponse(
        'NOT_FOUND',
        `Community post '${params.id}' not found`,
        undefined,
        404
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({ data: post });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to retrieve community post',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    let userId = req.headers.get('x-user-id') || 'auth-traveler-01';

    const { searchParams } = new URL(req.url);
    if (searchParams.get('user_id')) {
      userId = searchParams.get('user_id')!;
    } else {
      try {
        const body = await req.json();
        if (body.user_id) userId = body.user_id;
      } catch {
        // Body might be empty
      }
    }

    const result = await db.deletePost(params.id, userId);

    if (!result.success) {
      const errorCode = result.status === 403 ? 'FORBIDDEN' : 'NOT_FOUND';
      const { response, status } = createErrorResponse(
        errorCode,
        result.error || 'Failed to delete community post',
        undefined,
        result.status
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({ data: { success: true, message: `Post '${params.id}' deleted successfully` } });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to delete community post',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}
