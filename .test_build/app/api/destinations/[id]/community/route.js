"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = GET;
var _server = require("next/server");
var _supabase = require("@/lib/db/supabase");
var _utils = require("@/lib/utils");
async function GET(req, {
  params
}) {
  try {
    const [reviews, posts] = await Promise.all([_supabase.db.getReviews(params.id), _supabase.db.getCommunityPosts(params.id)]);

    // Calculate category averages
    const categoryTotals = {};
    let overallSum = 0;
    for (const r of reviews) {
      overallSum += r.overall_score;
      for (const [k, v] of Object.entries(r.category_scores || {})) {
        if (typeof v === 'number') {
          if (!categoryTotals[k]) categoryTotals[k] = {
            sum: 0,
            count: 0
          };
          categoryTotals[k].sum += v;
          categoryTotals[k].count += 1;
        }
      }
    }
    const categoryAverages = {};
    for (const [k, val] of Object.entries(categoryTotals)) {
      categoryAverages[k] = Math.round(val.sum / val.count * 10) / 10;
    }
    const overallAverage = reviews.length > 0 ? Math.round(overallSum / reviews.length * 10) / 10 : 4.5;
    return _server.NextResponse.json({
      data: {
        destination_id: params.id,
        rating_summary: {
          overall_average: overallAverage,
          total_reviews: reviews.length,
          category_averages: categoryAverages
        },
        reviews,
        posts // Sorted by popularity_score desc
      }
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to retrieve community data', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}