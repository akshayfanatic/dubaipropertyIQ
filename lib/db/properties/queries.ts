'use server';
/**
 * Property Queries
 * Read operations for properties
 */

import { adminClient } from '@/lib/supabase/admin';
import { serverClient } from '@/lib/supabase/server';
import { ApiResponse, HttpStatus } from '@/lib/utils/response';
import type { Property, PropertyFilters, PaginatedResult, PropertyListItem, PropertyOption } from '@/types/property';
import type { Amenity } from '@/types/amenities';
import { delay } from '@/lib/utils';
import type { PropertyStatus } from '@/types/enums';

// Type for Supabase join result: properties_amenities → amenities
interface PropertyAmenityWithAmenity {
  amenity: Pick<Amenity, 'id'>;
}

interface RawAmenityJoin {
  amenities: Amenity | Amenity[] | null;
}

type SavedPropertyRow = {
  property: PropertyListItem | PropertyListItem[] | null;
};

/**
 * Search filters for public property search
 */
export interface PropertySearchFilters {
  location?: string; // city slug or property slug
  city_id?: string; // city ID for direct filtering
  q?: string; // text search
  categories?: string; // category ID
  minPrice?: string;
  maxPrice?: string;
  amenities?: string; // comma-separated amenity IDs
  developer_id?: string;
  developer_slug?: string;
  status?: PropertyStatus;
  page?: number;
  pageSize?: number;
  golden_visa_eligible?: boolean | string;
  is_featured?: boolean | string;
}

const normalizeProperty = (data: { properties_amenities?: RawAmenityJoin[] | null } & Record<string, unknown>) => {
  const { properties_amenities, ...rest } = data;
  return {
    ...rest,
    amenities:
      properties_amenities
        ?.map((item) => {
          const a = item.amenities;
          return Array.isArray(a) ? a[0] : a;
        })
        .filter(Boolean) || [],
  } as Property;
};

/**
 * Get properties for public use
 * Uses serverClient - respects RLS, accessible to all users
 */
