'use client';

import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property } from '@/types/property';
import { FormSkelton } from '@/components/shared/form-skelton';

interface PropertyFormProps {
  property?: Property;
}

// Dynamic imports for code-splitting tabs
const PropertyBasicInfo = dynamic(() => import('./tabs/PropertyBasicInfo'), {
  loading: () => <FormSkelton fields={3} showPageHeader={false} showSubmitButton />,
});

const PropertyLocation = dynamic(() => import('./tabs/PropertyLocation'), {
  loading: () => <FormSkelton fields={1} showPageHeader={false} showSubmitButton />,
});

const PropertyFAQs = dynamic(() => import('./tabs/PropertyFAQs'), {
  loading: () => <FormSkelton fields={3} showPageHeader={false} showSubmitButton />,
});

export function PropertyForm({ property }: PropertyFormProps) {
  return (
    <Tabs defaultValue="basic-info" className="w-full">
      <TabsList className="flex w-full flex-nowrap overflow-x-auto overflow-y-hidden gap-1">
        <TabsTrigger value="basic-info" className="whitespace-nowrap shrink-0">
          Basic Info
        </TabsTrigger>
        <TabsTrigger value="location-info" className="whitespace-nowrap shrink-0">
          Location
        </TabsTrigger>
        <TabsTrigger value="faqs" className="whitespace-nowrap shrink-0">
          FAQs
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic-info">
        <PropertyBasicInfo property={property} />
      </TabsContent>

      <TabsContent value="location-info">
        <PropertyLocation propertyId={property?.id} location={property?.location} />
      </TabsContent>

      <TabsContent value="faqs">
        <PropertyFAQs propertyId={property?.id} faqs={property?.properties_faqs} />
      </TabsContent>
    </Tabs>
  );
}
