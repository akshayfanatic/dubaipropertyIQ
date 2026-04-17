'use server';
/**
 * Settings Actions
 * Write operations for site settings
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { revalidatePath } from 'next/cache';

/**
 * Update a single setting by key
 */
export async function updateSetting(key: string, value: unknown): Promise<ApiResponse<null>> {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key);

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: `Setting '${key}' not found`,
          error: { code: 'NOT_FOUND' },
        });
      }
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'UPDATE_ERROR' },
      });
    }

    // Revalidate all paths that might use settings
    revalidatePath('/');
    revalidatePath('/dashboard/admin/settings');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Setting updated successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update setting';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Bulk update multiple settings
 */
export async function updateSettings(settings: Record<string, unknown>): Promise<ApiResponse<null>> {
  try {
    const supabase = adminClient();

    // Update each setting
    const updates = Object.entries(settings).map(([key, value]) => supabase.from('site_settings').update({ value, updated_at: new Date().toISOString() }).eq('key', key));

    const results = await Promise.all(updates);

    // Check for errors
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.error) {
        return ApiResponse({
          success: false,
          status: HttpStatus.INTERNAL_ERROR,
          message: `Failed to update setting '${Object.keys(settings)[i]}': ${result.error.message}`,
          error: { code: result.error.code || 'UPDATE_ERROR' },
        });
      }
    }

    // Revalidate all paths that might use settings
    revalidatePath('/');
    revalidatePath('/dashboard/admin/settings');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Settings updated successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update settings';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Initialize default settings (run once)
 * This is idempotent - uses ON CONFLICT DO NOTHING
 */
export async function initializeDefaults(): Promise<ApiResponse<null>> {
  try {
    const supabase = adminClient();

    const defaults = [
      // General
      { key: 'site_name', value: 'Dubai Property IQ', group: 'general', label: 'Site Name', type: 'text' },
      { key: 'logo_url', value: '/logo.png', group: 'general', label: 'Logo URL', type: 'url' },
      // Contact
      { key: 'email', value: 'info@dubaipropertyiq.com', group: 'contact', label: 'Email Address', type: 'email' },
      { key: 'phone', value: '+971 4 123 4567', group: 'contact', label: 'Phone Number', type: 'tel' },
      { key: 'whatsapp', value: '+971 50 123 4567', group: 'contact', label: 'WhatsApp Number', type: 'tel' },
      { key: 'address', value: 'Dubai Marina, Dubai, UAE', group: 'contact', label: 'Address', type: 'textarea' },
      // Social
      { key: 'facebook', value: 'https://facebook.com', group: 'social', label: 'Facebook URL', type: 'url' },
      { key: 'instagram', value: 'https://instagram.com', group: 'social', label: 'Instagram URL', type: 'url' },
      { key: 'linkedin', value: 'https://linkedin.com', group: 'social', label: 'LinkedIn URL', type: 'url' },
      { key: 'twitter', value: 'https://twitter.com', group: 'social', label: 'Twitter/X URL', type: 'url' },
    ];

    // Insert with conflict resolution (do nothing if key exists)
    const { error } = await supabase.from('site_settings').insert(defaults);

    if (error && error.code !== '23505') {
      // Ignore unique constraint violations
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'INSERT_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Default settings initialized',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to initialize settings';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
