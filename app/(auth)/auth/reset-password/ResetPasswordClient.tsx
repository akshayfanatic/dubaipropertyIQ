'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput, PasswordStrengthMeter, FormField, AuthCard } from '@/components/auth';
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
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [isSettingUpSession, setIsSettingUpSession] = useState(true);
  const [isValidSession, setIsValidSession] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const passwordValue = watch('password', '');

  useEffect(() => {
    setupSession();
  }, [searchParams, router]);

  const setupSession = async () => {
    const tokenHash = searchParams.get('token_hash');
    const type = searchParams.get('type') as 'recovery' | null;

    if (!tokenHash || type !== 'recovery') {
      router.replace('/auth/login');
      return;
    }

    try {
      const supabase = browserClient();
      const { error } = await supabase.auth.verifyOtp({
        type: 'recovery',
        token_hash: tokenHash,
      });

      if (error) {
        setSessionError('Invalid or expired reset link. Please request a new one.');
        setIsValidSession(false);
      } else {
        setIsValidSession(true);
      }
    } catch {
      setSessionError('Failed to establish session. Please request a new reset link.');
      setIsValidSession(false);
    } finally {
      setIsSettingUpSession(false);
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const supabase = browserClient();
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        setFormError('root', { message: error.message });
        return;
      }

      await supabase.auth.signOut();
      router.replace('/auth/login');
    } catch {
      setFormError('root', { message: 'Failed to update password. Please try again.' });
    }
  };

  if (isSettingUpSession) {
    return (
      <AuthCard title="Verifying..." subtitle="Please wait while we verify your reset link">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Verifying reset link...</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set new password" subtitle="Your new password must be different from previous passwords.">
      {!isValidSession ? (
        <div className="text-center">
          <p className="mb-4 text-destructive">{sessionError}</p>
          <Button variant="outline" className="h-11 w-full cursor-pointer" onClick={() => router.push('/auth/forgot-password')}>
            Request new reset link
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {errors.root?.message && (
            <div className="animate-shake animate-duration-300 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{errors.root.message}</div>
          )}

          <FormField label="New password" htmlFor="password" error={errors.password?.message}>
            <div className="space-y-2">
              <PasswordInput id="password" placeholder="Enter new password" {...register('password')} />
              <PasswordStrengthMeter password={passwordValue} />
            </div>
          </FormField>

          <FormField label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword?.message}>
            <PasswordInput id="confirmPassword" placeholder="Confirm new password" {...register('confirmPassword')} />
          </FormField>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full cursor-pointer bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
          >
            {isSubmitting ? (
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
    </AuthCard>
  );
}
