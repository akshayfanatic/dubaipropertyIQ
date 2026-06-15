'use server';
/**
 * Building Queries
 * Read operations for buildings.
 */

import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import { normalizeBuildingWithRelations } from '@/lib/utils/buildings';
import { withBuildingAmenityLabels } from '@/lib/utils/building-report';
import type { BuildingFilters, BuildingOption, BuildingWithRelations } from '@/types/building';
import type { PaginatedResult } from '@/types/shared';

/**
 * Get buildings with optional admin filters and pagination.
 */
export async function getBuildingsAdmin(filters?: BuildingFilters): Promise<ApiResponse<PaginatedResult<BuildingWithRelations>>> {
  try {
    const supabase = adminClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('buildings')
      .select('*, area:areas(id, name, slug), city:cities(id, name, slug, logo_url), developer:developers(id, name, slug, logo_url), buildings_seo(*)', { count: 'exact' });

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
    }

    if (filters?.area_id) {
      query = query.eq('area_id', filters.area_id);
    }

    if (filters?.city_id) {
      query = query.eq('city_id', filters.city_id);
    }

    if (filters?.developer_id) {
      query = query.eq('developer_id', filters.developer_id);
    }

    query = query.order('name', { ascending: true }).range(from, to);

    const { data, error, count } = await query;

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
      message: 'Buildings fetched successfully',
      data: {
        data: (data || []).map((building) => normalizeBuildingWithRelations(building as Record<string, unknown>)),
        total: count || 0,
        page,
        pageSize,
        totalPages: Math.ceil((count || 0) / pageSize),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch buildings';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a single building by ID for admin use.
 */
export async function getBuildingByIdAdmin(id: string): Promise<ApiResponse<BuildingWithRelations | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase
      .from('buildings')
      .select('*, area:areas(id, name, slug), city:cities(id, name, slug, logo_url), developer:developers(id, name, slug, logo_url), buildings_seo(*)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Building not found',
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
      message: 'Building fetched successfully',
      data: normalizeBuildingWithRelations(data as Record<string, unknown>),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch building';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a public building by city, area, and building slug.
 */
export async function getBuildingBySlug(citySlug: string, areaSlug: string, buildingSlug: string): Promise<ApiResponse<BuildingWithRelations | null>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase
      .from('buildings')
      .select('*, area:areas!inner(id, name, slug), city:cities!inner(id, name, slug, logo_url), developer:developers(id, name, slug, logo_url), buildings_seo(*)')
      .eq('slug', buildingSlug)
      .eq('areas.slug', areaSlug)
      .eq('cities.slug', citySlug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return ApiResponse({
          success: false,
          status: HttpStatus.NOT_FOUND,
          message: 'Building not found',
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

    const building = await withBuildingAmenityLabels(normalizeBuildingWithRelations(data as Record<string, unknown>), supabase);

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Building fetched successfully',
      data: building,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch building';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get a public building by building slug only.
 * Used by short programmatic URLs such as /burj-khalifa-review.
 */
export async function getBuildingBySlugOnly(buildingSlug: string): Promise<ApiResponse<BuildingWithRelations | null>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase
      .from('buildings')
      .select('*, area:areas!inner(id, name, slug), city:cities!inner(id, name, slug, logo_url), developer:developers(id, name, slug, logo_url), buildings_seo(*)')
      .eq('slug', buildingSlug)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    if (!data) {
      return ApiResponse({
        success: false,
        status: HttpStatus.NOT_FOUND,
        message: 'Building not found',
        error: { code: 'NOT_FOUND' },
      });
    }

    const building = await withBuildingAmenityLabels(normalizeBuildingWithRelations(data as Record<string, unknown>), supabase);

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Building fetched successfully',
      data: building,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch building';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get public buildings for an area.
 */
export async function getBuildingsByArea(citySlug: string, areaSlug: string): Promise<ApiResponse<BuildingWithRelations[]>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase
      .from('buildings')
      .select('*, area:areas!inner(id, name, slug), city:cities!inner(id, name, slug, logo_url), developer:developers(id, name, slug, logo_url), buildings_seo(*)')
      .eq('areas.slug', areaSlug)
      .eq('cities.slug', citySlug)
      .order('overall_score', { ascending: false, nullsFirst: false })
      .order('name', { ascending: true });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
      });
    }

    const buildings = await Promise.all((data || []).map((building) => withBuildingAmenityLabels(normalizeBuildingWithRelations(building as Record<string, unknown>), supabase)));

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Buildings fetched successfully',
      data: buildings,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch buildings';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}

/**
 * Get building options for admin dropdowns.
 */
export async function getBuildingOptionsAdmin(filters?: Pick<BuildingFilters, 'area_id' | 'city_id'>): Promise<ApiResponse<BuildingOption[]>> {
  try {
    const supabase = adminClient();

    let query = supabase.from('buildings').select('id, name, area_id, city_id').order('name', { ascending: true });

    if (filters?.area_id) {
      query = query.eq('area_id', filters.area_id);
    }

    if (filters?.city_id) {
      query = query.eq('city_id', filters.city_id);
    }

    const { data, error } = await query;

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
      message: 'Building options fetched successfully',
      data: (data || []).map((building) => ({
        label: building.name,
        value: building.id,
        area_id: building.area_id,
        city_id: building.city_id,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch building options';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
    });
  }
}
