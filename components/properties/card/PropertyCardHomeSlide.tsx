'use client';

import { PropertyCardHome } from '@/components/properties/card/PropertyCardHome';
import type { PropertyListItem } from '@/types/property';

export function PropertyCardHomeSlide(property: PropertyListItem) {
  return <PropertyCardHome property={property} />;
}
