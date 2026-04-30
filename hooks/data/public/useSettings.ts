import useSWR from 'swr';
import type { GroupedSettings } from '@/types/settings';
import { fetcher } from '@/lib/swr-config';

interface SettingsResponse {
  success: boolean;
  status: number;
  message: string;
  data: GroupedSettings;
}

interface UseSettingsReturn {
  data: GroupedSettings | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
}

export function useSettings(): UseSettingsReturn {
  const { data, error, isLoading, isValidating } = useSWR<SettingsResponse>('/api/public/settings', fetcher, {
    dedupingInterval: 300000, // 5 min - prevent duplicate requests
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    data: data?.data,
    error,
    isLoading,
    isValidating,
  };
}
