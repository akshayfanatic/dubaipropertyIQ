'use client';

import { useCallback, useState } from 'react';
import { X, Loader2, UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { Label } from '@/components/ui/label';
import { uploadImage, deleteImage } from '@/lib/storage/actions';
import { extractPathFromUrl } from '@/lib/storage/utils';
import { validateFiles } from '@/lib/validations/storage';
import type { ImageUploaderProps } from '@/types/storage';
import type { ImageObject } from '@/types/images';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function ImageUploader({ bucket, value, onChange, maxImages = 10, label = 'Photos', required = false, folder }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const remainingSlots = maxImages - value.length;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      // Check max limit
      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxImages} photos allowed`);
        return;
      }

      const filesToUpload = acceptedFiles.slice(0, remainingSlots);

      // Validate files
      const validation = validateFiles(filesToUpload);
      if (!validation.valid) {
        validation.errors.forEach((error) => toast.error(error));
        return;
      }

      setUploading(true);
      const newImages: ImageObject[] = [];

      try {
        for (let i = 0; i < filesToUpload.length; i++) {
          setUploadingIndex(i);
          const file = filesToUpload[i];

          const result = await uploadImage(file, bucket, folder);

          if (result.success && result.url && result.alt_tag) {
            newImages.push({
              url: result.url,
              alt_tag: result.alt_tag,
            });
          } else {
            toast.error(result.error || `Failed to upload ${file.name}`);
          }
        }
      } catch (error) {
        toast.error('An unexpected error occurred during upload');
        console.error('Upload error:', error);
      } finally {
        setUploading(false);
        setUploadingIndex(null);
      }

      if (newImages.length > 0) {
        onChange([...value, ...newImages]);
        toast.success(`${newImages.length} photo(s) uploaded`);
      }
    },
    [bucket, folder, maxImages, onChange, value, remainingSlots],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.svg'] },
    multiple: true,
    maxFiles: remainingSlots,
    disabled: uploading,
  });

  const handleRemove = useCallback(
    async (index: number) => {
      const image = value[index];
      const url = typeof image === 'string' ? image : image.url;

      // Extract path from URL for Supabase deletion
      const path = extractPathFromUrl(url, bucket);

      setDeletingIndex(index);

      try {
        // Attempt to delete from Supabase if we have a valid path
        if (path) {
          const result = await deleteImage(bucket, path);

          if (!result.success) {
            toast.error(result.error || 'Failed to delete image from storage');
            // Don't proceed with local removal if remote deletion failed
            return;
          }
        } else {
          // URL is not from our Supabase bucket (might be external)
          // Allow local removal but log a warning
          console.warn('Image URL does not match Supabase bucket, removing locally only:', url);
        }

        // Remove from local state
        const newImages = value.filter((_, i) => i !== index);
        onChange(newImages);
        toast.success('Photo removed');
      } catch (error) {
        toast.error('An unexpected error occurred while deleting the photo');
        console.error('Delete error:', error);
      } finally {
        setDeletingIndex(null);
      }
    },
    [bucket, onChange, value],
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
          <span className="text-muted-foreground ml-2 text-sm font-normal">
            ({value.length}/{maxImages})
          </span>
        </Label>
        {remainingSlots > 0 && uploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Uploading...
          </div>
        )}
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {value.map((image, index) => {
            const url = typeof image === 'string' ? image : image.url;
            const alt = typeof image === 'string' ? `Photo ${index + 1}` : image.alt_tag || `Photo ${index + 1}`;

            return (
              <div key={url} className="group relative overflow-hidden rounded-lg border bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={alt} className="h-full w-full object-contain" />
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={deletingIndex === index}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove photo"
                >
                  {deletingIndex === index ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                </button>
              </div>
            );
          })}

          {/* Uploading placeholder */}
          {uploading && uploadingIndex !== null && (
            <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Add more dropzone when there are existing images */}
          {!uploading && remainingSlots > 0 && (
            <div
              {...getRootProps()}
              className={cn(
                'flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed transition-all cursor-pointer',
                'bg-muted/50 hover:bg-muted',
                isDragActive && !isDragReject && 'border-primary bg-primary/5 scale-[1.02]',
                isDragReject && 'border-destructive bg-destructive/5',
                !isDragActive && !isDragReject && 'border-muted-foreground/25 hover:border-muted-foreground/50',
              )}
            >
              <input {...getInputProps()} />
              <UploadCloud className={cn('h-8 w-8', isDragActive && 'scale-110 transition-transform')} />
              <span className="text-xs text-center text-muted-foreground">{isDragActive ? 'Drop images here' : 'Drag & drop or click'}</span>
            </div>
          )}
        </div>
      )}

      {/* Empty state - full width dropzone */}
      {value.length === 0 && !uploading && (
        <div
          {...getRootProps()}
          className={cn(
            'flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 transition-all cursor-pointer',
            'bg-muted/50 hover:bg-muted',
            isDragActive && !isDragReject && 'border-primary bg-primary/5 scale-[1.01]',
            isDragReject && 'border-destructive bg-destructive/5',
            !isDragActive && !isDragReject && 'border-muted-foreground/25 hover:border-muted-foreground/50',
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className={cn('h-12 w-12 text-muted-foreground', isDragActive && 'scale-110 transition-transform')} />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{isDragActive ? 'Drop your images here' : 'Drag & drop images here'}</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse • JPG, PNG, WebP, SVG • max 5MB each</p>
          </div>
        </div>
      )}

      {/* Max reached message */}
      {remainingSlots <= 0 && value.length > 0 && <p className="text-sm text-muted-foreground">Maximum {maxImages} photos reached</p>}
    </div>
  );
}
