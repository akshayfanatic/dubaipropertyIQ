/**
 * Storage Utilities
 * Helper functions for Supabase Storage operations
 */

/**
 * Extract the file path from a Supabase Storage public URL
 * URL format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
 *
 * @param url - The public URL from Supabase Storage
 * @param bucket - The bucket name to extract path from
 * @returns The file path within the bucket, or null if not a valid Supabase URL
 *
 * @example
 * extractPathFromUrl('https://xxx.supabase.co/storage/v1/object/public/images/properties/photo.jpg', 'images')
 * // Returns: 'properties/photo.jpg'
 */
export function extractPathFromUrl(url: string, bucket: string): string | null {
  if (!url || !bucket) return null;

  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Supabase public URLs follow this pattern:
    // /storage/v1/object/public/{bucket}/{path}
    const publicPrefix = `/storage/v1/object/public/${bucket}/`;

    if (pathname.startsWith(publicPrefix)) {
      // Extract everything after the prefix
      return pathname.slice(publicPrefix.length);
    }

    // Try alternative pattern for some Supabase configurations
    // /storage/v1/object/{bucket}/{path}
    const altPrefix = `/storage/v1/object/${bucket}/`;
    if (pathname.startsWith(altPrefix)) {
      return pathname.slice(altPrefix.length);
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Check if a URL is a valid Supabase Storage URL
 */
export function isSupabaseStorageUrl(url: string): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    return urlObj.pathname.includes('/storage/v1/object/');
  } catch {
    return false;
  }
}
