/**
 * Storage Validation Schemas
 * Zod schemas for file upload validation
 */

import { z } from 'zod';
import { FileValidationOptions } from '@/types/storage';

// Default validation options for images
export const DEFAULT_IMAGE_VALIDATION: FileValidationOptions = {
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
};

// File validation schema
export const fileValidationSchema = z.object({
  type: z.string(),
  size: z.number(),
  name: z.string(),
});

export type FileValidationInput = z.infer<typeof fileValidationSchema>;

/**
 * Validates a file against the specified options
 */
export function validateFile(file: FileValidationInput, options: FileValidationOptions = DEFAULT_IMAGE_VALIDATION): { valid: boolean; error?: string } {
  // Check file type
  if (!options.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${options.allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  if (file.size > options.maxSizeBytes) {
    const maxSizeMB = (options.maxSizeBytes / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: `File too large. Maximum size: ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Validates multiple files
 */
export function validateFiles(files: FileValidationInput[], options: FileValidationOptions = DEFAULT_IMAGE_VALIDATION): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const file of files) {
    const result = validateFile(file, options);
    if (!result.valid && result.error) {
      errors.push(`${file.name}: ${result.error}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
