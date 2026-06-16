import useSWR from 'swr';
import type { DeveloperOption } from '@/types/developer';

export function useDevelopers() {
  const { data, error, isLoading } = useSWR<DeveloperOption[]>('/api/public/developers');

  return {
    developers: data ?? [],
    isLoading,
    error,
  };
}
