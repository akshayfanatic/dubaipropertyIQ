/**
 * Amenity Validation Schemas
 * Zod schemas for amenity form validation
 */

import { z } from 'zod';
import { imageObjectSchema } from './shared';

// Amenity form validation schema
export const amenitySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  logo_url: imageObjectSchema.nullable().optional(),
});

export type AmenityFormData = z.infer<typeof amenitySchema>;

// Amenity insert schema (for creating new amenities)
export const amenityInsertSchema = amenitySchema;

export type AmenityInsertData = z.infer<typeof amenityInsertSchema>;

// Amenity update schema (for partial updates)
export const amenityUpdateSchema = amenitySchema.partial();

export type AmenityUpdateData = z.infer<typeof amenityUpdateSchema>;
