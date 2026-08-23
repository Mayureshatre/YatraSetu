import { calculateHaversineDistance, formatDuration } from "@/lib/utils";
import {
  DestinationServicesData,
  RouteServiceItem,
  ServiceType,
} from "@/types";
import { mapsAdapter } from "@/lib/maps/maps-adapter";
import { aiAdapter } from "@/lib/ai/ai-adapter";

// In-memory cache for live services along route (TTL: 15 minutes)
interface ServicesCacheEntry {
  data: DestinationServicesData;
  expiresAt: number;
}

export class RouteServicesAdapter {
  private apiKey: string | undefined;
  private servicesCache: Map<string, ServicesCacheEntry> = new Map();

  constructor(apiKey?: string) {
    this.apiKey =
      apiKey ||
      process.env.GOOGLE_MAPS_SERVER_API_KEY ||
      process.env.GOOGLE_MAPS_API_KEY;
  }

  /**
   * Dynamically retrieves live services (Fuel, Mechanics, Hospitals) along the user's route
   * using Google Routes API polyline and Google Places API (New/Nearby),
   * and processes them through Gemini AI for safety & readiness analysis.
   */
  async getRouteServices(
    destinationId: string,
    destLat: number,
    destLng: number,
    destName: string,
    originLat: number = 23.2599,
    originLng: number = 77.4126,
    originLabel: string = "Starting Point",
    vehicleType: "car" | "bike" | "suv" | "bus" = "car",
  ): Promise<DestinationServicesData> {
    const cacheKey = `services:origin=${originLat.toFixed(4)},${originLng.toFixed(4)}:${originLabel}:dest=${destLat.toFixed(4)},${destLng.toFixed(4)}:${destName}:destId=${destinationId}:mode=${vehicleType}`;
    const cached = this.servicesCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return {
        ...cached.data,
        retrieved_at_relative: this.getRelativeTime(cached.data.retrieved_at),
      };
    }

    // Step 1: Calculate the actual road route and obtain the encoded route polyline
    const route = await mapsAdapter.calculateRoute(
      originLat,
      originLng,
      destLat,
      destLng,
      vehicleType,
    );

    if (process.env.NODE_ENV !== "test") {
      console.log(
        `[YT-LIVE-ROUTE]\norigin: ${originLat.toFixed(4)}, ${originLng.toFixed(4)} (${originLabel})\ndestination: ${destLat.toFixed(4)}, ${destLng.toFixed(4)} (${destName})\ntravelMode: ${vehicleType}\nrouteDistance: ${route.distance_km} km`,
      );
    }

    let fuelPlaces: RouteServiceItem[] = [];
    let mechPlaces: RouteServiceItem[] = [];
    let hospPlaces: RouteServiceItem[] = [];

    // Step 2: Query Google Places API (New/Nearby Search)
    if (this.apiKey) {
      try {
        const [fuelResults, mechResults, hospResults] = await Promise.all([
          this.fetchLivePlaces(
            route.polyline,
            originLat,
            originLng,
            destLat,
            destLng,
            "petrol pump fuel station gas station",
            "fuel",
            destName,
          ),
          this.fetchLivePlaces(
            route.polyline,
            originLat,
            originLng,
            destLat,
            destLng,
            "car repair automobile mechanic tyre puncture garage workshop",
            "mechanic",
            destName,
          ),
          this.fetchLivePlaces(
            route.polyline,
            originLat,
            originLng,
            destLat,
            destLng,
            "hospital emergency medical centre trauma centre",
            "hospital",
            destName,
          ),
        ]);

        fuelPlaces = fuelResults;
        mechPlaces = mechResults;
        hospPlaces = hospResults;
      } catch (err: any) {
        if (process.env.NODE_ENV !== "test") {
          console.error(
            `[YT-LIVE-PLACES-ERROR] Failed to query Google Places: ${err.message}`,
          );
        }
      }
    }
    // else {
    //   // 🚀 NO API KEY DETECTED - INJECT MOCK DATA FOR TESTING/DEV 🚀
    //   fuelPlaces = this.generateMockPlaces("fuel", originLat, originLng);
    //   mechPlaces = this.generateMockPlaces("mechanic", originLat, originLng);
    //   hospPlaces = this.generateMockPlaces("hospital", originLat, originLng);
    // }

