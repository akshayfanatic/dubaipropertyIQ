'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock } from 'lucide-react';
import { PasswordInput } from '@/components/auth/inputs/PasswordInput';
import { updatePassword } from '@/app/(auth)/auth/actions';
import { toast } from 'sonner';
import { FormActions } from '@/components/shared/forms/FormActions';
import { Label } from '@/components/ui/label';
import { WidgetCard } from '@/components/shared/WidgetCard';

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export function PasswordChangeForm() {
  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormData) => {
    try {
      const formData = new FormData();
      formData.append('password', data.newPassword);
      formData.append('confirmPassword', data.confirmPassword);

      const result = await updatePassword(formData);

      if (result?.error) {
        form.setError('root', { message: result.error });
      } else {
        toast.success('Password updated successfully!');
        form.reset();
      }
    } catch {
      form.setError('root', { message: 'An unexpected error occurred' });
    }
  };

  return (
    <WidgetCard icon={Lock} title="Change Password" description="Update your password to keep your account secure.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {form.formState.errors.root && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{form.formState.errors.root.message}</div>}

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-sm font-medium">
            New Password
          </Label>
          <PasswordInput id="newPassword" placeholder="Enter new password" className="h-11" {...form.register('newPassword')} />
          {form.formState.errors.newPassword && <p className="text-sm text-destructive">{form.formState.errors.newPassword.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm New Password
          </Label>
          <PasswordInput id="confirmPassword" placeholder="Confirm new password" className="h-11" {...form.register('confirmPassword')} />
          {form.formState.errors.confirmPassword && <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>}
        </div>

        <FormActions isEditMode isSubmitting={form.formState.isSubmitting} submitLabel="Profile" />
      </form>
    </WidgetCard>
  );
}
