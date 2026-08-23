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
    const itinerary = await _supabase.db.getItineraryById(params.id);
    if (!itinerary) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('NOT_FOUND', `Itinerary with id '${params.id}' not found`, undefined, 404);
      return _server.NextResponse.json(response, {
        status
      });
    }
    return _server.NextResponse.json({
      data: itinerary
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to retrieve itinerary', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}