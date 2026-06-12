'use client';

import useSWR from 'swr';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { PropertySaveButton } from '@/components/properties/PropertySaveButton';
import { PropertyCard, PropertyCardSkeleton } from '@/components/properties/card';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { Button } from '@/components/ui/button';
import type { ApiResponse } from '@/lib/utils/response';
import type { PropertyListItem } from '@/types/property';

export const savedPropertiesKey = '/api/customer/saved-properties';

type CustomerSavedPropertiesListProps = {
  initialProperties: PropertyListItem[];
};

export function CustomerSavedPropertiesList({ initialProperties }: CustomerSavedPropertiesListProps) {
  const {
    data: response,
    error,
    isLoading,
  } = useSWR<ApiResponse<PropertyListItem[]>>(savedPropertiesKey, {
    fallbackData: {
      success: true,
      status: 200,
      message: 'Saved properties loaded',
      data: initialProperties,
    },

    dedupingInterval: 1000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
  });

  const savedProperties = response?.success ? (response.data ?? []) : [];

  return (
    <WidgetCard icon={Heart} title="Saved properties" description="Properties you save for later comparison will appear here.">
      {isLoading ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      ) : error || response?.success === false ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-sm text-destructive">{response?.message || 'Failed to load saved properties.'}</p>
        </div>
      ) : savedProperties.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {savedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} wishlistSlot={<PropertySaveButton propertyId={property.id} initialSaved />} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-background p-6">
          <p className="text-sm text-muted-foreground">No saved properties yet.</p>
          <Button asChild className="mt-4">
            <Link href="/search">Browse listings</Link>
          </Button>
        </div>
      )}
    </WidgetCard>
  );
}
