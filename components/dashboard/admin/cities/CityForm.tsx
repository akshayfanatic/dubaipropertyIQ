'use client';

import dynamic from 'next/dynamic';
import { StyledTabs } from '@/components/shared/styled-tabs';
import { FormSkelton } from '@/components/shared/form-skelton';
import type { City } from '@/types/city';

interface CityFormProps {
  city?: City;
}

const CityBasicInfo = dynamic(() => import('./tabs/CityBasicInfo'), {
  loading: () => <FormSkelton fields={4} showPageHeader={false} showSubmitButton />,
});

const CitySEO = dynamic(() => import('./tabs/CitySEO'), {
  loading: () => <FormSkelton fields={5} showPageHeader={false} showSubmitButton />,
});

export function CityForm({ city }: CityFormProps) {
  const tabs = [
    {
      value: 'basic-info',
      label: 'Basic Info',
      content: <CityBasicInfo city={city} />,
    },
    {
      value: 'seo',
      label: 'SEO',
      content: <CitySEO cityId={city?.id} seo={city?.cities_seo} />,
    },
  ] as const;

  return <StyledTabs tabs={tabs} defaultValue="basic-info" />;
}
