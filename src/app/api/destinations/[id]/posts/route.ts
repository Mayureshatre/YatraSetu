import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { postCreateSchema } from "@/lib/validation/schemas";
import { createErrorResponse } from "@/lib/utils";

export async function POST(
  req: NextRequest,
  { params }: { params: { id?: string; destinationId?: string } },
) {
  try {
    const body = await req.json();

    // Resolve the destination ID from either URL param or request body
    const resolvedDestinationId =
      params.id || params.destinationId || body.destination_id;

    console.log("DEBUG - Received params:", params);
    console.log("DEBUG - Resolved Destination ID:", resolvedDestinationId);
    console.log("DEBUG - Received Body:", body);

    const parseResult = postCreateSchema.safeParse({
      ...body,
      destination_id: resolvedDestinationId,
    });

    if (!parseResult.success) {
      console.log(
        "DEBUG - Zod Validation Failed:",
        parseResult.error.flatten(),
      );
      const { response, status } = createErrorResponse(
        "VALIDATION_ERROR",
        "Invalid community post data",
        parseResult.error.flatten(),
        400,
      );
      return NextResponse.json(response, { status });
    }

    const newPost = await db.createCommunityPost({
      destination_id: resolvedDestinationId,
      user_id: body.user_id || "traveler-user-01",
      user_name: body.user_name || "Travel Enthusiast",
      user_avatar: body.user_avatar || null,
      title: parseResult.data.title,
      body: parseResult.data.body,
      category: (parseResult.data.category || "General Discussion") as any,
      image_url: body.image_url,
    });

    return NextResponse.json({ data: newPost }, { status: 201 });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to create community post",
      { details: error.message },
      500,
    );
    return NextResponse.json(response, { status });
  }
}
