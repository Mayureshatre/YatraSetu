import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { imageUploadMetaSchema } from "@/lib/validation/schemas";
import { storageAdapter } from "@/lib/storage/storage-adapter";
import { createErrorResponse } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parseResult = imageUploadMetaSchema.safeParse({
      mime_type: body.mime_type,
      size_bytes: body.size_bytes,
    });

    if (!parseResult.success) {
      const { response, status } = createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid image metadata or unsupported format (allowed: JPEG, PNG, WebP up to 5MB)",
        parseResult.error.flatten(),
        400,
      );
      return NextResponse.json(response, { status });
    }

    const userId =
      body.user_id || req.headers.get("x-user-id") || "auth-traveler-01";

    // Verify post existence and ownership
    const post = await db.getPostById(id);
    if (!post) {
      const { response, status } = createErrorResponse(
        "NOT_FOUND",
        `Community post '${id}' not found`,
        undefined,
        404,
      );
      return NextResponse.json(response, { status });
    }

    if (post.user_id !== userId) {
      const { response, status } = createErrorResponse(
        "FORBIDDEN",
        "Forbidden: You do not have permission to upload images to this post",
        undefined,
        403,
      );
      return NextResponse.json(response, { status });
    }

    const storagePath =
      body.storage_path ||
      body.image_url ||
      `https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800`;

    const result = await db.addPostImage(id, userId, {
      storage_path: storagePath,
      mime_type: parseResult.data.mime_type,
      size_bytes: parseResult.data.size_bytes,
    });

    if (!result.success) {
      const errorCode = result.status === 403 ? "FORBIDDEN" : "NOT_FOUND";
      const { response, status } = createErrorResponse(
        errorCode,
        result.error || "Failed to upload post image",
        undefined,
        result.status,
      );
      return NextResponse.json(response, { status });
    }

    return NextResponse.json({ data: result.image }, { status: 201 });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to attach post image",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
