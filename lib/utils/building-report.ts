import type { SupabaseClient } from '@supabase/supabase-js';
import type { BuildingAmenityDetail, BuildingWithRelations } from '@/types/building';
import type { Database } from '@/types/db/supabase-generated';
import type { ImageObject } from '@/types/images';

function looksLikeUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function withBuildingAmenityLabels(building: BuildingWithRelations, supabase: SupabaseClient<Database>): Promise<BuildingWithRelations> {
  const amenityIds = building.amenities.filter(looksLikeUuid);

  if (amenityIds.length === 0) {
    return {
      ...building,
      amenity_details: building.amenities.map((amenity) => ({
        id: amenity,
        name: amenity,
        logo_url: null,
      })),
    };
  }

  const { data, error } = await supabase.from('amenities').select('id, name, logo_url').in('id', amenityIds);

  if (error) {
    return building;
  }

  const detailsById = new Map(
    (data || []).map((amenity) => [
      amenity.id,
      {
        id: amenity.id,
        name: amenity.name,
        logo_url: amenity.logo_url as ImageObject | null,
      } satisfies BuildingAmenityDetail,
    ]),
  );

  return {
    ...building,
    amenities: building.amenities.map((amenity) => detailsById.get(amenity)?.name || amenity),
    amenity_details: building.amenities.map((amenity) => detailsById.get(amenity) || { id: amenity, name: amenity, logo_url: null }),
  };
}
