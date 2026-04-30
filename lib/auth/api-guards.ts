import { serverClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getRole } from './roles';

export async function requireAuthApi() {
  const supabase = await serverClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}

export async function requireRoleApi(role: 'admin' | 'agent' | 'customer') {
  const authError = await requireAuthApi();
  if (authError) return authError;

  const userRole = await getRole();
  if (userRole !== role) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return null;
}
