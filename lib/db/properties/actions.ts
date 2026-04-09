'use server';
/**
 * Property Actions
 * Write operations for properties (Create, Update, Delete)
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { PropertyInsertData } from '@/lib/validations/property';
import type { Property, PropertyUpdate } from '@/types/property';

/**
 * Create a new property
 */
export async function createProperty(property: PropertyInsertData) {
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
 * Update property amenities (junction table)
 * Deletes existing relationships and inserts new ones
 */
export async function updatePropertyAmenities(propertyId: string, amenityIds: string[]) {
  try {
    const supabase = adminClient();

    // Delete existing relationships
    const { error: deleteError } = await supabase.from('properties_amenities').delete().eq('property_id', propertyId);

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
        property_id: propertyId,
        amenity_id: amenityId,
      }));

      const { error: insertError } = await supabase.from('properties_amenities').insert(relationships);

      if (insertError) {
        return ApiResponse({
          success: false,
          status: HttpStatus.INTERNAL_ERROR,
          message: insertError.message,
          error: { code: insertError.code || 'INSERT_ERROR' },
        });
      }
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Property amenities updated successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update property amenities';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
