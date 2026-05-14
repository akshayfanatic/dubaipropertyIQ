import useSWR from 'swr';
import { SelectOption } from '@/types/shared';

interface UseCategoriesReturn {
  categories: SelectOption[];
  isLoading: boolean;
  error: unknown;
}

// Property Types
export function useCategories(): UseCategoriesReturn {
  const { data, isLoading, error } = useSWR<SelectOption[]>('/api/public/categories/options');

  return {
    categories: data ?? [],
    isLoading,
    error,
  };
}
