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

// Generic FAQ validation schema (question/answer pairs)
export const faqSchema = z.object({
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
});

export type FAQSchema = z.infer<typeof faqSchema>;
