'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { DollarSign, Percent, Star } from 'lucide-react';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { buildingSchema } from '@/lib/validations/building';
import { updateBuilding } from '@/lib/db/buildings/actions';
import { NumberInput } from './BuildingFormFields';

const buildingInvestmentSchema = buildingSchema.pick({
  avg_price_per_sqft: true,
  area_avg_price_per_sqft: true,
  rental_yield: true,
  service_charge_aed_per_sqft: true,
  overall_score: true,
  liquidity_score: true,
  capital_growth_score: true,
  lifestyle_score: true,
  short_term_rental_potential: true,
  demand_level: true,
});

type BuildingInvestmentData = z.input<typeof buildingInvestmentSchema>;

interface BuildingInvestmentProps {
  buildingId?: string;
  avg_price_per_sqft?: BuildingInvestmentData['avg_price_per_sqft'];
  area_avg_price_per_sqft?: BuildingInvestmentData['area_avg_price_per_sqft'];
  rental_yield?: BuildingInvestmentData['rental_yield'];
  service_charge_aed_per_sqft?: BuildingInvestmentData['service_charge_aed_per_sqft'];
  overall_score?: BuildingInvestmentData['overall_score'];
  liquidity_score?: BuildingInvestmentData['liquidity_score'];
  capital_growth_score?: BuildingInvestmentData['capital_growth_score'];
  lifestyle_score?: BuildingInvestmentData['lifestyle_score'];
  short_term_rental_potential?: BuildingInvestmentData['short_term_rental_potential'];
  demand_level?: BuildingInvestmentData['demand_level'];
}

function BuildingInvestment({
  buildingId,
  avg_price_per_sqft,
  area_avg_price_per_sqft,
  rental_yield,
  service_charge_aed_per_sqft,
  overall_score,
  liquidity_score,
  capital_growth_score,
  lifestyle_score,
  short_term_rental_potential,
  demand_level,
}: BuildingInvestmentProps) {
  const form = useForm<BuildingInvestmentData>({
    resolver: zodResolver(buildingInvestmentSchema),
    defaultValues: {
      avg_price_per_sqft: avg_price_per_sqft ?? null,
      area_avg_price_per_sqft: area_avg_price_per_sqft ?? null,
      rental_yield: rental_yield ?? null,
      service_charge_aed_per_sqft: service_charge_aed_per_sqft ?? null,
      overall_score: overall_score ?? null,
      liquidity_score: liquidity_score ?? null,
      capital_growth_score: capital_growth_score ?? null,
      lifestyle_score: lifestyle_score ?? null,
      short_term_rental_potential: short_term_rental_potential ?? '',
      demand_level: demand_level ?? '',
    },
  });

  const onSubmit = async (data: BuildingInvestmentData) => {
    if (!buildingId) {
      toast.error('Please save the building basic info first');
      return;
    }

    const result = await updateBuilding(buildingId, {
      ...data,
      short_term_rental_potential: data.short_term_rental_potential || null,
      demand_level: data.demand_level || null,
    });

    if (!result.success) {
      toast.error(result.message || 'Failed to save investment intelligence');
      return;
    }

    toast.success('Investment intelligence saved successfully');
  };

  return (
    <WidgetCard>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Controller
            name="avg_price_per_sqft"
            control={form.control}
            render={({ field }) => <NumberInput label="Avg Price / sqft" icon={DollarSign} value={field.value} onChange={field.onChange} />}
          />
          <Controller
            name="area_avg_price_per_sqft"
            control={form.control}
            render={({ field }) => <NumberInput label="Area Avg / sqft" icon={DollarSign} value={field.value} onChange={field.onChange} />}
          />
          <Controller name="rental_yield" control={form.control} render={({ field }) => <NumberInput label="Rental Yield %" icon={Percent} value={field.value} onChange={field.onChange} />} />
          <Controller name="service_charge_aed_per_sqft" control={form.control} render={({ field }) => <NumberInput label="Service Charge / sqft" value={field.value} onChange={field.onChange} />} />
          <Controller
            name="overall_score"
            control={form.control}
            render={({ field }) => <NumberInput label="Overall Score" icon={Star} value={field.value} onChange={field.onChange} min={0} max={100} />}
          />
          <Controller name="liquidity_score" control={form.control} render={({ field }) => <NumberInput label="Liquidity Score" value={field.value} onChange={field.onChange} min={0} max={100} />} />
          <Controller
            name="capital_growth_score"
            control={form.control}
            render={({ field }) => <NumberInput label="Capital Growth Score" value={field.value} onChange={field.onChange} min={0} max={100} />}
          />
          <Controller name="lifestyle_score" control={form.control} render={({ field }) => <NumberInput label="Lifestyle Score" value={field.value} onChange={field.onChange} min={0} max={100} />} />
          <Controller
            name="short_term_rental_potential"
            control={form.control}
            render={({ field }) => <TextInput label="Short-term Potential" placeholder="High" value={field.value || ''} onChange={field.onChange} />}
          />
          <Controller name="demand_level" control={form.control} render={({ field }) => <TextInput label="Demand Level" placeholder="Strong" value={field.value || ''} onChange={field.onChange} />} />
        </div>
        <FormActions isSubmitting={form.formState.isSubmitting} isEditMode={!!buildingId} submitLabel="Investment" />
      </form>
    </WidgetCard>
  );
}

export default BuildingInvestment;
