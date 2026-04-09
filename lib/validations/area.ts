/**
 * Area Validation Schemas
 * Zod schemas for area form validation
 */

import { z } from 'zod';

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
  photos: z.array(z.string()),
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
