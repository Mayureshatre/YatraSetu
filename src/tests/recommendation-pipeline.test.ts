const test = require('node:test');
const assert = require('node:assert');
const { recommendationPipeline } = require('@/lib/recommendations/pipeline');

test('Pipeline: executes recommendation from Jabalpur and correctly identifies Bhedaghat (22 km) as nearby and Ujjain as far', async () => {
  const request = {
    origin_lat: 23.1815,
    origin_lng: 79.9864,
    origin_label: 'Jabalpur, Madhya Pradesh',
    vehicle_type: 'car',
    duration_days: 1,
  };

  const response = await recommendationPipeline.execute(request);

  assert.ok(response);
  assert.ok(response.recommendations.length > 0);
  assert.strictEqual(response.origin.label, 'Jabalpur, Madhya Pradesh');

  // Find Bhedaghat in recommendations
  const bhedaghat = response.recommendations.find((r) => r.slug === 'bhedaghat');
  assert.ok(bhedaghat, 'Expected Bhedaghat in Jabalpur recommendations');
  assert.ok(bhedaghat.distance_km <= 35, `Expected Bhedaghat <= 35km from Jabalpur, got ${bhedaghat.distance_km}`);
  assert.strictEqual(bhedaghat.is_within_preferred_radius, true);

  // Ujjain is ~580 km from Jabalpur, so for 1-day trip (max radius 250km), it is properly excluded or marked extended
  const ujjain = response.recommendations.find((r) => r.slug === 'ujjain');
  if (ujjain) {
    assert.ok(ujjain.distance_km > 450, `Ujjain must be > 450 km from Jabalpur, got ${ujjain.distance_km}`);
    assert.strictEqual(ujjain.is_within_preferred_radius, false);
  }
});

test('Pipeline: dynamically changes distances and candidate list when origin is switched from Jabalpur to Indore', async () => {
  // 1. From Jabalpur
  const jabalpurRes = await recommendationPipeline.execute({
    origin_lat: 23.1815,
    origin_lng: 79.9864,
    origin_label: 'Jabalpur, MP',
    vehicle_type: 'car',
    duration_days: 1,
  });

  // 2. From Indore
  const indoreRes = await recommendationPipeline.execute({
    origin_lat: 22.7196,
    origin_lng: 75.8577,
    origin_label: 'Indore, MP',
    vehicle_type: 'car',
    duration_days: 1,
  });

  // From Jabalpur, Bhedaghat (22km) and Bargi Dam (40km) must be nearby
  const bhedaghatFromJbp = jabalpurRes.recommendations.find(r => r.slug === 'bhedaghat');
  assert.ok(bhedaghatFromJbp, 'Bhedaghat should be recommended from Jabalpur');
  assert.ok(bhedaghatFromJbp.distance_km <= 35);
  assert.strictEqual(bhedaghatFromJbp.is_within_preferred_radius, true);

  // From Indore, Ujjain (55km), Mandu (95km), Maheshwar (90km), Omkareshwar (77km) must be nearby
  const ujjainFromIdr = indoreRes.recommendations.find(r => r.slug === 'ujjain');
  assert.ok(ujjainFromIdr, 'Ujjain should be recommended from Indore');
  assert.ok(ujjainFromIdr.distance_km <= 75, `Ujjain from Indore should be <= 75 km, got ${ujjainFromIdr.distance_km}`);
  assert.strictEqual(ujjainFromIdr.is_within_preferred_radius, true);

  const manduFromIdr = indoreRes.recommendations.find(r => r.slug === 'mandu');
  assert.ok(manduFromIdr, 'Mandu should be recommended from Indore');
  assert.ok(manduFromIdr.distance_km <= 110);

  // Assert that Jabalpur recommendations and Indore recommendations are genuinely different
  assert.notStrictEqual(jabalpurRes.recommendations[0].id, indoreRes.recommendations[0].id);
});

test('Pipeline: resolves textual location without initial coordinates', async () => {
  const request = {
    origin_label: 'Gwalior',
    vehicle_type: 'car',
    duration_days: 1,
  };

  const response = await recommendationPipeline.execute(request);
  assert.ok(response);
  assert.ok(response.origin.latitude > 25 && response.origin.latitude < 27);
  assert.ok(response.recommendations.length > 0);
});

test('Pipeline: throws structured error on unresolvable location', async () => {
  const request = {
    origin_label: 'invalidlocationstring999999',
    vehicle_type: 'car',
    duration_days: 1,
  };

  await assert.rejects(
    async () => {
      await recommendationPipeline.execute(request);
    },
    (err) => {
      return err.message.includes('Unable to resolve location');
    }
  );
});

test('Pipeline: vehicle-aware scoring adjusts for Motorcycle / Bike in hilly terrain', async () => {
  const bikeRequest = {
    origin_lat: 23.2599,
    origin_lng: 77.4126,
    origin_label: 'Bhopal, Madhya Pradesh',
    vehicle_type: 'bike',
    duration_days: 2,
  };

  const response = await recommendationPipeline.execute(bikeRequest);
  const pachmarhi = response.recommendations.find((r) => r.slug === 'pachmarhi');
  assert.ok(pachmarhi);
  assert.ok(pachmarhi.match_score >= 70);
  assert.ok(
    pachmarhi.ai_reason.toLowerCase().includes('motorcycle') ||
    pachmarhi.ai_reason.toLowerCase().includes('curves') ||
    pachmarhi.ai_reason.toLowerCase().includes('ghat') ||
    pachmarhi.ai_reason.toLowerCase().includes('scenic')
  );
});
