/**
 * Building Validation Schemas
 * Zod schemas for area-linked building intelligence forms.
 */

import { z } from 'zod';
import { imageObjectSchema } from './shared';

const nullableTextSchema = z.string().trim().nullable().or(z.literal(''));
const nullableNumberSchema = z.number().nullable().optional();
const scoreSchema = z.number().int().min(0).max(100).nullable().optional();

export const buildingUnitRangeSchema = z.object({
  unit_type: z.string().trim().min(1, 'Unit type is required'),
  min: nullableNumberSchema,
  max: nullableNumberSchema,
  average: nullableNumberSchema,
});

export const buildingNearbyPlaceSchema = z.object({
  name: z.string().trim().min(1, 'Place name is required'),
  type: nullableTextSchema.optional(),
  distance: nullableTextSchema.optional(),
});

export const buildingTransactionSummarySchema = z.object({
  recent_sales_count: z.number().int().min(0).nullable().optional(),
  average_transaction_value: nullableNumberSchema,
  price_trend: nullableTextSchema.optional(),
  notes: nullableTextSchema.optional(),
});

export const buildingSchema = z.object({
  area_id: z.string().uuid('Invalid area ID'),
  city_id: z.string().uuid('Invalid city ID'),
  developer_id: z.string().uuid('Invalid developer ID').nullable().optional().or(z.literal('')),

  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(80, 'Slug must be less than 80 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: nullableTextSchema.optional(),
  address: nullableTextSchema.optional(),
  location: z
    .object({
      lat: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
      lng: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
    })
    .nullable()
    .optional(),
  photos: z.array(imageObjectSchema).min(3, 'At least three photo is required'),

  building_type: nullableTextSchema.optional(),
  ownership_type: nullableTextSchema.optional(),
  completion_year: z.number().int().min(1800).max(2200).nullable().optional(),
  total_floors: z.number().int().min(0).nullable().optional(),
  total_units: z.number().int().min(0).nullable().optional(),
  property_types: z.array(z.string().trim().min(1)).default([]),

  avg_price_per_sqft: nullableNumberSchema,
  area_avg_price_per_sqft: nullableNumberSchema,
  rental_yield: nullableNumberSchema,
  service_charge_aed_per_sqft: nullableNumberSchema,
  short_term_rental_potential: nullableTextSchema.optional(),
  demand_level: nullableTextSchema.optional(),

  liquidity_score: scoreSchema,
  capital_growth_score: scoreSchema,
  lifestyle_score: scoreSchema,
  overall_score: scoreSchema,

  amenities: z.array(z.string().trim().min(1)).default([]),
  nearby_places: z.array(buildingNearbyPlaceSchema).default([]),
  unit_price_ranges: z.array(buildingUnitRangeSchema).default([]),
  rental_ranges: z.array(buildingUnitRangeSchema).default([]),
  transaction_summary: buildingTransactionSummarySchema.default({}),
  pros: z.array(z.string().trim().min(1)).default([]),
  cons: z.array(z.string().trim().min(1)).default([]),
});

export type BuildingFormData = z.input<typeof buildingSchema>;
export type BuildingData = z.output<typeof buildingSchema>;

export const buildingInsertSchema = buildingSchema;
export type BuildingInsertData = z.output<typeof buildingInsertSchema>;

export const buildingUpdateSchema = buildingSchema.partial();
export type BuildingUpdateData = z.output<typeof buildingUpdateSchema>;
