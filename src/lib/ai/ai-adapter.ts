import {
  aiRecommendationsOutputSchema,
  aiItineraryOutputSchema,
  aiServiceReadinessOutputSchema,
} from '@/lib/validation/schemas';

import {
  DestinationWeatherData,
  DestinationServicesData,
  AiServiceReadinessBriefing,
  RouteServiceItem,
  ItineraryItem,
  VehicleType,
} from '@/types';

export interface AiPromptCandidate {
  id: string;
  name: string;
  category: string;
  distance_km: number;
  duration_formatted: string;
  road_condition: string;
  safety_tips: string[];
  is_within_preferred_radius: boolean;
}

export interface AiRankingInput {
  origin_label: string;
  vehicle_type: VehicleType;
  duration_days: number;
  interests?: string[];
  candidates: AiPromptCandidate[];
}

export interface AiItineraryInput {
  destination_name: string;
  destination_category: string;
  description: string;
  duration_days: number;
  vehicle_type?: VehicleType;
  weather?: DestinationWeatherData | null;
  services?: DestinationServicesData | null;
}

export interface AiServicesProcessingInput {
  destination_name: string;
  origin_label: string;
  vehicle_type: VehicleType;
  route_distance_km: number;
  fuel_stations: RouteServiceItem[];
  mechanics: RouteServiceItem[];
  hospitals: RouteServiceItem[];
}

export interface AiAdapter {
  rankDestinations(input: AiRankingInput): Promise<{
    ranked: Array<{
      destination_id: string;
      match_score: number;
      ai_reason: string;
      is_extended_radius?: boolean;
      extension_justification?: string;
    }>;
    source: 'ai' | 'fallback_engine';
  }>;

  generateItinerary(input: AiItineraryInput): Promise<{
    summary: string;
    items: ItineraryItem[];
    source: 'ai' | 'fallback_engine';
  }>;

  processRouteServices(input: AiServicesProcessingInput): Promise<{
    briefing: AiServiceReadinessBriefing;
    source: 'ai' | 'fallback_engine';
  }>;
}

