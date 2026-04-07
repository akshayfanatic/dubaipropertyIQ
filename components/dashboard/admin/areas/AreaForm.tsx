'use client';

import dynamic from 'next/dynamic';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Area } from '@/types/areas';
import { Loader2 } from 'lucide-react';

// Dynamic imports for code-splitting tabs
const AreaBasicInfo = dynamic(() => import('./tabs/AreaBasicInfo'), {
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

const AreaFAQs = dynamic(() => import('./tabs/AreaFAQs'), {
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

const AreaAmenitiesFAQs = dynamic(() => import('./tabs/AreaAmenitiesFAQs'), {
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface AreaFormProps {
  area?: Area & {
    cities?: { name: string } | null;
    areas_amenities?: Array<{ amenity_id: string }>;
    areas_properties?: Array<{ property_id: string }>;
    areas_faqs?: Array<{ id: string; question: string; answer: string }>;
    areas_amenities_faqs?: Array<{ id: string; question: string; answer: string }>;
  };
}

export function AreaForm({ area }: AreaFormProps) {
  return (
    <Tabs defaultValue="basic-info" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
        <TabsTrigger value="faqs">FAQs</TabsTrigger>
        <TabsTrigger value="amenities-faqs">Amenities FAQs</TabsTrigger>
      </TabsList>

      <TabsContent value="basic-info">
        <AreaBasicInfo area={area} />
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
