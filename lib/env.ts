export class MissingEnvError extends Error {
  constructor(missingVars: string[]) {
    super(`Missing required environment variables: ${missingVars.join(', ')}`);
    this.name = 'MissingEnvError';
  }
}

export function getSupabaseEnv() {
  // Must use direct property access for Next.js to replace at build time
  // Dynamic process.env[key] doesn't work in browser
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const missing: string[] = [];
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!key) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (missing.length > 0) {
    throw new MissingEnvError(missing);
  }

  return { url: url!, key: key! };
}

export function isConfigError(error: Error): boolean {
  return error instanceof MissingEnvError;
}
