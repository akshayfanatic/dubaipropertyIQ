'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signup } from '@/app/(auth)/auth/actions';
import { PasswordInput } from './PasswordInput';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await signup(formData);

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
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 animate-in zoom-in-50 duration-300">
              <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-foreground">Check your email</h2>
            <p className="mb-8 text-muted-foreground">We&apos;ve sent a confirmation link to your email address. Please click the link to verify your account.</p>
            <Link href="/auth/login">
              <Button variant="outline" className="h-11 w-full cursor-pointer transition-all duration-200 hover:bg-accent">
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
        <div className="mb-8 flex items-center justify-center gap-2 md:hidden animate-fade-in animate-duration-300 animate-delay-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <Building2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">Dubai Property IQ</span>
        </div>

        {/* Header */}
        <div className="mb-8 animate-slide-in-from-bottom animate-duration-500 animate-delay-100  animate-fade-down animate-once animate-duration-1000 animate-ease-out">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h2>
          <p className="mt-1.5 text-muted-foreground">Start your real estate intelligence journey</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-black/5  animate-fade-down animate-once animate-duration-1000 animate-ease-out sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {error && <div className="animate-shake animate-duration-300 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

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

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <PasswordInput
                id="password"
                placeholder="Create a strong password"
                {...register('password')}
                className={`h-11 rounded-lg border-input transition-all duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 ${
                  errors.password ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20' : ''
                }`}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              <PasswordStrengthMeter password={passwordValue} className="mt-2" />
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-0.5 h-4 w-4 cursor-pointer rounded border-input text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <label htmlFor="terms" className="cursor-pointer text-sm text-muted-foreground select-none">
                I agree to the{' '}
                <Link href="/terms" className="font-medium text-primary transition-colors hover:text-primary/80">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-medium text-primary transition-colors hover:text-primary/80">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full cursor-pointer bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-medium text-primary transition-colors duration-200 hover:text-primary/80">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline-offset-2 transition-colors hover:text-foreground hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline-offset-2 transition-colors hover:text-foreground hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
