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
    const parseResult = _schemas.imageUploadMetaSchema.safeParse({
      mime_type: body.mime_type,
      size_bytes: body.size_bytes
    });
    if (!parseResult.success) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('VALIDATION_ERROR', 'Invalid image metadata or unsupported format (allowed: JPEG, PNG, WebP up to 5MB)', parseResult.error.flatten(), 400);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const userId = body.user_id || req.headers.get('x-user-id') || 'auth-traveler-01';

    // Verify post existence and ownership
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
    if (post.user_id !== userId) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('FORBIDDEN', 'Forbidden: You do not have permission to upload images to this post', undefined, 403);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const storagePath = body.storage_path || body.image_url || `https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800`;
    const result = await _supabase.db.addPostImage(params.id, userId, {
      storage_path: storagePath,
      mime_type: parseResult.data.mime_type,
      size_bytes: parseResult.data.size_bytes
    });
    if (!result.success) {
      const errorCode = result.status === 403 ? 'FORBIDDEN' : 'NOT_FOUND';
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)(errorCode, result.error || 'Failed to upload post image', undefined, result.status);
      return _server.NextResponse.json(response, {
        status
      });
    }
    return _server.NextResponse.json({
      data: result.image
    }, {
      status: 201
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to attach post image', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}