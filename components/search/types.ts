import { z } from 'zod';

const priceRangeSchema = z.object({
  min: z.string().optional(),
  max: z.string().optional(),
});

export const filterSchema = z.object({
  location: z.string().optional(),
  propertyType: z.string().optional(),
  priceRange: priceRangeSchema,
  amenities: z.array(z.string()).optional(),
  goldenVisaEligible: z.boolean().optional(),
});

export type FilterSchema = z.infer<typeof filterSchema>;
