/**
 * Property Validation Schemas
 * Zod schemas for property form validation
 */

import { z } from 'zod';
import { imageObjectSchema, faqSchema } from './shared';
import { locationSchema } from '@/components/shared/location/schema';
import { PROPERTY_STATUSES } from '@/types/enums';

// Property Type enum validation (for backward compatibility)
export const propertyTypeSchema = z.enum(['apartment', 'villa', 'townhouse', 'penthouse', 'land']);

// Property Status enum validation
export const propertyStatusSchema = z.enum(PROPERTY_STATUSES);

// Slug validation schema
export const propertySlugSchema = z
  .string()
  .min(3, 'Slug must be at least 3 characters')
  .max(200, 'Slug must be less than 200 characters')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers, and hyphens')
  .transform((val) => val.toLowerCase().trim());

// Optional UUID field - handles empty string, null, undefined
const optionalUuidField = z
  .union([z.string().uuid(), z.literal(''), z.null(), z.undefined()])
  .transform((val) => (val === '' || val === null || val === undefined ? null : val))
  .nullable()
  .optional();

// Required UUID field - handles empty string by rejecting it
const requiredUuidField = z.string().uuid('Please select a valid option');

const optionalSeoTextField = (max: number, message: string) =>
  z.union([z.string().trim().max(max, message), z.literal(''), z.null(), z.undefined()]).transform((val) => (val === '' || val === null || val === undefined ? null : val));

const optionalSeoUrlField = z
  .union([z.string().trim().url('Must be a valid URL').max(2048, 'URL must be less than 2048 characters'), z.literal(''), z.null(), z.undefined()])
  .transform((val) => (val === '' || val === null || val === undefined ? null : val));

// Property form validation schema
export const propertyFormSchema = z.object({
  slug: propertySlugSchema, // Auto-generated if not provided
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category_id: requiredUuidField,
  developer_id: optionalUuidField,
  city_id: optionalUuidField,
  bedrooms: z.number().int().min(0, 'Bedrooms cannot be negative'),
  bathrooms: z.number().int().min(0, 'Bathrooms cannot be negative'),
  size_sqft: z.number().int().positive('Size must be a positive number'),
  price_aed: z.number().positive('Price must be a positive number'),
  status: propertyStatusSchema,
  golden_visa_eligible: z.boolean(),
  is_featured: z.boolean().default(false),
  photos: z.array(imageObjectSchema).min(3, 'At least three photo is required'), // Three photo required
  features: z.array(z.string()),
  floor_plan: z.string().url('Invalid floor plan URL').nullable().optional(),
  location: locationSchema.optional(), // NEW: Location coordinates (lat/lng)
  amenity_ids: z.array(z.string().uuid()).optional(), // Array of amenity IDs from junction table
  faqs: z.array(faqSchema).optional(), // NEW: Property FAQs
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;

// Property insert schema (for creating new properties)
export const propertyInsertSchema = propertyFormSchema;

export type PropertyInsertData = z.infer<typeof propertyInsertSchema>;

// Property update schema (for partial updates)
export const propertyUpdateSchema = propertyFormSchema.partial();

export type PropertyUpdateData = z.infer<typeof propertyUpdateSchema>;

// Property SEO validation schema
export const propertySeoSchema = z.object({
  property_id: z.string().uuid('Property ID must be valid'),
  meta_title: optionalSeoTextField(60, 'Meta title must be less than 60 characters'),
  meta_description: optionalSeoTextField(160, 'Meta description must be less than 160 characters'),
  keywords: optionalSeoTextField(255, 'Keywords must be less than 255 characters'),
  og_image_url: optionalSeoUrlField,
  canonical_url: optionalSeoUrlField,
});

export type PropertySEOData = z.infer<typeof propertySeoSchema>;

// Property SEO form schema. property_id comes from route/property context.
export const propertySeoFormSchema = propertySeoSchema.omit({ property_id: true });

export type PropertySEOFormInput = z.input<typeof propertySeoFormSchema>;

export type PropertySEOFormData = z.infer<typeof propertySeoFormSchema>;

export const propertySeoInsertSchema = propertySeoSchema;

export type PropertySEOInsertData = z.infer<typeof propertySeoInsertSchema>;

export const propertySeoUpdateSchema = propertySeoFormSchema.partial();

export type PropertySEOUpdateData = z.infer<typeof propertySeoUpdateSchema>;

// Property filters validation schema
export const propertyFiltersSchema = z.object({
  search: z.string().optional(),
  property_type: propertyTypeSchema.optional(), // Keep for backward compat
  category_id: z.string().uuid().optional(),
  category_slug: z.string().optional(),
  city_id: z.string().uuid().optional(),
  city_slug: z.string().optional(),
  status: propertyStatusSchema.optional(),
  bedrooms: z.number().int().min(0).optional(),
  min_price: z.number().min(0).optional(),
  max_price: z.number().min(0).optional(),
  min_size: z.number().min(0).optional(),
  max_size: z.number().min(0).optional(),
  golden_visa_eligible: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().int().positive().optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
});

export type PropertyFiltersData = z.infer<typeof propertyFiltersSchema>;
