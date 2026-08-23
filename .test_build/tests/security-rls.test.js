"use strict";

const test = require('node:test');
const assert = require('node:assert');
const {
  storageAdapter
} = require('@/lib/storage/storage-adapter');
const {
  createErrorResponse
} = require('@/lib/utils');
const {
  db
} = require('@/lib/db/supabase');
const {
  PATCH: updateReview,
  DELETE: deleteReview
} = require('@/app/api/reviews/[id]/route');
const {
  DELETE: deleteComment
} = require('@/app/api/comments/[id]/route');
const {
  POST: uploadPostImage
} = require('@/app/api/posts/[id]/images/route');
const {
  DELETE: deletePost
} = require('@/app/api/posts/[id]/route');

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
test('Security: storageAdapter enforces strict MIME type whitelist', () => {
  assert.strictEqual(storageAdapter.validateFile('image/jpeg', 1000).valid, true);
  assert.strictEqual(storageAdapter.validateFile('image/png', 1000).valid, true);
  assert.strictEqual(storageAdapter.validateFile('image/webp', 1000).valid, true);

  // Rejects executable, SVG, HTML, PDF to prevent XSS / SSRF / upload abuse
  assert.strictEqual(storageAdapter.validateFile('image/svg+xml', 1000).valid, false);
  assert.strictEqual(storageAdapter.validateFile('text/html', 1000).valid, false);
  assert.strictEqual(storageAdapter.validateFile('application/javascript', 1000).valid, false);
  assert.strictEqual(storageAdapter.validateFile('application/pdf', 1000).valid, false);
});
test('Security: storageAdapter rejects files larger than 5 MB', () => {
  const underLimit = 4.9 * 1024 * 1024;
  const overLimit = 5.2 * 1024 * 1024;
  assert.strictEqual(storageAdapter.validateFile('image/jpeg', underLimit).valid, true);
  assert.strictEqual(storageAdapter.validateFile('image/jpeg', overLimit).valid, false);
});
test('Security: createErrorResponse generates unified non-leaking error envelope', () => {
  const {
    response,
    status
  } = createErrorResponse('UNAUTHORIZED', 'Authentication session invalid or expired', undefined, 401);
  assert.strictEqual(status, 401);
  assert.strictEqual(response.error.code, 'UNAUTHORIZED');
  assert.strictEqual(response.error.message, 'Authentication session invalid or expired');
  assert.ok(response.error.requestId.startsWith('req_'));
});
test('Security: Unauthorized mutation to review is denied (403 Forbidden)', async () => {
  const destId = 'c3333333-3333-3333-3333-333333333333';
  const ownerId = 'legitimate-owner-01';
  const attackerId = 'unauthorized-user-99';

  // 1. Create a review owned by ownerId
  const review = await db.createReview({
    destination_id: destId,
    user_id: ownerId,
    user_name: 'Legit User',
    overall_score: 4.0,
    category_scores: {
      safety: 4
    },
    body: 'Original review text'
  });

  // 2. Attacker attempts PATCH -> Must be 403 Forbidden
  const patchReq = mockRequest(`http://localhost:3000/api/reviews/${review.id}`, 'PATCH', {
    user_id: attackerId,
    overall_score: 1.0,
    body: 'Vandalized review by attacker'
  });
  const patchRes = await updateReview(patchReq, {
    params: {
      id: review.id
    }
  });
  const patchJson = await patchRes.json();
  assert.strictEqual(patchRes.status, 403);
  assert.strictEqual(patchJson.error.code, 'FORBIDDEN');

  // 3. Attacker attempts DELETE -> Must be 403 Forbidden
  const deleteReq = mockRequest(`http://localhost:3000/api/reviews/${review.id}`, 'DELETE', {
    user_id: attackerId
  });
  const deleteRes = await deleteReview(deleteReq, {
    params: {
      id: review.id
    }
  });
  const deleteJson = await deleteRes.json();
  assert.strictEqual(deleteRes.status, 403);
  assert.strictEqual(deleteJson.error.code, 'FORBIDDEN');
});
test('Security: Unauthorized mutation to community post/comment/images is denied (403 Forbidden)', async () => {
  const destId = 'a1111111-1111-1111-1111-111111111111';
  const postOwnerId = 'post-owner-01';
  const commentOwnerId = 'comment-owner-01';
  const attackerId = 'malicious-attacker-01';

  // 1. Create a post
  const post = await db.createCommunityPost({
    destination_id: destId,
    user_id: postOwnerId,
    user_name: 'Post Creator',
    title: 'Legitimate Travel Story',
    body: 'Detailed guide for travelers'
  });

  // 2. Attacker attempts to attach image to postOwnerId\'s post -> Must be 403 Forbidden
  const uploadReq = mockRequest(`http://localhost:3000/api/posts/${post.id}/images`, 'POST', {
    user_id: attackerId,
    mime_type: 'image/png',
    size_bytes: 50000,
    storage_path: 'https://attacker.site/malicious.png'
  });
  const uploadRes = await uploadPostImage(uploadReq, {
    params: {
      id: post.id
    }
  });
  const uploadJson = await uploadRes.json();
  assert.strictEqual(uploadRes.status, 403);
  assert.strictEqual(uploadJson.error.code, 'FORBIDDEN');

  // 3. Add legitimate comment
  const comment = await db.addComment(post.id, commentOwnerId, 'Commenter', 'Helpful tip');

  // 4. Attacker attempts to delete legitimate comment -> Must be 403 Forbidden
  const delComReq = mockRequest(`http://localhost:3000/api/comments/${comment.id}`, 'DELETE', {
    user_id: attackerId
  });
  const delComRes = await deleteComment(delComReq, {
    params: {
      id: comment.id
    }
  });
  const delComJson = await delComRes.json();
  assert.strictEqual(delComRes.status, 403);
  assert.strictEqual(delComJson.error.code, 'FORBIDDEN');

  // 5. Attacker attempts to delete post -> Must be 403 Forbidden
  const delPostReq = mockRequest(`http://localhost:3000/api/posts/${post.id}`, 'DELETE', {
    user_id: attackerId
  });
  const delPostRes = await deletePost(delPostReq, {
    params: {
      id: post.id
    }
  });
  const delPostJson = await delPostRes.json();
  assert.strictEqual(delPostRes.status, 403);
  assert.strictEqual(delPostJson.error.code, 'FORBIDDEN');
});