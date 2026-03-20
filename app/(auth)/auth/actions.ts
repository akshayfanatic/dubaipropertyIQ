'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { serverClient } from '@/lib/supabase/server';
import type { AuthResult } from '@/lib/auth/types';

export async function login(formData: FormData): Promise<AuthResult | void> {
  const supabase = await serverClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: error.message };
  }
  // redirect('/dashboard');
}

export async function signup(formData: FormData): Promise<AuthResult> {
  const supabase = await serverClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/confirm`,
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logout(): Promise<void> {
  const supabase = await serverClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/auth/login');
}

export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = await serverClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
  });

  console.log(error);
  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(formData: FormData): Promise<AuthResult> {
  const supabase = await serverClient();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (password !== confirmPassword) {
    return { error: 'Passwords do not match' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updateProfile(formData: FormData): Promise<AuthResult> {
  const supabase = await serverClient();

  const displayName = formData.get('displayName') as string;

  const { error } = await supabase.auth.updateUser({
    data: { display_name: displayName },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/profile');
  return { success: true };
}

export async function deleteAccount(): Promise<AuthResult> {
  const supabase = await serverClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  // Note: In production, you'd want to call a Supabase Edge Function
  // or admin API to properly delete the user from auth.users table
  // This signs out the user - actual deletion requires admin privileges
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
