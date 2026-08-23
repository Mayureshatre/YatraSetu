"use strict";

const test = require('node:test');
const assert = require('node:assert');
const {
  busBookingAdapter
} = require('@/lib/booking/bus-booking-adapter');
test('Bus Booking: generates valid RedBus deep-link redirect info', () => {
  const info = busBookingAdapter.generateRedirectInfo({
    origin_city: 'Bhopal',
    destination_city: 'Pachmarhi',
    travel_date: '2026-08-25',
    provider: 'redbus'
  });
  assert.strictEqual(info.provider_name, 'RedBus India');
  assert.strictEqual(info.origin_city, 'Bhopal');
  assert.strictEqual(info.destination_city, 'Pachmarhi');
  assert.ok(info.booking_url.includes('redbus.in'));
  assert.ok(info.booking_url.includes('bhopal-to-pachmarhi'));
  assert.strictEqual(info.deeplink_available, true);
});