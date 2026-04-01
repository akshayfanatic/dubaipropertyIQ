'use client';

import { useCallback, useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { uploadImage, deleteImage } from '@/lib/storage/actions';
import { extractPathFromUrl } from '@/lib/storage/utils';
import { validateFiles } from '@/lib/validations/storage';
import type { ImageUploaderProps } from '@/types/storage';
import { toast } from 'sonner';

export function ImageUploader({ bucket, value, onChange, maxImages = 10, accept = 'image/jpeg,image/png,image/webp', label = 'Photos', required = false, folder }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      // Check max limit
      const remainingSlots = maxImages - value.length;
      if (remainingSlots <= 0) {
        toast.error(`Maximum ${maxImages} photos allowed`);
        return;
      }

      const filesToUpload = Array.from(files).slice(0, remainingSlots);

      // Validate files
      const validation = validateFiles(filesToUpload);
      if (!validation.valid) {
        validation.errors.forEach((error) => toast.error(error));
        return;
      }

      setUploading(true);
      const newUrls: string[] = [];

      try {
        for (let i = 0; i < filesToUpload.length; i++) {
          setUploadingIndex(i);
          const file = filesToUpload[i];

          const result = await uploadImage(file, bucket, folder);

          if (result.success && result.url) {
            newUrls.push(result.url);
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

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls]);
        toast.success(`${newUrls.length} photo(s) uploaded`);
      }

      // Reset input
      event.target.value = '';
    },
    [bucket, folder, maxImages, onChange, value],
  );

  const handleRemove = useCallback(
    async (index: number) => {
      const url = value[index];

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
        const newUrls = value.filter((_, i) => i !== index);
        onChange(newUrls);
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

  const remainingSlots = maxImages - value.length;

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
        {remainingSlots > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={handleButtonClick} disabled={uploading} className="cursor-pointer">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                Add Photos
              </>
            )}
          </Button>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept={accept} multiple onChange={handleFileChange} className="hidden" disabled={uploading} />

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {value.map((url, index) => (
            <div key={url} className="group relative overflow-hidden rounded-lg border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Photo ${index + 1}`} className="h-full w-full object-contain" />
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
          ))}

          {/* Uploading placeholder */}
          {uploading && uploadingIndex !== null && (
            <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {value.length === 0 && !uploading && (
        <button
          type="button"
          onClick={handleButtonClick}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 px-4 py-8 text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted transition-colors cursor-pointer"
        >
          <ImagePlus className="h-10 w-10" />
          <span className="text-sm">Click to add photos</span>
          <span className="text-xs">JPG, PNG or WebP, max 5MB each</span>
        </button>
      )}

      {/* Max reached message */}
      {remainingSlots <= 0 && <p className="text-sm text-muted-foreground">Maximum {maxImages} photos reached</p>}
    </div>
  );
}
