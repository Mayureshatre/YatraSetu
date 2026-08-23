import { db } from '@/lib/db/supabase';
import { mapsAdapter } from '@/lib/maps/maps-adapter';
import { aiAdapter, AiPromptCandidate } from '@/lib/ai/ai-adapter';
import {
  RecommendationCandidate,
  RecommendationRequest,
  RecommendationResponse,
  DestinationWithDistance,
} from '@/types';

export class RecommendationPipeline {
  async execute(request: RecommendationRequest, userId?: string): Promise<RecommendationResponse> {
    let originLat = request.origin_lat;
    let originLng = request.origin_lng;
    let originLabel = request.origin_label;

    // Step 1: Ensure origin coordinates are resolved dynamically
    // If coordinates are missing or if user provided a text label that needs resolution
    if ((!originLat && originLat !== 0) || (!originLng && originLng !== 0) || (originLat === 0 && originLng === 0)) {
      const geocoded = await mapsAdapter.geocodeCity(originLabel);
      if (!geocoded) {
        throw new Error(`Unable to resolve location "${originLabel}". Please enter a valid city or location name.`);
      }
      originLat = geocoded.latitude;
      originLng = geocoded.longitude;
      originLabel = geocoded.formatted_address || originLabel;
    }

    // Step 2: Retrieve all canonical candidate destinations from database
    const destinations = await db.getDestinations();

    // Step 3: Dynamically compute route distance and travel duration for each candidate from resolved origin
    const candidatesWithDistance: DestinationWithDistance[] = await Promise.all(
      destinations.map(async (dest) => {
        const route = await mapsAdapter.calculateRoute(
          originLat,
          originLng,
          dest.latitude,
          dest.longitude,
          request.vehicle_type
        );

        return {
          ...dest,
          distance_m: route.distance_m,
          distance_km: route.distance_km,
          duration_s: route.duration_s,
          duration_formatted: route.duration_formatted,
          is_within_preferred_radius: route.distance_km <= 100,
        };
      })
    );

    // Step 4: Filter candidates based on actual road distance
    // For 1-day trips: prioritize <= 100 km, allow reasonable day-trip limit <= 250 km
    // For multi-day trips: allow broader range (up to 450 km)
    const maxRadius = request.duration_days > 1 ? 450 : 250;
    let eligibleCandidates = candidatesWithDistance
      .filter((c) => c.distance_km <= maxRadius)
      .sort((a, b) => a.distance_km - b.distance_km);

    // If no candidates within max radius (e.g. far remote origin), take nearest 6 candidates
    if (eligibleCandidates.length === 0) {
      eligibleCandidates = [...candidatesWithDistance]
        .sort((a, b) => a.distance_km - b.distance_km)
        .slice(0, 8);
    }

    // Step 5: Prepare structured, verified payload for AI evaluation (Gemini NEVER calculates distances)
    const promptCandidates: AiPromptCandidate[] = eligibleCandidates.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      distance_km: c.distance_km,
      duration_formatted: c.duration_formatted,
      road_condition: c.road_condition || 'Standard paved highway',
      safety_tips: c.safety_tips || [],
      is_within_preferred_radius: c.is_within_preferred_radius,
    }));

    // Step 6: Execute AI ranking & personalized reasoning with authoritative route data
    const { ranked, source } = await aiAdapter.rankDestinations({
      origin_label: originLabel,
      vehicle_type: request.vehicle_type,
      duration_days: request.duration_days,
      interests: request.interests,
      candidates: promptCandidates,
    });

    // Step 7: Combine rankings with destination objects
    const candidateMap = new Map(eligibleCandidates.map((c) => [c.id, c]));
    const recommendations: RecommendationCandidate[] = [];

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
          extension_justification: rankItem.extension_justification,
        });
      }
    }

    // Fallback: If AI returned items that didn't match candidateMap or incomplete list
    if (recommendations.length === 0) {
      eligibleCandidates.slice(0, 10).forEach((c, idx) => {
        recommendations.push({
          ...c,
          rank: idx + 1,
          match_score: Math.max(50, 95 - idx * 5),
          ai_reason: `Scenic ${c.category} destination located ${c.distance_km} km (${c.duration_formatted}) from ${originLabel.split(',')[0]}.`,
          is_extended_radius: !c.is_within_preferred_radius,
        });
      });
    }

    // Step 8: Persist trip planning session in database
    const savedTrip = await db.saveTrip({
      user_id: userId || 'anonymous-user',
      origin_lat: originLat,
      origin_lng: originLng,
      origin_label: originLabel,
      vehicle_type: request.vehicle_type,
      duration_days: request.duration_days,
    });

    // Step 9: Return structured recommendation response
    return {
      trip_id: savedTrip.id,
      origin: {
        latitude: originLat,
        longitude: originLng,
        label: originLabel,
      },
      vehicle_type: request.vehicle_type,
      duration_days: request.duration_days,
      recommendations,
      data_freshness: source === 'ai' ? 'live' : 'fallback',
      meta: {
        total_candidates_analyzed: destinations.length,
        radius_preferred_km: 100,
        generated_at: new Date().toISOString(),
      },
    };
  }
}

export const recommendationPipeline = new RecommendationPipeline();
