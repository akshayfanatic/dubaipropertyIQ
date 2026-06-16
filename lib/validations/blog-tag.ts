/**
 * Blog tag validation schemas.
 */

import { z } from 'zod';

export const blogTagSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
});

export type BlogTagFormData = z.infer<typeof blogTagSchema>;

export const blogTagInsertSchema = blogTagSchema;
export type BlogTagInsertData = z.infer<typeof blogTagInsertSchema>;

export const blogTagUpdateSchema = blogTagSchema.partial();
export type BlogTagUpdateData = z.infer<typeof blogTagUpdateSchema>;
