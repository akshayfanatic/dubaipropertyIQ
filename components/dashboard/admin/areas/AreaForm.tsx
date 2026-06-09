'use client';

import dynamic from 'next/dynamic';
import { StyledTabs } from '@/components/shared/styled-tabs';
import { AreaFormProps } from '@/types/areas';
import { FormSkelton } from '@/components/shared/form-skelton';
import type { LocationValue } from '@/components/shared/location/schema';
import type { Json } from '@/types/db/supabase-generated';

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

const AreaSEO = dynamic(() => import('./tabs/AreaSEO'), {
  loading: () => <FormSkelton fields={5} showPageHeader={false} showSubmitButton />,
});

function parseLocation(location: Json | null | undefined): LocationValue | null {
  if (!location || typeof location !== 'object' || Array.isArray(location)) {
    return null;
  }

  const lat = location.lat;
  const lng = location.lng;

  return typeof lat === 'number' && typeof lng === 'number' ? { lat, lng } : null;
}

export function AreaForm({ area }: AreaFormProps) {
  const location = parseLocation(area?.location);

  const tabs = [
    {
      value: 'basic-info',
      label: 'Basic Info',
      content: <AreaBasicInfo area={area} />,
    },
    {
      value: 'location-info',
      label: 'Location',
      content: <AreaLocation areaId={area?.id} location={location} />,
    },
    {
      value: 'faqs',
      label: 'FAQs',
      content: <AreaFAQs areaId={area?.id} faqs={area?.areas_faqs} />,
    },
    {
      value: 'amenities-faqs',
      label: 'Amenities',
      content: <AreaAmenitiesFAQs areaId={area?.id} faqs={area?.areas_amenities_faqs} />,
    },
    {
      value: 'seo',
      label: 'SEO',
      content: <AreaSEO areaId={area?.id} seo={area?.areas_seo} />,
    },
  ] as const;

  return <StyledTabs tabs={tabs} defaultValue="basic-info" />;
}
