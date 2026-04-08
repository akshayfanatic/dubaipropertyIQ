/**
 * Property Validation Schemas
 * Zod schemas for property form validation
 */

import { z } from 'zod';
import { imageObjectSchema } from './shared';

// Property Type enum validation (for backward compatibility)
export const propertyTypeSchema = z.enum(['apartment', 'villa', 'townhouse', 'penthouse', 'land']);

// Property Status enum validation
export const propertyStatusSchema = z.enum(['available', 'sold', 'reserved', 'off_plan']);

// Slug validation schema
export const propertySlugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(200, 'Slug must be less than 200 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .transform((val) => val.toLowerCase().trim());

// Property form validation schema
export const propertyFormSchema = z.object({
  slug: propertySlugSchema, // Auto-generated if not provided
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category_id: z.string(),
  developer_id: z.string().uuid('Please select a valid developer').nullable().optional(),
  bedrooms: z.number().int().min(0, 'Bedrooms cannot be negative'),
  bathrooms: z.number().int().min(0, 'Bathrooms cannot be negative'),
  size_sqft: z.number().int().positive('Size must be a positive number'),
  price_aed: z.number().positive('Price must be a positive number'),
  status: propertyStatusSchema,
  golden_visa_eligible: z.boolean(),
  photos: z.array(imageObjectSchema).min(1, 'At least one photo is required'), // one photo required
  features: z.array(z.string()),
  floor_plan: z.string().url('Invalid floor plan URL').nullable().optional(),
  amenity_ids: z.array(z.string().uuid()).optional(), // Array of amenity IDs from junction table
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;

// Property insert schema (for creating new properties)
export const propertyInsertSchema = propertyFormSchema;

export type PropertyInsertData = z.infer<typeof propertyInsertSchema>;

// Property update schema (for partial updates)
export const propertyUpdateSchema = propertyFormSchema.partial();

export type PropertyUpdateData = z.infer<typeof propertyUpdateSchema>;

// Property filters validation schema
export const propertyFiltersSchema = z.object({
  search: z.string().optional(),
  property_type: propertyTypeSchema.optional(), // Keep for backward compat
  category_id: z.string().uuid().optional(),
  category_slug: z.string().optional(),
  status: propertyStatusSchema.optional(),
  bedrooms: z.number().int().min(0).optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  min_size: z.number().min(0).optional(),
  max_size: z.number().min(0).optional(),
  golden_visa_eligible: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});

export type PropertyFiltersData = z.infer<typeof propertyFiltersSchema>;
