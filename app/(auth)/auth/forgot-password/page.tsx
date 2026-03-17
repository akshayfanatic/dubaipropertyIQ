'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resetPassword } from '@/app/(auth)/auth/actions';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
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
      <div className="flex w-full items-center justify-center bg-auth-background px-6 py-12 md:w-1/2 md:px-8 lg:w-1/2 lg:px-12">
        <div className="w-full max-w-md text-center">
          <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-lg shadow-black/5">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground">Check your email</h2>
            <p className="mb-8 text-muted-foreground">We&apos;ve sent a password reset link to your email address. Click the link to reset your password.</p>
            <Link href="/auth/login">
              <Button variant="outline" className="h-11 w-full cursor-pointer transition-all duration-200 hover:bg-accent">
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Button>
            </Link>
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
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Forgot password?</h2>
          <p className="mt-1.5 text-muted-foreground">No worries, we&apos;ll send you reset instructions.</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-black/5 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={`flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 pl-10 text-sm text-foreground ring-offset-background transition-all duration-200 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.email ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20' : ''
                  }`}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

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
        </div>
      </div>
    </div>
  );
}
