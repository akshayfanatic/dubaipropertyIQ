'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SelectField } from '@/components/ui/select-field';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

export type FilterFormValues = {
  search: string;
  property_type: string;
  status: string;
  bedrooms: number | '';
  min_price: number | '';
  max_price: number | '';
  min_size: number | '';
  max_size: number | '';
  golden_visa_eligible: boolean;
};

const propertyTypeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'land', label: 'Land' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'off_plan', label: 'Off Plan' },
];

interface FilterBarProps {
  popoverOpen: boolean;
  onPopoverChange: (open: boolean) => void;
}

export function FilterBar({ popoverOpen, onPopoverChange }: FilterBarProps) {
  const { control, reset } = useFormContext<FilterFormValues>();

  const handleClearFilters = () => {
    reset({
      search: '',
      property_type: '',
      status: '',
      bedrooms: '',
      min_price: '',
      max_price: '',
      min_size: '',
      max_size: '',
      golden_visa_eligible: true,
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Controller
        name="search"
        control={control}
        render={({ field }) => (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...field} placeholder="Search properties..." className="pl-10" />
          </div>
        )}
      />

      <Controller
        name="property_type"
        control={control}
        render={({ field }) => <SelectField options={propertyTypeOptions} placeholder="Type" value={field.value} onValueChange={field.onChange} className="w-full sm:w-40" />}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => <SelectField options={statusOptions} placeholder="Status" value={field.value} onValueChange={field.onChange} className="w-full sm:w-40" />}
      />

      <Popover open={popoverOpen} onOpenChange={onPopoverChange}>
        <PopoverTrigger asChild>
          <Button variant="outline" type="button" className="cursor-pointer">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Additional Filters</h4>

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
                <Controller
                  name="min_price"
                  control={control}
                  render={({ field }) => <Input type="number" min={0} placeholder="Min" value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} />}
                />
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
                <Controller
                  name="min_size"
                  control={control}
                  render={({ field }) => <Input type="number" min={0} placeholder="Min" value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} />}
                />
                <Controller
                  name="max_size"
                  control={control}
                  render={({ field }) => <Input type="number" min={0} placeholder="Max" value={field.value || ''} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')} />}
                />
              </div>
            </div>

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

            <Button variant="outline" type="button" className="w-full cursor-pointer" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
