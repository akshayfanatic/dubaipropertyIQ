import useSWR from 'swr';
import { fetcher } from '@/lib/swr-config';

export interface AutocompleteResult {
  id: string;
  label: string;
  type: 'property' | 'city';
  slug: string;
  city?: string | null;
}

interface UseLocationAutocompleteReturn {
  results: AutocompleteResult[];
  isLoading: boolean;
  error: unknown;
}

export function useLocationAutocomplete(query: string): UseLocationAutocompleteReturn {
  const shouldFetch = query.length >= 2;
  const { data, isLoading, error } = useSWR<{ results: AutocompleteResult[] }>(shouldFetch ? `/api/public/locations/autocomplete?q=${encodeURIComponent(query)}` : null, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    results: data?.results ?? [],
    isLoading,
    error,
  };
}
