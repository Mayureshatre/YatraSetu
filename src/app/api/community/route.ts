import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';
import { createErrorResponse } from '@/lib/utils';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get('destination_id') || undefined;
    const category = searchParams.get('category') || undefined;
    const sortBy = (searchParams.get('sort_by') as any) || 'popular';
    const currentUserId = searchParams.get('user_id') || req.headers.get('x-user-id') || undefined;

    const posts = await db.getCommunityPosts({
      destinationId,
      category,
      sortBy,
      currentUserId,
    });

    return NextResponse.json({
      data: {
        posts,
        meta: {
          count: posts.length,
          category: category || 'All',
          sort_by: sortBy,
        },
      },
    });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to retrieve community feed',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}