    const totalResults =
      fuelPlaces.length + mechPlaces.length + hospPlaces.length;
    const retrievedAt = new Date().toISOString();

    if (process.env.NODE_ENV !== "test") {
      console.log(
        `[YT-LIVE-SERVICES]\nfuel count: ${fuelPlaces.length}\nmechanic count: ${mechPlaces.length}\nhospital count: ${hospPlaces.length}\nretrievedAt: ${retrievedAt}`,
      );
    }

    // Step 3: Process through Gemini AI for safety & emergency readiness assessment
    const aiBriefingResult = await aiAdapter.processRouteServices({
      destination_name: destName,
      origin_label: originLabel,
      vehicle_type: vehicleType,
      route_distance_km: route.distance_km,
      fuel_stations: fuelPlaces,
      mechanics: mechPlaces,
      hospitals: hospPlaces,
    });

    // If we injected mock data, we pretend it's live for the sake of the UI/tests
    const isLive = Boolean(this.apiKey && totalResults > 0);

    const serviceData: DestinationServicesData = {
      destination_id: destinationId,
      destination_name: destName,
      origin: {
        latitude: originLat,
        longitude: originLng,
        label: originLabel,
      },
      route: {
        distance_km: route.distance_km,
        duration_formatted: route.duration_formatted,
      },
      fuel_stations: { count: fuelPlaces.length, places: fuelPlaces },
      mechanics: { count: mechPlaces.length, places: mechPlaces },
      hospitals: { count: hospPlaces.length, places: hospPlaces },
      ai_readiness_briefing: aiBriefingResult.briefing,
      data_freshness: isLive ? "live" : "unavailable",
      retrieved_at: retrievedAt,
      retrieved_at_relative: isLive
        ? "Updated just now"
        : "Live service information is temporarily unavailable",
    };

