export interface BusBookingRedirectParams {
  origin_city: string;
  destination_city: string;
  travel_date?: string;
  provider?: 'redbus' | 'abhibus' | 'state_transport';
}

export interface BusBookingRedirectInfo {
  provider_name: string;
  origin_city: string;
  destination_city: string;
  travel_date: string;
  booking_url: string;
  deeplink_available: boolean;
  disclaimer: string;
}

export interface CabBookingRedirectParams {
  origin_city: string;
  destination_city: string;
  distance_km?: number;
  origin_lat?: number;
  origin_lng?: number;
  dest_lat?: number;
  dest_lng?: number;
  provider?: 'rapido';
}

export interface CabBookingRedirectInfo {
  provider_name: string;
  origin_city: string;
  destination_city: string;
  distance_km: number;
  is_suitable: boolean;
  max_suitable_distance_km: number;
  booking_url: string;
  deeplink_available: boolean;
  suitability_message: string;
  disclaimer: string;
}

export interface TravelOptionsSummary {
  bus: BusBookingRedirectInfo;
  cab: CabBookingRedirectInfo;
  distance_km: number;
  duration_formatted: string;
}
