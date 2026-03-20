'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signup } from '@/app/(auth)/auth/actions';
import { PasswordInput } from './PasswordInput';
import { EmailInput } from './EmailInput';
import { FormField } from './FormField';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { AuthCard } from './AuthCard';
import { AuthFooter } from './AuthFooter';

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setError: setFormError,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const passwordValue = watch('password', '');

  const onSubmit = async (data: SignupFormData) => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);

    try {
      const result = await signup(formData);
      if (result?.error) {
        setFormError('root', { message: result.error });
      } else {
        setSuccess(true);
      }
    } catch {
      setFormError('root', { message: 'An unexpected error occurred. Please try again.' });
    }
  };

  if (success) {
    return (
      <AuthCard title="Check your email" subtitle="We've sent a confirmation link to your email address" showMobileLogo={true}>
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <p className="mb-8 text-muted-foreground">Please click the link to verify your account.</p>
          <Link href="/auth/login">
            <Button variant="outline" className="h-11 w-full cursor-pointer transition-all duration-200 hover:bg-accent">
              Back to login
            </Button>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create your account" subtitle="Start your real estate intelligence journey" footer={<AuthFooter prefix="By creating an account, you agree to our" />}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {errors.root?.message && <div className="animate-shake animate-duration-300 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{errors.root.message}</div>}

        <FormField label="Email address" htmlFor="email" error={errors.email?.message}>
          <EmailInput id="email" placeholder="you@example.com" {...register('email')} />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <div className="space-y-2">
            <PasswordInput id="password" placeholder="Create a strong password" {...register('password')} />
            <PasswordStrengthMeter password={passwordValue} />
          </div>
        </FormField>

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
          disabled={isSubmitting}
          className="h-11 w-full cursor-pointer bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 disabled:opacity-50"
        >
          {isSubmitting ? (
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
    </AuthCard>
  );
}
