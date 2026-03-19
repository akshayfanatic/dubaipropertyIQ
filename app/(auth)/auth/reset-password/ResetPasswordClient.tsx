'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrengthMeter } from '@/components/auth/PasswordStrengthMeter';
import { browserClient } from '@/lib/supabase/client';

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingUpSession, setIsSettingUpSession] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);

  useEffect(() => {
    const setupSession = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      // No token - redirect to login
      if (!accessToken) {
        router.replace('/auth/login');
        return;
      }

      try {
        const supabase = browserClient();

        // Create temporary session using tokens from URL
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        });

        if (sessionError) {
          setError('Invalid or expired reset link. Please request a new one.');
          setIsValidSession(false);
        } else {
          setIsValidSession(true);
        }
      } catch {
        setError('Failed to establish session. Please request a new reset link.');
        setIsValidSession(false);
      } finally {
        setIsSettingUpSession(false);
      }
    };

    setupSession();
  }, [searchParams, router]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch('password', '');

  const onSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = browserClient();

        // Update password using the temporary session
        const { error: updateError } = await supabase.auth.updateUser({
          password: data.password,
        });

        if (updateError) {
          setError(updateError.message);
          setIsLoading(false);
          return;
        }

        // Sign out the temporary session
        await supabase.auth.signOut();

        // Redirect to login
        router.replace('/auth/login');
      } catch {
        setError('Failed to update password. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  // Loading state while setting up session
  if (isSettingUpSession) {
    return (
      <div className="flex w-full items-center justify-center bg-auth-background px-6 py-12 md:w-1/2 md:px-8 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-lg shadow-black/5">
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Verifying reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center justify-center bg-auth-background px-6 py-12 md:w-1/2 md:px-8 lg:w-1/2 lg:px-12">
      <div className="w-full max-w-md animate-fade-in animate-duration-500">
        {/* Mobile Logo */}
        <div className="mb-8 flex items-center justify-center gap-2 md:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Dubai Property IQ</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Set new password</h2>
          <p className="mt-1.5 text-muted-foreground">Your new password must be different from previous passwords.</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-black/5 sm:p-8">
          {!isValidSession ? (
            <div className="text-center">
              <p className="mb-4 text-destructive">{error}</p>
              <Button variant="outline" className="h-11 w-full cursor-pointer" onClick={() => router.push('/auth/forgot-password')}>
                Request new reset link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  New password
                </label>
                <PasswordInput
                  id="password"
                  placeholder="Enter new password"
                  {...register('password')}
                  className={`h-11 rounded-lg border-input transition-all duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 ${
                    errors.password ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20' : ''
                  }`}
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                <PasswordStrengthMeter password={passwordValue} className="mt-2" />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <PasswordInput
                  id="confirmPassword"
                  placeholder="Confirm new password"
                  {...register('confirmPassword')}
                  className={`h-11 rounded-lg border-input transition-all duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 ${
                    errors.confirmPassword ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20' : ''
                  }`}
                />
                {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full cursor-pointer bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Reset password'
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
