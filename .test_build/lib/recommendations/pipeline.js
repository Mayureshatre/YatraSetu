"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.recommendationPipeline = exports.RecommendationPipeline = void 0;
var _supabase = require("@/lib/db/supabase");
var _mapsAdapter = require("@/lib/maps/maps-adapter");
var _aiAdapter = require("@/lib/ai/ai-adapter");
class RecommendationPipeline {
  async execute(request, userId) {
    // Step 1: Retrieve all canonical candidate destinations
    const destinations = await _supabase.db.getDestinations();

    // Step 2: Compute route distance and travel duration for each candidate
    const candidatesWithDistance = await Promise.all(destinations.map(async dest => {
      const route = await _mapsAdapter.mapsAdapter.calculateRoute(request.origin_lat, request.origin_lng, dest.latitude, dest.longitude, request.vehicle_type);
      return {
        ...dest,
        distance_m: route.distance_m,
        distance_km: route.distance_km,
        duration_s: route.duration_s,
        duration_formatted: route.duration_formatted,
        is_within_preferred_radius: route.distance_km <= 100
      };
    }));

    // Step 3: Filter candidates - prioritize <= 100 km, but allow candidates within reasonable multi-day drive (<= 300 km)
    const eligibleCandidates = candidatesWithDistance.filter(c => c.distance_km <= (request.duration_days > 1 ? 350 : 200)).sort((a, b) => a.distance_km - b.distance_km);

    // Step 4: Prepare structured payload for AI evaluation
    const promptCandidates = eligibleCandidates.map(c => ({
      id: c.id,
      name: c.name,
      category: c.category,
      distance_km: c.distance_km,
      duration_formatted: c.duration_formatted,
      road_condition: c.road_condition || 'Standard paved highway',
      safety_tips: c.safety_tips || [],
      is_within_preferred_radius: c.is_within_preferred_radius
    }));

    // Step 5 & 6: Execute AI ranking & personalized reasoning
    const {
      ranked,
      source
    } = await _aiAdapter.aiAdapter.rankDestinations({
      origin_label: request.origin_label,
      vehicle_type: request.vehicle_type,
      duration_days: request.duration_days,
      interests: request.interests,
      candidates: promptCandidates
    });

    // Step 7: Combine rankings with destination objects
    const candidateMap = new Map(eligibleCandidates.map(c => [c.id, c]));
    const recommendations = [];
    let rankCounter = 1;
    for (const rankItem of ranked) {
      const candidate = candidateMap.get(rankItem.destination_id);
      if (candidate) {
        recommendations.push({
          ...candidate,
          rank: rankCounter++,
          match_score: rankItem.match_score,
          ai_reason: rankItem.ai_reason,
          is_extended_radius: rankItem.is_extended_radius ?? !candidate.is_within_preferred_radius,
          extension_justification: rankItem.extension_justification
        });
      }
    }

    // Step 8: Persist trip planning session in database
    const savedTrip = await _supabase.db.saveTrip({
      user_id: userId || 'anonymous-user',
      origin_lat: request.origin_lat,
      origin_lng: request.origin_lng,
      origin_label: request.origin_label,
      vehicle_type: request.vehicle_type,
      duration_days: request.duration_days
    });

    // Step 9: Return structured recommendation response
    return {
      trip_id: savedTrip.id,
      origin: {
        latitude: request.origin_lat,
        longitude: request.origin_lng,
        label: request.origin_label
      },
      vehicle_type: request.vehicle_type,
      duration_days: request.duration_days,
      recommendations,
      data_freshness: source === 'ai' ? 'live' : 'fallback',
      meta: {
        total_candidates_analyzed: destinations.length,
        radius_preferred_km: 100,
        generated_at: new Date().toISOString()
      }
    };
  }
}
exports.RecommendationPipeline = RecommendationPipeline;
const recommendationPipeline = new RecommendationPipeline();
exports.recommendationPipeline = recommendationPipeline;