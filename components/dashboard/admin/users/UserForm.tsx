'use client';

import { useRouter } from 'next/navigation';
import { Mail, Key, Calendar, Clock, ShieldCheck, ShieldAlert, Shield } from 'lucide-react';
import { updateUserRoleAdmin } from '@/lib/db/users/actions';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ROLE_OPTIONS } from '@/types/user-admin';
import type { UserRole, UserWithRole } from '@/types/user-admin';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils/date';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updateUserSchema = z.object({
  role: z.enum(['admin', 'agent', 'customer'] as const),
});

type UpdateUserData = z.infer<typeof updateUserSchema>;

interface UserFormProps {
  user: UserWithRole;
}

const roleIcons: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  admin: ShieldAlert,
  agent: Shield,
  customer: ShieldCheck,
};

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<UpdateUserData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      role: user.role,
    },
  });

  const onSubmit = async (data: UpdateUserData) => {
    const result = await updateUserRoleAdmin(user.id, { role: data.role });

    if (!result?.success) {
      toast.error(result?.message || 'Failed to update user');
      return;
    }

    toast.success('User updated successfully');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="w-full">
        <CardContent className="space-y-6 pt-6">
          {/* Email */}
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Email</Label>
              <p className="text-sm font-medium">{user.email || 'No email'}</p>
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Key className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">User ID</Label>
              <p className="text-sm font-mono text-muted-foreground">{user.id}</p>
            </div>
          </div>

          {/* Created */}
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Created</Label>
              <p className="text-sm font-medium">{formatDate(new Date(user.created_at))}</p>
            </div>
          </div>

          {/* Last Sign In */}
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Last Sign In</Label>
              <p className="text-sm font-medium">{user.last_sign_in_at ? formatDate(new Date(user.last_sign_in_at)) : 'Never'}</p>
            </div>
          </div>

          {/* Email Verified */}
          <div className="flex items-center gap-4 rounded-lg border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              {user.email_confirmed_at ? <ShieldCheck className="h-5 w-5 text-green-600" /> : <ShieldAlert className="h-5 w-5 text-yellow-600" />}
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs text-muted-foreground">Email Verified</Label>
              <p className="text-sm font-medium">
                {user.email_confirmed_at ? (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                    <ShieldCheck className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    <ShieldAlert className="mr-1 h-3 w-3" />
                    Pending
                  </Badge>
                )}
              </p>
            </div>
          </div>

          {/* Role Selection - only show for non-admin users */}
          {user.role !== 'admin' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <Label htmlFor="role" className="text-base font-semibold">
                  User Role
                </Label>
              </div>
              <p className="text-sm text-muted-foreground -mt-2">Select the appropriate role for this user</p>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <RadioGroup value={field.value} onValueChange={field.onChange} name="role">
                    <div className="grid grid-cols-2 gap-4">
                      {ROLE_OPTIONS.filter((option) => option.value !== 'admin').map((option) => {
                        const Icon = roleIcons[option.value];
                        return (
                          <Label
                            key={option.value}
                            htmlFor={`role-${option.value}`}
                            className="relative flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all has-checked:border-primary has-checked:bg-primary/10 has-checked:shadow-md border-border hover:border-primary/50 hover:bg-muted/50"
                          >
                            <RadioGroupItem value={option.value} id={`role-${option.value}`} className="sr-only" />
                            <div className="flex h-12 w-12 items-center justify-center rounded-full transition-all bg-muted text-muted-foreground has-checked:bg-primary has-checked:text-primary-foreground">
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col items-start gap-1">
                              <Badge variant={option.color as 'default' | 'secondary' | 'destructive' | 'outline'} className="font-medium">
                                {option.label}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{option.value === 'agent' ? 'Can manage properties' : 'Can browse and inquire'}</span>
                            </div>
                          </Label>
                        );
                      })}
                    </div>
                  </RadioGroup>
                )}
              />
            </div>
          )}
        </CardContent>

        <div className="flex justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 min-w-25"
          >
            {isSubmitting ? <>Saving...</> : <>Save Changes</>}
          </button>
        </div>
      </Card>
    </form>
  );
}