export async function getProperties(filters?: PropertySearchFilters): Promise<ApiResponse<PaginatedResult<PropertyListItem>>> {
  await delay(2000);
  try {
    const supabase = await serverClient();
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 12;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

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
        is_featured,
        photos,
        features,
        floor_plan,
        location,
        city_id,
        created_at,
        updated_at,
        category:categories!inner (id, name, slug),
        city:cities (id, name, slug),
        developer:developers (id, name, slug, logo_url)
      `,
      { count: 'exact' },
    );

    query = query.eq('status', filters?.status || 'available');

    // Find matching city IDs for location search
    let cityIds: string[] = [];
    if (filters?.location) {
      const { data: cities } = await supabase.from('cities').select('id').or(`slug.ilike.%${filters.location}%,name.ilike.%${filters.location}%`);
      cityIds = cities?.map((c) => c.id) || [];
    }

    // Text search (q parameter) - searches title and description
    if (filters?.q) {
      query = query.or(`title.ilike.%${filters.q}%,description.ilike.%${filters.q}%`);
    }

    // Location filter - matches city OR title/description
    if (filters?.location) {
      if (cityIds.length > 0) {
        query = query.or(`city_id.in.(${cityIds.join(',')}),title.ilike.%${filters.location}%,description.ilike.%${filters.location}%`);
      } else {
        // No cities found, search only title/description
        query = query.or(`title.ilike.%${filters.location}%,description.ilike.%${filters.location}%`);
      }
    }

    // Direct city_id filter (takes precedence over location)
    if (filters?.city_id) {
      query = query.eq('city_id', filters.city_id);
    }

    // Category filter
    if (filters?.categories) {
      query = query.eq('category_id', filters.categories);
    }

    // Price range
    if (filters?.minPrice) {
      query = query.gte('price_aed', Number(filters.minPrice));
    }
    if (filters?.maxPrice) {
      query = query.lte('price_aed', Number(filters.maxPrice));
    }

    // Golden Visa filter
    if (filters?.golden_visa_eligible) {
      query = query.eq('golden_visa_eligible', filters.golden_visa_eligible === true || filters.golden_visa_eligible === 'true');
    }

    // Featured filter
    if (filters?.is_featured !== undefined) {
      query = query.eq('is_featured', filters.is_featured === true || filters.is_featured === 'true');
    }

    // Developer filter
    if (filters?.developer_id) {
      query = query.eq('developer_id', filters.developer_id);
    }

    if (filters?.developer_slug) {
      const { data: dev } = await supabase.from('developers').select('id').eq('slug', filters.developer_slug).single();
      if (dev) {
        query = query.eq('developer_id', dev.id);
      }
    }

    // Amenities filter (requires separate query due to many-to-many)
    let amenityIds: string[] = [];
    if (filters?.amenities) {
      amenityIds = filters.amenities.split(',').filter(Boolean);
    }

    // Apply sorting
    query = query.order('created_at', { ascending: false });

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

    // Filter by amenities if provided (client-side filter for now)
    let filteredData = data as PropertyListItem[];
    if (amenityIds.length > 0) {
      const { data: propertyAmenities } = await supabase.from('properties_amenities').select('property_id, amenity_id').in('amenity_id', amenityIds);

      const propertyIdsWithAmenities = new Set(propertyAmenities?.map((pa) => pa.property_id) || []);
      filteredData = filteredData.filter((property) => propertyIdsWithAmenities.has(property.id));
    }

    const result: PaginatedResult<PropertyListItem> = {
      data: filteredData,
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
    console.error('[searchProperties] Error:', error);
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
 * Get a single property by slug for public display
 * Uses serverClient - respects RLS, accessible to all users
 * Returns property with category, city, and developer details
 */
export async function getPropertyBySlug(slug: string): Promise<ApiResponse<Property | null>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase
      .from('properties')
      .select(
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
          is_featured,
          photos,
          features,
          floor_plan,
          location,
          city_id,
          created_at,
          updated_at,
          properties_amenities ( amenities ( * ) ),
          category:categories!inner (id, name, slug),
          city:cities (id, name, slug, logo_url),
          developer:developers (id, name, slug, logo_url),
          properties_faqs (*)
        `,
      )
      .eq('slug', slug)
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

    return ApiResponse({
      success: true,
      status: HttpStatus.OK,
      message: 'Property fetched successfully',
      data: normalizeProperty(data as unknown as { properties_amenities?: RawAmenityJoin[] | null } & Record<string, unknown>),
    });
  } catch (error) {
    console.error('[getPropertyBySlug] Error:', error);
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
 * Get available properties by city slug for public city pages
 */
export async function getPropertiesByCity(citySlug: string): Promise<ApiResponse<PropertyListItem[]>> {
  try {
    const supabase = await serverClient();

    const { data, error } = await supabase
      .from('properties')
      .select(
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
          is_featured,
          photos,
          features,
          floor_plan,
          location,
          city_id,
          created_at,
          updated_at,
          category:categories (id, name, slug),
          city:cities!inner (id, name, slug),
          developer:developers (id, name, slug, logo_url)
        `,
      )
      .eq('cities.slug', citySlug)
      .order('created_at', { ascending: false });

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
      data: data as PropertyListItem[],
    });
  } catch (error) {
    console.error('[getPropertiesByCity] Error:', error);
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
 * Get available public properties linked to an area through areas_properties.
 */
export async function getPropertiesByArea(areaSlug: string, citySlug?: string): Promise<ApiResponse<PropertyListItem[]>> {
  try {
    const supabase = await serverClient();

    let areaQuery = supabase.from('areas').select('id, cities!inner(slug)').eq('slug', areaSlug);

    if (citySlug) {
      areaQuery = areaQuery.eq('cities.slug', citySlug);
    }

    const { data: area, error: areaError } = await areaQuery.single();

    if (areaError) {
      if (areaError.code === 'PGRST116') {
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
        message: areaError.message,
        error: { code: areaError.code || 'QUERY_ERROR' },
      });
    }

    const { data: linkedProperties, error: linkError } = await supabase.from('areas_properties').select('property_id').eq('area_id', area.id);

    if (linkError) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: linkError.message,
        error: { code: linkError.code || 'QUERY_ERROR' },
      });
    }

    const propertyIds = linkedProperties?.map((item) => item.property_id) ?? [];
    if (propertyIds.length === 0) {
      return ApiResponse({
        success: true,
        status: HttpStatus.OK,
        message: 'Properties fetched successfully',
        data: [],
      });
    }

    const { data, error } = await supabase
      .from('properties')
      .select(
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
          is_featured,
          photos,
          features,
          floor_plan,
          location,
          city_id,
          created_at,
          updated_at,
          category:categories (id, name, slug),
          city:cities (id, name, slug),
          developer:developers (id, name, slug, logo_url)
        `,
      )
      .in('id', propertyIds)
      .eq('status', 'available')
      .order('created_at', { ascending: false });

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
      data: data as PropertyListItem[],
    });
  } catch (error) {
    console.error('[getPropertiesByArea] Error:', error);
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
    is_featured,
    photos,
    features,
    floor_plan,
    location,
    city_id,
    created_at,
    updated_at,
    category:categories!inner (
      id,
      name,
      slug
    ),
    city:cities (id, name, slug)
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
      if (filters.category_id) {
        query = query.eq('category_id', filters.category_id);
      }
      if (filters.category_slug) {
        query = query.eq('categories.slug', filters.category_slug);
      }
      if (filters.city_id) {
        query = query.eq('city_id', filters.city_id);
      }
      if (filters.city_slug) {
        query = query.eq('cities.slug', filters.city_slug);
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
      if (filters.is_featured !== undefined) {
        query = query.eq('is_featured', filters.is_featured);
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
 * Get a single property by ID with amenities and FAQs
 */
export async function getPropertyByIdAdmin(id: string): Promise<ApiResponse<Property | null>> {
  try {
    const supabase = adminClient();

    const { data, error } = await supabase
      .from('properties')
      .select(
        `
        *,
        amenities:properties_amenities (
          amenity:amenities (id)
        ),
        properties_faqs (
          id,
          question,
          answer,
          created_at
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

export async function getSavedProperties(): Promise<ApiResponse<PropertyListItem[]>> {
  try {
    const supabase = await serverClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return ApiResponse({
        success: false,
        status: HttpStatus.FORBIDDEN,
        message: 'Please log in to view saved properties',
        error: { code: 'UNAUTHENTICATED' },
        data: [],
      });
    }

    const { data, error } = await supabase
      .from('customer_saved_properties')
      .select(
        `
          property:properties (
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
            is_featured,
            photos,
            features,
            floor_plan,
            location,
            city_id,
            created_at,
            updated_at,
            category:categories (id, name, slug),
            city:cities (id, name, slug),
            developer:developers (id, name, slug, logo_url)
          )
        `,
      )
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return ApiResponse({
        success: false,
        status: HttpStatus.INTERNAL_ERROR,
        message: error.message,
        error: { code: error.code || 'QUERY_ERROR' },
        data: [],
      });
    }

    const properties = ((data ?? []) as SavedPropertyRow[])
      .map((row) => (Array.isArray(row.property) ? row.property[0] : row.property))
      .filter((property): property is PropertyListItem => Boolean(property));

    return ApiResponse({ success: true, status: HttpStatus.OK, message: 'Saved properties fetched successfully', data: properties });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch saved properties';
    return ApiResponse({
      success: false,
      status: HttpStatus.INTERNAL_ERROR,
      message,
      error: { code: 'INTERNAL_ERROR' },
      data: [],
    });
  }
}
