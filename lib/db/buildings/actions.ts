'use server';
/**
 * Building Actions
 * Write operations for buildings.
 */

import { revalidatePath } from 'next/cache';
import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { buildingInsertSchema, buildingUpdateSchema, type BuildingInsertData, type BuildingUpdateData } from '@/lib/validations/building';
import type { Building } from '@/types/building';

const revalidateBuildingPaths = () => {
  revalidatePath('/dashboard/admin/buildings');
  revalidatePath('/dashboard/admin/areas');
  revalidatePath('/areas');
};

/**
 * Create a new building.
 */
export async function createBuilding(building: BuildingInsertData) {
  try {
    const parsed = buildingInsertSchema.parse(building);
    const supabase = adminClient();

    const { data, error } = await supabase.from('buildings').insert(parsed).select().single();

    if (error) {
      if (error.code === '23505') {
        return ApiResponse({
          success: false,
          status: HttpStatus.BAD_REQUEST,
          message: 'A building with this name or slug already exists in this area',
          error: { code: 'DUPLICATE_BUILDING' },
        });
      }

      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    revalidateBuildingPaths();

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Building created successfully',
      data: data as Building,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create building';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update an existing building.
 */
export async function updateBuilding(id: string, updates: BuildingUpdateData) {
  try {
    const parsed = buildingUpdateSchema.parse(updates);
    const supabase = adminClient();

    const { data, error } = await supabase.from('buildings').update(parsed).eq('id', id).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Building not found',
          error: { code: 'NOT_FOUND' },
        });
      }

      if (error.code === '23505') {
        return ApiResponse({
          success: false,
          status: HttpStatus.BAD_REQUEST,
          message: 'A building with this name or slug already exists in this area',
          error: { code: 'DUPLICATE_BUILDING' },
        });
      }

      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'UPDATE_ERROR' },
      });
    }

    revalidateBuildingPaths();

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Building updated successfully',
      data: data as Building,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update building';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete a building.
 */
export async function deleteBuilding(id: string) {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('buildings').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    revalidateBuildingPaths();

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Building deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete building';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
