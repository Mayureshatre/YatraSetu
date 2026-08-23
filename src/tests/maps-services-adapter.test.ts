const test = require('node:test');
const assert = require('node:assert');
const { mapsAdapter } = require('@/lib/maps/maps-adapter');
const { routeServicesAdapter } = require('@/lib/services/services-adapter');
const { placePhotosAdapter } = require('@/lib/images/place-photos-adapter');
const { db } = require('@/lib/db/supabase');

test('Maps Adapter: calculates accurate route distance and travel time for Bhopal to Sanchi', async () => {
  // Bhopal: 23.2599, 77.4126 | Sanchi: 23.4800, 77.7400
  const route = await mapsAdapter.calculateRoute(23.2599, 77.4126, 23.4800, 77.7400, 'car');

  assert.ok(route.distance_km >= 40 && route.distance_km <= 65);
  assert.ok(route.duration_s > 0);
  assert.ok(route.duration_formatted.includes('min') || route.duration_formatted.includes('hr'));
});

test('Maps Adapter: calculates dynamic, non-static distances from different origins', async () => {
  // Target: Ujjain Mahakaleshwar (23.1765, 75.7885)
  const ujjainLat = 23.1765;
  const ujjainLng = 75.7885;

  // 1. From Indore (22.7196, 75.8577) -> ~50-65 km
  const routeFromIndore = await mapsAdapter.calculateRoute(22.7196, 75.8577, ujjainLat, ujjainLng, 'car');

  // 2. From Bhopal (23.2599, 77.4126) -> ~180-210 km
  const routeFromBhopal = await mapsAdapter.calculateRoute(23.2599, 77.4126, ujjainLat, ujjainLng, 'car');

  // 3. From Jabalpur (23.1815, 79.9864) -> ~500-600 km
  const routeFromJabalpur = await mapsAdapter.calculateRoute(23.1815, 79.9864, ujjainLat, ujjainLng, 'car');

  // Verify that all 3 distances are genuinely different and accurate
  assert.ok(routeFromIndore.distance_km < 80, `Expected Indore to Ujjain < 80 km, got ${routeFromIndore.distance_km}`);
  assert.ok(routeFromBhopal.distance_km > 150 && routeFromBhopal.distance_km < 250, `Expected Bhopal to Ujjain ~190 km, got ${routeFromBhopal.distance_km}`);
  assert.ok(routeFromJabalpur.distance_km > 450, `Expected Jabalpur to Ujjain > 450 km, got ${routeFromJabalpur.distance_km}`);

  // Assert non-static behavior
  assert.notStrictEqual(routeFromIndore.distance_km, routeFromBhopal.distance_km);
  assert.notStrictEqual(routeFromBhopal.distance_km, routeFromJabalpur.distance_km);
});

test('Maps Adapter: geocodes multiple Indian cities dynamically', async () => {
  const cities = ['Jabalpur', 'Bhopal', 'Indore', 'Gwalior', 'Pachmarhi', 'Khajuraho'];
  for (const city of cities) {
    const res = await mapsAdapter.geocodeCity(city);
    assert.ok(res, `Failed to geocode ${city}`);
    assert.ok(res.latitude !== 0 && res.longitude !== 0);
    assert.ok(res.formatted_address.length > 0);
  }
});

test('Route Services Adapter: returns live/verified services along user route with distance from origin & detour', async () => {
  // Test route: Jabalpur to Mahakaleshwar (Ujjain)
  const jabalpurLat = 23.1815;
  const jabalpurLng = 79.9864;
  const ujjainLat = 23.1765;
  const ujjainLng = 75.7885;
  const destId = '99999999-9999-9999-9999-999999999999';

  const services = await routeServicesAdapter.getRouteServices(
    destId,
    ujjainLat,
    ujjainLng,
    'Ujjain Mahakal',
    jabalpurLat,
    jabalpurLng,
    'Jabalpur, MP',
    'car'
  );

  assert.ok(services);
  assert.strictEqual(services.destination_id, destId);
  assert.ok(services.fuel_stations.count > 0);
  assert.ok(services.mechanics.count > 0);
  assert.ok(services.hospitals.count > 0);
  assert.ok(services.route);
  assert.ok(services.route.distance_km > 450);

  // Check fuel place fields (distance from origin, detour, rating)
  const firstFuel = services.fuel_stations.places[0];
  assert.ok(firstFuel.distance_from_origin_km > 0);
  assert.ok(firstFuel.detour_km !== undefined);
  assert.strictEqual(firstFuel.type, 'fuel');

  // Check mechanic place fields
  const firstMech = services.mechanics.places[0];
  assert.ok(firstMech.distance_from_origin_km > 0);
  assert.strictEqual(firstMech.type, 'mechanic');

  // Check hospital place fields
  const firstHosp = services.hospitals.places[0];
  assert.ok(firstHosp.distance_from_origin_km > 0);
  assert.strictEqual(firstHosp.type, 'hospital');
});

test('Place Photos Adapter: verifies place photo resolution and licensing provenance', async () => {
  const photo = await placePhotosAdapter.getVerifiedPlacePhoto(
    'Sanchi Stupa',
    23.4800,
    77.7400,
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220'
  );

  assert.ok(photo);
  assert.ok(photo.url);
  assert.ok(photo.source);
  assert.ok(photo.license);
});
