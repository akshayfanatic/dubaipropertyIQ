import { serverClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export type Role = 'admin' | 'agent' | 'customer';

/**
 * Get the current user's role from JWT
 * Defaults to 'customer' if not found
 */
export async function getRole(): Promise<Role> {
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (user?.app_metadata?.user_role as Role) ?? 'customer';
}

/**
 * Check if current user has a specific role
 */
export async function hasRole(role: Role): Promise<boolean> {
  return (await getRole()) === role;
}

/**
 * Redirect if user doesn't have required role
 */
export async function requireRole(role: Role): Promise<void> {
  if (!(await hasRole(role))) {
    redirect('/unauthorized');
  }
}
