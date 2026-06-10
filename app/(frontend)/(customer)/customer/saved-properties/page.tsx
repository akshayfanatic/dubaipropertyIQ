import { PropertySaveButton } from '@/components/properties/PropertySaveButton';
import { PropertyCard } from '@/components/properties/card';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { Button } from '@/components/ui/button';
import { getSavedProperties } from '@/lib/db/properties/queries';
import { Heart } from 'lucide-react';
import Link from 'next/link';

const CustomerSavedPropertiesPage = async () => {
  const savedPropertiesResponse = await getSavedProperties();
  const savedProperties = savedPropertiesResponse.success ? (savedPropertiesResponse.data ?? []) : [];

  return (
    <WidgetCard icon={Heart} title="Saved properties" description="Properties you save for later comparison will appear here.">
      {savedProperties.length > 0 ? (
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
};

export default CustomerSavedPropertiesPage;
