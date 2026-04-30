/**
 * City Validation Schemas
 * Zod schemas for city form validation
 */

import { z } from 'zod';
import { imageObjectSchema } from './shared';

// City form validation schema
export const citySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  logo_url: imageObjectSchema,
});

export type CityFormData = z.infer<typeof citySchema>;

// City insert schema (for creating new cities)
export const cityInsertSchema = citySchema;

export type CityInsertData = z.infer<typeof cityInsertSchema>;

// City update schema (for partial updates)
export const cityUpdateSchema = citySchema.partial();

export type CityUpdateData = z.infer<typeof cityUpdateSchema>;
