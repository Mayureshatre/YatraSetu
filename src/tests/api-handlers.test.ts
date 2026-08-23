const test = require('node:test');
const assert = require('node:assert');
const { GET: getDestinations } = require('@/app/api/destinations/route');
const { GET: getDestinationById } = require('@/app/api/destinations/[id]/route');
const { GET: getServices } = require('@/app/api/destinations/[id]/services/route');
const { GET: getCommunity } = require('@/app/api/destinations/[id]/community/route');
const { POST: createReview } = require('@/app/api/destinations/[id]/reviews/route');
const { PATCH: updateReview, DELETE: deleteReview } = require('@/app/api/reviews/[id]/route');
const { POST: createPost } = require('@/app/api/destinations/[id]/posts/route');
const { GET: getPostById, DELETE: deletePost } = require('@/app/api/posts/[id]/route');
const { POST: addComment } = require('@/app/api/posts/[id]/comments/route');
const { DELETE: deleteComment } = require('@/app/api/comments/[id]/route');
const { POST: uploadPostImage } = require('@/app/api/posts/[id]/images/route');
const { POST: votePost } = require('@/app/api/posts/[id]/vote/route');
const { POST: submitReport } = require('@/app/api/reports/route');
const { GET: getGlobalCommunity } = require('@/app/api/community/route');
const { GET: getWeather } = require('@/app/api/destinations/[id]/weather/route');
const { POST: getRecommendations } = require('@/app/api/recommendations/route');
const { POST: createItinerary } = require('@/app/api/itineraries/route');
const { GET: getBusBooking } = require('@/app/api/booking/bus/route');
const { GET: getCabBooking } = require('@/app/api/booking/cab/route');
const { GET: getRoute, POST: postBatchRoutes } = require('@/app/api/routes/route');
const { GET: getGeocode, POST: postGeocode } = require('@/app/api/geocode/route');

// Helper to create mock NextRequest
function mockRequest(url, method = 'GET', body = null, headers = {}) {
  return {
    url,
    method,
    headers: {
      get: (key) => headers[key.toLowerCase()] || null,
    },
    json: async () => body,
  };
}

test('API Handlers: GET /api/destinations returns list of destinations', async () => {
  const req = mockRequest('http://localhost:3000/api/destinations');
  const res = await getDestinations(req);
  const json = await res.json();

  assert.strictEqual(res.status, 200);
  assert.ok(json.data.length >= 30);
  assert.ok(json.meta.count >= 30);
});

test('API Handlers: GET /api/destinations/:id/weather returns 5-day forecast', async () => {
  const destId = 'c3333333-3333-3333-3333-333333333333'; // Sanchi
  const req = mockRequest(`http://localhost:3000/api/destinations/${destId}/weather`);
  const res = await getWeather(req, { params: { id: destId } });
  const json = await res.json();

  assert.strictEqual(res.status, 200);
  assert.ok(json.data.forecast);
  assert.strictEqual(json.data.forecast.length, 5);
});

test('API Handlers: GET /api/destinations/:id/services returns live route support places', async () => {
  const destId = 'a1111111-1111-1111-1111-111111111111';
  const req = mockRequest(`http://localhost:3000/api/destinations/${destId}/services?origin_lat=23.1815&origin_lng=79.9864&origin_label=Jabalpur`);
  const res = await getServices(req, { params: { id: destId } });
  const json = await res.json();

  assert.strictEqual(res.status, 200);
  assert.ok(json.data.fuel_stations.count > 0);
  assert.ok(json.data.hospitals.count > 0);
  assert.ok(json.data.fuel_stations.places[0].distance_from_origin_km > 0);
});

