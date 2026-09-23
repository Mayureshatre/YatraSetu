import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { reviewCreateSchema } from "@/lib/validation/schemas";
import { createErrorResponse } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parseResult = reviewCreateSchema.safeParse({
      ...body,
      destination_id: id,
    });

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid review submission data",
        parseResult.error.flatten(),
        400,
      );
      return NextResponse.json(response, { status });
    }

    const newReview = await db.createReview({
      destination_id: id,
      user_id: body.user_id || "auth-traveler-01",
      user_name: body.user_name || "Verified Explorer",
      user_avatar: body.user_avatar || null,
      overall_score: parseResult.data.overall_score,
      category_scores: parseResult.data.category_scores,
      body: parseResult.data.body || null,
    });

    return NextResponse.json({ data: newReview }, { status: 201 });
  } catch (error: any) {
    // Check if it's a duplicate review violation from PostgreSQL (Unique Constraint Error)
    if (error.message?.includes("23505") || error.code === "23505") {
      const { response, status } = createErrorResponse(
        "CONFLICT",
        "You have already submitted a review for this destination.",
        undefined,
        409,
      );
      return NextResponse.json(response, { status });
    }

    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to submit destination review",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: destinationId } = await params;
    const body = await req.json();

    // Ensure we have a user identifier
    const userId = body.user_id;
    if (!userId) {
      const { response, status } = createErrorResponse(
        "VALIDATION_ERROR",
        "Missing user_id for review update",
        undefined,
        400,
      );
      return NextResponse.json(response, { status });
    }

    const result = await db.updateReview(destinationId, userId, {
      overall_score: body.overall_score,
      category_scores: body.category_scores,
      body: body.body,
    });

    if (!result.success) {
      const { response, status } = createErrorResponse(
        result.status === 404 ? "NOT_FOUND" : "SERVER_ERROR",
        result.error || "Failed to update review",
        undefined,
        result.status,
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({ data: result.review }, { status: 200 });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to process review update",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
