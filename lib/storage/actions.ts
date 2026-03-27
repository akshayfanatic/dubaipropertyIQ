'use server';
/**
 * Storage Actions
 * Server actions for file upload to Supabase Storage
 */

import { adminClient } from '@/lib/supabase/admin';
import { UploadResponse } from '@/types/storage';
import { validateFile, DEFAULT_IMAGE_VALIDATION } from '@/lib/validations/storage';
import { randomUUID } from 'crypto';

/**
 * Upload an image to Supabase Storage
 */
export async function uploadImage(file: File, bucket: string, folder?: string): Promise<UploadResponse> {
  try {
    // Validate file
    const validation = validateFile(
      {
        type: file.type,
        size: file.size,
        name: file.name,
      },
      DEFAULT_IMAGE_VALIDATION,
    );

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Generate unique file path
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${randomUUID()}.${fileExtension}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const supabase = adminClient();
    const { error } = await supabase.storage.from(bucket).upload(filePath, fileData, {
      contentType: file.type,
      upsert: false,
    });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Upload exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(bucket: string, path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = adminClient();
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
}
