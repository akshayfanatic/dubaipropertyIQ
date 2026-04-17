'use server';
/**
 * Settings Queries
 * Read operations for site settings
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { GroupedSettings, SettingsRecord } from '@/types/settings';

/**
 * Get a single setting value by key
 */
export async function getSetting(key: string): Promise<ApiResponse<unknown>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('site_settings').select('value').eq('key', key).single();

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
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Setting fetched successfully',
      data: data?.value,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch setting';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get all settings as a flat record
 */
export async function getAllSettings(): Promise<ApiResponse<SettingsRecord>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('site_settings').select('key, value');

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    // Convert to record
    const record: SettingsRecord = {};
    for (const setting of data ?? []) {
      record[setting.key] = setting.value;
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Settings fetched successfully',
      data: record,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch settings';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get settings grouped by category
 */
export async function getGroupedSettings(): Promise<ApiResponse<GroupedSettings>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('site_settings').select('key, value, "group"');

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    // Group by category
    const grouped: GroupedSettings = {
      general: {},
      contact: {},
      social: {},
    };

    for (const setting of data ?? []) {
      const group = setting.group as keyof GroupedSettings;
      if (grouped[group]) {
        grouped[group][setting.key] = setting.value;
      }
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Settings fetched successfully',
      data: grouped,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch settings';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get settings by a specific group
 */
export async function getSettingsByGroup(group: string): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('site_settings').select('key, value').eq('group', group);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    // Convert to record
    const record: Record<string, unknown> = {};
    for (const setting of data ?? []) {
      record[setting.key] = setting.value;
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Settings fetched successfully',
      data: record,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch settings';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get all setting definitions with current values
 */
export async function getSettingsWithDefinitions(): Promise<ApiResponse<Array<{ key: string; value: unknown; group: string; label: string; type: string }>>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('site_settings').select('*');

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Settings fetched successfully',
      data: (data ?? []) as Array<{ key: string; value: unknown; group: string; label: string; type: string }>,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch settings';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
