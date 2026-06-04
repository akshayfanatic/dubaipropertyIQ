'use client';

import dynamic from 'next/dynamic';
import { StyledTabs } from '@/components/shared/styled-tabs';
import { FormSkelton } from '@/components/shared/form-skelton';
import type { BuildingWithRelations } from '@/types/building';

interface BuildingFormProps {
  building?: BuildingWithRelations;
}

const BuildingBasicInfo = dynamic(() => import('./tabs/BuildingBasicInfo'), {
  loading: () => <FormSkelton fields={6} showPageHeader={false} showSubmitButton={false} />,
});

const BuildingLocation = dynamic(() => import('./tabs/BuildingLocation'), {
  loading: () => <FormSkelton fields={1} showPageHeader={false} showSubmitButton={false} />,
});

const BuildingFacts = dynamic(() => import('./tabs/BuildingFacts'), {
  loading: () => <FormSkelton fields={7} showPageHeader={false} showSubmitButton={false} />,
});

const BuildingInvestment = dynamic(() => import('./tabs/BuildingInvestment'), {
  loading: () => <FormSkelton fields={10} showPageHeader={false} showSubmitButton={false} />,
});

const BuildingProsCons = dynamic(() => import('./tabs/BuildingProsCons'), {
  loading: () => <FormSkelton fields={2} showPageHeader={false} showSubmitButton={false} />,
});

export function BuildingForm({ building }: BuildingFormProps) {
  const buildingId = building?.id;

  const tabs = [
    {
      value: 'basic-info',
      label: 'Basic Info',
      content: (
        <BuildingBasicInfo
          buildingId={buildingId}
          area_id={building?.area_id}
          city_id={building?.city_id}
          developer_id={building?.developer_id}
          name={building?.name}
          slug={building?.slug}
          description={building?.description}
          address={building?.address}
          photos={building?.photos}
        />
      ),
    },
    {
      value: 'location',
      label: 'Location',
      content: <BuildingLocation buildingId={buildingId} location={building?.location} />,
    },
    {
      value: 'facts',
      label: 'Facts',
      content: (
        <BuildingFacts
          buildingId={buildingId}
          building_type={building?.building_type}
          ownership_type={building?.ownership_type}
          completion_year={building?.completion_year}
          total_floors={building?.total_floors}
          total_units={building?.total_units}
          property_types={building?.property_types}
          amenities={building?.amenities}
        />
      ),
    },
    {
      value: 'investment',
      label: 'Investment',
      content: (
        <BuildingInvestment
          buildingId={buildingId}
          avg_price_per_sqft={building?.avg_price_per_sqft}
          area_avg_price_per_sqft={building?.area_avg_price_per_sqft}
          rental_yield={building?.rental_yield}
          service_charge_aed_per_sqft={building?.service_charge_aed_per_sqft}
          overall_score={building?.overall_score}
          liquidity_score={building?.liquidity_score}
          capital_growth_score={building?.capital_growth_score}
          lifestyle_score={building?.lifestyle_score}
          short_term_rental_potential={building?.short_term_rental_potential}
          demand_level={building?.demand_level}
        />
      ),
    },
    {
      value: 'pros-cons',
      label: 'Pros & Cons',
      content: <BuildingProsCons buildingId={buildingId} pros={building?.pros} cons={building?.cons} />,
    },
  ] as const;

  return <StyledTabs tabs={tabs} defaultValue="basic-info" />;
}
