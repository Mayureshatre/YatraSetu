"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = GET;
var _server = require("next/server");
var _supabase = require("@/lib/db/supabase");
var _utils = require("@/lib/utils");
async function GET(req) {
  try {
    const {
      searchParams
    } = new URL(req.url);
    const category = searchParams.get('category');
    const region = searchParams.get('region');
    const query = searchParams.get('q')?.toLowerCase();
    let destinations = await _supabase.db.getDestinations();
    if (category) {
      destinations = destinations.filter(d => d.category.toLowerCase() === category.toLowerCase());
    }
    if (region) {
      destinations = destinations.filter(d => d.region.toLowerCase() === region.toLowerCase());
    }
    if (query) {
      destinations = destinations.filter(d => d.name.toLowerCase().includes(query) || d.description.toLowerCase().includes(query) || d.category.toLowerCase().includes(query));
    }
    return _server.NextResponse.json({
      data: destinations,
      meta: {
        count: destinations.length
      }
    });
  } catch (error) {
    const {
      response,
      status
    } = (0, _utils.createErrorResponse)('SERVER_ERROR', 'Failed to retrieve destinations', {
      details: error.message
    }, 500);
    return _server.NextResponse.json(response, {
      status
    });
  }
}