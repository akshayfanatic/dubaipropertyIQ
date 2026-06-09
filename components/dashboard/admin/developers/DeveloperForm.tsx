'use client';

import dynamic from 'next/dynamic';
import { Developer } from '@/types/developer';
import { StyledTabs } from '@/components/shared/styled-tabs';
import { FormSkelton } from '@/components/shared/form-skelton';

interface DeveloperFormProps {
  developer?: Developer;
}

// Dynamic imports for code-splitting tabs
const DeveloperBasicInfo = dynamic(() => import('./tabs/DeveloperBasicInfo'), {
  loading: () => <FormSkelton fields={8} showPageHeader={false} showSubmitButton />,
});

const DeveloperSEO = dynamic(() => import('./tabs/DeveloperSEO'), {
  loading: () => <FormSkelton fields={5} showPageHeader={false} showSubmitButton />,
});

export function DeveloperForm({ developer }: DeveloperFormProps) {
  const tabs = [
    {
      value: 'basic-details',
      label: 'Basic Details',
      content: <DeveloperBasicInfo developer={developer} />,
    },
    {
      value: 'seo',
      label: 'SEO',
      content: <DeveloperSEO developerId={developer?.id} seo={developer?.developers_seo} />,
    },
  ];

  return <StyledTabs tabs={tabs} defaultValue="basic-details" />;
}
