/**
 * Area Validation Schemas
 * Zod schemas for area form validation
 */

import { z } from 'zod';
import { imageObjectSchema } from './shared';

const optionalSeoTextField = (max: number, message: string) =>
  z.union([z.string().trim().max(max, message), z.literal(''), z.null(), z.undefined()]).transform((val) => (val === '' || val === null || val === undefined ? null : val));

const optionalSeoUrlField = z
  .union([z.string().trim().url('Must be a valid URL').max(2048, 'URL must be less than 2048 characters'), z.literal(''), z.null(), z.undefined()])
  .transform((val) => (val === '' || val === null || val === undefined ? null : val));

// Area form validation schema
export const areaSchema = z.object({
  city_id: z.string().uuid('Invalid city ID'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  photos: z.array(imageObjectSchema).min(3, 'At least three photo is required'), // Three photo required
  amenity_ids: z.array(z.string().uuid()).optional(),
  property_ids: z.array(z.string().uuid()).optional(),
  faqs: z
    .array(
      z.object({
        question: z.string().min(5, 'Question must be at least 5 characters'),
        answer: z.string().min(10, 'Answer must be at least 10 characters'),
      }),
    )
    .optional(),
  amenities_faqs: z
    .array(
      z.object({
        question: z.string().min(5, 'Question must be at least 5 characters'),
        answer: z.string().min(10, 'Answer must be at least 10 characters'),
      }),
    )
    .optional(),
  location: z
    .object({
      lat: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
      lng: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
    })
    .optional(),
});

export type AreaFormData = z.infer<typeof areaSchema>;

// Area insert schema (for creating new areas)
export const areaInsertSchema = areaSchema;

export type AreaInsertData = z.infer<typeof areaInsertSchema>;

// Area update schema (for partial updates)
export const areaUpdateSchema = areaSchema.partial();

export type AreaUpdateData = z.infer<typeof areaUpdateSchema>;

// Area FAQ schema
export const areaFAQSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
});

export type AreaFAQData = z.infer<typeof areaFAQSchema>;

export const areaFAQInsertSchema = areaFAQSchema.extend({
  area_id: z.string().uuid('Invalid area ID'),
});

export type AreaFAQInsertData = z.infer<typeof areaFAQInsertSchema>;

// Area Amenities FAQ schema (same structure)
export const areaAmenityFAQInsertSchema = areaFAQInsertSchema;

export type AreaAmenityFAQInsertData = z.infer<typeof areaAmenityFAQInsertSchema>;

export const areaSeoSchema = z.object({
  area_id: z.string().uuid('Area ID must be valid'),
  meta_title: optionalSeoTextField(60, 'Meta title must be less than 60 characters'),
  meta_description: optionalSeoTextField(160, 'Meta description must be less than 160 characters'),
  keywords: optionalSeoTextField(255, 'Keywords must be less than 255 characters'),
  og_image_url: optionalSeoUrlField,
  canonical_url: optionalSeoUrlField,
});

export type AreaSEOData = z.infer<typeof areaSeoSchema>;

export const areaSeoFormSchema = areaSeoSchema.omit({ area_id: true });

export type AreaSEOFormInput = z.input<typeof areaSeoFormSchema>;

export type AreaSEOFormData = z.infer<typeof areaSeoFormSchema>;

export const areaSeoInsertSchema = areaSeoSchema;

export type AreaSEOInsertData = z.infer<typeof areaSeoInsertSchema>;

export const areaSeoUpdateSchema = areaSeoFormSchema.partial();

export type AreaSEOUpdateData = z.infer<typeof areaSeoUpdateSchema>;
