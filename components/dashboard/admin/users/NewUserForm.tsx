'use client';

import { useRouter } from 'next/navigation';
import { Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import { createUserAdmin } from '@/lib/db/users/actions';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ROLE_OPTIONS } from '@/types/user-admin';
import type { UserRole } from '@/types/user-admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TextInput } from '@/components/shared/forms/text-input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'agent', 'customer'] as const),
});

type CreateUserData = z.infer<typeof createUserSchema>;

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  admin: ShieldAlert,
  agent: Shield,
  customer: ShieldCheck,
};

export function NewUserForm() {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'customer',
    },
  });

  const onSubmit = async (data: CreateUserData) => {
    const result = await createUserAdmin(data);

    if (!result?.success) {
      toast.error(result?.message || 'Failed to create user');
      return;
    }

    toast.success('User created successfully');
    router.push('/dashboard/admin/users');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        <CardContent className="space-y-6 pt-6">
          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => <TextInput id="email" label="Email" required placeholder="user@example.com" error={errors.email?.message} value={field.value} onChange={field.onChange} />}
          />

          {/* Password */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextInput id="password" label="Password" required type="password" placeholder="Min 8 characters" error={errors.password?.message} value={field.value} onChange={field.onChange} />
            )}
          />

          {/* Role Selection */}
          <div className="space-y-3">
            <Label htmlFor="role" className="text-sm font-medium">
              Role
            </Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange} name="role">
                  <div className="grid grid-cols-2 gap-3">
                    {ROLE_OPTIONS.filter((option) => option.value !== 'admin').map((option) => {
                      const Icon = roleIcons[option.value];
                      return (
                        <Label
                          key={option.value}
                          htmlFor={`role-${option.value}`}
                          className="relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all has-checked:border-primary has-checked:bg-primary/5 has-checked:shadow-sm border-border hover:border-primary/50 hover:bg-muted/50"
                        >
                          <RadioGroupItem value={option.value} id={`role-${option.value}`} className="sr-only" />
                          <Icon className="h-6 w-6 text-muted-foreground has-checked:text-primary" />
                          <Badge variant={option.color as 'default' | 'secondary' | 'destructive' | 'outline'}>{option.label}</Badge>
                        </Label>
                      );
                    })}
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        </CardContent>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create User'}
          </Button>
        </div>
      </Card>
    </form>
  );
}
