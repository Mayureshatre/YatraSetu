"use strict";

const test = require('node:test');
const assert = require('node:assert');
const {
  tripSetupSchema,
  recommendationRequestSchema,
  itineraryRequestSchema,
  reviewCreateSchema,
  postCreateSchema,
  commentCreateSchema,
  imageUploadMetaSchema,
  busBookingQuerySchema,
  aiRecommendationsOutputSchema,
  aiItineraryOutputSchema
} = require('@/lib/validation/schemas');
test('Validation: tripSetupSchema accepts valid trip data', () => {
  const valid = {
    origin_lat: 23.2599,
    origin_lng: 77.4126,
    origin_label: 'Bhopal, Madhya Pradesh',
    vehicle_type: 'car',
    duration_days: 2
  };
  const result = tripSetupSchema.safeParse(valid);
  assert.strictEqual(result.success, true);
});
test('Validation: tripSetupSchema rejects invalid coordinates or vehicle', () => {
  const invalid = {
    origin_lat: 95.0,
    // Out of bounds
    origin_lng: 77.4126,
    origin_label: 'Invalid',
    vehicle_type: 'airplane',
    // Unsupported
    duration_days: -1 // Negative
  };

  const result = tripSetupSchema.safeParse(invalid);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error.issues.length >= 3, true);
});
test('Validation: reviewCreateSchema bounds overall_score between 1 and 5', () => {
  const validReview = {
    destination_id: 'a1111111-1111-1111-1111-111111111111',
    overall_score: 4.5,
    category_scores: {
      cleanliness: 5,
      safety: 4
    },
    body: 'Great road trip destination!'
  };
  assert.strictEqual(reviewCreateSchema.safeParse(validReview).success, true);
  const invalidScore = {
    ...validReview,
    overall_score: 6.5
  };
  assert.strictEqual(reviewCreateSchema.safeParse(invalidScore).success, false);
});
test('Validation: imageUploadMetaSchema restricts MIME types and 5MB size limit', () => {
  const validImage = {
    mime_type: 'image/jpeg',
    size_bytes: 2048000
  };
  assert.strictEqual(imageUploadMetaSchema.safeParse(validImage).success, true);
  const invalidMime = {
    mime_type: 'application/pdf',
    size_bytes: 2048000
  };
  assert.strictEqual(imageUploadMetaSchema.safeParse(invalidMime).success, false);
  const oversized = {
    mime_type: 'image/png',
    size_bytes: 10 * 1024 * 1024
  }; // 10MB
  assert.strictEqual(imageUploadMetaSchema.safeParse(oversized).success, false);
});
test('Validation: aiRecommendationsOutputSchema validates LLM JSON structure', () => {
  const validLlmOutput = {
    ranked_destinations: [{
      destination_id: 'a1111111-1111-1111-1111-111111111111',
      match_score: 94,
      ai_reason: 'Scenic hill station offering waterfalls and smooth ghat roads.',
      is_extended_radius: false
    }]
  };
  assert.strictEqual(aiRecommendationsOutputSchema.safeParse(validLlmOutput).success, true);
});
test('Validation: aiItineraryOutputSchema validates day-by-day structure', () => {
  const validItin = {
    summary: 'A 2-day relaxed heritage trip.',
    items: [{
      day_number: 1,
      title: 'Arrival & Monastic Stupas',
      description: 'Morning drive followed by guided ASI monument tour.',
      timing_suggestion: '9:00 AM - 4:00 PM',
      activities: ['Stupa visit', 'Museum tour']
    }]
  };
  assert.strictEqual(aiItineraryOutputSchema.safeParse(validItin).success, true);
});