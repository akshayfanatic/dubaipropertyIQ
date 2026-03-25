'use server';
/**
 * Property Queries
 * Read operations for properties
 */

import { adminClient } from '@/lib/supabase/admin';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { Property, PropertyFilters } from '@/types/property';

/**
 * Get all properties with optional filters
 */
export async function getPropertiesAdmin(filters?: PropertyFilters) {
  try {
    const supabase = adminClient();
    let query = supabase.from('properties').select('*');

    // Apply filters
    if (filters) {
      // Text search on title and description
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters.property_type) {
        query = query.eq('property_type', filters.property_type);
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

    const { data, error } = await query;

    console.log(data);
    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Properties fetched successfully',
      data: data as Property[],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch properties';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a single property by ID
 */
export async function getPropertyByIdAdmin(id: string) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();

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

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Property fetched successfully',
      data: data as Property,
    });
  } catch (error) {
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
 * Get featured properties (latest available)
 */
export async function getFeaturedPropertiesAdmin(limit: number = 6) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('properties').select('*').eq('status', 'available').order('created_at', { ascending: false }).limit(limit);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Featured properties fetched successfully',
      data: data as Property[],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch featured properties';
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
 * Search properties by text
 */
export async function searchPropertiesAdmin(searchTerm: string, limit: number = 20) {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .eq('status', 'available')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Search results fetched successfully',
      data: data as Property[],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to search properties';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get property count by status
 */
export async function getPropertyStatsAdmin() {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase.from('properties').select('status');

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const stats = {
      total: data.length,
      available: 0,
      sold: 0,
      reserved: 0,
      off_plan: 0,
    };

    data.forEach((item) => {
      if (item.status in stats) {
        stats[item.status as keyof typeof stats]++;
      }
    });

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Property stats fetched successfully',
      data: stats,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch property stats';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
