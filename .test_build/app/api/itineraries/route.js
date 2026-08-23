"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POST = POST;
var _server = require("next/server");
var _supabase = require("@/lib/db/supabase");
var _schemas = require("@/lib/validation/schemas");
var _aiAdapter = require("@/lib/ai/ai-adapter");
var _utils = require("@/lib/utils");
async function POST(req) {
  try {
    const body = await req.json();
    const parseResult = _schemas.itineraryRequestSchema.safeParse(body);
    if (!parseResult.success) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('VALIDATION_ERROR', 'Invalid itinerary request data', parseResult.error.flatten(), 400);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const destination = await _supabase.db.getDestinationById(parseResult.data.destination_id);
    if (!destination) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('NOT_FOUND', `Destination '${parseResult.data.destination_id}' not found`, undefined, 404);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const {
      summary,
      items,
      source
    } = await _aiAdapter.aiAdapter.generateItinerary({
      destination_name: destination.name,
      destination_category: destination.category,
      description: destination.description,
      duration_days: parseResult.data.duration_days,
      vehicle_type: parseResult.data.vehicle_type
    });
    const savedItinerary = await _supabase.db.saveItinerary({
      trip_id: parseResult.data.trip_id,
      destination_id: destination.id,
      destination_name: destination.name,
      summary,
      duration_days: parseResult.data.duration_days,
      generated_by: source,
      items
    });
    return _server.NextResponse.json({
      data: savedItinerary
    }, {
      status: 201
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to generate flexible itinerary', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}