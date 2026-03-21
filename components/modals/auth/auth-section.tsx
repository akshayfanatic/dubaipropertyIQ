'use client';

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { browserClient } from '@/lib/supabase/client';
import { UserNav } from './user-nav';
import { AdminNav } from './admin-nav';
import { LoginButton } from './login-button';
import { UserProfile } from '@/types/user';

type Role = 'admin' | 'agent' | 'customer';

export function AuthSection() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = browserClient();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userProfile: UserProfile = {
          email: session.user.email,
          user_metadata: {
            display_name: session.user.user_metadata?.display_name,
            avatar_url: session.user.user_metadata?.avatar_url,
          },
        };
        setUser(userProfile);

        // Decode JWT to get role
        try {
          const decoded = jwtDecode<{ user_role?: Role }>(session.access_token);
          setRole(decoded.user_role ?? 'customer');
        } catch {
          setRole('customer');
        }
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userProfile: UserProfile = {
          email: session.user.email,
          user_metadata: {
            display_name: session.user.user_metadata?.display_name,
            avatar_url: session.user.user_metadata?.avatar_url,
          },
        };
        setUser(userProfile);
        try {
          const decoded = jwtDecode<{ user_role?: Role }>(session.access_token);
          setRole(decoded.user_role ?? 'customer');
        } catch {
          setRole('customer');
        }
      } else {
        setUser(null);
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null;

  if (!user) {
    return <LoginButton />;
  }

  if (role === 'admin') {
    return <AdminNav user={user} />;
  }

  return <UserNav user={user} />;
}
