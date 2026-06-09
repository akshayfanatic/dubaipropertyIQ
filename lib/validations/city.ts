/**
 * City Validation Schemas
 * Zod schemas for city form validation
 */

import { z } from 'zod';
import { imageObjectSchema } from './shared';

const optionalSeoTextField = (max: number, message: string) =>
  z.union([z.string().trim().max(max, message), z.literal(''), z.null(), z.undefined()]).transform((val) => (val === '' || val === null || val === undefined ? null : val));

const optionalSeoUrlField = z
  .union([z.string().trim().url('Must be a valid URL').max(2048, 'URL must be less than 2048 characters'), z.literal(''), z.null(), z.undefined()])
  .transform((val) => (val === '' || val === null || val === undefined ? null : val));

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

export const citySeoSchema = z.object({
  city_id: z.string().uuid('City ID must be valid'),
  meta_title: optionalSeoTextField(60, 'Meta title must be less than 60 characters'),
  meta_description: optionalSeoTextField(160, 'Meta description must be less than 160 characters'),
  keywords: optionalSeoTextField(255, 'Keywords must be less than 255 characters'),
  og_image_url: optionalSeoUrlField,
  canonical_url: optionalSeoUrlField,
});

export type CitySEOData = z.infer<typeof citySeoSchema>;

export const citySeoFormSchema = citySeoSchema.omit({ city_id: true });

export type CitySEOFormInput = z.input<typeof citySeoFormSchema>;

export type CitySEOFormData = z.infer<typeof citySeoFormSchema>;

export const citySeoInsertSchema = citySeoSchema;

export type CitySEOInsertData = z.infer<typeof citySeoInsertSchema>;

export const citySeoUpdateSchema = citySeoFormSchema.partial();

export type CitySEOUpdateData = z.infer<typeof citySeoUpdateSchema>;
