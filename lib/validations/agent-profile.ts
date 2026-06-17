import { z } from 'zod';

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

export const agentProfileSchema = z.object({
  contact_name: optionalTextField,
  phone: optionalTextField,
  whatsapp: optionalTextField,
  agency_name: optionalTextField,
  company_name: optionalTextField,
  broker_id: optionalTextField,
  avatar_url: optionalTextField,
});

export type AgentProfileInput = z.input<typeof agentProfileSchema>;
export type AgentProfileFormData = z.infer<typeof agentProfileSchema>;
