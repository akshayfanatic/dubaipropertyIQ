'use client';

import dynamic from 'next/dynamic';
import { StyledTabs } from '@/components/shared/styled-tabs';
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

const PropertySEO = dynamic(() => import('./tabs/PropertySEO'), {
  loading: () => <FormSkelton fields={5} showPageHeader={false} showSubmitButton />,
});

export function PropertyForm({ property }: PropertyFormProps) {
  const tabs = [
    {
      value: 'basic-info',
      label: 'Basic Info',
      content: <PropertyBasicInfo property={property} />,
    },
    {
      value: 'location-info',
      label: 'Location',
      content: <PropertyLocation propertyId={property?.id} location={property?.location} />,
    },
    {
      value: 'faqs',
      label: 'FAQs',
      content: <PropertyFAQs propertyId={property?.id} faqs={property?.properties_faqs} />,
    },
    {
      value: 'seo',
      label: 'SEO',
      content: <PropertySEO propertyId={property?.id} seo={property?.properties_seo} />,
    },
  ] as const;

  return <StyledTabs tabs={tabs} defaultValue="basic-info" />;
}
