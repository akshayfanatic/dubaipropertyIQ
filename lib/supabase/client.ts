import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseEnv } from '@/lib/env';

export function browserClient() {
  const { url, key } = getSupabaseEnv();
  return createBrowserClient(url, key);
}
