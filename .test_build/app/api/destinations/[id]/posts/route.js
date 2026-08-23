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
    const parseResult = _schemas.postCreateSchema.safeParse({
      ...body,
      destination_id: params.id
    });
    if (!parseResult.success) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('VALIDATION_ERROR', 'Invalid community post data', parseResult.error.flatten(), 400);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const newPost = await _supabase.db.createCommunityPost({
      destination_id: params.id,
      user_id: body.user_id || 'auth-traveler-01',
      user_name: body.user_name || 'Travel Enthusiast',
      user_avatar: body.user_avatar || null,
      title: parseResult.data.title,
      body: parseResult.data.body,
      image_url: body.image_url
    });
    return _server.NextResponse.json({
      data: newPost
    }, {
      status: 201
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to create community post', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}