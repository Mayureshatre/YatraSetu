import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/supabase';
import { reportCreateSchema } from '@/lib/validation/schemas';
import { createErrorResponse } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = reportCreateSchema.safeParse(body);

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        'VALIDATION_ERROR',
        'Invalid report submission (reason is required)',
        parseResult.error.flatten(),
        400
      );
      return NextResponse.json(response, { status });
    }

    const reporterId = body.reporter_id || req.headers.get('x-user-id') || 'traveler-user-01';

    const result = await db.reportContent(
      reporterId,
      parseResult.data.reason,
      parseResult.data.post_id,
      parseResult.data.comment_id
    );

    return NextResponse.json(
      { data: { success: true, report_id: result.report_id, message: 'Report submitted successfully for community moderation review' } },
      { status: 201 }
    );
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      'SERVER_ERROR',
      'Failed to submit report',
      { details: error.message },
      500
    );
    return NextResponse.json(response, { status });
  }
}
