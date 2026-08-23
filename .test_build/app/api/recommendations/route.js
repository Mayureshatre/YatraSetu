"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POST = POST;
var _server = require("next/server");
var _schemas = require("@/lib/validation/schemas");
var _pipeline = require("@/lib/recommendations/pipeline");
var _utils = require("@/lib/utils");
async function POST(req) {
  try {
    const body = await req.json();
    const parseResult = _schemas.recommendationRequestSchema.safeParse(body);
    if (!parseResult.success) {
      const {
        response,
        status
      } = (0, _utils.createErrorResponse)('VALIDATION_ERROR', 'Invalid recommendation request parameters', parseResult.error.flatten(), 400);
      return _server.NextResponse.json(response, {
        status
      });
    }
    const recommendations = await _pipeline.recommendationPipeline.execute(parseResult.data, body.user_id);
    return _server.NextResponse.json({
      data: recommendations
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to generate recommendations', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}