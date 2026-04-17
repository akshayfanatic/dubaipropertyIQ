/**
 * Settings Validation Schemas
 * Zod schemas for settings form validation
 */

import { z } from 'zod';

/**
 * URL validation schema
 */
const urlSchema = z.string().url('Must be a valid URL').optional().or(z.literal(''));

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Must be a valid email address');

/**
 * Phone/Tel validation schema (flexible for international formats)
 */
export const telSchema = z.string().min(5, 'Phone number must be at least 5 characters');

/**
 * General settings schema
 */
export const generalSettingsSchema = z.object({
  site_name: z.string().min(2, 'Site name must be at least 2 characters'),
  logo_url: urlSchema,
});

export type GeneralSettingsFormData = z.infer<typeof generalSettingsSchema>;

/**
 * Contact settings schema
 */
export const contactSettingsSchema = z.object({
  email: emailSchema,
  phone: telSchema,
  whatsapp: telSchema,
  address: z.string().min(5, 'Address must be at least 5 characters'),
});

export type ContactSettingsFormData = z.infer<typeof contactSettingsSchema>;

/**
 * Social settings schema
 */
export const socialSettingsSchema = z.object({
  facebook: urlSchema,
  instagram: urlSchema,
  linkedin: urlSchema,
  twitter: urlSchema,
});

export type SocialSettingsFormData = z.infer<typeof socialSettingsSchema>;

/**
 * Combined settings schema for bulk updates
 */
export const settingsUpdateSchema = z.object({
  general: generalSettingsSchema.partial(),
  contact: contactSettingsSchema.partial(),
  social: socialSettingsSchema.partial(),
});

export type SettingsUpdateFormData = z.infer<typeof settingsUpdateSchema>;
