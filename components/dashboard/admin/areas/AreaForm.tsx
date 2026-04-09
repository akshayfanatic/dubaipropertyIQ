'use client';

import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaFormProps } from '@/types/areas';
import { FormSkelton } from '@/components/shared/form-skelton';

// Dynamic imports for code-splitting tabs
const AreaBasicInfo = dynamic(() => import('./tabs/AreaBasicInfo'), {
  loading: () => <FormSkelton fields={6} showPageHeader={false} showSubmitButton />,
});

const AreaFAQs = dynamic(() => import('./tabs/AreaFAQs'), {
  loading: () => <FormSkelton fields={3} showPageHeader={false} showSubmitButton />,
});

const AreaAmenitiesFAQs = dynamic(() => import('./tabs/AreaAmenitiesFAQs'), {
  loading: () => <FormSkelton fields={3} showPageHeader={false} showSubmitButton />,
});

const AreaLocation = dynamic(() => import('./tabs/AreaLocation'), {
  loading: () => <FormSkelton fields={1} showPageHeader={false} showSubmitButton />,
});

export function AreaForm({ area }: AreaFormProps) {
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
        <TabsTrigger value="amenities-faqs" className="whitespace-nowrap shrink-0">
          Amenities
        </TabsTrigger>
      </TabsList>

      <TabsContent value="basic-info">
        <AreaBasicInfo area={area} />
      </TabsContent>

      <TabsContent value="location-info">
        <AreaLocation areaId={area?.id} location={area?.location} />
      </TabsContent>

      <TabsContent value="faqs">
        <AreaFAQs areaId={area?.id} faqs={area?.areas_faqs} />
      </TabsContent>

      <TabsContent value="amenities-faqs">
        <AreaAmenitiesFAQs areaId={area?.id} faqs={area?.areas_amenities_faqs} />
      </TabsContent>
    </Tabs>
  );
}
