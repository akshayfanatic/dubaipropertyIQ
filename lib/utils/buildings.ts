import type { Building, BuildingWithRelations } from '@/types/building';

export function firstOrValue<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

export function normalizeBuilding(data: Record<string, unknown>): Building {
  return {
    ...data,
    location: data.location ?? null,
    photos: Array.isArray(data.photos) ? data.photos : [],
    property_types: Array.isArray(data.property_types) ? data.property_types : [],
    amenities: Array.isArray(data.amenities) ? data.amenities : [],
    nearby_places: Array.isArray(data.nearby_places) ? data.nearby_places : [],
    unit_price_ranges: Array.isArray(data.unit_price_ranges) ? data.unit_price_ranges : [],
    rental_ranges: Array.isArray(data.rental_ranges) ? data.rental_ranges : [],
    transaction_summary: data.transaction_summary && typeof data.transaction_summary === 'object' && !Array.isArray(data.transaction_summary) ? data.transaction_summary : {},
    pros: Array.isArray(data.pros) ? data.pros : [],
    cons: Array.isArray(data.cons) ? data.cons : [],
  } as Building;
}

export function normalizeBuildingWithRelations(data: Record<string, unknown>): BuildingWithRelations {
  const building = normalizeBuilding(data);

  return {
    ...building,
    area: firstOrValue(data.area as BuildingWithRelations['area'] | BuildingWithRelations['area'][] | null),
    city: firstOrValue(data.city as BuildingWithRelations['city'] | BuildingWithRelations['city'][] | null),
    developer: firstOrValue(data.developer as BuildingWithRelations['developer'] | BuildingWithRelations['developer'][] | null),
  };
}
