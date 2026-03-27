'use server';
/**
 * Property Actions
 * Write operations for properties (Create, Update, Delete)
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { Property, PropertyInsert, PropertyUpdate } from '@/types/property';

/**
 * Create a new property
 */
export async function createProperty(property: PropertyInsert) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('properties').insert(property).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Property created successfully',
      data: data as Property,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create property';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update an existing property
 */
export async function updateProperty(id: string, updates: PropertyUpdate) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('properties').update(updates).eq('id', id).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Property not found',
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

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Property updated successfully',
      data: data as Property,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update property';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete a property
 */
export async function deleteProperty(id: string) {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('properties').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Property deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete property';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Bulk update property status
 */
export async function bulkUpdateStatus(ids: string[], status: Property['status']) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('properties').update({ status }).in('id', ids).select();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'UPDATE_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: `${data.length} properties updated successfully`,
      data: { updated: data.length },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update properties';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Toggle Golden Visa eligibility
 */
export async function toggleGoldenVisa(id: string, eligible: boolean) {
  return updateProperty(id, { golden_visa_eligible: eligible });
}
