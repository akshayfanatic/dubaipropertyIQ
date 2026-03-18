'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2, Mail, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { login } from '@/app/(auth)/auth/actions';
import { PasswordInput } from './PasswordInput';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

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
        <div className="mb-8 animate-slide-in-from-bottom animate-duration-500 animate-delay-100">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h2>
          <p className="mt-1.5 text-muted-foreground">Sign in to access your dashboard</p>
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
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-primary transition-colors duration-200 hover:text-primary/80">
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                {...register('password')}
                className={`h-11 rounded-lg border-input transition-all duration-200 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 ${
                  errors.password ? 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20' : ''
                }`}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 cursor-pointer rounded border-input text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
              <label htmlFor="remember" className="cursor-pointer text-sm text-muted-foreground select-none">
                Remember me for 30 days
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary transition-colors duration-200 hover:text-primary/80">
              Create one
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By signing in, you agree to our{' '}
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
