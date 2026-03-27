/**
 * Storage Types
 * Type definitions for file upload operations
 */

export interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

export interface FileValidationOptions {
  maxSizeBytes: number;
  allowedTypes: string[];
}

export interface ImageUploaderProps {
  /** Supabase storage bucket name */
  bucket: string;
  /** Current image URLs */
  value: string[];
  /** Callback when images change */
  onChange: (urls: string[]) => void;
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
