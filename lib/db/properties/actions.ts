'use server';
/**
 * Property Actions
 * Write operations for properties (Create, Update, Delete)
 */

import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { PropertyInsertData, PropertySEOFormData } from '@/lib/validations/property';
import type { Property, PropertySEO, PropertyUpdate } from '@/types/property';
import type { Location } from '@/types/shared';
import { revalidatePath } from 'next/cache';

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

    revalidatePath(`/admin/properties/${id}`);
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

/**
 * Update property location
 * Updates the location jsonb column for a property
 */
export async function updatePropertyLocation(propertyId: string, location: Location) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('properties').update({ location }).eq('id', propertyId).select().single();

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

    // Revalidate cache
    revalidatePath('/dashboard/admin/properties');
    revalidatePath('/dashboard/admin/properties/[id]');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Property location updated successfully',
      data: data as Property,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update property location';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Save property FAQs (replace all)
 * Deletes all existing FAQs for the property and inserts the new ones
 */
export async function savePropertyFAQs(propertyId: string, faqs: Array<{ question: string; answer: string }>) {
  try {
    const supabase = adminClient();

    // Delete all existing FAQs for this property
    const { error: deleteError } = await supabase.from('properties_faqs').delete().eq('property_id', propertyId);

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
      const faqsWithPropertyId = faqs.map((faq) => ({
        property_id: propertyId,
        question: faq.question,
        answer: faq.answer,
      }));

      const { error: insertError } = await supabase.from('properties_faqs').insert(faqsWithPropertyId);

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
    revalidatePath('/dashboard/admin/properties');
    revalidatePath('/dashboard/admin/properties/[id]');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: `${faqs.length} FAQ(s) saved successfully`,
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save property FAQs';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Save property SEO metadata.
 * Upserts by property_id because each property has one SEO record.
 */
export async function savePropertySEO(propertyId: string, seo: PropertySEOFormData) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase
      .from('properties_seo')
      .upsert(
        {
          property_id: propertyId,
          ...seo,
        },
        { onConflict: 'property_id' },
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

    revalidatePath('/dashboard/admin/properties');
    revalidatePath('/dashboard/admin/properties/[id]');

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Property SEO saved successfully',
      data: data as PropertySEO,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save property SEO';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

export async function toggleSavedProperty(propertyId: string) {
  try {
    const supabase = await serverClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return ApiResponse({
        success: false,
        status: HttpStatus.FORBIDDEN,
        message: 'Please log in to save properties',
        error: { code: 'UNAUTHENTICATED' },
        data: { saved: false },
      });
    }

    const { data: existing, error: existingError } = await supabase.from('customer_saved_properties').select('id').eq('user_id', user.id).eq('property_id', propertyId).maybeSingle();

    if (existingError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: existingError.message,
        error: { code: existingError.code || 'QUERY_ERROR' },
        data: { saved: false },
      });
    }

    if (existing) {
      const { error } = await supabase.from('customer_saved_properties').delete().eq('id', existing.id).eq('user_id', user.id);

      if (error) {
        return ApiResponse({
          success: false,
          status: HttpStatus.INTERNAL_ERROR,
          message: error.message,
          error: { code: error.code || 'DELETE_ERROR' },
          data: { saved: true },
        });
      }

      revalidatePath('/customer');
      return ApiResponse({ success: true, status: HttpStatus.OK, message: 'Property removed from saved properties', data: { saved: false } });
    }

    const { error } = await supabase.from('customer_saved_properties').insert({ user_id: user.id, property_id: propertyId });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'INSERT_ERROR' },
        data: { saved: false },
      });
    }

    revalidatePath('/customer', 'page');
    return ApiResponse({ success: true, status: HttpStatus.OK, message: 'Property added to saved properties', data: { saved: true } });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update saved property';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
      data: { saved: false },
    });
  }
}
