import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { postVoteSchema } from "@/lib/validation/schemas";
import { createErrorResponse } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parseResult = postVoteSchema.safeParse(body);

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid vote type (must be 1 for upvote or -1 for downvote)",
        parseResult.error.flatten(),
        400,
      );

      return NextResponse.json(response, { status });
    }

    const userId =
      body.user_id || req.headers.get("x-user-id") || "traveler-user-01";

    // Normalize the validated value to the exact type expected by db.votePost.
    const voteType: 1 | -1 = parseResult.data.vote_type === 1 ? 1 : -1;

    const result = await db.votePost(id, userId, voteType);

    if (!result.success) {
      const { response, status } = createErrorResponse(
        "NOT_FOUND",
        `Post '${id}' not found`,
        undefined,
        404,
      );

      return NextResponse.json(response, { status });
    }

    return NextResponse.json({
      data: {
        post_id: id,
        net_votes: result.net_votes,
        upvotes_count: result.upvotes_count,
        downvotes_count: result.downvotes_count,
        user_vote: result.user_vote,
      },
    });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to record vote",
      { details: error.message },
      500,
    );

    return NextResponse.json(response, { status });
  }
}
