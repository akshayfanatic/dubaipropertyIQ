/**
 * Developer Validation Schemas
 * Zod schemas for developer form validation
 */

import { z } from 'zod';
import { imageObjectSchema } from './shared';

// Developer form validation schema
export const developerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be less than 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  logo_url: imageObjectSchema
    .nullable()
    .optional()
    .refine((value) => value != null, 'Developer logo is required'),
  description: z.string().max(2000, 'Description must be less than 2000 characters').nullable().or(z.literal('')),
  website_url: z.string().url('Must be a valid URL').nullable().or(z.literal('')),

  // Trust Score Components (1-5 scale per PRD)
  delivery_timeliness_score: z.number().min(1).max(5),
  service_charge_score: z.number().min(1).max(5),
  build_quality_score: z.number().min(1).max(5),
  after_sales_score: z.number().min(1).max(5),

  // Stats
  total_projects: z.number().min(0),
  completed_projects: z.number().min(0),
  ongoing_projects: z.number().min(0),
  years_active: z.number().min(0),
});

export type DeveloperFormData = z.input<typeof developerSchema>;

// Developer insert schema (for creating new developers)
export const developerInsertSchema = developerSchema;

export type DeveloperInsertData = z.output<typeof developerInsertSchema>;

// Developer update schema (for partial updates)
export const developerUpdateSchema = developerSchema.partial();

export type DeveloperUpdateData = z.output<typeof developerUpdateSchema>;
