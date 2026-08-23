"use strict";

const test = require('node:test');
const assert = require('node:assert');
const {
  db
} = require('@/lib/db/supabase');
test('Database: retrieves seed destinations correctly', async () => {
  const destinations = await db.getDestinations();
  assert.ok(destinations.length >= 6);
  const pachmarhi = await db.getDestinationById('a1111111-1111-1111-1111-111111111111');
  assert.ok(pachmarhi);
  assert.strictEqual(pachmarhi.slug, 'pachmarhi');
  assert.ok(pachmarhi.safety_tips.length > 0);
});
test('Database: creates, updates, and deletes multi-category destination reviews', async () => {
  const destId = 'b2222222-2222-2222-2222-222222222222';
  const authorId = 'db-tester-01';

  // 1. Create
  const review = await db.createReview({
    destination_id: destId,
    user_id: authorId,
    user_name: 'Architect Tester',
    overall_score: 4.6,
    category_scores: {
      scenery: 5,
      safety: 4,
      cleanliness: 5
    },
    body: 'Remarkable stone temples and serene gardens.'
  });
  assert.ok(review.id);
  assert.strictEqual(review.overall_score, 4.6);

  // 2. Retrieve reviews for destination
  const reviews = await db.getReviews(destId);
  const found = reviews.find(r => r.id === review.id);
  assert.ok(found);

  // 3. Update review (Owner)
  const updateRes = await db.updateReview(review.id, authorId, {
    overall_score: 4.9,
    body: 'Updated: Even more spectacular in evening light.'
  });
  assert.strictEqual(updateRes.success, true);
  assert.strictEqual(updateRes.review.overall_score, 4.9);

  // 4. Delete review (Owner)
  const deleteRes = await db.deleteReview(review.id, authorId);
  assert.strictEqual(deleteRes.success, true);
  const reviewsAfter = await db.getReviews(destId);
  assert.strictEqual(reviewsAfter.find(r => r.id === review.id), undefined);
});
test('Database: creates community posts, uploads image, adds and deletes comments', async () => {
  const destId = 'c3333333-3333-3333-3333-333333333333';
  const authorId = 'db-poster-01';

  // 1. Create post
  const post = await db.createCommunityPost({
    destination_id: destId,
    user_id: authorId,
    user_name: 'History Enthusiast',
    title: 'Hidden cave inscriptions near Sanchi',
    body: 'Discovered lesser-known Rock shelter inscriptions just 3 km north.'
  });
  assert.ok(post.id);
  assert.strictEqual(post.popularity_score, 1);

  // 2. Add image
  const imgRes = await db.addPostImage(post.id, authorId, {
    storage_path: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800',
    mime_type: 'image/jpeg',
    size_bytes: 850000
  });
  assert.strictEqual(imgRes.success, true);
  assert.ok(imgRes.image.id);

  // 3. Add comment
  const comment = await db.addComment(post.id, 'db-commenter-01', 'Traveler Priya', 'Where was the trailhead?');
  assert.ok(comment.id);
  assert.strictEqual(comment.body, 'Where was the trailhead?');
  const updatedPost = await db.getPostById(post.id);
  assert.strictEqual(updatedPost.comments.length, 1);
  assert.strictEqual(updatedPost.images.length, 1);

  // 4. Delete comment
  const delComRes = await db.deleteComment(comment.id, 'db-commenter-01');
  assert.strictEqual(delComRes.success, true);
  const postAfterComDel = await db.getPostById(post.id);
  assert.strictEqual(postAfterComDel.comments.length, 0);

  // 5. Delete post
  const delPostRes = await db.deletePost(post.id, authorId);
  assert.strictEqual(delPostRes.success, true);
  const postAfterDel = await db.getPostById(post.id);
  assert.strictEqual(postAfterDel, null);
});