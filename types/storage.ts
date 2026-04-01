/**
 * Storage Types
 * Type definitions for file upload operations
 */

import type { ImageObject } from './images';

export interface UploadResponse {
  success: boolean;
  url?: string;
  alt_tag?: string; // New: include alt tag in response
  error?: string;
}

export interface FileValidationOptions {
  maxSizeBytes: number;
  allowedTypes: string[];
}

export interface ImageUploaderProps {
  /** Supabase storage bucket name */
  bucket: string;
  /** Current image objects (was URLs, now ImageObjects) */
  value: ImageObject[];
  /** Callback when images change */
  onChange: (images: ImageObject[]) => void;
  /** Maximum number of images allowed */
  maxImages?: number;
  /** Accepted MIME types */
  accept?: string;
  /** Label for the uploader */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Folder path within bucket */
  folder?: string;
}

/** Legacy type for backward compatibility during migration */
export type LegacyImageUploaderProps = Omit<ImageUploaderProps, 'value' | 'onChange'> & {
  value: string[];
  onChange: (urls: string[]) => void;
};
