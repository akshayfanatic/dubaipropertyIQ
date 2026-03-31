'use server';
/**
 * Developer Actions
 * Write operations for developers (Create, Update, Delete)
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Developer } from '@/types/developer';
import { revalidatePath } from 'next/cache';

/**
 * Developer insert type
 */
export interface DeveloperInsert {
  name: string;
  slug: string;
  logo_url?: string | null;
  description?: string | null;
  website_url?: string | null;
  delivery_timeliness_score?: number;
  service_charge_score?: number;
  build_quality_score?: number;
  after_sales_score?: number;
  total_projects?: number;
  completed_projects?: number;
  ongoing_projects?: number;
  years_active?: number;
}

/**
 * Developer update type
 */
export type DeveloperUpdate = Partial<DeveloperInsert>;

/**
 * Create a new developer
 */
export async function createDeveloper(developer: DeveloperInsert) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('developers').insert(developer).select().single();

    if (error) {
      // Handle duplicate slug
      if (error.code === '23505') {
        return ApiResponse({
          success: false,
          status: HttpStatus.BAD_REQUEST,
          message: 'A developer with this slug already exists',
          error: { code: 'DUPLICATE_SLUG' },
        });
      }
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/developers');
    revalidatePath('/dashboard/admin/properties');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Developer created successfully',
      data: data as Developer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create developer';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update an existing developer
 */
export async function updateDeveloper(id: string, updates: DeveloperUpdate) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('developers').update(updates).eq('id', id).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Developer not found',
          error: { code: 'NOT_FOUND' },
        });
      }
      // Handle duplicate slug
      if (error.code === '23505') {
        return ApiResponse({
          success: false,
          status: HttpStatus.BAD_REQUEST,
          message: 'A developer with this slug already exists',
          error: { code: 'DUPLICATE_SLUG' },
        });
      }
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'UPDATE_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/developers');
    revalidatePath('/dashboard/admin/properties');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Developer updated successfully',
      data: data as Developer,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update developer';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete a developer
 * Properties assigned to this developer will have developer_id set to null
 */
export async function deleteDeveloper(id: string) {
  try {
    const supabase = adminClient();

    // First, update any properties that reference this developer
    await supabase.from('properties').update({ developer_id: null }).eq('developer_id', id);

    // Delete the developer
    const { error } = await supabase.from('developers').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/developers');
    revalidatePath('/dashboard/admin/properties');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Developer deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete developer';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
