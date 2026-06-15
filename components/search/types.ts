import { z } from 'zod';
import { parseAsArrayOf, parseAsBoolean, parseAsInteger, parseAsString } from 'nuqs';

const priceRangeSchema = z.object({
  min: z.string().optional(),
  max: z.string().optional(),
});

export const filterSchema = z.object({
  location: z.string().optional(),
  propertyType: z.string().optional(),
  bedrooms: z.string().optional(),
  status: z.string().optional(),
  sort: z.string().optional(),
  areas: z.array(z.string()).optional(),
  developerId: z.string().optional(),
  priceRange: priceRangeSchema,
  amenities: z.array(z.string()).optional(),
  goldenVisaEligible: z.boolean().optional(),
});

export type FilterSchema = z.infer<typeof filterSchema>;

export const searchQueryParsers = {
  q: parseAsString.withDefault(''),
  categories: parseAsString.withDefault(''),
  bedrooms: parseAsString.withDefault(''),
  status: parseAsString.withDefault(''),
  sort: parseAsString.withDefault(''),
  areas: parseAsArrayOf(parseAsString).withDefault([]),
  developer_id: parseAsString.withDefault(''),
  minPrice: parseAsString.withDefault(''),
  maxPrice: parseAsString.withDefault(''),
  amenities: parseAsArrayOf(parseAsString).withDefault([]),
  golden_visa_eligible: parseAsBoolean.withDefault(false),
  page: parseAsInteger.withDefault(1),
};

export function queryToFilterValues(query: {
  q: string;
  categories: string;
  bedrooms: string;
  status: string;
  sort: string;
  areas: string[];
  developer_id: string;
  minPrice: string;
  maxPrice: string;
  amenities: string[];
  golden_visa_eligible: boolean;
}): FilterSchema {
  return {
    location: query.q,
    propertyType: query.categories,
    bedrooms: query.bedrooms,
    status: query.status,
    sort: query.sort,
    areas: query.areas,
    developerId: query.developer_id,
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
    bedrooms: data.bedrooms || null,
    status: data.status || null,
    sort: data.sort || null,
    areas: data.areas?.length ? data.areas : null,
    developer_id: data.developerId || null,
    minPrice: data.priceRange.min || null,
    maxPrice: data.priceRange.max || null,
    amenities: data.amenities?.length ? data.amenities : null,
    golden_visa_eligible: data.goldenVisaEligible || null,
  };
}
