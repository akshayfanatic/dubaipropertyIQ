import { createClient } from '@supabase/supabase-js';

const REQUIRED_ADMIN_ENV_VARS = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const;

class MissingAdminEnvError extends Error {
  constructor(missingVars: string[]) {
    super(`Missing required admin environment variables: ${missingVars.join(', ')}`);
    this.name = 'MissingAdminEnvError';
  }
}

function getAdminEnv() {
  const missing = REQUIRED_ADMIN_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new MissingAdminEnvError(missing);
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  };
}

export function adminClient() {
  const { url, serviceKey } = getAdminEnv();

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export function isAdminConfigError(error: Error): boolean {
  return error instanceof MissingAdminEnvError;
}
