'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { StyledTab2, type TabConfig } from '@/components/shared/styled-tabs-2';
import { PropertyCardHome } from '@/components/properties/card/PropertyCardHome';
import { PropertyCardHomeSkeleton } from '@/components/properties/card/PropertyCardHomeSkeleton';
import type { City } from '@/types/city';
import type { PropertyListItem, PaginatedResult } from '@/types/property';
import { ApiResponse } from '@/lib/utils/response';

interface CityPropertyTabsProps {
  cities: City[];
  propertiesPerCity?: number;
}

export function CityPropertyTabs({ cities, propertiesPerCity = 6 }: CityPropertyTabsProps) {
  const [activeCity, setActiveCity] = useState<string>(cities[0]?.id || '');

  const queryString = `?city_id=${activeCity}&pageSize=${propertiesPerCity}`;
  const { data, isLoading } = useSWR<ApiResponse<PaginatedResult<PropertyListItem>>>(`/api/public/properties${queryString}`);

  const properties = data?.data?.data ?? [];

  const tabs: TabConfig[] = cities.map((city) => ({
    value: city.id,
    label: city.name,
    content: isLoading ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <PropertyCardHomeSkeleton key={i} />
        ))}
      </div>
    ) : properties.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <PropertyCardHome key={property.id} property={property} />
        ))}
      </div>
    ) : (
      <div className="text-center py-12 text-muted-foreground">No properties available in {city.name}</div>
    ),
  }));

  return <StyledTab2 tabs={tabs} defaultValue={activeCity} onValueChange={setActiveCity} />;
}
