'use server';
/**
 * Property Queries
 * Read operations for properties
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { Property, PropertyFilters, PaginatedResult, PropertyListItem, PropertyOption } from '@/types/property';
import type { Amenity } from '@/types/amenities';

// Type for Supabase join result: properties_amenities → amenities
interface PropertyAmenityWithAmenity {
  amenity: Pick<Amenity, 'id'>;
}

/**
 * Get all properties with optional filters and pagination
 */
export async function getPropertiesAdmin(filters?: PropertyFilters) {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Query for data with pagination
    let query = supabase.from('properties').select(
      `
    id,
    slug,
    title,
    description,
    bedrooms,
    bathrooms,
    size_sqft,
    price_aed,
    status,
    golden_visa_eligible,
    photos,
    features,
    floor_plan,
    created_at,
    updated_at,
    category:categories!inner (
      id,
      name,
      slug
    )
  `,
      { count: 'exact' },
    );

    // Apply filters
    if (filters) {
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      if (filters.property_type) {
        query = query.eq('categories.slug', filters.property_type); // Filter by category slug (property_type in URL maps to category.slug)
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.bedrooms !== undefined) {
        query = query.gte('bedrooms', filters.bedrooms);
      }
      if (filters.min_price !== undefined) {
        query = query.gte('price_aed', filters.min_price);
      }
      if (filters.max_price !== undefined) {
        query = query.lte('price_aed', filters.max_price);
      }
      if (filters.min_size !== undefined) {
        query = query.gte('size_sqft', filters.min_size);
      }
      if (filters.max_size !== undefined) {
        query = query.lte('size_sqft', filters.max_size);
      }
      if (filters.golden_visa_eligible !== undefined) {
        query = query.eq('golden_visa_eligible', filters.golden_visa_eligible);
      }
    }

    // Apply sorting
    const sortBy = filters?.sortBy || 'created_at';
    const sortOrder = filters?.sortOrder === 'desc';
    query = query.order(sortBy, { ascending: !sortOrder });

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const result: PaginatedResult<PropertyListItem> = {
      data: data as PropertyListItem[],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Properties fetched successfully',
      data: result,
    });
  } catch (error) {
    console.error('[getPropertiesAdmin] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch properties';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

// type PropertyAmenity=Pick<Property,"amenities">
/**
 * Get a single property by ID with amenities
 */
export async function getPropertyByIdAdmin(id: string): Promise<ApiResponse<Property | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase
      .from('properties')
      .select(
        `
        *,
        category:categories!inner (id, name, slug),
        developer:developers (id, name, logo_url),
 amenities:properties_amenities (
      amenity:amenities (id)
    )
      `,
      )
      .eq('id', id)
      .single();

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
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    // Transform amenities array to extract amenity data from nested join
    const property = {
      ...data,
      amenities: data?.amenities?.map((pa: PropertyAmenityWithAmenity) => pa.amenity).filter(Boolean) || [],
    };

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Property fetched successfully',
      data: property as Property,
    });
  } catch (error) {
    console.error('[getPropertyByIdAdmin] Error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch property';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get Golden Visa eligible properties
 */
export async function getGoldenVisaPropertiesAdmin() {
  return getPropertiesAdmin({
    status: 'available',
    golden_visa_eligible: true,
  });
}

/**
 * Get property options for admin dropdowns
 * Returns properties formatted for select components
 */
export async function getPropertyOptionsAdmin(): Promise<ApiResponse<PropertyOption[]>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('properties').select('id, title').order('title', { ascending: true });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    // Format for select dropdown
    const options: PropertyOption[] = data.map((property) => ({
      label: property.title,
      value: property.id,
    }));

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Property options fetched successfully',
      data: options,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch property options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
