import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { reviewUpdateSchema } from "@/lib/validation/schemas";
import { createErrorResponse } from "@/lib/utils";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    console.log("📥 Received review submission:", body);

    // 1. Basic validation
    if (!body.overall_score || !body.user_id) {
      const { response, status } = createErrorResponse(
        "VALIDATION_ERROR",
        "Missing required fields: overall_score and user_id",
        undefined,
        400,
      );
      return NextResponse.json(response, { status });
    }

    // 2. Ensure user_id is a valid UUID for Supabase PostgreSQL
    // If logged in via demo mode ('auth-traveler-01'), map to a valid UUID format
    const isValidUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        body.user_id,
      );
    const dbUserId = isValidUUID
      ? body.user_id
      : "11111111-0001-0001-0001-000000000001";

    // 3. Insert into Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        destination_id: id,
        user_id: dbUserId,
        overall_score: body.overall_score,
        category_scores: body.category_scores,
        body: body.body || "",
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase DB Insert Error:", error);
      const { response, status } = createErrorResponse(
        "SERVER_ERROR",
        error.message || "Failed to create review",
        { details: error },
        400,
      );
      return NextResponse.json(response, { status });
    }

    console.log("✅ Review created successfully:", data);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    console.error("❌ Server Error:", error);
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to process review submission",
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
