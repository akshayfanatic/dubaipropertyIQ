'use client';

import { PropertyCard } from '@/components/properties/card/PropertyCard';
import type { PropertyListItem } from '@/types/property';

export function PropertyCardSlide(property: PropertyListItem) {
  return <PropertyCard property={property} />;
}
