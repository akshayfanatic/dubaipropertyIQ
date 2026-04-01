/**
 * Category Validation Schemas
 * Zod schemas for category form validation
 */

import { z } from 'zod';

// Image object schema for logo
const imageObjectSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  alt_tag: z.string().min(1, 'Alt tag is required'),
});

// Category form validation schema
export const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  logo_url: imageObjectSchema.nullable().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

// Category insert schema (for creating new categories)
export const categoryInsertSchema = categorySchema;

export type CategoryInsertData = z.infer<typeof categoryInsertSchema>;

// Category update schema (for partial updates)
export const categoryUpdateSchema = categorySchema.partial();

export type CategoryUpdateData = z.infer<typeof categoryUpdateSchema>;
