import { calculateHaversineDistance, estimateTravelDurationSeconds, formatDuration } from '@/lib/utils';
import { VehicleType } from '@/types';

export interface RouteResult {
  distance_m: number;
  distance_km: number;
  duration_s: number;
  duration_formatted: string;
  source: 'live_maps' | 'fallback_routing';
  polyline?: string;
  route_summary?: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  formatted_address: string;
  city: string;
  state: string;
}

export interface MapsProvider {
  calculateRoute(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    vehicleType: VehicleType
  ): Promise<RouteResult>;
  geocodeCity(query: string): Promise<GeocodeResult | null>;
}

// In-memory short-lived cache to avoid redundant API calls & respect quotas
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class GoogleMapsAdapter implements MapsProvider {
  private apiKey: string | undefined;
  private routeCache: Map<string, CacheEntry<RouteResult>> = new Map();
  private geocodeCache: Map<string, CacheEntry<GeocodeResult>> = new Map();

  constructor(apiKey?: string) {
    this.apiKey =
      apiKey ||
      process.env.GOOGLE_MAPS_SERVER_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY;
  }

  /**
   * Calculates dynamic road distance and travel duration using Google Routes API
   * with graceful fallback to realistic road topology estimation.
   */
  async calculateRoute(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    vehicleType: VehicleType = 'car'
  ): Promise<RouteResult> {
    const cacheKey = `route:${originLat.toFixed(4)}:${originLng.toFixed(4)}:${destLat.toFixed(4)}:${destLng.toFixed(4)}:${vehicleType}`;
    const cached = this.routeCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    // 1. Try Google Routes API (Preferred Modern ComputeRoutes Endpoint)
    if (this.apiKey) {
      try {
        const travelMode = vehicleType === 'bike' ? 'TWO_WHEELER' : 'DRIVE';
        const routesApiUrl = 'https://routes.googleapis.com/directions/v2:computeRoutes';

        const requestBody = {
          origin: {
            location: {
              latLng: {
                latitude: originLat,
                longitude: originLng,
              },
            },
          },
          destination: {
            location: {
              latLng: {
                latitude: destLat,
                longitude: destLng,
              },
            },
          },
          travelMode,
          routingPreference: 'TRAFFIC_UNAWARE',
          computeAlternativeRoutes: false,
        };

        const res = await fetch(routesApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': this.apiKey,
            'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.description',
          },
          body: JSON.stringify(requestBody),
          signal: AbortSignal.timeout(4000),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.routes && json.routes.length > 0) {
            const route = json.routes[0];
            const distanceM = route.distanceMeters || 0;
            // Parse duration string e.g. "12345s"
            const durationStr = route.duration || '0s';
            const durationS = parseInt(durationStr.replace('s', ''), 10) || estimateTravelDurationSeconds(distanceM, vehicleType);

            const result: RouteResult = {
              distance_m: distanceM,
              distance_km: Math.round((distanceM / 1000) * 10) / 10,
              duration_s: durationS,
              duration_formatted: formatDuration(durationS),
              source: 'live_maps',
              polyline: route.polyline?.encodedPolyline,
              route_summary: route.description || `Highway route via arterial corridors`,
            };

            this.routeCache.set(cacheKey, { data: result, expiresAt: Date.now() + 3600 * 1000 });
            return result;
          }
        }
      } catch (err) {
        // Fallback to Directions API or estimation
      }

      // Secondary check: Google Directions API
      try {
        const mode = vehicleType === 'bike' ? 'bicycling' : 'driving';
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=${mode}&key=${this.apiKey}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'OK' && json.routes && json.routes.length > 0) {
            const leg = json.routes[0].legs[0];
            const distanceM = leg.distance.value;
            const durationS = leg.duration.value;

            const result: RouteResult = {
              distance_m: distanceM,
              distance_km: Math.round((distanceM / 1000) * 10) / 10,
              duration_s: durationS,
              duration_formatted: formatDuration(durationS),
              source: 'live_maps',
              polyline: json.routes[0].overview_polyline?.points,
              route_summary: json.routes[0].summary,
            };

            this.routeCache.set(cacheKey, { data: result, expiresAt: Date.now() + 3600 * 1000 });
            return result;
          }
        }
      } catch (err) {
        // Fall through to deterministic road estimation
      }
    }

    // 2. High-accuracy deterministic fallback routing via Haversine calculation & vehicle speed profiles
    // Road distance factor typically 1.25x to 1.35x of straight-line distance in Indian topography
    const straightLineM = calculateHaversineDistance(originLat, originLng, destLat, destLng);
    const estimatedRoadM = Math.round(straightLineM * 1.28);
    const durationS = estimateTravelDurationSeconds(estimatedRoadM, vehicleType);

    const fallbackResult: RouteResult = {
      distance_m: estimatedRoadM,
      distance_km: Math.round((estimatedRoadM / 1000) * 10) / 10,
      duration_s: durationS,
      duration_formatted: formatDuration(durationS),
      source: 'fallback_routing',
      route_summary: `State/National Highway route via regional connectivity corridors`,
    };

    this.routeCache.set(cacheKey, { data: fallbackResult, expiresAt: Date.now() + 1800 * 1000 });
    return fallbackResult;
  }

  /**
   * Resolves textual user location into verified coordinates using Google Geocoding API.
   * If location is invalid, returns null (never silently defaults to random location).
   */
  async geocodeCity(query: string): Promise<GeocodeResult | null> {
    const clean = query.trim();
    if (!clean || clean.length < 2) {
      return null;
    }

    const cacheKey = `geo:${clean.toLowerCase()}`;
    const cached = this.geocodeCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    // 1. If Google API key is configured, call Google Geocoding API
    if (this.apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(clean)}&region=in&key=${this.apiKey}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            const result = data.results[0];
            const lat = result.geometry.location.lat;
            const lng = result.geometry.location.lng;

            // Extract city and state from address_components
            let city = clean;
            let state = 'India';
            for (const comp of result.address_components || []) {
              if (comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')) {
                city = comp.long_name;
              }
              if (comp.types.includes('administrative_area_level_1')) {
                state = comp.long_name;
              }
            }

            const geocodeResult: GeocodeResult = {
              latitude: lat,
              longitude: lng,
              formatted_address: result.formatted_address || `${city}, ${state}, India`,
              city,
              state,
            };

            this.geocodeCache.set(cacheKey, { data: geocodeResult, expiresAt: Date.now() + 86400 * 1000 });
            return geocodeResult;
          }
          if (data.status === 'ZERO_RESULTS') {
            return null;
          }
        }
      } catch (e) {
        // Network timeout / fallback check
      }
    }

    // 2. Verified fallback database for standard Indian hubs when running in offline/testing mode without API key
    const VERIFIED_INDIAN_LOCATIONS: Record<string, GeocodeResult> = {
      bhopal: { latitude: 23.2599, longitude: 77.4126, formatted_address: 'Bhopal, Madhya Pradesh, India', city: 'Bhopal', state: 'Madhya Pradesh' },
      indore: { latitude: 22.7196, longitude: 75.8577, formatted_address: 'Indore, Madhya Pradesh, India', city: 'Indore', state: 'Madhya Pradesh' },
      jabalpur: { latitude: 23.1815, longitude: 79.9864, formatted_address: 'Jabalpur, Madhya Pradesh, India', city: 'Jabalpur', state: 'Madhya Pradesh' },
      gwalior: { latitude: 26.2183, longitude: 78.1828, formatted_address: 'Gwalior, Madhya Pradesh, India', city: 'Gwalior', state: 'Madhya Pradesh' },
      ujjain: { latitude: 23.1765, longitude: 75.7885, formatted_address: 'Ujjain, Madhya Pradesh, India', city: 'Ujjain', state: 'Madhya Pradesh' },
      pachmarhi: { latitude: 22.4674, longitude: 78.4346, formatted_address: 'Pachmarhi, Madhya Pradesh, India', city: 'Pachmarhi', state: 'Madhya Pradesh' },
      khajuraho: { latitude: 24.8318, longitude: 79.9199, formatted_address: 'Khajuraho, Madhya Pradesh, India', city: 'Khajuraho', state: 'Madhya Pradesh' },
      rewa: { latitude: 24.5362, longitude: 81.3037, formatted_address: 'Rewa, Madhya Pradesh, India', city: 'Rewa', state: 'Madhya Pradesh' },
      sagar: { latitude: 23.8388, longitude: 78.7378, formatted_address: 'Sagar, Madhya Pradesh, India', city: 'Sagar', state: 'Madhya Pradesh' },
      satna: { latitude: 24.5800, longitude: 80.8300, formatted_address: 'Satna, Madhya Pradesh, India', city: 'Satna', state: 'Madhya Pradesh' },
      chhindwara: { latitude: 22.0574, longitude: 78.9382, formatted_address: 'Chhindwara, Madhya Pradesh, India', city: 'Chhindwara', state: 'Madhya Pradesh' },
      hoshangabad: { latitude: 22.7519, longitude: 77.7289, formatted_address: 'Narmadapuram (Hoshangabad), Madhya Pradesh, India', city: 'Narmadapuram', state: 'Madhya Pradesh' },
      narmadapuram: { latitude: 22.7519, longitude: 77.7289, formatted_address: 'Narmadapuram, Madhya Pradesh, India', city: 'Narmadapuram', state: 'Madhya Pradesh' },
      delhi: { latitude: 28.6139, longitude: 77.2090, formatted_address: 'New Delhi, Delhi, India', city: 'New Delhi', state: 'Delhi' },
      mumbai: { latitude: 19.0760, longitude: 72.8777, formatted_address: 'Mumbai, Maharashtra, India', city: 'Mumbai', state: 'Maharashtra' },
      nagpur: { latitude: 21.1458, longitude: 79.0882, formatted_address: 'Nagpur, Maharashtra, India', city: 'Nagpur', state: 'Maharashtra' },
      raipur: { latitude: 21.2514, longitude: 81.6296, formatted_address: 'Raipur, Chhattisgarh, India', city: 'Raipur', state: 'Chhattisgarh' },
      jhansi: { latitude: 25.4484, longitude: 78.5685, formatted_address: 'Jhansi, Uttar Pradesh, India', city: 'Jhansi', state: 'Uttar Pradesh' },
    };

    const cleanLower = clean.toLowerCase();
    for (const [key, value] of Object.entries(VERIFIED_INDIAN_LOCATIONS)) {
      if (cleanLower === key || cleanLower.startsWith(key) || cleanLower.includes(key)) {
        this.geocodeCache.set(cacheKey, { data: value, expiresAt: Date.now() + 86400 * 1000 });
        return value;
      }
    }

    // If query is an invalid/gibberish location, return null - DO NOT default to a random city
    return null;
  }
}

export const mapsAdapter = new GoogleMapsAdapter();
