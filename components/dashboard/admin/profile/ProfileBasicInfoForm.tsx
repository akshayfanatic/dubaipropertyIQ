'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Info } from 'lucide-react';
import { AvatarUploader } from '@/components/ui/avatar-uploader';
import { updateProfile } from '@/app/(auth)/auth/actions';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FormActions } from '@/components/shared/forms/FormActions';
import { cn } from '@/lib/utils';
import { WidgetCard } from '@/components/shared/WidgetCard';
import { useAuth } from '@/providers/auth-provider';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  avatarUrl: z.string().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileBasicInfoFormProps {
  initialData?: {
    email?: string;
    displayName?: string;
    avatarUrl?: string | null;
  };
}

export function ProfileBasicInfoForm({ initialData }: ProfileBasicInfoFormProps) {
  const router = useRouter();
  const { updateProfileState } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialData?.avatarUrl || null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: initialData?.displayName || '',
      avatarUrl: initialData?.avatarUrl || null,
    },
  });

  const displayName = useWatch({ control: form.control, name: 'displayName' });

  useEffect(() => {
    if (initialData?.displayName) {
      form.setValue('displayName', initialData.displayName);
    }
  }, [initialData, form]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const formData = new FormData();
      formData.append('displayName', data.displayName);
      formData.append('avatarUrl', avatarUrl || '');

      const result = await updateProfile(formData);

      if (result?.error) {
        form.setError('root', { message: result.error });
      } else {
        updateProfileState({ displayName: data.displayName, avatarUrl });
        router.refresh();
        toast.success('Profile updated successfully!');
      }
    } catch {
      form.setError('root', { message: 'An unexpected error occurred' });
    }
  };

  return (
    <WidgetCard icon={User} title="Profile Information" description="Update your personal details.">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {form.formState.errors.root && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive transition-all duration-200">
            <Info className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{form.formState.errors.root.message}</span>
          </div>
        )}

        {/* Avatar Section */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Profile Photo
          </Label>
          <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 p-6 transition-all duration-200 hover:border-border/80">
            <AvatarUploader bucket="user-profile" value={avatarUrl} onChange={setAvatarUrl} disabled={form.formState.isSubmitting} displayName={initialData?.displayName || displayName || ''} />
          </div>
        </div>

        {/* Display Name Input with Icon */}
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            Display Name
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary" />
            <input
              id="displayName"
              type="text"
              placeholder="Enter your display name"
              className={cn(
                'flex h-11 w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2',
                'text-sm ring-offset-background',
                'placeholder:text-muted-foreground/50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'transition-all duration-200',
                form.formState.errors.displayName && 'border-destructive focus-visible:ring-destructive',
              )}
              {...form.register('displayName')}
              disabled={form.formState.isSubmitting}
            />
          </div>
          {form.formState.errors.displayName && (
            <p className="flex items-center gap-1.5 text-sm text-destructive animate-in fade-in-50 slide-in-from-top-1">
              <Info className="h-3.5 w-3.5" />
              {form.formState.errors.displayName.message}
            </p>
          )}
        </div>

        {/* Email Read-only Field with Icon */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            Email Address
          </Label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground/60 transition-colors" />
            <div className="flex h-11 w-full items-center rounded-lg border border-border/60 bg-muted/40 px-10 pl-10 transition-all duration-200 group-hover:border-border/80 group-hover:bg-muted/50">
              <span className="text-sm text-muted-foreground">{initialData?.email || 'No email associated'}</span>
            </div>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            Email cannot be changed. Contact support if needed.
          </p>
        </div>

        <FormActions isEditMode isSubmitting={form.formState.isSubmitting} submitLabel="Profile" />
      </form>
    </WidgetCard>
  );
}
