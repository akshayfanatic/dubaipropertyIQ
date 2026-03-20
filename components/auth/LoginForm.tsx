'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { login } from '@/app/(auth)/auth/actions';
import { PasswordInput } from './PasswordInput';
import { EmailInput } from './EmailInput';
import { FormField } from './FormField';
import { AuthCard } from './AuthCard';
import { AuthFooter } from './AuthFooter';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    try {
      const result = await login(formData);
      if (result?.error) {
        setFormError('root', { message: result.error });
      }
    } catch {
      setFormError('root', { message: 'An unexpected error occurred. Please try again.' });
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to access your dashboard" footer={<AuthFooter prefix="By signing in, you agree to our" />}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root?.message && <div className="animate-shake animate-duration-300 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{errors.root.message}</div>}

        <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
          <EmailInput id="email" placeholder="you@example.com" {...register('email')} />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          error={errors.password?.message}
          labelRight={
            <Link href="/auth/forgot-password" className="text-sm text-primary transition-colors duration-200 hover:text-primary/80">
              Forgot password?
            </Link>
          }
        >
          <PasswordInput id="password" placeholder="Enter your password" {...register('password')} />
        </FormField>

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
          disabled={isSubmitting}
          className="h-11 w-full cursor-pointer bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
        >
          {isSubmitting ? (
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
    </AuthCard>
  );
}
