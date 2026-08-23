"use strict";

const test = require('node:test');
const assert = require('node:assert');
const {
  GET: getDestinations
} = require('@/app/api/destinations/route');
const {
  GET: getDestinationById
} = require('@/app/api/destinations/[id]/route');
const {
  GET: getServices
} = require('@/app/api/destinations/[id]/services/route');
const {
  GET: getCommunity
} = require('@/app/api/destinations/[id]/community/route');
const {
  POST: createReview
} = require('@/app/api/destinations/[id]/reviews/route');
const {
  PATCH: updateReview,
  DELETE: deleteReview
} = require('@/app/api/reviews/[id]/route');
const {
  POST: createPost
} = require('@/app/api/destinations/[id]/posts/route');
const {
  GET: getPostById,
  DELETE: deletePost
} = require('@/app/api/posts/[id]/route');
const {
  POST: addComment
} = require('@/app/api/posts/[id]/comments/route');
const {
  DELETE: deleteComment
} = require('@/app/api/comments/[id]/route');
const {
  POST: uploadPostImage
} = require('@/app/api/posts/[id]/images/route');
const {
  POST: getRecommendations
} = require('@/app/api/recommendations/route');
const {
  POST: createItinerary
} = require('@/app/api/itineraries/route');
const {
  GET: getBusBooking
} = require('@/app/api/booking/bus/route');

