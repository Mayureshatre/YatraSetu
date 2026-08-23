"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = GET;
var _server = require("next/server");
var _mapsAdapter = require("@/lib/maps/maps-adapter");
var _schemas = require("@/lib/validation/schemas");
var _utils = require("@/lib/utils");
var _zod = require("zod");
const routeQuerySchema = _zod.z.object({
  origin_lat: _zod.z.coerce.number().min(-90).max(90),
  origin_lng: _zod.z.coerce.number().min(-180).max(180),
  dest_lat: _zod.z.coerce.number().min(-90).max(90),
  dest_lng: _zod.z.coerce.number().min(-180).max(180),
  vehicle_type: _schemas.vehicleTypeEnum.default('car')
});
async function GET(req) {
  try {
    const {
      searchParams
    } = new URL(req.url);
    const parseResult = routeQuerySchema.safeParse({
      origin_lat: searchParams.get('origin_lat'),
      origin_lng: searchParams.get('origin_lng'),
      dest_lat: searchParams.get('dest_lat'),
      dest_lng: searchParams.get('dest_lng'),
      vehicle_type: searchParams.get('vehicle_type') || 'car'
    });
    if (!parseResult.success) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('VALIDATION_ERROR', 'Invalid coordinates or vehicle type in route query', parseResult.error.flatten(), 400);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const {
      origin_lat,
      origin_lng,
      dest_lat,
      dest_lng,
      vehicle_type
    } = parseResult.data;
    const route = await _mapsAdapter.mapsAdapter.calculateRoute(origin_lat, origin_lng, dest_lat, dest_lng, vehicle_type);
    return _server.NextResponse.json({
      data: route
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to calculate vehicle route', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}