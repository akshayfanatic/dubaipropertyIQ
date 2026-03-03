'use client';

import { Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/components/ui/select-field';
export interface SearchFormData {
  location: string;
  propertyType: string;
  priceRange: string;
}

const formSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  propertyType: z.string(),
  priceRange: z.string(),
});

const propertyTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'penthouse', label: 'Penthouse' },
];

const priceRanges = [
  { value: 'any', label: 'Any Price' },
  { value: '500k-1m', label: 'AED 500K - 1M' },
  { value: '1m-2m', label: 'AED 1M - 2M' },
  { value: '2m-5m', label: 'AED 2M - 5M' },
  { value: '5m+', label: 'AED 5M+' },
];

export default function SearchForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: '',
      propertyType: '',
      priceRange: '',
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    console.log('Search submitted:', data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn('flex flex-col gap-4 md:flex-row md:items-end')}>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-white">Location</FormLabel>
              <FormControl>
                <Input placeholder="City, community, or building name" className="bg-white/95 border-0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertyType"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-white">Property Type</FormLabel>
              <FormControl>
                <SelectField options={propertyTypes} placeholder="Select type" value={field.value} onValueChange={field.onChange} className="h-11 bg-white/95 border-0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priceRange"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-white">Price Range</FormLabel>
              <FormControl>
                <SelectField options={priceRanges} placeholder="Select price" value={field.value} onValueChange={field.onChange} className="h-11 bg-white/95 border-0" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="icon" className="h-11 w-11 shrink-0 bg-primary hover:bg-primary/90">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search properties</span>
        </Button>
      </form>
    </Form>
  );
}
