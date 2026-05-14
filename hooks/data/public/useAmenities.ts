import useSWR from 'swr';

export function useAmenities() {
  const { data, error, isLoading } = useSWR<{ label: string; value: string }[]>('/api/public/amenities/options');

  return {
    amenities: data ?? [],
    isLoading,
    error,
  };
}
