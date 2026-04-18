/**
 * Page Validation Schemas
 * Zod schemas for page form validation
 */

import { z } from 'zod';

// Tiptap JSON content schema (basic validation)
const pageContentSchema = z.any();

// Page form validation schema
export const pageSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters').max(200, 'Title must be less than 200 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: pageContentSchema,
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  meta_title: z.string().max(60, 'Meta title must be less than 60 characters').optional(),
  meta_description: z.string().max(160, 'Meta description must be less than 160 characters').optional(),
  is_published: z.boolean(),
});

export type PageFormData = z.infer<typeof pageSchema>;

// Page insert schema
export const pageInsertSchema = pageSchema;
export type PageInsertData = z.infer<typeof pageInsertSchema>;

// Page update schema (partial, slug not editable)
export const pageUpdateSchema = pageSchema.partial({
  slug: true,
});
export type PageUpdateData = z.infer<typeof pageUpdateSchema>;
