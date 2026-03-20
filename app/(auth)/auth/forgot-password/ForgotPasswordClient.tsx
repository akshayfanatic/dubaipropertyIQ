'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resetPassword } from '@/app/(auth)/auth/actions';
import { AuthCard } from '@/components/auth/AuthCard';
import { EmailInput } from '@/components/auth/EmailInput';
import { FormField } from '@/components/auth/FormField';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordClient() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await resetPassword(data.email);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <AuthCard title="Check your email" subtitle="We've sent a password reset link to your email address" showMobileLogo={true}>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
            <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="mb-8 text-muted-foreground">Click the link to reset your password.</p>
          <Link href="/auth/login">
            <Button variant="outline" className="h-11 w-full cursor-pointer transition-all duration-200 hover:bg-accent">
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Forgot password?" subtitle="No worries, we'll send you reset instructions.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && <div className="animate-shake animate-duration-300 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

        <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
          <EmailInput id="email" placeholder="you@example.com" {...register('email')} />
        </FormField>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full cursor-pointer bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </form>

      {/* Back to Login */}
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/auth/login" className="font-medium text-primary transition-colors duration-200 hover:text-primary/80">
          <ArrowLeft className="mr-1 inline h-4 w-4" />
          Back to login
        </Link>
      </p>
    </AuthCard>
  );
}
