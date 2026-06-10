'use client';

import { useAuth } from '@/providers/auth-provider';
import { UserNav } from './user-nav';
import { AdminNav } from './admin-nav';
import { LoginButton } from './login-button';

export function AuthSection() {
  const { user, role, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <LoginButton />;
  }

  if (role === 'admin') {
    return <AdminNav />;
  }

  return <UserNav />;
}
