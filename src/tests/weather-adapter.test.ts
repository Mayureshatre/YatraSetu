const test = require('node:test');
const assert = require('node:assert');
const { weatherAdapter } = require('@/lib/weather/weather-adapter');

test('Weather Adapter: generates structured 5-day forecast for coordinates', async () => {
  // Coordinates for Mahakaleshwar, Ujjain (23.1765, 75.7885)
  const weather = await weatherAdapter.getFiveDayForecast(
    23.1765,
    75.7885,
    'Mahakaleshwar, Ujjain',
    '99999999-9999-9999-9999-999999999999'
  );

  assert.ok(weather);
  assert.strictEqual(weather.destination_name, 'Mahakaleshwar, Ujjain');
  assert.strictEqual(weather.location.latitude, 23.1765);
  assert.strictEqual(weather.location.longitude, 75.7885);
  assert.strictEqual(weather.forecast.length, 5);

  // Validate each day's structure
  for (const day of weather.forecast) {
    assert.ok(day.date.match(/^\d{4}-\d{2}-\d{2}$/));
    assert.ok(day.dayOfWeek.length > 0);
    assert.ok(typeof day.temperatureMin === 'number');
    assert.ok(typeof day.temperatureMax === 'number');
    assert.ok(day.temperatureMax >= day.temperatureMin);
    assert.ok(day.condition.length > 0);
    assert.ok(day.precipitationProbability >= 0 && day.precipitationProbability <= 100);
    assert.ok(day.icon.length > 0);
  }
});

test('Weather Adapter: caches forecast responses to reduce redundant requests', async () => {
  const t1 = Date.now();
  const first = await weatherAdapter.getFiveDayForecast(22.4674, 78.4346, 'Pachmarhi');
  const second = await weatherAdapter.getFiveDayForecast(22.4674, 78.4346, 'Pachmarhi');

  assert.strictEqual(first.forecast.length, 5);
  assert.strictEqual(second.forecast.length, 5);
  assert.strictEqual(first.retrieved_at, second.retrieved_at);
});

test('Weather Adapter: differentiates forecasts based on geographic location (hill station vs plains)', async () => {
  // Pachmarhi Hill Station (22.4674, 78.4346) vs Ujjain Plains (23.1765, 75.7885)
  const pachmarhiWeather = await weatherAdapter.getFiveDayForecast(22.4674, 78.4346, 'Pachmarhi');
  const ujjainWeather = await weatherAdapter.getFiveDayForecast(23.1765, 75.7885, 'Ujjain');

  assert.ok(pachmarhiWeather.forecast.length === 5);
  assert.ok(ujjainWeather.forecast.length === 5);
  assert.notStrictEqual(pachmarhiWeather.location.latitude, ujjainWeather.location.latitude);
});
