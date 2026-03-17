'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { jwtDecode } from 'jwt-decode';

export type Role = 'admin' | 'agent' | 'customer';

type DecodedToken = {
  user_role?: Role;
  sub: string;
};

/**
 * Hook to get current user's role from JWT
 * Use this in client components
 */
export function useRole() {
  const [role, setRole] = useState<Role>('customer');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    const getRole = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        try {
          const decoded = jwtDecode<DecodedToken>(session.access_token);
          setRole(decoded.user_role ?? 'customer');
        } catch {
          setRole('customer');
        }
      }

      setLoading(false);
    };

    getRole();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        try {
          const decoded = jwtDecode<DecodedToken>(session.access_token);
          setRole(decoded.user_role ?? 'customer');
        } catch {
          setRole('customer');
        }
      } else {
        setRole('customer');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { role, loading, isAdmin: role === 'admin', isAgent: role === 'agent' };
}
