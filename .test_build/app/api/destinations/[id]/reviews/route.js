"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POST = POST;
var _server = require("next/server");
var _supabase = require("@/lib/db/supabase");
var _schemas = require("@/lib/validation/schemas");
var _utils = require("@/lib/utils");
async function POST(req, {
  params
}) {
  try {
    const body = await req.json();
    const parseResult = _schemas.reviewCreateSchema.safeParse({
      ...body,
      destination_id: params.id
    });
    if (!parseResult.success) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('VALIDATION_ERROR', 'Invalid review submission data', parseResult.error.flatten(), 400);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const newReview = await _supabase.db.createReview({
      destination_id: params.id,
      user_id: body.user_id || 'auth-traveler-01',
      user_name: body.user_name || 'Verified Explorer',
      user_avatar: body.user_avatar || null,
      overall_score: parseResult.data.overall_score,
      category_scores: parseResult.data.category_scores,
      body: parseResult.data.body || null
    });
    return _server.NextResponse.json({
      data: newReview
    }, {
      status: 201
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to submit destination review', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}