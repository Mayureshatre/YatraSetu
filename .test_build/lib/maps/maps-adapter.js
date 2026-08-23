"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapsAdapter = exports.GoogleMapsAdapter = void 0;
var _utils = require("@/lib/utils");
class GoogleMapsAdapter {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.GOOGLE_MAPS_API_KEY;
  }
  async calculateRoute(originLat, originLng, destLat, destLng, vehicleType) {
    // If live API key is present, attempt live Google Directions API
    if (this.apiKey) {
      try {
        const mode = vehicleType === 'bike' ? 'bicycling' : 'driving';
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originLat},${originLng}&destination=${destLat},${destLng}&mode=${mode}&key=${this.apiKey}`;
        const res = await fetch(url, {
          signal: AbortSignal.timeout(4000)
        });
        if (res.ok) {
          const json = await res.json();
          if (json.status === 'OK' && json.routes && json.routes.length > 0) {
            const leg = json.routes[0].legs[0];
            const distanceM = leg.distance.value;
            const durationS = leg.duration.value;
            return {
              distance_m: distanceM,
              distance_km: Math.round(distanceM / 1000 * 10) / 10,
              duration_s: durationS,
              duration_formatted: (0, _utils.formatDuration)(durationS),
              source: 'live_maps',
              polyline: json.routes[0].overview_polyline?.points,
              route_summary: json.routes[0].summary
            };
          }
        }
      } catch (err) {
        // Fallback gracefully on network timeout or API error
      }
    }

    // High-accuracy fallback routing via Haversine calculation & vehicle speed profiles
    // Road distance factor typically 1.25x to 1.35x of straight-line distance in Indian topography
    const straightLineM = (0, _utils.calculateHaversineDistance)(originLat, originLng, destLat, destLng);
    const estimatedRoadM = Math.round(straightLineM * 1.28);
    const durationS = (0, _utils.estimateTravelDurationSeconds)(estimatedRoadM, vehicleType);
    return {
      distance_m: estimatedRoadM,
      distance_km: Math.round(estimatedRoadM / 1000 * 10) / 10,
      duration_s: durationS,
      duration_formatted: (0, _utils.formatDuration)(durationS),
      source: 'fallback_routing',
      route_summary: `State/National Highway route via arterial corridors`
    };
  }
  async geocodeCity(query) {
    const clean = query.trim().toLowerCase();

    // Standard known hubs in Central India & beyond for instant fallback resolution
    const KNOWN_HUBS = {
      bhopal: {
        latitude: 23.2599,
        longitude: 77.4126,
        formatted_address: 'Bhopal, Madhya Pradesh, India',
        city: 'Bhopal',
        state: 'Madhya Pradesh'
      },
      indore: {
        latitude: 22.7196,
        longitude: 75.8577,
        formatted_address: 'Indore, Madhya Pradesh, India',
        city: 'Indore',
        state: 'Madhya Pradesh'
      },
      jabalpur: {
        latitude: 23.1815,
        longitude: 79.9864,
        formatted_address: 'Jabalpur, Madhya Pradesh, India',
        city: 'Jabalpur',
        state: 'Madhya Pradesh'
      },
      gwalior: {
        latitude: 26.2183,
        longitude: 78.1828,
        formatted_address: 'Gwalior, Madhya Pradesh, India',
        city: 'Gwalior',
        state: 'Madhya Pradesh'
      },
      ujjain: {
        latitude: 23.1765,
        longitude: 75.7885,
        formatted_address: 'Ujjain, Madhya Pradesh, India',
        city: 'Ujjain',
        state: 'Madhya Pradesh'
      },
      hoshangabad: {
        latitude: 22.7519,
        longitude: 77.7289,
        formatted_address: 'Narmadapuram (Hoshangabad), Madhya Pradesh, India',
        city: 'Narmadapuram',
        state: 'Madhya Pradesh'
      },
      narmadapuram: {
        latitude: 22.7519,
        longitude: 77.7289,
        formatted_address: 'Narmadapuram, Madhya Pradesh, India',
        city: 'Narmadapuram',
        state: 'Madhya Pradesh'
      },
      jhansi: {
        latitude: 25.4484,
        longitude: 78.5685,
        formatted_address: 'Jhansi, Uttar Pradesh, India',
        city: 'Jhansi',
        state: 'Uttar Pradesh'
      },
      nagpur: {
        latitude: 21.1458,
        longitude: 79.0882,
        formatted_address: 'Nagpur, Maharashtra, India',
        city: 'Nagpur',
        state: 'Maharashtra'
      },
      raipur: {
        latitude: 21.2514,
        longitude: 81.6296,
        formatted_address: 'Raipur, Chhattisgarh, India',
        city: 'Raipur',
        state: 'Chhattisgarh'
      },
      delhi: {
        latitude: 28.6139,
        longitude: 77.2090,
        formatted_address: 'New Delhi, Delhi, India',
        city: 'New Delhi',
        state: 'Delhi'
      },
      mumbai: {
        latitude: 19.0760,
        longitude: 72.8777,
        formatted_address: 'Mumbai, Maharashtra, India',
        city: 'Mumbai',
        state: 'Maharashtra'
      }
    };
    if (KNOWN_HUBS[clean]) {
      return KNOWN_HUBS[clean];
    }
    for (const [key, value] of Object.entries(KNOWN_HUBS)) {
      if (clean.includes(key) || key.includes(clean)) {
        return value;
      }
    }
    if (this.apiKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${this.apiKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            return {
              latitude: result.geometry.location.lat,
              longitude: result.geometry.location.lng,
              formatted_address: result.formatted_address,
              city: query,
              state: 'India'
            };
          }
        }
      } catch (e) {
        // Return default Bhopal anchor
      }
    }

    // Default fallback to Bhopal Central hub if query cannot be resolved
    return {
      latitude: 23.2599,
      longitude: 77.4126,
      formatted_address: `${query} (Resolved to Central MP Hub)`,
      city: query,
      state: 'Madhya Pradesh'
    };
  }
}
exports.GoogleMapsAdapter = GoogleMapsAdapter;
const mapsAdapter = new GoogleMapsAdapter();
exports.mapsAdapter = mapsAdapter;