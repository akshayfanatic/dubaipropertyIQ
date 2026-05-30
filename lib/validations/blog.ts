/**
 * Blog Validation Schemas
 * Zod schemas for blog form validation
 */

import { z } from 'zod';
import { imageObjectSchema } from './shared';

// Tiptap JSON content schema (basic validation)
const blogContentSchema = z.any();

// Blog form validation schema
export const blogSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title must be less than 200 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  feature_image_url: imageObjectSchema,
  content: blogContentSchema,
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  meta_title: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
  meta_description: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  is_published: z.boolean(),
});

export type BlogFormData = z.infer<typeof blogSchema>;

// Blog insert schema
export const blogInsertSchema = blogSchema;
export type BlogInsertData = z.infer<typeof blogInsertSchema>;

// Blog update schema (partial, slug not editable)
export const blogUpdateSchema = blogSchema.partial({
  slug: true,
});
export type BlogUpdateData = z.infer<typeof blogUpdateSchema>;
