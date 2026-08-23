export type DestinationCategory =
  | 'Hill Station & Nature'
  | 'Heritage & Architecture'
  | 'UNESCO Heritage & History'
  | 'Historical Citadel & Romantic Heritage'
  | 'Geological Wonder & River Gorge'
  | 'Palatial Heritage & Riverside Culture'
  | 'Wildlife Safari & Tiger Reserve'
  | 'Prehistoric Archaeology & Caves'
  | 'Pilgrimage & Spiritual Culture'
  | 'Culture, Weaving Heritage & Spiritual'
  | string;

export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  latitude: number;
  longitude: number;
  category: DestinationCategory;
  region: string;
  hero_image_url?: string | null;
  image_source?: string | null;
  image_source_url?: string | null;
  image_alt?: string | null;
  image_credit?: string | null;
  image_license?: string | null;
  image_verified_at?: string | null;
  road_condition?: string | null;
  safety_tips?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface DestinationWithDistance extends Destination {
  distance_m: number;
  distance_km: number;
  duration_s: number;
  duration_formatted: string;
  is_within_preferred_radius: boolean; // <= 100 km
}
