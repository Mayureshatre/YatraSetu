"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = GET;
var _server = require("next/server");
var _supabase = require("@/lib/db/supabase");
var _servicesAdapter = require("@/lib/services/services-adapter");
var _utils = require("@/lib/utils");
async function GET(req, {
  params
}) {
  try {
    const destination = await _supabase.db.getDestinationById(params.id);
    if (!destination) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('NOT_FOUND', `Destination with id '${params.id}' not found`, undefined, 404);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const services = await _servicesAdapter.nearbyServicesAdapter.getNearbyServices(destination.id, destination.latitude, destination.longitude, destination.name);
    return _server.NextResponse.json({
      data: services
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to retrieve nearby services', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}