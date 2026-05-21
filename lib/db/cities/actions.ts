'use server';

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { City, CityInsert, CityUpdate } from '@/types/city';
import { revalidatePath } from 'next/cache';

/**
 * Create a new city
 *
 * @param city - City data to insert (name, slug, description, logo_url)
 * @returns ApiResponse with created city or error
 *
 * @example
 * const result = await createCity({
 *   name: 'Dubai',
 *   slug: 'dubai',
 *   description: 'The largest city in UAE',
 *   logo_url: null
 * });
 */
export async function createCity(city: CityInsert) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('cities').insert(city).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    // Revalidate cities cache
    revalidatePath('/dashboard/admin/cities');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'City created successfully',
      data: data as City,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create city';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update an existing city
 *
 * @param id - City UUID to update
 * @param updates - Partial city data to update
 * @returns ApiResponse with updated city or error
 *
 * @example
 * const result = await updateCity('uuid', {
 *   description: 'Updated description'
 * });
 */
export async function updateCity(id: string, updates: CityUpdate) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('cities').update(updates).eq('id', id).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'City not found',
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

    // Revalidate cities cache
    revalidatePath('/dashboard/admin/cities');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'City updated successfully',
      data: data as City,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update city';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete a city
 */
export async function deleteCity(id: string) {
  try {
    const supabase = adminClient();

    // Delete city
    const { error } = await supabase.from('cities').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    // Revalidate cities cache
    revalidatePath('/dashboard/admin/cities');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'City deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete city';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
