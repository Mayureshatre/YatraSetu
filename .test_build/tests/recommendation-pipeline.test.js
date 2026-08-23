"use strict";

const test = require('node:test');
const assert = require('node:assert');
const {
  recommendationPipeline
} = require('@/lib/recommendations/pipeline');
test('Pipeline: executes recommendation from Bhopal and prefers <= 100km radius', async () => {
  const request = {
    origin_lat: 23.2599,
    origin_lng: 77.4126,
    origin_label: 'Bhopal, Madhya Pradesh',
    vehicle_type: 'car',
    duration_days: 1
  };
  const response = await recommendationPipeline.execute(request);
  assert.ok(response);
  assert.ok(response.recommendations.length > 0);
  assert.strictEqual(response.origin.label, 'Bhopal, Madhya Pradesh');
  assert.strictEqual(response.vehicle_type, 'car');

  // Verify rank ordering 1, 2, 3...
  for (let i = 0; i < response.recommendations.length; i++) {
    assert.strictEqual(response.recommendations[i].rank, i + 1);
    assert.ok(response.recommendations[i].match_score >= 0 && response.recommendations[i].match_score <= 100);
    assert.ok(response.recommendations[i].ai_reason.length > 10);
  }

  // Verify Sanchi (approx 46 km) is within preferred 100km radius
  const sanchi = response.recommendations.find(r => r.slug === 'sanchi');
  assert.ok(sanchi);
  assert.strictEqual(sanchi.is_within_preferred_radius, true);
  assert.strictEqual(sanchi.is_extended_radius, false);
});
test('Pipeline: vehicle-aware scoring adjusts for Motorcycle / Bike in hilly terrain', async () => {
  const bikeRequest = {
    origin_lat: 23.2599,
    origin_lng: 77.4126,
    origin_label: 'Bhopal, Madhya Pradesh',
    vehicle_type: 'bike',
    duration_days: 2
  };
  const response = await recommendationPipeline.execute(bikeRequest);
  const pachmarhi = response.recommendations.find(r => r.slug === 'pachmarhi');
  assert.ok(pachmarhi);
  assert.ok(pachmarhi.match_score >= 70);
  assert.ok(pachmarhi.ai_reason.toLowerCase().includes('riding') || pachmarhi.ai_reason.toLowerCase().includes('winding') || pachmarhi.ai_reason.toLowerCase().includes('scenic'));
});