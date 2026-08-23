"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = GET;
var _server = require("next/server");
var _schemas = require("@/lib/validation/schemas");
var _busBookingAdapter = require("@/lib/booking/bus-booking-adapter");
var _utils = require("@/lib/utils");
async function GET(req) {
  try {
    const {
      searchParams
    } = new URL(req.url);
    const parseResult = _schemas.busBookingQuerySchema.safeParse({
      origin_city: searchParams.get('origin_city') || '',
      destination_city: searchParams.get('destination_city') || '',
      travel_date: searchParams.get('travel_date') || undefined,
      provider: searchParams.get('provider') || 'redbus'
    });
    if (!parseResult.success) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('VALIDATION_ERROR', 'Invalid bus booking parameters', parseResult.error.flatten(), 400);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const redirectInfo = _busBookingAdapter.busBookingAdapter.generateRedirectInfo(parseResult.data);
    return _server.NextResponse.json({
      data: redirectInfo
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to generate bus booking redirect', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}