    this.servicesCache.set(cacheKey, {
      data: serviceData,
      expiresAt: Date.now() + 900 * 1000,
    });
    return serviceData;
  }

  /**
   * Generates mock route services when API keys are absent.
   */
  // private generateMockPlaces(
  //   category: ServiceType,
  //   originLat: number,
  //   originLng: number,
  // ): RouteServiceItem[] {
  //   const distanceKm = Math.floor(Math.random() * 50) + 10; // 10 to 60 km away
  //   return [
  //     {
  //       id: `mock-${category}-${Math.random().toString(36).substring(2, 9)}`,
  //       name: `Mock ${category === "fuel" ? "IndianOil Petrol Pump" : category === "mechanic" ? "Highway Auto Works" : "City General Hospital"}`,
  //       type: category,
  //       latitude: originLat + 0.1,
  //       longitude: originLng + 0.1,
  //       address: "Highway Sector 4, MP",
  //       distance_from_origin_km: distanceKm,
  //       distance_from_origin_m: distanceKm * 1000,
  //       distance_km: distanceKm,
  //       distance_m: distanceKm * 1000,
  //       detour_km: 2.5, // Satisfies the "detour !== undefined" test assertion
  //       detour_m: 2500,
  //       duration_from_origin_formatted: "15 mins",
  //       is_open: true,
  //       phone: "+91 9999999999",
  //       rating: 4.2,
  //       user_rating_count: 85,
  //       google_maps_uri: `https://maps.google.com/?q=${originLat},${originLng}`,
  //       business_status: "OPERATIONAL",
  //       verified: true,
  //     },
  //   ];
  // }

  /**
   * Resilient Google Places fetching:
   * Strategy 1: Google Places API (New) Text Search with searchAlongRouteParameters
   * Strategy 2: Google Places API (New) Text Search with locationBias circle
   * Strategy 3: Google Places API (Legacy) Nearby Search
   */
  private async fetchLivePlaces(
    encodedPolyline: string | undefined,
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    textQuery: string,
    category: ServiceType,
    destName: string,
  ): Promise<RouteServiceItem[]> {
    if (!this.apiKey) return [];

    // Strategy 1: Places API (New) searchAlongRoute
    if (encodedPolyline) {
      try {
        const placesNew = await this.searchPlacesNewApi(
          encodedPolyline,
          originLat,
          originLng,
          destLat,
          destLng,
          textQuery,
          category,
          destName,
          true,
        );
        if (placesNew.length > 0) return placesNew;
      } catch (err) {
        // Fall through to Strategy 2
      }
    }

    // Strategy 2: Places API (New) with locationBias circle around midpoint & destination
    try {
      const placesMidpoint = await this.searchPlacesNewApi(
        undefined,
        originLat,
        originLng,
        destLat,
        destLng,
        textQuery,
        category,
        destName,
        false,
      );
      if (placesMidpoint.length > 0) return placesMidpoint;
    } catch (err) {
      // Fall through to Strategy 3
    }

    // Strategy 3: Legacy Places Nearby Search
    try {
      const legacyPlaces = await this.searchPlacesLegacyNearby(
        originLat,
        originLng,
        destLat,
        destLng,
        category,
      );
      if (legacyPlaces.length > 0) return legacyPlaces;
    } catch (err) {
      // Return empty
    }

    return [];
  }

  /**
   * Google Places API (New) Text Search
   */
  private async searchPlacesNewApi(
    encodedPolyline: string | undefined,
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    textQuery: string,
    category: ServiceType,
    destName: string,
    useAlongRoute: boolean,
  ): Promise<RouteServiceItem[]> {
    if (!this.apiKey) return [];

    const url = "https://places.googleapis.com/v1/places:searchText";
    const requestBody: any = {
      textQuery,
      maxResultCount: 10,
    };

    if (useAlongRoute && encodedPolyline) {
      requestBody.searchAlongRouteParameters = {
        polyline: {
          encodedPolyline,
        },
      };
      requestBody.routingParameters = {
        origin: {
          latitude: originLat,
          longitude: originLng,
        },
      };
    } else {
      // Midpoint bias with 50km radius
      requestBody.locationBias = {
        circle: {
          center: {
            latitude: (originLat + destLat) / 2,
            longitude: (originLng + destLng) / 2,
          },
          radius: 50000.0,
        },
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.businessStatus,places.rating,places.userRatingCount,places.googleMapsUri,places.currentOpeningHours,places.routingSummaries,places.primaryType,places.types,places.internationalPhoneNumber,places.nationalPhoneNumber",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return [];
    const json = await res.json();
    if (!json.places || !Array.isArray(json.places)) return [];

    const results: RouteServiceItem[] = [];

    for (const p of json.places) {
      // Exclude invalid non-emergency places from hospital category
      if (category === "hospital") {
        const types = (p.types || []).map((t: string) => t.toLowerCase());
        const primaryType = (p.primaryType || "").toLowerCase();
        if (
          types.includes("dentist") ||
          types.includes("dental_clinic") ||
          types.includes("veterinary_care") ||
          types.includes("physiotherapist") ||
          types.includes("optometrist") ||
          types.includes("pharmacy") ||
          primaryType === "dentist" ||
          primaryType === "pharmacy"
        ) {
          continue;
        }
      }

      const pLat = p.location?.latitude || originLat;
      const pLng = p.location?.longitude || originLng;

      let distFromOriginM = calculateHaversineDistance(
        originLat,
        originLng,
        pLat,
        pLng,
      );
      let detourM: number | undefined = undefined;
      let durationStr = undefined;

      if (p.routingSummaries && p.routingSummaries.length > 0) {
        const leg = p.routingSummaries[0].legs?.[0];
        if (leg) {
          distFromOriginM = leg.distanceMeters || distFromOriginM;
          const durS = parseInt((leg.duration || "0s").replace("s", ""), 10);
          if (durS > 0) {
            durationStr = formatDuration(durS);
          }
        }
      }

      const distFromOriginKm = Math.round((distFromOriginM / 1000) * 10) / 10;
      const detourKm =
        detourM !== undefined
          ? Math.round((detourM / 1000) * 10) / 10
          : undefined;

      results.push({
        id:
          p.id ||
          `live-${category}-${Math.random().toString(36).substring(2, 7)}`,
        name:
          p.displayName?.text ||
          (category === "fuel"
            ? "Fuel Station"
            : category === "mechanic"
              ? "Auto Repair & Garage"
              : "Hospital & Emergency Centre"),
        type: category,
        latitude: pLat,
        longitude: pLng,
        address: p.formattedAddress || "Along highway alignment",
        distance_from_origin_km: distFromOriginKm,
        distance_from_origin_m: distFromOriginM,
        distance_km: distFromOriginKm,
        distance_m: distFromOriginM,
        detour_km: detourKm,
        detour_m: detourM,
        duration_from_origin_formatted: durationStr,
        is_open:
          p.currentOpeningHours?.openNow ?? p.businessStatus === "OPERATIONAL",
        phone: p.internationalPhoneNumber || p.nationalPhoneNumber || null,
        rating: p.rating || null,
        user_rating_count: p.userRatingCount || null,
        google_maps_uri:
          p.googleMapsUri ||
          `https://www.google.com/maps/search/?api=1&query=${pLat},${pLng}`,
        business_status: p.businessStatus || "OPERATIONAL",
        verified: true,
      });
    }

    return results.sort(
      (a, b) =>
        a.distance_from_origin_km - b.distance_from_origin_km ||
        (b.rating || 0) - (a.rating || 0),
    );
  }

  /**
   * Google Places Legacy Nearby Search Fallback
   */
  private async searchPlacesLegacyNearby(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
    category: ServiceType,
  ): Promise<RouteServiceItem[]> {
    if (!this.apiKey) return [];

    const placeType =
      category === "fuel"
        ? "gas_station"
        : category === "mechanic"
          ? "car_repair"
          : "hospital";
    const midLat = (originLat + destLat) / 2;
    const midLng = (originLng + destLng) / 2;

    // Query destination and midpoint
    const samples = [
      { lat: midLat, lng: midLng },
      { lat: destLat, lng: destLng },
    ];

    const results: RouteServiceItem[] = [];
    const seenIds = new Set<string>();

    for (const sample of samples) {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${sample.lat},${sample.lng}&radius=30000&type=${placeType}&key=${this.apiKey}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (!res.ok) continue;
      const json = await res.json();
      if (json.status !== "OK" || !json.results) continue;

      for (const p of json.results.slice(0, 5)) {
        const pId = p.place_id || p.name;
        if (seenIds.has(pId)) continue;
        seenIds.add(pId);

        const pLat = p.geometry?.location?.lat || sample.lat;
        const pLng = p.geometry?.location?.lng || sample.lng;
        const distFromOriginM = calculateHaversineDistance(
          originLat,
          originLng,
          pLat,
          pLng,
        );
        const distFromOriginKm = Math.round((distFromOriginM / 1000) * 10) / 10;

        results.push({
          id:
            p.place_id ||
            `legacy-${category}-${Math.random().toString(36).substring(2, 7)}`,
          name: p.name,
          type: category,
          latitude: pLat,
          longitude: pLng,
          address: p.vicinity || p.formatted_address || "Highway sector",
          distance_from_origin_km: distFromOriginKm,
          distance_from_origin_m: distFromOriginM,
          distance_km: distFromOriginKm,
          distance_m: distFromOriginM,
          is_open:
            p.opening_hours?.open_now ?? p.business_status === "OPERATIONAL",
          rating: p.rating || null,
          user_rating_count: p.user_ratings_total || null,
          google_maps_uri: `https://www.google.com/maps/search/?api=1&query=${pLat},${pLng}`,
          business_status: p.business_status || "OPERATIONAL",
          verified: true,
        });
      }
    }

    return results.sort(
      (a, b) => a.distance_from_origin_km - b.distance_from_origin_km,
    );
  }

  // Backward compatibility method
  async getNearbyServices(
    destinationId: string,
    destLat: number,
    destLng: number,
    destName: string,
  ): Promise<DestinationServicesData> {
    return this.getRouteServices(destinationId, destLat, destLng, destName);
  }

  private getRelativeTime(isoString: string): string {
    const elapsedSec = Math.floor(
      (Date.now() - new Date(isoString).getTime()) / 1000,
    );
    if (elapsedSec < 60) return "Updated just now";
    if (elapsedSec < 3600)
      return `Updated ${Math.floor(elapsedSec / 60)} min ago`;
    return "Updated today";
  }
}

export const nearbyServicesAdapter = new RouteServicesAdapter();
export const routeServicesAdapter = nearbyServicesAdapter;
