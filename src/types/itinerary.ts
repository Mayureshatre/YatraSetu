export interface ItineraryItem {
  id?: string;
  itinerary_id?: string;
  day_number: number;
  title: string;
  description: string;
  destination_id?: string | null;
  sequence: number;
  timing_suggestion?: string;
  activities?: string[];
}

export interface FlexibleItinerary {
  id?: string;
  trip_id?: string;
  destination_id: string;
  destination_name?: string;
  summary: string;
  duration_days: number;
  generated_by: 'ai' | 'fallback_engine';
  items: ItineraryItem[];
  created_at?: string;
  updated_at?: string;
}
