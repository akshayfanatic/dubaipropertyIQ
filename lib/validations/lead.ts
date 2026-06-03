import { z } from 'zod';
import { LEAD_SOURCE_TYPES, LEAD_STATUSES } from '@/types/lead';

const optionalTextField = z
  .preprocess((value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? null : trimmed;
    }

    return value ?? null;
  }, z.string().nullable())
  .optional()
  .transform((value) => value ?? null);

export const leadSourceTypeSchema = z.enum(LEAD_SOURCE_TYPES);
export const leadStatusSchema = z.enum(LEAD_STATUSES);

export const leadSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120, 'Name must be less than 120 characters'),
  email: z.string().trim().email('Enter a valid email address').max(255, 'Email must be less than 255 characters'),
  phone: optionalTextField,
  nationality: optionalTextField,
  source_page: z.string().trim().min(1, 'Source page is required').max(2048, 'Source page must be less than 2048 characters'),
  source_type: leadSourceTypeSchema,
  area_of_interest: optionalTextField,
  message: optionalTextField,
  utm_source: optionalTextField,
  utm_medium: optionalTextField,
  utm_campaign: optionalTextField,
});

export type LeadData = z.infer<typeof leadSchema>;
export type LeadInput = z.input<typeof leadSchema>;

export const leadInsertSchema = leadSchema.extend({
  status: leadStatusSchema.optional(),
});

export type LeadInsertData = z.infer<typeof leadInsertSchema>;
