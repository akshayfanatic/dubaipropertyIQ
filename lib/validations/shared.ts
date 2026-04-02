/**
 * Shared Validation Schemas
 * Common Zod schemas used across multiple validation files
 */

import { z } from 'zod';

// Image object schema for SEO-friendly images with alt tags
export const imageObjectSchema = z.object({
  url: z.string().url('Must be a valid URL'),
  alt_tag: z.string().min(1, 'Alt tag is required'),
});

export type ImageObjectSchema = z.infer<typeof imageObjectSchema>;
