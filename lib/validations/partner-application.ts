import { z } from 'zod';
import { PARTNER_APPLICATION_STATUSES } from '@/types/partner-application';

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

export const agentPartnerApplicationSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name is required').max(120, 'Full name must be less than 120 characters'),
  email: z.string().trim().email('Enter a valid email').max(255, 'Email must be less than 255 characters'),
  phone: optionalTextField,
  whatsapp: optionalTextField,
  agency_name: optionalTextField,
  rera_number: z.string().trim().min(2, 'RERA number is required').max(80, 'RERA number must be less than 80 characters'),
  experience_years: z.coerce.number().int().min(0).max(80).nullable().optional(),
  areas_of_focus: optionalTextField,
  message: optionalTextField,
});

export const partnerApplicationStatusSchema = z.enum(PARTNER_APPLICATION_STATUSES);

export const partnerApplicationReviewSchema = z.object({
  status: partnerApplicationStatusSchema,
  admin_notes: optionalTextField,
});

export type AgentPartnerApplicationInput = z.input<typeof agentPartnerApplicationSchema>;
export type AgentPartnerApplicationFormData = z.infer<typeof agentPartnerApplicationSchema>;
export type PartnerApplicationReviewInput = z.input<typeof partnerApplicationReviewSchema>;
