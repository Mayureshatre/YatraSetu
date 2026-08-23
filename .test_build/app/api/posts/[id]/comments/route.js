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
    const parseResult = _schemas.commentCreateSchema.safeParse(body);
    if (!parseResult.success) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('VALIDATION_ERROR', 'Invalid comment text', parseResult.error.flatten(), 400);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const post = await _supabase.db.getPostById(params.id);
    if (!post) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('NOT_FOUND', `Post '${params.id}' not found`, undefined, 404);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const comment = await _supabase.db.addComment(params.id, body.user_id || 'auth-traveler-01', body.user_name || 'Fellow Traveler', parseResult.data.body);
    return _server.NextResponse.json({
      data: comment
    }, {
      status: 201
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to post comment', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}