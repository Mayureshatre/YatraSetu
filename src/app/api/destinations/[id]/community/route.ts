import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/supabase";
import { createErrorResponse } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const [reviews, posts] = await Promise.all([
      db.getReviews(id),
      db.getCommunityPosts({
        destinationId: id,
      }),
    ]);

    // Calculate category averages
    const categoryTotals: Record<string, { sum: number; count: number }> = {};
    let overallSum = 0;

    for (const r of reviews) {
      overallSum += r.overall_score;

      for (const [k, v] of Object.entries(r.category_scores || {})) {
        if (typeof v === "number") {
          if (!categoryTotals[k]) {
            categoryTotals[k] = { sum: 0, count: 0 };
          }

          categoryTotals[k].sum += v;
          categoryTotals[k].count += 1;
        }
      }
    }

    const categoryAverages: Record<string, number> = {};

    for (const [k, val] of Object.entries(categoryTotals)) {
      categoryAverages[k] = Math.round((val.sum / val.count) * 10) / 10;
    }

    const overallAverage =
      reviews.length > 0
        ? Math.round((overallSum / reviews.length) * 10) / 10
        : 4.5;

    return NextResponse.json({
      data: {
        destination_id: id,
        rating_summary: {
          overall_average: overallAverage,
          total_reviews: reviews.length,
          category_averages: categoryAverages,
        },
        reviews,
        posts,
      },
    });
  } catch (error: any) {
    const { response, status } = createErrorResponse(
      "SERVER_ERROR",
      "Failed to retrieve community data",
      { details: error.message },
      500,
    );

    return NextResponse.json(response, { status });
  }
}
