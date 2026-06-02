import { ProfileBasicInfoForm } from '@/components/dashboard/admin/profile/ProfileBasicInfoForm';
import { PropertySaveButton } from '@/components/properties/PropertySaveButton';
import { PropertyCard } from '@/components/properties/card';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { PageHeader } from '@/components/shared/page-header';
import { StyledTabs } from '@/components/shared/styled-tabs';
import { Button } from '@/components/ui/button';
import { requireAuth } from '@/lib/auth/guards';
import { getSavedProperties } from '@/lib/db/properties/queries';
import { Heart } from 'lucide-react';
import Link from 'next/link';

async function SavedPropertiesTab() {
  const savedPropertiesResponse = await getSavedProperties();
  const savedProperties = savedPropertiesResponse.success ? (savedPropertiesResponse.data ?? []) : [];

  return (
    <WidgetCard icon={Heart} title="Saved properties" description="Properties you save for later comparison will appear here.">
      {savedProperties.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

const CustomerPage = async () => {
  const user = await requireAuth();

  const initialData = {
    email: user.email,
    displayName: user.user_metadata?.display_name || null,
    avatarUrl: user.user_metadata?.avatar_url || null,
  };

  const tabs = [
    {
      value: 'profile',
      label: 'Profile',
      content: <ProfileBasicInfoForm initialData={initialData} />,
    },
    {
      value: 'saved-properties',
      label: 'Saved Properties',
      content: <SavedPropertiesTab />,
    },
  ] as const;

  return (
    <div className="mx-auto space-y-8">
      <PageHeader title="Customer Account" description="Manage your profile and saved properties." showBackButton />
      <StyledTabs tabs={tabs} defaultValue="profile" className="w-full" />
    </div>
  );
};

export default CustomerPage;
