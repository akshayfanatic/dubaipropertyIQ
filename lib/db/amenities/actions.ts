'use server';
/**
 * Amenity Actions
 * Write operations for amenities (Create, Update, Delete)
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Amenity } from '@/types/amenities';
import { AmenityInsertData, AmenityUpdateData } from '@/lib/validations/amenity';

import { revalidatePath } from 'next/cache';

/**
 * Amenity insert type (for creating new amenities)
 */
export type AmenityInsert = AmenityInsertData;

/**
 * Amenity update type (for partial updates)
 */
export type AmenityUpdate = AmenityUpdateData;

/**
 * Create a new amenity
 */
export async function createAmenity(amenity: AmenityInsert) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('amenities').insert(amenity).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/amenities');
    revalidatePath('/dashboard/admin/areas');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Amenity created successfully',
      data: data as Amenity,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create amenity';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update an existing amenity
 */
export async function updateAmenity(id: string, updates: AmenityUpdate) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('amenities').update(updates).eq('id', id).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Amenity not found',
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

    // Revalidate cache
    revalidatePath('/dashboard/admin/amenities');
    revalidatePath('/dashboard/admin/areas');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Amenity updated successfully',
      data: data as Amenity,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update amenity';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete an amenity
 */
export async function deleteAmenity(id: string) {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('amenities').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/amenities');
    revalidatePath('/dashboard/admin/areas');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Amenity deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete amenity';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
