'use client';

import dynamic from 'next/dynamic';
import { StyledTabs } from '@/components/shared/styled-tabs';
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
  const tabs = [
    {
      value: 'basic-info',
      label: 'Basic Info',
      content: <AreaBasicInfo area={area} />,
    },
    {
      value: 'location-info',
      label: 'Location',
      content: <AreaLocation areaId={area?.id} location={area?.location} />,
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
  ] as const;

  return <StyledTabs tabs={tabs} defaultValue="basic-info" />;
}
