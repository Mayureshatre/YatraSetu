"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POST = POST;
var _server = require("next/server");
var _supabase = require("@/lib/db/supabase");
var _schemas = require("@/lib/validation/schemas");
var _utils = require("@/lib/utils");
async function POST(req) {
  try {
    const body = await req.json();
    const parseResult = _schemas.tripSetupSchema.safeParse(body);
    if (!parseResult.success) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('VALIDATION_ERROR', 'Invalid trip configuration', parseResult.error.flatten(), 400);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const trip = await _supabase.db.saveTrip({
      user_id: body.user_id || 'anonymous-user',
      origin_lat: parseResult.data.origin_lat,
      origin_lng: parseResult.data.origin_lng,
      origin_label: parseResult.data.origin_label,
      vehicle_type: parseResult.data.vehicle_type,
      duration_days: parseResult.data.duration_days
    });
    return _server.NextResponse.json({
      data: trip
    }, {
      status: 201
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to initialize trip session', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}