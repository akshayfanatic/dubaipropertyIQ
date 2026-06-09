'use server';
/**
 * Area Actions
 * Write operations for areas (Create, Update, Delete)
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { Area, AreaSEO } from '@/types/areas';
import { AreaInsertData, AreaSEOFormData, AreaUpdateData } from '@/lib/validations/area';

import { revalidatePath } from 'next/cache';

/**
 * Location coordinates type (matches areas.location jsonb schema)
 */
export type AreaLocationCoords = {
  lat: number;
  lng: number;
};

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
 * Save area SEO metadata.
 * Upserts by area_id because each area has one SEO record.
 */
export async function saveAreaSEO(areaId: string, seo: AreaSEOFormData) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase
      .from('areas_seo')
      .upsert(
        {
          area_id: areaId,
          ...seo,
        },
        { onConflict: 'area_id' },
      )
      .select()
      .single();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'UPSERT_ERROR' },
      });
    }

    revalidatePath('/dashboard/admin/areas');
    revalidatePath('/dashboard/admin/areas/[id]');
    revalidatePath('/areas/[city]/[area]');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area SEO saved successfully',
      data: data as AreaSEO,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save area SEO';
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
 * Save area FAQs (replace all)
 * Deletes all existing FAQs for the area and inserts the new ones
 */
export async function saveAreaFAQs(areaId: string, faqs: Array<{ question: string; answer: string }>) {
  try {
    const supabase = adminClient();

    // Delete all existing FAQs for this area
    const { error: deleteError } = await supabase.from('areas_faqs').delete().eq('area_id', areaId);

    if (deleteError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: deleteError.message,
        error: { code: deleteError.code || 'DELETE_ERROR' },
      });
    }

    // Insert new FAQs
    if (faqs.length > 0) {
      const faqsWithAreaId = faqs.map((faq) => ({
        area_id: areaId,
        question: faq.question,
        answer: faq.answer,
      }));

      const { error: insertError } = await supabase.from('areas_faqs').insert(faqsWithAreaId);

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
      message: `${faqs.length} FAQ(s) saved successfully`,
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save area FAQs';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Save area amenities FAQs (replace all)
 * Deletes all existing amenities FAQs for the area and inserts the new ones
 */
export async function saveAreaAmenitiesFAQs(areaId: string, faqs: Array<{ question: string; answer: string }>) {
  try {
    const supabase = adminClient();

    // Delete all existing amenities FAQs for this area
    const { error: deleteError } = await supabase.from('areas_amenities_faqs').delete().eq('area_id', areaId);

    if (deleteError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: deleteError.message,
        error: { code: deleteError.code || 'DELETE_ERROR' },
      });
    }

    // Insert new FAQs
    if (faqs.length > 0) {
      const faqsWithAreaId = faqs.map((faq) => ({
        area_id: areaId,
        question: faq.question,
        answer: faq.answer,
      }));

      const { error: insertError } = await supabase.from('areas_amenities_faqs').insert(faqsWithAreaId);

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
      message: `${faqs.length} Amenities FAQ(s) saved successfully`,
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save area amenities FAQs';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Update area location
 * Updates the location jsonb column for an area
 */
export async function updateAreaLocation(areaId: string, location: AreaLocationCoords) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('areas').update({ location }).eq('id', areaId).select().single();

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

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Area location updated successfully',
      data: data as Area,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update area location';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
