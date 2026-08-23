"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DELETE = DELETE;
exports.PATCH = PATCH;
var _server = require("next/server");
var _supabase = require("@/lib/db/supabase");
var _schemas = require("@/lib/validation/schemas");
var _utils = require("@/lib/utils");
async function PATCH(req, {
  params
}) {
  try {
    const body = await req.json();
    const parseResult = _schemas.reviewUpdateSchema.safeParse(body);
    if (!parseResult.success) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('VALIDATION_ERROR', 'Invalid review update data', parseResult.error.flatten(), 400);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const userId = body.user_id || req.headers.get('x-user-id') || 'auth-traveler-01';
    const result = await _supabase.db.updateReview(params.id, userId, parseResult.data);
    if (!result.success) {
      const errorCode = result.status === 403 ? 'FORBIDDEN' : 'NOT_FOUND';
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)(errorCode, result.error || 'Failed to update review', undefined, result.status);
      return _server.NextResponse.json(response, {
        status
      });
    }
    return _server.NextResponse.json({
      data: result.review
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to update review', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}
async function DELETE(req, {
  params
}) {
  try {
    let userId = req.headers.get('x-user-id') || 'auth-traveler-01';

    // Check if user_id was passed via query or body
    const {
      searchParams
    } = new URL(req.url);
    if (searchParams.get('user_id')) {
      userId = searchParams.get('user_id');
    } else {
      try {
        const body = await req.json();
        if (body.user_id) userId = body.user_id;
      } catch {
        // Body might be empty in DELETE request
      }
    }
    const result = await _supabase.db.deleteReview(params.id, userId);
    if (!result.success) {
      const errorCode = result.status === 403 ? 'FORBIDDEN' : 'NOT_FOUND';
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)(errorCode, result.error || 'Failed to delete review', undefined, result.status);
      return _server.NextResponse.json(response, {
        status
      });
    }
    return _server.NextResponse.json({
      data: {
        success: true,
        message: `Review '${params.id}' deleted successfully`
      }
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to delete review', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}