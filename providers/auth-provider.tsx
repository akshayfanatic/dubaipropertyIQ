'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { Session } from '@supabase/supabase-js';

import { browserClient } from '@/lib/supabase/client';
import type { UserProfile } from '@/types/user';

type Role = 'admin' | 'agent' | 'customer';

type UpdateProfileStateInput = {
  displayName?: string;
  avatarUrl?: string | null;
};

type AuthContextValue = {
  user: UserProfile | null;
  role: Role | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  updateProfileState: (updates: UpdateProfileStateInput) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function toUserProfile(session: Session | null): UserProfile | null {
  if (!session?.user) return null;

  return {
    email: session.user.email,
    user_metadata: {
      display_name: session.user.user_metadata?.display_name,
      avatar_url: session.user.user_metadata?.avatar_url,
    },
  };
}

function getSessionRole(session: Session | null): Role | null {
  if (!session?.access_token) return null;

  try {
    const decoded = jwtDecode<{ user_role?: Role }>(session.access_token);
    return decoded.user_role ?? 'customer';
  } catch {
    return 'customer';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback((session: Session | null) => {
    setUser(toUserProfile(session));
    setRole(getSessionRole(session));
  }, []);

  const refreshUser = useCallback(async () => {
    const supabase = browserClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    applySession(session);
  }, [applySession]);

  const updateProfileState = useCallback((updates: UpdateProfileStateInput) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      return {
        ...currentUser,
        user_metadata: {
          ...currentUser.user_metadata,
          display_name: updates.displayName ?? currentUser.user_metadata?.display_name,
          avatar_url: updates.avatarUrl,
        },
      };
    });
  }, []);

  useEffect(() => {
    const supabase = browserClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [applySession]);

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      refreshUser,
      updateProfileState,
    }),
    [loading, refreshUser, role, updateProfileState, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
