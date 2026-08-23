"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.vehicleTypeEnum = exports.tripSetupSchema = exports.reviewUpdateSchema = exports.reviewCreateSchema = exports.recommendationRequestSchema = exports.postCreateSchema = exports.itineraryRequestSchema = exports.imageUploadMetaSchema = exports.commentCreateSchema = exports.categoryScoresSchema = exports.busBookingQuerySchema = exports.aiRecommendationsOutputSchema = exports.aiRecommendationItemSchema = exports.aiItineraryOutputSchema = exports.aiItineraryItemOutputSchema = void 0;
var _zod = require("zod");
const vehicleTypeEnum = _zod.z.enum(['car', 'bike', 'suv', 'bus']);
exports.vehicleTypeEnum = vehicleTypeEnum;
const tripSetupSchema = _zod.z.object({
  origin_lat: _zod.z.number().min(-90).max(90),
  origin_lng: _zod.z.number().min(-180).max(180),
  origin_label: _zod.z.string().min(1).max(200),
  vehicle_type: vehicleTypeEnum,
  duration_days: _zod.z.number().int().positive().max(30)
});
exports.tripSetupSchema = tripSetupSchema;
const recommendationRequestSchema = _zod.z.object({
  origin_lat: _zod.z.number().min(-90).max(90),
  origin_lng: _zod.z.number().min(-180).max(180),
  origin_label: _zod.z.string().min(1).max(200),
  vehicle_type: vehicleTypeEnum,
  duration_days: _zod.z.number().int().positive().max(30),
  interests: _zod.z.array(_zod.z.string()).optional()
});
exports.recommendationRequestSchema = recommendationRequestSchema;
const itineraryRequestSchema = _zod.z.object({
  trip_id: _zod.z.string().uuid().optional(),
  destination_id: _zod.z.string().uuid(),
  duration_days: _zod.z.number().int().positive().max(30),
  vehicle_type: vehicleTypeEnum.optional()
});
exports.itineraryRequestSchema = itineraryRequestSchema;
const categoryScoresSchema = _zod.z.object({
  cleanliness: _zod.z.number().min(1).max(5).optional(),
  safety: _zod.z.number().min(1).max(5).optional(),
  accessibility: _zod.z.number().min(1).max(5).optional(),
  scenery: _zod.z.number().min(1).max(5).optional(),
  family_friendly: _zod.z.number().min(1).max(5).optional(),
  value_for_money: _zod.z.number().min(1).max(5).optional()
});
exports.categoryScoresSchema = categoryScoresSchema;
const reviewCreateSchema = _zod.z.object({
  destination_id: _zod.z.string().uuid(),
  overall_score: _zod.z.number().min(1).max(5),
  category_scores: categoryScoresSchema.default({}),
  body: _zod.z.string().max(2000).optional()
});
exports.reviewCreateSchema = reviewCreateSchema;
const reviewUpdateSchema = _zod.z.object({
  overall_score: _zod.z.number().min(1).max(5).optional(),
  category_scores: categoryScoresSchema.optional(),
  body: _zod.z.string().max(2000).optional()
});
exports.reviewUpdateSchema = reviewUpdateSchema;
const postCreateSchema = _zod.z.object({
  destination_id: _zod.z.string().uuid(),
  title: _zod.z.string().min(3).max(200),
  body: _zod.z.string().min(10).max(5000)
});
exports.postCreateSchema = postCreateSchema;
const commentCreateSchema = _zod.z.object({
  body: _zod.z.string().min(1).max(1000)
});
exports.commentCreateSchema = commentCreateSchema;
const imageUploadMetaSchema = _zod.z.object({
  mime_type: _zod.z.enum(['image/jpeg', 'image/png', 'image/webp']),
  size_bytes: _zod.z.number().int().positive().max(5242880) // 5 MB max
});
exports.imageUploadMetaSchema = imageUploadMetaSchema;
const busBookingQuerySchema = _zod.z.object({
  origin_city: _zod.z.string().min(1).max(100),
  destination_city: _zod.z.string().min(1).max(100),
  travel_date: _zod.z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  provider: _zod.z.enum(['redbus', 'abhibus', 'state_transport']).default('redbus')
});

// AI Output Validation Schemas
exports.busBookingQuerySchema = busBookingQuerySchema;
const aiRecommendationItemSchema = _zod.z.object({
  destination_id: _zod.z.string(),
  match_score: _zod.z.number().min(0).max(100),
  ai_reason: _zod.z.string().min(10),
  is_extended_radius: _zod.z.boolean().optional(),
  extension_justification: _zod.z.string().optional()
});
exports.aiRecommendationItemSchema = aiRecommendationItemSchema;
const aiRecommendationsOutputSchema = _zod.z.object({
  ranked_destinations: _zod.z.array(aiRecommendationItemSchema)
});
exports.aiRecommendationsOutputSchema = aiRecommendationsOutputSchema;
const aiItineraryItemOutputSchema = _zod.z.object({
  day_number: _zod.z.number().int().positive(),
  title: _zod.z.string().min(2),
  description: _zod.z.string().min(10),
  timing_suggestion: _zod.z.string().optional(),
  activities: _zod.z.array(_zod.z.string()).optional()
});
exports.aiItineraryItemOutputSchema = aiItineraryItemOutputSchema;
const aiItineraryOutputSchema = _zod.z.object({
  summary: _zod.z.string().min(10),
  items: _zod.z.array(aiItineraryItemOutputSchema)
});
exports.aiItineraryOutputSchema = aiItineraryOutputSchema;