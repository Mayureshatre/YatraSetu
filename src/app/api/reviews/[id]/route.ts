import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { reviewUpdateSchema } from "@/lib/validation/schemas";
import { createErrorResponse } from "@/lib/utils";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parseResult = reviewUpdateSchema.safeParse(body);

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid review update data",
        parseResult.error.flatten(),
        400,
      );
      return NextResponse.json(response, { status });
    }

    const userId =
      body.user_id || req.headers.get("x-user-id") || "auth-traveler-01";

    const result = await db.updateReview(id, userId, parseResult.data);

    if (!result.success) {
      const errorCode = result.status === 403 ? "FORBIDDEN" : "NOT_FOUND";
      const { response, status } = createErrorResponse(
        errorCode,
        result.error || "Failed to update review",
        undefined,
        result.status,
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({ data: result.review });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to update review",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    let userId = req.headers.get("x-user-id") || "auth-traveler-01";

    // Check if user_id was passed via query or body
    const { searchParams } = new URL(req.url);
    if (searchParams.get("user_id")) {
      userId = searchParams.get("user_id")!;
    } else {
      try {
        const body = await req.json();
        if (body.user_id) userId = body.user_id;
      } catch {
        // Body might be empty in DELETE request
      }
    }

    const result = await db.deleteReview(id, userId);

    if (!result.success) {
      const errorCode = result.status === 403 ? "FORBIDDEN" : "NOT_FOUND";
      const { response, status } = createErrorResponse(
        errorCode,
        result.error || "Failed to delete review",
        undefined,
        result.status,
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({
      data: { success: true, message: `Review '${id}' deleted successfully` },
    });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to delete review",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
