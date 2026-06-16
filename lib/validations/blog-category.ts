/**
 * Blog category validation schemas.
 */

import { z } from 'zod';

export const blogCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must be less than 100 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(100, 'Slug must be less than 100 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  is_active: z.boolean(),
});

export type BlogCategoryFormData = z.infer<typeof blogCategorySchema>;

export const blogCategoryInsertSchema = blogCategorySchema;
export type BlogCategoryInsertData = z.infer<typeof blogCategoryInsertSchema>;

export const blogCategoryUpdateSchema = blogCategorySchema.partial();
export type BlogCategoryUpdateData = z.infer<typeof blogCategoryUpdateSchema>;