// Helper to create mock NextRequest
function mockRequest(url, method = 'GET', body = null, headers = {}) {
  return {
    url,
    method,
    headers: {
      get: key => headers[key.toLowerCase()] || null
    },
    json: async () => body
  };
}
test('API Handlers: GET /api/destinations returns list of destinations', async () => {
  const req = mockRequest('http://localhost:3000/api/destinations');
  const res = await getDestinations(req);
  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(json.data.length >= 6);
  assert.ok(json.meta.count >= 6);
});
test('API Handlers: GET /api/destinations/:id returns 404 for nonexistent id', async () => {
  const req = mockRequest('http://localhost:3000/api/destinations/invalid-id');
  const res = await getDestinationById(req, {
    params: {
      id: 'invalid-id'
    }
  });
  const json = await res.json();
  assert.strictEqual(res.status, 404);
  assert.strictEqual(json.error.code, 'NOT_FOUND');
  assert.ok(json.error.requestId.startsWith('req_'));
});
test('API Handlers: GET /api/destinations/:id/services returns nearby support places', async () => {
  const destId = 'a1111111-1111-1111-1111-111111111111';
  const req = mockRequest(`http://localhost:3000/api/destinations/${destId}/services`);
  const res = await getServices(req, {
    params: {
      id: destId
    }
  });
  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(json.data.fuel_stations.count > 0);
  assert.ok(json.data.hospitals.count > 0);
});
test('API Handlers: POST /api/recommendations generates validated recommendation list', async () => {
  const req = mockRequest('http://localhost:3000/api/recommendations', 'POST', {
    origin_lat: 23.2599,
    origin_lng: 77.4126,
    origin_label: 'Bhopal, MP',
    vehicle_type: 'car',
    duration_days: 1
  });
  const res = await getRecommendations(req);
  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.ok(json.data.recommendations.length > 0);
  assert.strictEqual(json.data.recommendations[0].rank, 1);
});
test('API Handlers: POST /api/itineraries generates day-by-day plan', async () => {
  const destId = 'c3333333-3333-3333-3333-333333333333';
  const req = mockRequest('http://localhost:3000/api/itineraries', 'POST', {
    destination_id: destId,
    duration_days: 2,
    vehicle_type: 'bike'
  });
  const res = await createItinerary(req);
  const json = await res.json();
  assert.strictEqual(res.status, 201);
  assert.strictEqual(json.data.destination_id, destId);
  assert.strictEqual(json.data.items.length, 2);
});
test('API Handlers: GET /api/booking/bus returns external redirect metadata', async () => {
  const req = mockRequest('http://localhost:3000/api/booking/bus?origin_city=Bhopal&destination_city=Indore&provider=redbus');
  const res = await getBusBooking(req);
  const json = await res.json();
  assert.strictEqual(res.status, 200);
  assert.strictEqual(json.data.provider_name, 'RedBus India');
  assert.ok(json.data.booking_url.includes('redbus.in'));
});
test('API Handlers: Reviews CRUD lifecycle (POST, PATCH, DELETE)', async () => {
  const destId = 'a1111111-1111-1111-1111-111111111111';
  const testUserId = 'test-author-001';

  // 1. Create Review
  const createReq = mockRequest(`http://localhost:3000/api/destinations/${destId}/reviews`, 'POST', {
    user_id: testUserId,
    user_name: 'Test Reviewer',
    overall_score: 4.5,
    category_scores: {
      cleanliness: 5,
      safety: 4
    },
    body: 'Initial review for test verification'
  });
  const createRes = await createReview(createReq, {
    params: {
      id: destId
    }
  });
  const createJson = await createRes.json();
  assert.strictEqual(createRes.status, 201);
  const reviewId = createJson.data.id;
  assert.ok(reviewId);

  // 2. PATCH Review (Owner)
  const patchReq = mockRequest(`http://localhost:3000/api/reviews/${reviewId}`, 'PATCH', {
    user_id: testUserId,
    overall_score: 5.0,
    body: 'Updated review body with higher satisfaction'
  });
  const patchRes = await updateReview(patchReq, {
    params: {
      id: reviewId
    }
  });
  const patchJson = await patchRes.json();
  assert.strictEqual(patchRes.status, 200);
  assert.strictEqual(patchJson.data.overall_score, 5.0);
  assert.strictEqual(patchJson.data.body, 'Updated review body with higher satisfaction');

  // 3. DELETE Review (Owner)
  const deleteReq = mockRequest(`http://localhost:3000/api/reviews/${reviewId}`, 'DELETE', {
    user_id: testUserId
  });
  const deleteRes = await deleteReview(deleteReq, {
    params: {
      id: reviewId
    }
  });
  const deleteJson = await deleteRes.json();
  assert.strictEqual(deleteRes.status, 200);
  assert.strictEqual(deleteJson.data.success, true);
});
test('API Handlers: Community Post, Images, and Comments lifecycle', async () => {
  const destId = 'a1111111-1111-1111-1111-111111111111';
  const postAuthorId = 'test-post-author-01';
  const commenterId = 'test-commenter-01';

  // 1. Create Post
  const postReq = mockRequest(`http://localhost:3000/api/destinations/${destId}/posts`, 'POST', {
    user_id: postAuthorId,
    user_name: 'Post Author',
    title: 'Scenic viewpoints on the Pachmarhi route',
    body: 'Detailed field notes about road surface and scenic lookout spots.'
  });
  const postRes = await createPost(postReq, {
    params: {
      id: destId
    }
  });
  const postJson = await postRes.json();
  assert.strictEqual(postRes.status, 201);
  const postId = postJson.data.id;

  // 2. Upload/Attach Image to Post
  const imgReq = mockRequest(`http://localhost:3000/api/posts/${postId}/images`, 'POST', {
    user_id: postAuthorId,
    mime_type: 'image/jpeg',
    size_bytes: 1200000,
    storage_path: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800'
  });
  const imgRes = await uploadPostImage(imgReq, {
    params: {
      id: postId
    }
  });
  const imgJson = await imgRes.json();
  assert.strictEqual(imgRes.status, 201);
  assert.ok(imgJson.data.id);

  // 3. Add Comment
  const comReq = mockRequest(`http://localhost:3000/api/posts/${postId}/comments`, 'POST', {
    user_id: commenterId,
    user_name: 'Commenter Explorer',
    body: 'Is there mobile connectivity along that stretch?'
  });
  const comRes = await addComment(comReq, {
    params: {
      id: postId
    }
  });
  const comJson = await comRes.json();
  assert.strictEqual(comRes.status, 201);
  const commentId = comJson.data.id;

  // 4. Retrieve Post Details
  const getPostReq = mockRequest(`http://localhost:3000/api/posts/${postId}`);
  const getPostRes = await getPostById(getPostReq, {
    params: {
      id: postId
    }
  });
  const getPostJson = await getPostRes.json();
  assert.strictEqual(getPostRes.status, 200);
  assert.strictEqual(getPostJson.data.title, 'Scenic viewpoints on the Pachmarhi route');

  // 5. Delete Comment (Owner)
  const delComReq = mockRequest(`http://localhost:3000/api/comments/${commentId}`, 'DELETE', {
    user_id: commenterId
  });
  const delComRes = await deleteComment(delComReq, {
    params: {
      id: commentId
    }
  });
  const delComJson = await delComRes.json();
  assert.strictEqual(delComRes.status, 200);
  assert.strictEqual(delComJson.data.success, true);

  // 6. Delete Post (Owner)
  const delPostReq = mockRequest(`http://localhost:3000/api/posts/${postId}`, 'DELETE', {
    user_id: postAuthorId
  });
  const delPostRes = await deletePost(delPostReq, {
    params: {
      id: postId
    }
  });
  const delPostJson = await delPostRes.json();
  assert.strictEqual(delPostRes.status, 200);
  assert.strictEqual(delPostJson.data.success, true);
});