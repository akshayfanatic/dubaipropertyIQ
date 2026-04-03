'use server';
/**
 * Area Actions
 * Write operations for areas (Create, Update, Delete)
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Area } from '@/types/areas';
import { AreaInsertData, AreaUpdateData, AreaFAQInsertData, AreaAmenityFAQInsertData } from '@/lib/validations/area';

import { revalidatePath } from 'next/cache';

/**
 * Area insert type (for creating new areas)
 */
export type AreaInsert = AreaInsertData;

/**
 * Area update type (for partial updates)
 */
export type AreaUpdate = AreaUpdateData;

/**
 * Create a new area
 */
export async function createArea(area: AreaInsert) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas').insert(area).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/areas');
    revalidatePath('/dashboard/admin/properties');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Area created successfully',
      data: data as Area,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create area';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update an existing area
 */
export async function updateArea(id: string, updates: AreaUpdate) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas').update(updates).eq('id', id).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Area not found',
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
    revalidatePath('/dashboard/admin/areas');
    revalidatePath('/dashboard/admin/properties');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area updated successfully',
      data: data as Area,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update area';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete an area
 */
export async function deleteArea(id: string) {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('areas').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/areas');
    revalidatePath('/dashboard/admin/properties');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete area';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update area amenities (replace all)
 */
export async function updateAreaAmenities(areaId: string, amenityIds: string[]) {
  try {
    const supabase = adminClient();

    // Delete existing relationships
    const { error: deleteError } = await supabase.from('areas_amenities').delete().eq('area_id', areaId);

    if (deleteError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: deleteError.message,
        error: { code: deleteError.code || 'DELETE_ERROR' },
      });
    }

    // Insert new relationships
    if (amenityIds.length > 0) {
      const relationships = amenityIds.map((amenityId) => ({
        area_id: areaId,
        amenity_id: amenityId,
      }));

      const { error: insertError } = await supabase.from('areas_amenities').insert(relationships);

      if (insertError) {
        return ApiResponse({
          success: false,
          status: HttpStatus.INTERNAL_ERROR,
          message: insertError.message,
          error: { code: insertError.code || 'INSERT_ERROR' },
        });
      }
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/areas');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area amenities updated successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update area amenities';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update area properties (replace all)
 */
export async function updateAreaProperties(areaId: string, propertyIds: string[]) {
  try {
    const supabase = adminClient();

    // Delete existing relationships
    const { error: deleteError } = await supabase.from('areas_properties').delete().eq('area_id', areaId);

    if (deleteError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: deleteError.message,
        error: { code: deleteError.code || 'DELETE_ERROR' },
      });
    }

    // Insert new relationships
    if (propertyIds.length > 0) {
      const relationships = propertyIds.map((propertyId) => ({
        area_id: areaId,
        property_id: propertyId,
      }));

      const { error: insertError } = await supabase.from('areas_properties').insert(relationships);

      if (insertError) {
        return ApiResponse({
          success: false,
          status: HttpStatus.INTERNAL_ERROR,
          message: insertError.message,
          error: { code: insertError.code || 'INSERT_ERROR' },
        });
      }
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/areas');
    revalidatePath('/dashboard/admin/properties');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area properties updated successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update area properties';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Create area FAQ
 */
export async function createAreaFAQ(faq: AreaFAQInsertData) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas_faqs').insert(faq).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/areas');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Area FAQ created successfully',
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create area FAQ';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update area FAQ
 */
export async function updateAreaFAQ(id: string, updates: Partial<AreaFAQInsertData>) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas_faqs').update(updates).eq('id', id).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Area FAQ not found',
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
    revalidatePath('/dashboard/admin/areas');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area FAQ updated successfully',
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update area FAQ';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete area FAQ
 */
export async function deleteAreaFAQ(id: string) {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('areas_faqs').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/areas');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area FAQ deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete area FAQ';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Create area amenities FAQ
 */
export async function createAreaAmenitiesFAQ(faq: AreaAmenityFAQInsertData) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas_amenities_faqs').insert(faq).select().single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'CREATE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/areas');

    return ApiResponse({
      success: true,
      status: HttpStatus.CREATED,
      message: 'Area amenities FAQ created successfully',
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create area amenities FAQ';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update area amenities FAQ
 */
export async function updateAreaAmenitiesFAQ(id: string, updates: Partial<AreaAmenityFAQInsertData>) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas_amenities_faqs').update(updates).eq('id', id).select().single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Area amenities FAQ not found',
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
    revalidatePath('/dashboard/admin/areas');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area amenities FAQ updated successfully',
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update area amenities FAQ';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Delete area amenities FAQ
 */
export async function deleteAreaAmenitiesFAQ(id: string) {
  try {
    const supabase = adminClient();

    const { error } = await supabase.from('areas_amenities_faqs').delete().eq('id', id);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'DELETE_ERROR' },
      });
    }

    // Revalidate cache
    revalidatePath('/dashboard/admin/areas');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area amenities FAQ deleted successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete area amenities FAQ';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
