'use client';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { FormActions } from '@/components/shared/forms/FormActions';
import { TextInput } from '@/components/shared/forms/text-input';
import { MultiSelect } from '@/components/ui/multi-select';
import { buildingSchema } from '@/lib/validations/building';
import { updateBuilding } from '@/lib/db/buildings/actions';
import { useAmenities } from '@/hooks/data/public/useAmenities';
import { useCategories } from '@/hooks/data/public/useCategories';
import { NumberInput } from './BuildingFormFields';

const buildingFactsSchema = buildingSchema.pick({
  building_type: true,
  ownership_type: true,
  completion_year: true,
  total_floors: true,
  total_units: true,
  property_types: true,
  amenities: true,
});

type BuildingFactsData = z.input<typeof buildingFactsSchema>;

interface BuildingFactsProps {
  buildingId?: string;
  building_type?: BuildingFactsData['building_type'];
  ownership_type?: BuildingFactsData['ownership_type'];
  completion_year?: BuildingFactsData['completion_year'];
  total_floors?: BuildingFactsData['total_floors'];
  total_units?: BuildingFactsData['total_units'];
  property_types?: BuildingFactsData['property_types'];
  amenities?: BuildingFactsData['amenities'];
}

function BuildingFacts({ buildingId, building_type, ownership_type, completion_year, total_floors, total_units, property_types, amenities: selectedAmenities }: BuildingFactsProps) {
  const { categories, isLoading: isLoadingCategories } = useCategories();
  const { amenities, isLoading: isLoadingAmenities } = useAmenities();
  const propertyTypeOptions = categories.map(({ label, value }) => ({ label, value }));

  const form = useForm<BuildingFactsData>({
    resolver: zodResolver(buildingFactsSchema),
    defaultValues: {
      building_type: building_type ?? '',
      ownership_type: ownership_type ?? '',
      completion_year: completion_year ?? null,
      total_floors: total_floors ?? null,
      total_units: total_units ?? null,
      property_types: property_types ?? [],
      amenities: selectedAmenities ?? [],
    },
  });

  const onSubmit = async (data: BuildingFactsData) => {
    if (!buildingId) {
      toast.error('Please save the building basic info first');
      return;
    }

    const result = await updateBuilding(buildingId, {
      ...data,
      building_type: data.building_type || null,
      ownership_type: data.ownership_type || null,
      property_types: data.property_types ?? [],
      amenities: data.amenities ?? [],
    });

    if (!result.success) {
      toast.error(result.message || 'Failed to save building facts');
      return;
    }

    toast.success('Building facts saved successfully');
  };

  return (
    <WidgetCard>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Controller
            name="building_type"
            control={form.control}
            render={({ field }) => <TextInput label="Building Type" placeholder="Residential" value={field.value || ''} onChange={field.onChange} />}
          />
          <Controller
            name="ownership_type"
            control={form.control}
            render={({ field }) => <TextInput label="Ownership Type" placeholder="Freehold" value={field.value || ''} onChange={field.onChange} />}
          />
          <Controller name="completion_year" control={form.control} render={({ field }) => <NumberInput label="Completion Year" value={field.value} onChange={field.onChange} />} />
          <Controller name="total_floors" control={form.control} render={({ field }) => <NumberInput label="Total Floors" value={field.value} onChange={field.onChange} />} />
          <Controller name="total_units" control={form.control} render={({ field }) => <NumberInput label="Total Units" value={field.value} onChange={field.onChange} />} />
          <Controller
            name="property_types"
            control={form.control}
            render={({ field }) => (
              <MultiSelect
                name="property_types"
                label="Property Types"
                placeholder="Select property types"
                options={propertyTypeOptions}
                value={field.value ?? []}
                onChange={field.onChange}
                isLoading={isLoadingCategories}
                disabled={isLoadingCategories}
              />
            )}
          />
          <Controller
            name="amenities"
            control={form.control}
            render={({ field }) => (
              <MultiSelect
                name="amenities"
                label="Amenities"
                placeholder="Select amenities"
                options={amenities}
                value={field.value ?? []}
                onChange={field.onChange}
                isLoading={isLoadingAmenities}
                disabled={isLoadingAmenities}
              />
            )}
          />
        </div>
        <FormActions isSubmitting={form.formState.isSubmitting} isEditMode={!!buildingId} submitLabel="Facts" />
      </form>
    </WidgetCard>
  );
}

export default BuildingFacts;
