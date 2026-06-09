/**
 * Developer Validation Schemas
 * Zod schemas for developer form validation
 */

import { z } from 'zod';
import { imageObjectSchema } from './shared';

const optionalSeoTextField = (max: number, message: string) =>
  z.union([z.string().trim().max(max, message), z.literal(''), z.null(), z.undefined()]).transform((val) => (val === '' || val === null || val === undefined ? null : val));

const optionalSeoUrlField = z
  .union([z.string().trim().url('Must be a valid URL').max(2048, 'URL must be less than 2048 characters'), z.literal(''), z.null(), z.undefined()])
  .transform((val) => (val === '' || val === null || val === undefined ? null : val));

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

export const developerSeoSchema = z.object({
  developer_id: z.string().uuid('Developer ID must be valid'),
  meta_title: optionalSeoTextField(60, 'Meta title must be less than 60 characters'),
  meta_description: optionalSeoTextField(160, 'Meta description must be less than 160 characters'),
  keywords: optionalSeoTextField(255, 'Keywords must be less than 255 characters'),
  og_image_url: optionalSeoUrlField,
  canonical_url: optionalSeoUrlField,
});

export type DeveloperSEOData = z.infer<typeof developerSeoSchema>;

export const developerSeoFormSchema = developerSeoSchema.omit({ developer_id: true });

export type DeveloperSEOFormInput = z.input<typeof developerSeoFormSchema>;

export type DeveloperSEOFormData = z.infer<typeof developerSeoFormSchema>;

export const developerSeoInsertSchema = developerSeoSchema;

export type DeveloperSEOInsertData = z.infer<typeof developerSeoInsertSchema>;

export const developerSeoUpdateSchema = developerSeoFormSchema.partial();

export type DeveloperSEOUpdateData = z.infer<typeof developerSeoUpdateSchema>;
