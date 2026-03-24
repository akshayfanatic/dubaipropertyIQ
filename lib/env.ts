const REQUIRED_ENV_VARS = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'] as const;

export class MissingEnvError extends Error {
  constructor(missingVars: string[]) {
    super(`Missing required environment variables: ${missingVars.join(', ')}`);
    this.name = 'MissingEnvError';
  }
}

export function validateSupabaseEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new MissingEnvError(missing);
  }
}

export function getSupabaseEnv() {
  validateSupabaseEnv();
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  };
}

export function isConfigError(error: Error): boolean {
  return error instanceof MissingEnvError;
}
