import { serverClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

export type Role = 'admin' | 'agent' | 'customer';

type DecodedToken = {
  user_role?: Role;
  sub: string;
  email?: string;
};

/**
 * Get the current user's role from JWT custom claims
 * Defaults to 'customer' if not found
 */
export async function getRole(): Promise<Role> {
  const supabase = await serverClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return 'customer';
  }

  try {
    const decoded = jwtDecode<DecodedToken>(session.access_token);
    return decoded.user_role ?? 'customer';
  } catch {
    return 'customer';
  }
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
