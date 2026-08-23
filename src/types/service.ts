export type ServiceType = 'fuel' | 'mechanic' | 'hospital';

export interface RouteServiceItem {
  id: string;
  name: string;
  type: ServiceType;
  latitude: number;
  longitude: number;
  address: string;
  distance_from_origin_km: number;
  distance_from_origin_m: number;
  distance_km?: number;
  distance_m?: number;
  detour_km?: number;
  detour_m?: number;
  duration_from_origin_formatted?: string;
  is_open?: boolean | null;
  phone?: string | null;
  rating?: number | null;
  user_rating_count?: number | null;
  google_maps_uri?: string | null;
  business_status?: string | null;
  verified: boolean;
}

// Backward compatibility alias
export type NearbyPlaceItem = RouteServiceItem;

export interface AiServiceReadinessBriefing {
  safety_score: number;
  readiness_level: 'High' | 'Moderate' | 'Low';
  headline: string;
  summary: string;
  coverage_analysis: {
    fuel_assessment: string;
    mechanic_assessment: string;
    hospital_assessment: string;
  };
  actionable_tips: string[];
}

export interface DestinationServicesData {
  destination_id: string;
  destination_name: string;
  origin?: {
    latitude: number;
    longitude: number;
    label: string;
  };
  route?: {
    distance_km: number;
    duration_formatted: string;
  };
  fuel_stations: {
    count: number;
    places: RouteServiceItem[];
  };
  mechanics: {
    count: number;
    places: RouteServiceItem[];
  };
  hospitals: {
    count: number;
    places: RouteServiceItem[];
  };
  ai_readiness_briefing?: AiServiceReadinessBriefing;
  data_freshness: 'live' | 'fallback' | 'unavailable';
  retrieved_at: string;
  retrieved_at_relative: string;
}