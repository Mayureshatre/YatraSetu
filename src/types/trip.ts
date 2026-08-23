export type VehicleType = 'car' | 'bike' | 'suv' | 'bus';

export interface TripLocation {
  latitude: number;
  longitude: number;
  label: string;
}

export interface TripSession {
  id?: string;
  user_id?: string;
  origin_lat: number;
  origin_lng: number;
  origin_label: string;
  vehicle_type: VehicleType;
  duration_days: number;
  created_at?: string;
  updated_at?: string;
}
