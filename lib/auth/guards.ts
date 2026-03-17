import { serverClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requireAuth() {
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return user;
}

export async function getAuthUser() {
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireGuest() {
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }
}
