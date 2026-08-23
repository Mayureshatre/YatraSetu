import { z } from "zod";

export const vehicleTypeEnum = z.enum(["car", "bike", "suv", "bus"]);

export const tripSetupSchema = z.object({
  origin_lat: z.number().min(-90).max(90).optional(),
  origin_lng: z.number().min(-180).max(180).optional(),
  origin_label: z.string().min(1).max(200),
  vehicle_type: vehicleTypeEnum.default("car"),
  duration_days: z.number().int().positive().max(30).default(1),
});

export const recommendationRequestSchema = z.object({
  origin_lat: z.number().min(-90).max(90).optional(),
  origin_lng: z.number().min(-180).max(180).optional(),
  origin_label: z.string().min(1).max(200),
  vehicle_type: vehicleTypeEnum.default("car"),
  duration_days: z.number().int().positive().max(30).default(1),
  interests: z.array(z.string()).optional(),
});

export const itineraryRequestSchema = z.object({
  trip_id: z.string().uuid().optional(),
  destination_id: z.string(),
  duration_days: z.number().int().positive().max(30).default(2),
  vehicle_type: vehicleTypeEnum.optional(),
});

export const categoryScoresSchema = z.object({
  cleanliness: z.number().min(1).max(5).optional(),
  safety: z.number().min(1).max(5).optional(),
  accessibility: z.number().min(1).max(5).optional(),
  scenery: z.number().min(1).max(5).optional(),
  family_friendly: z.number().min(1).max(5).optional(),
  value_for_money: z.number().min(1).max(5).optional(),
});

export const reviewCreateSchema = z.object({
  destination_id: z.string(),
  overall_score: z.number().min(1).max(5),
  category_scores: categoryScoresSchema.default({}),
  body: z.string().max(2000).optional(),
});

export const reviewUpdateSchema = z.object({
  overall_score: z.number().min(1).max(5).optional(),
  category_scores: categoryScoresSchema.optional(),
  body: z.string().max(2000).optional(),
});

export const postCreateSchema = z.object({
  destination_id: z.string(),
  title: z.string().min(3).max(200),
  body: z.string().min(10).max(5000),
  category: z.string().optional().default("General Discussion"),
});

export const commentCreateSchema = z.object({
  body: z.string().min(1).max(1000),
  parent_id: z.string().optional(),
});

export const postVoteSchema = z.object({
  vote_type: z.number().int(),
});

export const reportCreateSchema = z.object({
  reason: z.string().min(3).max(500),
  post_id: z.string().optional(),
  comment_id: z.string().optional(),
});

export const imageUploadMetaSchema = z.object({
  mime_type: z.enum(["image/jpeg", "image/png", "image/webp"]),
  size_bytes: z.number().int().positive().max(5242880), // 5 MB max
});

export const busBookingQuerySchema = z.object({
  origin_city: z.string().min(1).max(100),
  destination_city: z.string().min(1).max(100),
  travel_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  provider: z.enum(["redbus", "abhibus", "state_transport"]).default("redbus"),
});

// AI Output Validation Schemas
export const aiRecommendationItemSchema = z.object({
  destination_id: z.string(),
  match_score: z.number().min(0).max(100),
  ai_reason: z.string().min(10),
  is_extended_radius: z.boolean().optional(),
  extension_justification: z.string().optional(),
});

export const aiRecommendationsOutputSchema = z.object({
  ranked_destinations: z.array(aiRecommendationItemSchema),
});

export const aiItineraryItemOutputSchema = z.object({
  day_number: z.number().int().positive(),
  title: z.string().min(2),
  description: z.string().min(10),
  timing_suggestion: z.string().optional(),
  activities: z.array(z.string()).optional(),
});

export const aiItineraryOutputSchema = z.object({
  summary: z.string().min(10),
  items: z.array(aiItineraryItemOutputSchema),
});

export const aiServiceReadinessOutputSchema = z.object({
  safety_score: z.number().min(0).max(100),
  readiness_level: z.enum(["High", "Moderate", "Low"]),
  headline: z.string().min(5),
  summary: z.string().min(10),
  coverage_analysis: z.object({
    fuel_assessment: z.string(),
    mechanic_assessment: z.string(),
    hospital_assessment: z.string(),
  }),
  actionable_tips: z.array(z.string()),
});

export const aiVehicleCompatibilityOutputSchema = z.object({
  score: z.number().min(0).max(100),
  verdict: z.enum([
    "Highly Recommended",
    "Proceed with Caution",
    "Not Recommended",
  ]),
  summary: z.string(),
  reasons: z.array(z.string()),
  warnings: z.array(z.string()),
});

export type AiVehicleCompatibilityOutput = z.infer<
  typeof aiVehicleCompatibilityOutputSchema
>;
