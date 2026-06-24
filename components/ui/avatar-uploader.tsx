'use client';

import { useState, useRef, type ChangeEvent } from 'react';
import { Camera, Loader, Loader2, Trash2, User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { uploadImage, deleteImage } from '@/lib/storage/actions';
import { extractPathFromUrl } from '@/lib/storage/utils';
import { validateFiles } from '@/lib/validations/storage';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Input } from './input';

interface AvatarUploaderProps {
  bucket: string;
  value: string | null;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  displayName?: string;
  className?: string;
  label?: string;
}

export function AvatarUploader({ bucket, value, onChange, disabled = false, displayName = '', className, label = 'Profile Photo' }: AvatarUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (!disabled && !uploading && !deleting) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validation = validateFiles([file]);
    if (!validation.valid) {
      validation.errors.forEach((error) => toast.error(error));
      return;
    }

    setUploading(true);

    try {
      // Delete old avatar if exists
      if (value) {
        const oldPath = extractPathFromUrl(value, bucket);
        if (oldPath) {
          await deleteImage(bucket, oldPath);
        }
      }

      // Upload new avatar
      const result = await uploadImage(file, bucket);

      if (result.success && result.url) {
        onChange(result.url);
        toast.success('Profile photo updated');
      } else {
        toast.error(result.error || 'Failed to upload photo');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!value || deleting) return;

    setDeleting(true);

    try {
      const path = extractPathFromUrl(value, bucket);

      if (path) {
        const result = await deleteImage(bucket, path);

        if (!result.success) {
          toast.error(result.error || 'Failed to delete photo');
          return;
        }
      }

      onChange(null);
      toast.success('Profile photo removed');
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Delete error:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Get initials from display name for fallback
  const getInitials = (name: string) => {
    if (!name) return null;
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(displayName);

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {/* Avatar */}
      <div className="relative group/avatar-uploader">
        <Avatar
          size="lg"
          onClick={handleClick}
          className={cn(
            'size-52 cursor-pointer transition-all',
            !disabled && !uploading && !deleting && 'hover:ring-2 hover:ring-primary/50 hover:ring-offset-2',
            (uploading || deleting || disabled) && 'cursor-not-allowed opacity-70',
          )}
        >
          {value ? <AvatarImage src={value} alt="Profile photo" /> : null}
          <AvatarFallback className={cn(!value && 'bg-muted')}>
            {uploading || deleting ? (
              <Loader2 className="size-52 animate-spin text-muted-foreground" />
            ) : initials ? (
              <span className="text-lg font-semibold">{initials}</span>
            ) : (
              <User className="size-52 text-muted-foreground" />
            )}
          </AvatarFallback>
        </Avatar>

        {/* Camera overlay on hover */}
        {!uploading && !deleting && !disabled && (
          <button
            type="button"
            onClick={handleClick}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover/avatar-uploader:opacity-100 cursor-pointer"
            aria-label={value ? 'Change photo' : 'Upload photo'}
          >
            {uploading || deleting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <Input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={handleFileChange} disabled={disabled || uploading || deleting} className="hidden" />

      {/* Labels */}
      <div className="space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">Click to {value ? 'change' : 'upload'} • JPG, Max 5MB</p>
        {value && (
          <button type="button" onClick={handleRemove} disabled={deleting || disabled} className="text-xs text-destructive hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
            {deleting ? <Loader className="animate-spin delay-300" /> : <Trash2 className=" text-sm" />}
          </button>
        )}
      </div>
    </div>
  );
}
