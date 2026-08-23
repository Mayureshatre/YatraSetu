"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aiAdapter = exports.HybridAiAdapter = void 0;
var _schemas = require("@/lib/validation/schemas");
class HybridAiAdapter {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.AI_PROVIDER_API_KEY;
  }
  async rankDestinations(input) {
    // 1. If API Key is present, attempt live LLM call
    if (this.apiKey) {
      try {
        const liveResult = await this.callLiveAiForRanking(input);
        if (liveResult) {
          return {
            ranked: liveResult,
            source: 'ai'
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
      source: 'fallback_engine'
    };
  }
  async generateItinerary(input) {
    if (this.apiKey) {
      try {
        const liveItin = await this.callLiveAiForItinerary(input);
        if (liveItin) {
          return {
            summary: liveItin.summary,
            items: liveItin.items,
            source: 'ai'
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
      source: 'fallback_engine'
    };
  }
  async callLiveAiForRanking(input) {
    // Construct structured prompt strictly requesting JSON schema
    const prompt = `You are YatraSetu's travel intelligence ranking engine.
User Trip Context:
- Origin: ${input.origin_label}
- Vehicle: ${input.vehicle_type}
- Duration: ${input.duration_days} day(s)
${input.interests ? `- Interests: ${input.interests.join(', ')}` : ''}

Candidate Destinations:
${JSON.stringify(input.candidates, null, 2)}

Instructions:
1. Rank candidates based on suitability for the vehicle, distance, road condition, and duration.
2. Preferred radius is <= 100 km. Give candidates within 100km higher baseline priority. For candidates > 100km, only include them if they have high justification for the trip duration, and provide an 'extension_justification'.
3. Assign a match_score (0-100).
4. Provide a concise, factual 1-2 sentence ai_reason explaining why it fits this vehicle and trip context.
5. Return strictly a JSON object with key "ranked_destinations" matching the schema:
{"ranked_destinations": [{"destination_id": "...", "match_score": 95, "ai_reason": "...", "is_extended_radius": false, "extension_justification": ""}]}`;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      }),
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        const validated = _schemas.aiRecommendationsOutputSchema.safeParse(parsed);
        if (validated.success) {
          return validated.data.ranked_destinations;
        }
      }
    }
    return null;
  }
  async callLiveAiForItinerary(input) {
    const prompt = `You are YatraSetu's flexible itinerary designer.
Create a ${input.duration_days}-day relaxed, flexible travel itinerary for ${input.destination_name} (${input.destination_category}).
Description: ${input.description}
${input.vehicle_type ? `Vehicle: ${input.vehicle_type}` : ''}

Instructions:
1. Provide a concise overall summary of the trip.
2. For each day (from 1 to ${input.duration_days}), provide:
   - title: Theme of the day (e.g. "Heritage Morning & Ancient Stupas")
   - description: Practical suggested flow without rigid timestamps.
   - timing_suggestion: (e.g. "Morning 8:00 AM - 12:00 PM")
   - activities: array of key activities
3. Output strictly valid JSON matching:
{"summary": "...", "items": [{"day_number": 1, "title": "...", "description": "...", "timing_suggestion": "...", "activities": ["..."]}]}`;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3
        }
      }),
      signal: AbortSignal.timeout(5000)
    });
    if (res.ok) {
      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const parsed = JSON.parse(rawText);
        const validated = _schemas.aiItineraryOutputSchema.safeParse(parsed);
        if (validated.success) {
          return validated.data;
        }
      }
    }
    return null;
  }

  /**
   * Deterministic Multi-Factor Scoring Engine (Guarantees robust, zero-downtime ranking)
   */
  generateDeterministicRanking(input) {
    return input.candidates.map(c => {
      let score = 70;
      let reasons = [];

      // 1. Distance scoring (100km preferred radius)
      if (c.distance_km <= 50) {
        score += 18;
        reasons.push(`Ideal quick getaway at only ${c.distance_km} km (${c.duration_formatted})`);
      } else if (c.distance_km <= 100) {
        score += 12;
        reasons.push(`Comfortably within the preferred 100 km radius (${c.distance_km} km)`);
      } else {
        // > 100 km
        if (input.duration_days >= 2) {
          score += 4;
          reasons.push(`Extended ${c.distance_km} km journey well justified by your ${input.duration_days}-day trip duration`);
        } else {
          score -= 10;
          reasons.push(`Extended distance (${c.distance_km} km) for a 1-day trip, recommended for early morning start`);
        }
      }

      // 2. Vehicle-Specific Alignment
      if (input.vehicle_type === 'bike') {
        if (c.category.includes('Hill') || c.category.includes('Nature') || c.road_condition.toLowerCase().includes('scenic') || c.road_condition.toLowerCase().includes('ghat')) {
          score += 10;
          reasons.push('Scenic winding roads offer a superb riding experience for 2-wheelers');
        } else {
          score += 4;
          reasons.push('Comfortable paved transit suitable for motorcycles');
        }
      } else if (input.vehicle_type === 'suv') {
        if (c.category.includes('Wildlife') || c.category.includes('Hill') || c.road_condition.toLowerCase().includes('ghat')) {
          score += 10;
          reasons.push('High ground clearance and power make it exceptionally well suited for this terrain');
        } else {
          score += 5;
          reasons.push('Spacious and smooth long-distance cruising');
        }
      } else if (input.vehicle_type === 'bus') {
        if (c.road_condition.toLowerCase().includes('highway') || c.road_condition.toLowerCase().includes('expressway') || c.road_condition.toLowerCase().includes('4-lane')) {
          score += 8;
          reasons.push('Excellent regular intercity bus frequency and highway connectivity');
        } else {
          score += 2;
          reasons.push('Connecting bus services available from regional hubs');
        }
      } else {
        // Car
        if (c.road_condition.toLowerCase().includes('smooth') || c.road_condition.toLowerCase().includes('highway') || c.road_condition.toLowerCase().includes('4-lane')) {
          score += 8;
          reasons.push('Paved dual-carriageway ensures a relaxing self-drive experience');
        }
      }

      // 3. Duration alignment
      if (input.duration_days === 1 && c.distance_km <= 75) {
        score += 5;
      } else if (input.duration_days > 1 && (c.category.includes('Hill') || c.category.includes('Wildlife') || c.category.includes('UNESCO'))) {
        score += 6;
      }
      const clampedScore = Math.min(99, Math.max(45, score));
      const aiReason = reasons.slice(0, 2).join('. ') + '.';
      const isExtended = c.distance_km > 100;
      return {
        destination_id: c.id,
        match_score: clampedScore,
        ai_reason: aiReason,
        is_extended_radius: isExtended,
        extension_justification: isExtended ? `Premium destination offering multi-day depth suitable for your ${input.duration_days}-day itinerary.` : undefined
      };
    }).sort((a, b) => b.match_score - a.match_score);
  }

  /**
   * Deterministic Flexible Itinerary Builder
   */
  generateDeterministicItinerary(input) {
    const days = Math.max(1, input.duration_days);
    const items = [];
    if (days === 1) {
      items.push({
        day_number: 1,
        title: `Explore Highlights of ${input.destination_name}`,
        description: `Arrive in the morning, tour the iconic ${input.destination_category} landmarks, capture photographs, and enjoy authentic local culinary specialties before an easy evening return.`,
        timing_suggestion: '8:30 AM - 5:30 PM',
        activities: ['Monument walkthrough', 'Local market & craft visit', 'Sunset viewpoint'],
        sequence: 1
      });
    } else if (days === 2) {
      items.push({
        day_number: 1,
        title: `Arrival & Core Heritage Highlights`,
        description: `Morning scenic drive to ${input.destination_name}. Check into your stay and spend the afternoon exploring primary heritage structures and viewpoints.`,
        timing_suggestion: 'Morning to Late Afternoon',
        activities: ['Scenic road trip', 'Primary site exploration', 'Evening cultural aarti / sound & light show'],
        sequence: 1
      }, {
        day_number: 2,
        title: `Nature Trails, Local Crafts & Departure`,
        description: `Enjoy a crisp morning nature trail or temple visit. Sample traditional breakfast, explore artisanal handicraft stalls, and begin a relaxed return journey.`,
        timing_suggestion: 'Early Morning to Late Afternoon',
        activities: ['Sunrise trail / boat ride', 'Handloom & souvenir shopping', 'Return highway drive'],
        sequence: 2
      });
    } else {
      // 3+ days
      items.push({
        day_number: 1,
        title: `Scenic Drive & Landmark Discovery`,
        description: `Arrive via highway, check into your retreat, and take an introductory tour of the main archaeological and architectural marvels.`,
        timing_suggestion: '9:00 AM - 5:00 PM',
        activities: ['Arrival & check-in', 'Main complex tour', 'Sunset vantage point'],
        sequence: 1
      }, {
        day_number: 2,
        title: `Deep Cultural Immersion & Nature Safaris`,
        description: `Dedicate a full day to immersive experiences—guided heritage walks, waterfalls, river ghats or forest safaris with local storytellers.`,
        timing_suggestion: 'Full Day (Flexible)',
        activities: ['Guided heritage/nature trail', 'Local cuisine lunch', 'Photography session'],
        sequence: 2
      });
      for (let d = 3; d <= days; d++) {
        items.push({
          day_number: d,
          title: d === days ? `Artisanal Villages, Souvenirs & Farewell` : `Off-the-beaten-path Exploration (Day ${d})`,
          description: d === days ? `Visit traditional craft communities, savor regional breakfast, and wrap up with a picturesque return drive.` : `Discover tranquil surrounding rural temples, hidden viewpoints, and serene river banks at your own pace.`,
          timing_suggestion: 'Morning to Afternoon',
          activities: ['Village/handloom visit', 'Relaxed cafe lunch', 'Smooth return drive'],
          sequence: d
        });
      }
    }
    return {
      summary: `A carefully paced ${days}-day itinerary for ${input.destination_name} crafted for ${input.vehicle_type || 'vehicle'} travel, balancing core sightseeing, authentic local flavors, and relaxed transit.`,
      items
    };
  }
}
exports.HybridAiAdapter = HybridAiAdapter;
const aiAdapter = new HybridAiAdapter();
exports.aiAdapter = aiAdapter;