test('API Handlers: Community Voting and Moderation Reports endpoints', async () => {
  const destId = 'a1111111-1111-1111-1111-111111111111';

  // 1. Create a post
  const postReq = mockRequest(`http://localhost:3000/api/destinations/${destId}/posts`, 'POST', {
    user_id: 'test-vote-author',
    title: 'Monsoon Ghat Advisory for Pachmarhi',
    body: 'Drive in low gears and keep headlights on in heavy fog.',
    category: 'Safety',
  });
  const postRes = await createPost(postReq, { params: { id: destId } });
  const postJson = await postRes.json();
  const postId = postJson.data.id;

  // 2. Vote Post (Upvote)
  const voteReq = mockRequest(`http://localhost:3000/api/posts/${postId}/vote`, 'POST', {
    user_id: 'voter-007',
    vote_type: 1,
  });
  const voteRes = await votePost(voteReq, { params: { id: postId } });
  const voteJson = await voteRes.json();

  assert.strictEqual(voteRes.status, 200);
  assert.strictEqual(voteJson.data.net_votes, 2);

  // 3. Submit Report
  const reportReq = mockRequest('http://localhost:3000/api/reports', 'POST', {
    post_id: postId,
    reason: 'Duplicate post report test',
    reporter_id: 'reporter-001',
  });
  const reportRes = await submitReport(reportReq);
  const reportJson = await reportRes.json();

  assert.strictEqual(reportRes.status, 201);
  assert.strictEqual(reportJson.data.success, true);
});

test('API Handlers: GET /api/community returns global feed with filters', async () => {
  const req = mockRequest('http://localhost:3000/api/community?sort_by=popular&category=All');
  const res = await getGlobalCommunity(req);
  const json = await res.json();

  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(json.data.posts));
});

test('API Handlers: Geocode API resolves valid cities and returns 404 for invalid cities', async () => {
  // Valid GET
  const validReq = mockRequest('http://localhost:3000/api/geocode?q=Jabalpur');
  const validRes = await getGeocode(validReq);
  const validJson = await validRes.json();
  assert.strictEqual(validRes.status, 200);
  assert.strictEqual(validJson.data.city, 'Jabalpur');
  assert.ok(Math.abs(validJson.data.latitude - 23.18) < 0.1);

  // Invalid query
  const invalidReq = mockRequest('http://localhost:3000/api/geocode?q=invalidgibberishcity12345');
  const invalidRes = await getGeocode(invalidReq);
  const invalidJson = await invalidRes.json();
  assert.strictEqual(invalidRes.status, 404);
  assert.strictEqual(invalidJson.error.code, 'LOCATION_NOT_FOUND');
});

test('API Handlers: Batch Routes API calculates dynamic road distances', async () => {
  const batchReq = mockRequest('http://localhost:3000/api/routes', 'POST', {
    origin: { latitude: 23.1815, longitude: 79.9864, label: 'Jabalpur' },
    destinationIds: [
      'e5555555-5555-5555-5555-555555555555', // Bhedaghat
      '99999999-9999-9999-9999-999999999999', // Ujjain
    ],
    travelMode: 'DRIVE',
  });

  const res = await postBatchRoutes(batchReq);
  const json = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(json.data.length, 2);

  const bhedaghat = json.data.find(d => d.destinationId === 'e5555555-5555-5555-5555-555555555555');
  const ujjain = json.data.find(d => d.destinationId === '99999999-9999-9999-9999-999999999999');

  assert.ok(bhedaghat);
  assert.ok(ujjain);
  assert.ok(bhedaghat.distanceKm <= 35);
  assert.ok(ujjain.distanceKm > 450);
});

test('API Handlers: GET /api/booking/cab returns Rapido redirect metadata', async () => {
  const req = mockRequest('http://localhost:3000/api/booking/cab?origin_city=Jabalpur&destination_city=Bhedaghat&distance_km=22');
  const res = await getCabBooking(req);
  const json = await res.json();

  assert.strictEqual(res.status, 200);
  assert.strictEqual(json.data.provider_name, 'Rapido Cabs & Auto');
  assert.strictEqual(json.data.is_suitable, true);
  assert.ok(json.data.booking_url.includes('rapido.bike'));
});
