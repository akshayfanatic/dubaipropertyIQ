'use client';

import { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Filter } from 'lucide-react';
import useSWR from 'swr';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/shared/select-field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { SearchInput } from '@/components/shared/forms/search-input';
import { ResetButton } from '@/components/shared/forms/reset-button';
import { FilterFieldSet } from '@/components/shared/forms/filter-fieldset';
import { CategoryOption } from '@/types/category';
import { CityOption } from '@/types/city';
import { useIsMobile } from '@/hooks/use-mobile';
import { PROPERTY_STATUS_OPTIONS } from '@/types';

export function FilterBar() {
  const { control, reset } = useFormContext();
  const isMobile = useIsMobile();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { data: categoryOptions, isLoading: isLoadingCategories } = useSWR<CategoryOption[]>('/api/admin/categories/options');
  const { data: cityOptions, isLoading: isLoadingCities } = useSWR<CityOption[]>('/api/admin/cities/options');
  const cities = cityOptions || [];

  return (
    <FilterFieldSet>
      {/* Search field - filters properties by title/description */}
      <Controller
        name="search"
        control={control}
        render={({ field }) => <SearchInput value={field.value} onChange={field.onChange} placeholder="Search properties..." className="flex-1 max-w-7xl" />}
      />

      {/* Property type field - filters by property category */}
      <Controller
        name="property_type"
        control={control}
        render={({ field }) => (
          <SelectField
            options={categoryOptions ?? []}
            placeholder={isLoadingCategories ? 'Loading...' : 'Type'}
            value={field.value}
            onValueChange={field.onChange}
            className="w-full sm:w-40"
            disabled={isLoadingCategories}
          />
        )}
      />

      {/* City field - filters by city */}
      <Controller
        name="city_id"
        control={control}
        render={({ field }) => (
          <SelectField
            options={cities.filter((c) => c.value !== 'all')}
            placeholder={isLoadingCities ? 'Loading...' : 'City'}
            value={field.value}
            onValueChange={field.onChange}
            className="w-full sm:w-40"
            disabled={isLoadingCities}
          />
        )}
      />

      {/* Status field - filters by property availability status */}
      <Controller
        name="status"
        control={control}
        render={({ field }) => <SelectField options={PROPERTY_STATUS_OPTIONS} placeholder="Status" value={field.value} onValueChange={field.onChange} className="w-full sm:w-40" />}
      />

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" type="button" className="cursor-pointer">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align={isMobile ? 'start' : 'end'}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium leading-none">Additional Filters</h4>
              <ResetButton onReset={() => reset()} label="Reset All" />
            </div>

            {/* Bedrooms field - filters by minimum number of bedrooms */}
            <Controller
              name="bedrooms"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Min Bedrooms</Label>
                  <Input id="bedrooms" type="number" min={0} placeholder="0" value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} />
                </div>
              )}
            />

            <div className="space-y-2">
              <Label>Price Range (AED)</Label>
              <div className="grid grid-cols-2 gap-2">
                {/* Min price field - filters by minimum price */}
                <Controller
                  name="min_price"
                  control={control}
                  render={({ field }) => <Input type="number" min={0} placeholder="Min" value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} />}
                />

                {/* Max price field - filters by maximum price */}
                <Controller
                  name="max_price"
                  control={control}
                  render={({ field }) => <Input type="number" min={0} placeholder="Max" value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} />}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Size Range (sqft)</Label>
              <div className="grid grid-cols-2 gap-2">
                {/* Min size field - filters by minimum property size */}
                <Controller
                  name="min_size"
                  control={control}
                  render={({ field }) => <Input type="number" min={0} placeholder="Min" value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} />}
                />

                {/* Max size field - filters by maximum property size */}
                <Controller
                  name="max_size"
                  control={control}
                  render={({ field }) => <Input type="number" min={0} placeholder="Max" value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} />}
                />
              </div>
            </div>

            {/* Golden visa field - filters for golden visa eligible properties only */}
            <Controller
              name="golden_visa_eligible"
              control={control}
              render={({ field }) => (
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
                  <span className="text-sm">Golden Visa Eligible Only</span>
                </label>
              )}
            />
          </div>
        </PopoverContent>
      </Popover>

      <ResetButton onReset={() => reset()} />
    </FilterFieldSet>
  );
}
