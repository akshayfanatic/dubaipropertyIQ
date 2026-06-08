import useSWR from 'swr';

export function useAreas() {
  const { data, error, isLoading } = useSWR<{ label: string; value: string }[]>('/api/public/areas/options');

  return {
    areas: data ?? [],
    isLoading,
    error,
  };
}
