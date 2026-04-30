import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useAmenities() {
  const { data, error, isLoading } = useSWR<{ label: string; value: string }[]>('/api/public/amenities/options', fetcher);

  return {
    amenities: data ?? [],
    isLoading,
    error,
  };
}
