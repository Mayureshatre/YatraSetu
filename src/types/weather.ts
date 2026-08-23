export interface DailyForecast {
  date: string;                     // YYYY-MM-DD
  dayOfWeek: string;                // "Monday", "Tuesday", etc.
  temperatureMin: number;           // Celsius
  temperatureMax: number;           // Celsius
  condition: string;                // e.g. "Partly Cloudy", "Light Rain"
  precipitationProbability: number;    // 0 to 100 (%)
  rainMm: number;                   // rain volume in mm
  humidity: number;                 // 0 to 100 (%)
  windSpeed: number;                // km/h
  icon: string;                     // Emoji/Icon representation
}

export interface DestinationWeatherData {
  destination_id?: string;
  destination_name?: string;
  location: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  current?: {
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
  };
  forecast: DailyForecast[];
  data_freshness: 'live' | 'fallback' | 'unavailable';
  retrieved_at: string;
  retrieved_at_relative: string;
}
