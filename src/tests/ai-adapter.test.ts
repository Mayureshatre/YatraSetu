const test = require('node:test');
const assert = require('node:assert');
const { aiAdapter } = require('@/lib/ai/ai-adapter');

test('AI Adapter: generates deterministic flexible itinerary for 3 days', async () => {
  const result = await aiAdapter.generateItinerary({
    destination_name: 'Pachmarhi',
    destination_category: 'Hill Station & Nature',
    description: 'Pristine waterfalls and forest viewpoints in Satpura range.',
    duration_days: 3,
    vehicle_type: 'suv',
  });

  assert.ok(result.summary);
  assert.strictEqual(result.items.length, 3);
  assert.strictEqual(result.items[0].day_number, 1);
  assert.strictEqual(result.items[1].day_number, 2);
  assert.strictEqual(result.items[2].day_number, 3);
  assert.ok(result.items[0].activities.length > 0);
});

test('AI Adapter: generates fallback ranking with justification for extended radius', async () => {
  const input = {
    origin_label: 'Bhopal, MP',
    vehicle_type: 'car',
    duration_days: 2,
    candidates: [
      {
        id: 'c-1',
        name: 'Nearby Heritage Stupa',
        category: 'Heritage',
        distance_km: 45,
        duration_formatted: '50 mins',
        road_condition: 'Smooth 4-lane highway',
        safety_tips: [],
        is_within_preferred_radius: true,
      },
      {
        id: 'c-2',
        name: 'Distant National Park',
        category: 'Wildlife',
        distance_km: 220,
        duration_formatted: '4 hrs 30 mins',
        road_condition: 'State highway with forest trails',
        safety_tips: [],
        is_within_preferred_radius: false,
      },
    ],
  };

  const { ranked, source } = await aiAdapter.rankDestinations(input);
  assert.ok(ranked.length === 2);
  assert.ok(ranked[0].match_score >= ranked[1].match_score);
  assert.strictEqual(ranked.find(r => r.destination_id === 'c-2').is_extended_radius, true);
});
