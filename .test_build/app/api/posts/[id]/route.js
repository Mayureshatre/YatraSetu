"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DELETE = DELETE;
exports.GET = GET;
var _server = require("next/server");
var _supabase = require("@/lib/db/supabase");
var _utils = require("@/lib/utils");
async function GET(req, {
  params
}) {
  try {
    const post = await _supabase.db.getPostById(params.id);
    if (!post) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('NOT_FOUND', `Community post '${params.id}' not found`, undefined, 404);
      return _server.NextResponse.json(response, {
        status
      });
    }
    return _server.NextResponse.json({
      data: post
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to retrieve community post', {
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
        // Body might be empty
      }
    }
    const result = await _supabase.db.deletePost(params.id, userId);
    if (!result.success) {
      const errorCode = result.status === 403 ? 'FORBIDDEN' : 'NOT_FOUND';
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)(errorCode, result.error || 'Failed to delete community post', undefined, result.status);
      return _server.NextResponse.json(response, {
        status
      });
    }
    return _server.NextResponse.json({
      data: {
        success: true,
        message: `Post '${params.id}' deleted successfully`
      }
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to delete community post', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}