const test = require('node:test');
const assert = require('node:assert');
const { db } = require('@/lib/db/supabase');

test('Database: retrieves seed destinations correctly', async () => {
  const destinations = await db.getDestinations();
  assert.ok(destinations.length >= 30);

  const pachmarhi = await db.getDestinationById('a1111111-1111-1111-1111-111111111111');
  assert.ok(pachmarhi);
  assert.strictEqual(pachmarhi.slug, 'pachmarhi');
  assert.ok(pachmarhi.safety_tips.length > 0);
  assert.ok(pachmarhi.image_source);
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
      cleanliness: 5,
    },
    body: 'Remarkable stone temples and serene gardens.',
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
    body: 'Updated: Even more spectacular in evening light.',
  });
  assert.strictEqual(updateRes.success, true);
  assert.strictEqual(updateRes.review.overall_score, 4.9);

  // 4. Delete review (Owner)
  const deleteRes = await db.deleteReview(review.id, authorId);
  assert.strictEqual(deleteRes.success, true);

  const reviewsAfter = await db.getReviews(destId);
  assert.strictEqual(reviewsAfter.find(r => r.id === review.id), undefined);
});

test('Database Community: handles post creation with category and Reddit-style voting lifecycle', async () => {
  const destId = 'c3333333-3333-3333-3333-333333333333';
  const authorId = 'voter-test-author';
  const voter1 = 'voter-user-01';
  const voter2 = 'voter-user-02';

  // 1. Create post with category
  const post = await db.createCommunityPost({
    destination_id: destId,
    user_id: authorId,
    user_name: 'Heritage Explorer',
    title: 'Hidden cave trail near Sanchi North Hill',
    body: 'Take the northern walking trail around 7:30 AM for misty views.',
    category: 'Hidden Gem',
  });

  assert.ok(post.id);
  assert.strictEqual(post.category, 'Hidden Gem');
  assert.strictEqual(post.net_votes, 1);

  // 2. Voter 1 Upvotes (+1)
  const vote1 = await db.votePost(post.id, voter1, 1);
  assert.strictEqual(vote1.success, true);
  assert.strictEqual(vote1.user_vote, 1);
  assert.strictEqual(vote1.net_votes, 2);

  // 3. Voter 1 toggles off / removes vote (clicks +1 again)
  const voteToggle = await db.votePost(post.id, voter1, 1);
  assert.strictEqual(voteToggle.success, true);
  assert.strictEqual(voteToggle.user_vote, null);
  assert.strictEqual(voteToggle.net_votes, 1);

  // 4. Voter 2 Downvotes (-1)
  const vote2 = await db.votePost(post.id, voter2, -1);
  assert.strictEqual(vote2.success, true);
  assert.strictEqual(vote2.user_vote, -1);
  assert.strictEqual(vote2.net_votes, 0);

  // 5. Voter 2 switches from Downvote (-1) to Upvote (+1)
  const voteSwitch = await db.votePost(post.id, voter2, 1);
  assert.strictEqual(voteSwitch.success, true);
  assert.strictEqual(voteSwitch.user_vote, 1);
  assert.strictEqual(voteSwitch.net_votes, 2);
});

test('Database Community: supports nested comment replies and reporting', async () => {
  const destId = 'a1111111-1111-1111-1111-111111111111';
  const authorId = 'comment-test-author';

  // 1. Create post
  const post = await db.createCommunityPost({
    destination_id: destId,
    user_id: authorId,
    user_name: 'Biker Ravi',
    title: 'Monsoon ride conditions to Pachmarhi',
    body: 'Pipariya ghat road has fresh tarmac, but watch for fog at hairpins.',
    category: 'Road Condition',
  });

  // 2. Add root comment
  const rootComment = await db.addComment(post.id, 'user-a', 'Sunil', 'Are fuel stations open 24/7 along Pipariya road?');
  assert.ok(rootComment.id);

  // 3. Add nested reply to root comment
  const replyComment = await db.addComment(post.id, authorId, 'Biker Ravi', 'Yes, HP pump at the ghat entrance is open 24/7.', rootComment.id);
  assert.ok(replyComment.id);
  assert.strictEqual(replyComment.parent_id, rootComment.id);

  // 4. Verify post retrieval includes nested structure
  const fetchedPost = await db.getPostById(post.id);
  assert.ok(fetchedPost);
  const foundRoot = fetchedPost.comments.find(c => c.id === rootComment.id);
  assert.ok(foundRoot);
  assert.ok(foundRoot.replies && foundRoot.replies.length === 1);
  assert.strictEqual(foundRoot.replies[0].body, 'Yes, HP pump at the ghat entrance is open 24/7.');

  // 5. Report content
  const report = await db.reportContent('user-reporter', 'Inaccurate road speed advice', post.id);
  assert.strictEqual(report.success, true);
  assert.ok(report.report_id);
});
