'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { StyledTab2, type TabConfig } from '@/components/shared/styled-tabs-2';
import { PropertyCard, PropertyCardSkeleton } from '@/components/properties/card';
import type { City } from '@/types/city';
import type { PropertyListItem, PaginatedResult } from '@/types/property';
import { ApiResponse } from '@/lib/utils/response';

interface CityPropertyTabsProps {
  cities: City[];
  propertiesPerCity?: number;
  isFeatured?: boolean;
}

export function CityPropertyTabs({ cities, propertiesPerCity = 6, isFeatured }: CityPropertyTabsProps) {
  const [activeCity, setActiveCity] = useState<string>(cities[0]?.id || '');

  const queryString = `?city_id=${activeCity}&pageSize=${propertiesPerCity}${isFeatured !== undefined ? `&is_featured=${isFeatured}` : ''}`;
  const { data, isLoading } = useSWR<ApiResponse<PaginatedResult<PropertyListItem>>>(`/api/public/properties${queryString}`);

  const properties = data?.data?.data ?? [];
  const gridClassName = 'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 xl:gap-6';

  const tabs: TabConfig[] = cities.map((city) => ({
    value: city.id,
    label: city.name,
    content: isLoading ? (
      <div className={gridClassName}>
        {Array.from({ length: propertiesPerCity }).map((_, i) => (
          <PropertyCardSkeleton key={i} />
        ))}
      </div>
    ) : properties.length > 0 ? (
      <div className={gridClassName}>
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    ) : (
      <div className="text-center py-12 text-muted-foreground">No properties available in {city.name}</div>
    ),
  }));

  return <StyledTab2 tabs={tabs} defaultValue={activeCity} onValueChange={setActiveCity} />;
}
