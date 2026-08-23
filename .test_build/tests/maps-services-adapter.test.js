"use strict";

const test = require('node:test');
const assert = require('node:assert');
const {
  mapsAdapter
} = require('@/lib/maps/maps-adapter');
const {
  nearbyServicesAdapter
} = require('@/lib/services/services-adapter');
test('Maps Adapter: calculates accurate route distance and travel time for Bhopal to Sanchi', async () => {
  // Bhopal: 23.2599, 77.4126 | Sanchi: 23.4800, 77.7400
  const route = await mapsAdapter.calculateRoute(23.2599, 77.4126, 23.4800, 77.7400, 'car');
  assert.ok(route.distance_km >= 40 && route.distance_km <= 60);
  assert.ok(route.duration_s > 0);
  assert.ok(route.duration_formatted.includes('min') || route.duration_formatted.includes('hr'));
});
test('Maps Adapter: geocodes known central hubs with fallback resolution', async () => {
  const res = await mapsAdapter.geocodeCity('Jabalpur');
  assert.ok(res);
  assert.strictEqual(res.city, 'Jabalpur');
  assert.ok(Math.abs(res.latitude - 23.18) < 0.1);
});
test('Services Adapter: returns fuel, mechanic, and hospital places with data freshness tag', async () => {
  const destinationId = 'a1111111-1111-1111-1111-111111111111'; // Pachmarhi
  const services = await nearbyServicesAdapter.getNearbyServices(destinationId, 22.4674, 78.4346, 'Pachmarhi');
  assert.ok(services);
  assert.strictEqual(services.destination_id, destinationId);
  assert.ok(services.fuel_stations.count > 0);
  assert.ok(services.mechanics.count > 0);
  assert.ok(services.hospitals.count > 0);
  assert.ok(['live', 'fallback'].includes(services.data_freshness));
  assert.strictEqual(services.fuel_stations.places[0].type, 'fuel');
  assert.strictEqual(services.mechanics.places[0].type, 'mechanic');
  assert.strictEqual(services.hospitals.places[0].type, 'hospital');
});