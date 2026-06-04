import { z } from 'zod';
import { parseAsArrayOf, parseAsBoolean, parseAsString } from 'nuqs';

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

export const searchQueryParsers = {
  q: parseAsString.withDefault(''),
  categories: parseAsString.withDefault(''),
  minPrice: parseAsString.withDefault(''),
  maxPrice: parseAsString.withDefault(''),
  amenities: parseAsArrayOf(parseAsString).withDefault([]),
  golden_visa_eligible: parseAsBoolean.withDefault(false),
};

export function queryToFilterValues(query: { q: string; categories: string; minPrice: string; maxPrice: string; amenities: string[]; golden_visa_eligible: boolean }): FilterSchema {
  return {
    location: query.q,
    propertyType: query.categories,
    priceRange: {
      min: query.minPrice,
      max: query.maxPrice,
    },
    amenities: query.amenities,
    goldenVisaEligible: query.golden_visa_eligible,
  };
}

export function filterValuesToQuery(data: FilterSchema) {
  return {
    q: data.location || null,
    categories: data.propertyType || null,
    minPrice: data.priceRange.min || null,
    maxPrice: data.priceRange.max || null,
    amenities: data.amenities?.length ? data.amenities : null,
    golden_visa_eligible: data.goldenVisaEligible || null,
  };
}
