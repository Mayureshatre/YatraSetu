const test = require('node:test');
const assert = require('node:assert');
const { busBookingAdapter } = require('@/lib/booking/bus-booking-adapter');
const { cabBookingAdapter, CAB_MAX_DISTANCE_KM } = require('@/lib/booking/cab-booking-adapter');

test('Bus Booking: generates valid RedBus deep-link redirect info', () => {
  const info = busBookingAdapter.generateRedirectInfo({
    origin_city: 'Bhopal',
    destination_city: 'Pachmarhi',
    travel_date: '2026-08-25',
    provider: 'redbus',
  });

  assert.strictEqual(info.provider_name, 'RedBus India');
  assert.strictEqual(info.origin_city, 'Bhopal');
  assert.strictEqual(info.destination_city, 'Pachmarhi');
  assert.ok(info.booking_url.includes('redbus.in'));
  assert.ok(info.booking_url.includes('bhopal-to-pachmarhi'));
  assert.strictEqual(info.deeplink_available, true);
});

test('Cab Booking: marks cab as highly suitable for trips under 100 km (e.g. Jabalpur to Bhedaghat 22km)', () => {
  const cabInfo = cabBookingAdapter.generateRedirectInfo({
    origin_city: 'Jabalpur',
    destination_city: 'Bhedaghat',
    distance_km: 22,
    provider: 'rapido',
  });

  assert.strictEqual(cabInfo.provider_name, 'Rapido Cabs & Auto');
  assert.strictEqual(cabInfo.is_suitable, true);
  assert.strictEqual(cabInfo.max_suitable_distance_km, CAB_MAX_DISTANCE_KM);
  assert.ok(cabInfo.booking_url.includes('rapido.bike'));
  assert.ok(cabInfo.suitability_message.includes('Ideal'));
});

test('Cab Booking: flags cab as less suitable for long distance trips over 100 km (e.g. Jabalpur to Ujjain 584km)', () => {
  const cabInfo = cabBookingAdapter.generateRedirectInfo({
    origin_city: 'Jabalpur',
    destination_city: 'Ujjain',
    distance_km: 584,
    provider: 'rapido',
  });

  assert.strictEqual(cabInfo.provider_name, 'Rapido Cabs & Auto');
  assert.strictEqual(cabInfo.is_suitable, false);
  assert.ok(cabInfo.suitability_message.includes('less suitable'));
  assert.ok(cabInfo.booking_url.includes('rapido.bike'));
});
