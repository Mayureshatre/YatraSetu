import { DestinationWithDistance } from './destination';
import { VehicleType } from './trip';

export interface RecommendationCandidate extends DestinationWithDistance {
  match_score: number; // 0 - 100
  ai_reason: string;
  rank: number;
  is_extended_radius?: boolean;
  extension_justification?: string;
  suitability_factors?: {
    vehicle_compatibility: number;
    distance_score: number;
    road_readiness: number;
    community_sentiment: number;
    seasonal_appeal: number;
  };
}

export interface RecommendationRequest {
  origin_lat: number;
  origin_lng: number;
  origin_label: string;
  vehicle_type: VehicleType;
  duration_days: number;
  interests?: string[];
}

export interface RecommendationResponse {
  trip_id?: string;
  origin: {
    latitude: number;
    longitude: number;
    label: string;
  };
  vehicle_type: VehicleType;
  duration_days: number;
  recommendations: RecommendationCandidate[];
  data_freshness: 'live' | 'fallback';
  meta: {
    total_candidates_analyzed: number;
    radius_preferred_km: number;
    generated_at: string;
  };
}
