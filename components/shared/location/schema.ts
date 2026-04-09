/**
 * Location Validation Schemas
 * Zod schemas for location form validation
 */

import { z } from 'zod';

export const locationSchema = z.object({
  lat: z.number().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
  lng: z.number().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
});

export const locationFormSchema = z.object({
  location: locationSchema.optional(),
});

export type Location = z.infer<typeof locationFormSchema>;
export type LocationValue = z.infer<typeof locationSchema>;

export const DEFAULT_LOCATION: LocationValue = { lat: 25.0657, lng: 55.17128 };
