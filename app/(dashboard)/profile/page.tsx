'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Lock, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { updateProfile, updatePassword, deleteAccount } from '@/app/(auth)/auth/actions';

// Profile schema
const profileSchema = z.object({
  displayName: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// Password schema
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

export default function ProfilePage() {
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [currentUser, setCurrentUser] = useState<{ email?: string; displayName?: string } | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
          profileForm.setValue('displayName', data.displayName || '');
        }
      } catch {
        // Handle error silently
      }
    };
    fetchUser();
  }, [profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setProfileLoading(true);
    setProfileError(null);
    setProfileSuccess(false);

    const formData = new FormData();
    formData.append('displayName', data.displayName);

    const result = await updateProfile(formData);

    if (result?.error) {
      setProfileError(result.error);
    } else {
      setProfileSuccess(true);
      setCurrentUser((prev) => ({ ...prev, displayName: data.displayName }));
      setTimeout(() => setProfileSuccess(false), 3000);
    }
    setProfileLoading(false);
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setPasswordLoading(true);
    setPasswordError(null);
    setPasswordSuccess(false);

    const formData = new FormData();
    formData.append('password', data.newPassword);
    formData.append('confirmPassword', data.confirmPassword);

    const result = await updatePassword(formData);

    if (result?.error) {
      setPasswordError(result.error);
    } else {
      setPasswordSuccess(true);
      passwordForm.reset();
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
    setPasswordLoading(false);
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    await deleteAccount();
    // Will redirect on success
    setDeleteLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>

      {/* Profile Info Section */}
      <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Profile Information</h2>
            <p className="text-sm text-muted-foreground">Update your personal details.</p>
          </div>
        </div>

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          {profileError && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{profileError}</div>}
          {profileSuccess && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Profile updated successfully!
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              placeholder="Your name"
              {...profileForm.register('displayName')}
              className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
            {profileForm.formState.errors.displayName && <p className="text-sm text-destructive">{profileForm.formState.errors.displayName.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <p className="text-sm text-muted-foreground">{currentUser?.email || 'Email cannot be changed. Contact support if needed.'}</p>
          </div>

          <Button type="submit" disabled={profileLoading} className="cursor-pointer">
            {profileLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Change Password</h2>
            <p className="text-sm text-muted-foreground">Update your password to keep your account secure.</p>
          </div>
        </div>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          {passwordError && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{passwordError}</div>}
          {passwordSuccess && (
            <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Password updated successfully!
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </label>
            <PasswordInput id="newPassword" placeholder="Enter new password" {...passwordForm.register('newPassword')} className="h-11" />
            {passwordForm.formState.errors.newPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm New Password
            </label>
            <PasswordInput id="confirmPassword" placeholder="Confirm new password" {...passwordForm.register('confirmPassword')} className="h-11" />
            {passwordForm.formState.errors.confirmPassword && <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" disabled={passwordLoading} className="cursor-pointer">
            {passwordLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      </div>

      {/* Delete Account Section */}
      <div className="rounded-xl border border-destructive/30 bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
            <Trash2 className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-destructive">Delete Account</h2>
            <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <Button variant="outline" className="cursor-pointer border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => setShowDeleteConfirm(true)}>
            Delete Account
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Are you sure? This action cannot be undone. All your data will be permanently deleted.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="cursor-pointer" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="cursor-pointer" disabled={deleteLoading} onClick={handleDeleteAccount}>
                {deleteLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete My Account'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