export class HybridAiAdapter implements AiAdapter {
  private apiKey: string | undefined;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.AI_PROVIDER_API_KEY;
  }

  async rankDestinations(input: AiRankingInput) {
    // 1. If API Key is present, attempt live LLM call
    if (this.apiKey) {
      try {
        const liveResult = await this.callLiveAiForRanking(input);

        if (liveResult) {
          return {
            ranked: liveResult,
            source: 'ai' as const,
          };
        }
      } catch (err) {
        // Fallback gracefully on AI error/timeout
      }
    }

    // 2. Deterministic Structured Heuristic Fallback Engine
    const fallbackRanked = this.generateDeterministicRanking(input);

    return {
      ranked: fallbackRanked,
      source: 'fallback_engine' as const,
    };
  }

  async generateItinerary(input: AiItineraryInput) {
    if (this.apiKey) {
      try {
        const liveItin = await this.callLiveAiForItinerary(input);

        if (liveItin) {
          return {
            summary: liveItin.summary,
            items: liveItin.items,
            source: 'ai' as const,
          };
        }
      } catch (err) {
        // Fallback gracefully
      }
    }

    const fallbackItin = this.generateDeterministicItinerary(input);

    return {
      summary: fallbackItin.summary,
      items: fallbackItin.items,
      source: 'fallback_engine' as const,
    };
  }

  async processRouteServices(input: AiServicesProcessingInput) {
    if (this.apiKey) {
      try {
        const liveBriefing = await this.callLiveAiForServices(input);

        if (liveBriefing) {
          return {
            briefing: liveBriefing,
            source: 'ai' as const,
          };
        }
      } catch (err) {
        // Fallback gracefully to structured deterministic briefing
      }
    }

    const fallbackBriefing =
      this.generateDeterministicServiceBriefing(input);

    return {
      briefing: fallbackBriefing,
      source: 'fallback_engine' as const,
    };
  }

  private async callLiveAiForRanking(input: AiRankingInput) {
    const prompt = `You are YatraSetu's travel intelligence ranking engine.

CRITICAL INSTRUCTIONS ON DISTANCE AND TIME:
- DO NOT calculate, estimate, or hallucinate geographical distances or travel times.
- The distance_km and duration_formatted provided for each candidate are VERIFIED and authoritative from Google Maps Routes API.
- You must use these verified numbers verbatim to evaluate suitability and generate explanations.

User Trip Context:
- Starting Origin: ${input.origin_label}
- Selected Vehicle: ${input.vehicle_type}
- Trip Duration: ${input.duration_days} day(s)
${input.interests && input.interests.length > 0 ? `- Traveler Interests: ${input.interests.join(', ')}` : ''}

Verified Candidate Destinations (with verified road distance & travel time):
${JSON.stringify(input.candidates, null, 2)}

Ranking Guidelines:
1. Prioritize candidates where is_within_preferred_radius is true (distance_km <= 100 km).
2. For candidates with distance_km > 100 km, include them only if they are well-justified by the trip duration (${input.duration_days} day(s)), and set is_extended_radius to true with an 'extension_justification'.
3. Assign a match_score (0-100) taking into account vehicle compatibility (e.g. scenic ghats for bikes, rough terrain for SUVs, highways for cars/buses).
4. Provide a concise, factual 1-2 sentence ai_reason explaining why it fits this vehicle and trip context. Reference the verified road distance and travel time.
5. Return strictly a JSON object with key "ranked_destinations" matching this schema:
{
  "ranked_destinations": [
    {
      "destination_id": "string",
      "match_score": 95,
      "ai_reason": "string",
      "is_extended_radius": false,
      "extension_justification": ""
    }
  ]
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
        signal: AbortSignal.timeout(6000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const rawText =
        data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText) {
        const parsed = JSON.parse(rawText);
        const validated =
          aiRecommendationsOutputSchema.safeParse(parsed);

        if (validated.success) {
          return validated.data.ranked_destinations;
        }
      }
    }

    return null;
  }

  private async callLiveAiForItinerary(input: AiItineraryInput) {
    const weatherSummary = input.weather?.forecast
      ?.map(
        (f) =>
          `${f.dayOfWeek}: ${f.condition}, ${f.temperatureMax}°C / ${f.temperatureMin}°C, ${f.precipitationProbability}% rain`
      )
      .join('; ');

    const serviceSummary = input.services
      ? `${input.services.fuel_stations.count} fuel stations, ${input.services.mechanics.count} mechanics, and ${input.services.hospitals.count} hospitals monitored along route`
      : '';

    const prompt = `You are YatraSetu's flexible itinerary designer.
Create a ${input.duration_days}-day relaxed, flexible travel itinerary for ${input.destination_name} (${input.destination_category}).
Description: ${input.description}
${input.vehicle_type ? `Vehicle: ${input.vehicle_type}` : ''}
${weatherSummary ? `Verified 5-Day Weather Forecast: ${weatherSummary}` : ''}
${serviceSummary ? `Route Emergency Readiness: ${serviceSummary}` : ''}

CRITICAL RULES:
- DO NOT invent, calculate or alter verified meteorological weather numbers or route distances.
- If rain or high temperatures are forecast, provide practical weather-aware tips (e.g. carry rainwear or start early morning).

Instructions:
1. Provide a concise overall summary of the trip.
2. For each day (from 1 to ${input.duration_days}), provide:
   - title: Theme of the day (e.g. "Heritage Morning & Ancient Stupas")
   - description: Practical suggested flow without rigid timestamps.
   - timing_suggestion: (e.g. "Morning 8:30 AM - 1:00 PM")
   - activities: array of key activities
3. Output strictly valid JSON matching:
{"summary": "...", "items": [{"day_number": 1, "title": "...", "description": "...", "timing_suggestion": "...", "activities": ["..."]}]}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        }),
        signal: AbortSignal.timeout(6000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const rawText =
        data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText) {
        const parsed = JSON.parse(rawText);

        const validated =
          aiItineraryOutputSchema.safeParse(parsed);

        if (validated.success) {
          /*
           * The AI schema does not contain `sequence`,
           * but the application's ItineraryItem type requires it.
           *
           * Add a deterministic sequence number here so the
           * AI response matches the application's internal type.
           */
          return {
            summary: validated.data.summary,
            items: validated.data.items.map((item, index) => ({
              ...item,
              sequence: index + 1,
            })),
          };
        }
      }
    }

    return null;
  }

  private async callLiveAiForServices(
    input: AiServicesProcessingInput
  ): Promise<AiServiceReadinessBriefing | null> {
    const prompt = `You are YatraSetu's Road Safety and Emergency Travel Intelligence Engine.
Analyze the live emergency facilities retrieved from Google Places along the traveler's highway route.

Route Context:
- Starting Origin: ${input.origin_label}
- Destination: ${input.destination_name}
- Mode of Travel: ${input.vehicle_type}
- Route Road Distance: ${input.route_distance_km} km

Live Facilities Found Along Route:
- Fuel Stations (${input.fuel_stations.length}): ${JSON.stringify(
      input.fuel_stations
        .slice(0, 8)
        .map((p) => ({
          name: p.name,
          dist_km: p.distance_from_origin_km,
          isOpen: p.is_open,
          rating: p.rating,
        })),
      null,
      2
    )}
- 24/7 Mechanics & Garages (${input.mechanics.length}): ${JSON.stringify(
      input.mechanics
        .slice(0, 8)
        .map((p) => ({
          name: p.name,
          dist_km: p.distance_from_origin_km,
          isOpen: p.is_open,
          rating: p.rating,
        })),
      null,
      2
    )}
- Emergency Hospitals (${input.hospitals.length}): ${JSON.stringify(
      input.hospitals
        .slice(0, 8)
        .map((p) => ({
          name: p.name,
          dist_km: p.distance_from_origin_km,
          isOpen: p.is_open,
          rating: p.rating,
        })),
      null,
      2
    )}

Instructions:
1. Evaluate the emergency readiness along this route:
   - safety_score: an integer from 0 to 100 based on density and availability of facilities for this ${input.vehicle_type} journey.
   - readiness_level: "High" (well-covered with frequent fuel, mechanics, medical), "Moderate" (adequate but has stretches with fewer facilities), or "Low" (sparse emergency facilities).
2. headline: A crisp 1-sentence headline summarizing route safety (e.g. "Excellent Highway Corridor with Frequent Fuel & Breakdown Support").
3. summary: A concise 2-sentence overview evaluating travel preparedness.
4. coverage_analysis: 1-sentence specific assessments for fuel_assessment, mechanic_assessment, and hospital_assessment.
5. actionable_tips: Array of 2-3 specific, actionable recommendations tailored for a ${input.vehicle_type} on this ${input.route_distance_km} km route.

Output strictly valid JSON matching this schema:
{
  "safety_score": 88,
  "readiness_level": "High",
  "headline": "...",
  "summary": "...",
  "coverage_analysis": {
    "fuel_assessment": "...",
    "mechanic_assessment": "...",
    "hospital_assessment": "..."
  },
  "actionable_tips": [
    "...",
    "..."
  ]
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        }),
        signal: AbortSignal.timeout(6000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const rawText =
        data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (rawText) {
        const parsed = JSON.parse(rawText);

        const validated =
          aiServiceReadinessOutputSchema.safeParse(parsed);

        if (validated.success) {
          return validated.data;
        }
      }
    }

    return null;
  }

  /**
   * Deterministic Multi-Factor Scoring Engine
   * Guarantees robust, zero-downtime ranking.
   */
  private generateDeterministicRanking(input: AiRankingInput) {
    return input.candidates
      .map((c) => {
        let score = 70;
        const reasons: string[] = [];

        // 1. Distance scoring (100km preferred radius)
        if (c.distance_km <= 50) {
          score += 18;

          reasons.push(
            `Ideal quick getaway at only ${c.distance_km} km (${c.duration_formatted}) from ${input.origin_label.split(',')[0]}`
          );
        } else if (c.distance_km <= 100) {
          score += 12;

          reasons.push(
            `Comfortably within the preferred 100 km radius at ${c.distance_km} km (${c.duration_formatted})`
          );
        } else {
          // > 100 km
          if (input.duration_days >= 2) {
            score += 4;

            reasons.push(
              `Extended ${c.distance_km} km drive (${c.duration_formatted}) well justified for a ${input.duration_days}-day trip`
            );
          } else {
            score -= 12;

            reasons.push(
              `Longer distance (${c.distance_km} km, ~${c.duration_formatted}) for a 1-day trip; early morning start advised`
            );
          }
        }

        // 2. Vehicle-Specific Alignment
        if (input.vehicle_type === 'bike') {
          if (
            c.category.includes('Hill') ||
            c.category.includes('Nature') ||
            c.road_condition.toLowerCase().includes('scenic') ||
            c.road_condition.toLowerCase().includes('ghat')
          ) {
            score += 10;
            reasons.push(
              'Scenic curves and mountain ghats offer an exhilarating motorcycle ride'
            );
          } else {
            score += 4;
            reasons.push(
              'Smooth paved highway corridors well-suited for two-wheelers'
            );
          }
        } else if (input.vehicle_type === 'suv') {
          if (
            c.category.includes('Wildlife') ||
            c.category.includes('Hill') ||
            c.road_condition.toLowerCase().includes('ghat')
          ) {
            score += 10;
            reasons.push(
              'High ground clearance and power are ideal for this terrain'
            );
          } else {
            score += 5;
            reasons.push(
              'Spacious and smooth long-distance cruising'
            );
          }
        } else if (input.vehicle_type === 'bus') {
          if (
            c.road_condition.toLowerCase().includes('highway') ||
            c.road_condition.toLowerCase().includes('expressway') ||
            c.road_condition.toLowerCase().includes('4-lane')
          ) {
            score += 8;
            reasons.push(
              'Frequent direct intercity bus schedules and highway connectivity'
            );
          } else {
            score += 2;
            reasons.push(
              'Connecting bus services available from regional hubs'
            );
          }
        } else {
          // Car
          if (
            c.road_condition.toLowerCase().includes('smooth') ||
            c.road_condition.toLowerCase().includes('highway') ||
            c.road_condition.toLowerCase().includes('4-lane')
          ) {
            score += 8;
            reasons.push(
              'Well-paved dual carriageway ensures an effortless drive'
            );
          }
        }

        // 3. Duration alignment
        if (
          input.duration_days === 1 &&
          c.distance_km <= 75
        ) {
          score += 5;
        } else if (
          input.duration_days > 1 &&
          (c.category.includes('Hill') ||
            c.category.includes('Wildlife') ||
            c.category.includes('UNESCO'))
        ) {
          score += 6;
        }

        const clampedScore = Math.min(
          99,
          Math.max(40, score)
        );

        const aiReason =
          reasons.slice(0, 2).join('. ') + '.';

        const isExtended = c.distance_km > 100;

        return {
          destination_id: c.id,
          match_score: clampedScore,
          ai_reason: aiReason,
          is_extended_radius: isExtended,
          extension_justification: isExtended
            ? `Destination offers multi-day depth suitable for your ${input.duration_days}-day itinerary.`
            : undefined,
        };
      })
      .sort((a, b) => b.match_score - a.match_score);
  }

  /**
   * Deterministic Flexible Itinerary Builder
   */
  private generateDeterministicItinerary(input: AiItineraryInput) {
    const days = Math.max(1, input.duration_days);
    const items: ItineraryItem[] = [];

    if (days === 1) {
      items.push({
        day_number: 1,
        title: `Explore Highlights of ${input.destination_name}`,
        description: `Arrive in the morning, tour the iconic ${input.destination_category} landmarks, capture photographs, and enjoy authentic local culinary specialties before an easy evening return.`,
        timing_suggestion: '8:30 AM - 5:30 PM',
        activities: [
          'Monument walkthrough',
          'Local market & craft visit',
          'Sunset viewpoint',
        ],
        sequence: 1,
      });
    } else if (days === 2) {
      items.push(
        {
          day_number: 1,
          title: `Arrival & Core Heritage Highlights`,
          description: `Morning scenic drive to ${input.destination_name}. Check into your stay and spend the afternoon exploring primary heritage structures and viewpoints.`,
          timing_suggestion: 'Morning to Late Afternoon',
          activities: [
            'Scenic road trip',
            'Primary site exploration',
            'Evening cultural aarti / sound & light show',
          ],
          sequence: 1,
        },
        {
          day_number: 2,
          title: `Nature Trails, Local Crafts & Departure`,
          description:
            `Enjoy a crisp morning nature trail or temple visit. Sample traditional breakfast, explore artisanal handicraft stalls, and begin a relaxed return journey.`,
          timing_suggestion:
            'Early Morning to Late Afternoon',
          activities: [
            'Sunrise trail / boat ride',
            'Handloom & souvenir shopping',
            'Return highway drive',
          ],
          sequence: 2,
        }
      );
    } else {
      // 3+ days
      items.push(
        {
          day_number: 1,
          title: `Scenic Drive & Landmark Discovery`,
          description:
            `Arrive via highway, check into your retreat, and take an introductory tour of the main archaeological and architectural marvels.`,
          timing_suggestion: '9:00 AM - 5:00 PM',
          activities: [
            'Arrival & check-in',
            'Main complex tour',
            'Sunset vantage point',
          ],
          sequence: 1,
        },
        {
          day_number: 2,
          title: `Deep Cultural Immersion & Nature Safaris`,
          description:
            `Dedicate a full day to immersive experiences—guided heritage walks, waterfalls, river ghats or forest safaris with local storytellers.`,
          timing_suggestion: 'Full Day (Flexible)',
          activities: [
            'Guided heritage/nature trail',
            'Local cuisine lunch',
            'Photography session',
          ],
          sequence: 2,
        }
      );

      for (let d = 3; d <= days; d++) {
        items.push({
          day_number: d,
          title:
            d === days
              ? `Artisanal Villages, Souvenirs & Farewell`
              : `Off-the-beaten-path Exploration (Day ${d})`,
          description:
            d === days
              ? `Visit traditional craft communities, savor regional breakfast, and wrap up with a picturesque return drive.`
              : `Discover tranquil surrounding rural temples, hidden viewpoints, and serene river banks at your own pace.`,
          timing_suggestion: 'Morning to Afternoon',
          activities: [
            'Village/handloom visit',
            'Relaxed cafe lunch',
            'Smooth return drive',
          ],
          sequence: d,
        });
      }
    }

    return {
      summary: `A carefully paced ${days}-day itinerary for ${input.destination_name} crafted for ${input.vehicle_type || 'vehicle'} travel, balancing core sightseeing, authentic local flavors, and relaxed transit.`,
      items,
    };
  }

  /**
   * Deterministic Service Readiness Briefing Engine
   */
  private generateDeterministicServiceBriefing(
    input: AiServicesProcessingInput
  ): AiServiceReadinessBriefing {
    const fuelCount = input.fuel_stations.length;
    const mechCount = input.mechanics.length;
    const hospCount = input.hospitals.length;
    const totalCount =
      fuelCount + mechCount + hospCount;

    let score = 65;

    if (fuelCount >= 3) {
      score += 12;
    } else if (fuelCount >= 1) {
      score += 6;
    } else {
      score -= 15;
    }

    if (mechCount >= 2) {
      score += 10;
    } else if (mechCount >= 1) {
      score += 5;
    } else {
      score -= 10;
    }

    if (hospCount >= 2) {
      score += 10;
    } else if (hospCount >= 1) {
      score += 5;
    } else {
      score -= 10;
    }

    if (
      input.route_distance_km > 200 &&
      fuelCount < 2
    ) {
      score -= 8;
    }

    const safetyScore = Math.min(
      98,
      Math.max(35, score)
    );

    const readinessLevel:
      | 'High'
      | 'Moderate'
      | 'Low' =
      safetyScore >= 80
        ? 'High'
        : safetyScore >= 60
          ? 'Moderate'
          : 'Low';

    const originCity = input.origin_label
      .split(',')[0]
      .trim();

    const destCity = input.destination_name
      .split(' ')[0]
      .trim();

    const headline =
      readinessLevel === 'High'
        ? `Excellent Highway Support Corridor between ${originCity} and ${destCity}`
        : readinessLevel === 'Moderate'
          ? `Adequate Emergency Readiness with Strategic Stops between ${originCity} and ${destCity}`
          : `Caution: Limited Direct Support Facilities on Route to ${destCity}`;

    const summary =
      totalCount > 0
        ? `Monitored ${totalCount} live assistance facilities along this ${input.route_distance_km} km ${input.vehicle_type} corridor. Emergency and breakdown readiness is rated ${readinessLevel.toLowerCase()} based on real-time service proximity.`
        : `Live places search indicates limited direct highway commercial facilities along this ${input.route_distance_km} km stretch. Pre-journey vehicle inspection and refueling at ${originCity} are recommended.`;

    const fuelAssessment =
      fuelCount > 0
        ? `${fuelCount} operational fuel station${fuelCount > 1 ? 's' : ''} detected along the highway alignment.`
        : `Limited branded fuel stations along immediate route; tank up before departure.`;

    const mechanicAssessment =
      mechCount > 0
        ? `${mechCount} auto repair / puncture garage${mechCount > 1 ? 's' : ''} accessible along the transit corridor.`
        : `No direct 24/7 mechanics verified on this segment; carry essential spare tools and tyre inflator.`;

    const hospitalAssessment =
      hospCount > 0
        ? `${hospCount} emergency medical centre${hospCount > 1 ? 's' : ''} situated within response radius.`
        : `Major medical facilities located in primary urban hubs at ${originCity} and ${destCity}.`;

    const tips: string[] = [];

    if (input.vehicle_type === 'bike') {
      tips.push(
        'Check tyre pressure and carry a compact puncture kit before riding highway ghats.'
      );
      tips.push(
        'Hydrate and plan rest stops at verified fuel plazas every 60-80 km.'
      );
    } else if (input.vehicle_type === 'suv') {
      tips.push(
        'Ideal ground clearance for regional roads; ensure 4x4 fluid levels are checked for hilly sections.'
      );
      tips.push(
        'Top up washer fluid and verify spare tyre condition before long stretches.'
      );
    } else if (input.vehicle_type === 'bus') {
      tips.push(
        'Ensure schedule alignment with major highway toll interchange stops.'
      );
      tips.push(
        'Confirm passenger refreshment stops at designated commercial plazas.'
      );
    } else {
      // Car
      tips.push(
        'Ensure fuel tank is at least half full before departing major city limits.'
      );
      tips.push(
        'Save 108 emergency ambulance and national highway breakdown helpline numbers.'
      );
    }

    return {
      safety_score: safetyScore,
      readiness_level: readinessLevel,
      headline,
      summary,
      coverage_analysis: {
        fuel_assessment: fuelAssessment,
        mechanic_assessment: mechanicAssessment,
        hospital_assessment: hospitalAssessment,
      },
      actionable_tips: tips,
    };
  }
}

export const aiAdapter = new HybridAiAdapter();