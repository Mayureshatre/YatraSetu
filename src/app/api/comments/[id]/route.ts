import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { createErrorResponse } from "@/lib/utils";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    let userId = req.headers.get("x-user-id") || "auth-traveler-01";

    const { searchParams } = new URL(req.url);
    if (searchParams.get("user_id")) {
      userId = searchParams.get("user_id")!;
    } else {
      try {
        const body = await req.json();
        if (body.user_id) userId = body.user_id;
      } catch {
        // Body might be empty
      }
    }

    const result = await db.deleteComment(id, userId);

    if (!result.success) {
      const errorCode = result.status === 403 ? "FORBIDDEN" : "NOT_FOUND";
      const { response, status } = createErrorResponse(
        errorCode,
        result.error || "Failed to delete comment",
        undefined,
        result.status,
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({
      data: { success: true, message: `Comment '${id}' deleted successfully` },
    });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to delete comment",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
