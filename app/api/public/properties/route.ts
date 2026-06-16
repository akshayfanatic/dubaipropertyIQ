import { NextRequest, NextResponse } from 'next/server';
import { getProperties } from '@/lib/db/properties/queries';
import type { PropertySearchFilters } from '@/lib/db/properties/queries';
import { parsePropertyStatus } from '@/types/enums';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: PropertySearchFilters = {
      city_id: searchParams.get('city_id') || undefined,
      categories: searchParams.get('categories') || undefined,
      location: searchParams.get('location') || undefined,
      q: searchParams.get('q') || undefined,
      bedrooms: searchParams.get('bedrooms') || undefined,
      status: parsePropertyStatus(searchParams.get('status')),
      sort: searchParams.get('sort') || undefined,
      areas: searchParams.get('areas') || undefined,
      minPrice: searchParams.get('minPrice') || undefined,
      maxPrice: searchParams.get('maxPrice') || undefined,
      amenities: searchParams.get('amenities') || undefined,
      developer_id: searchParams.get('developer_id') || undefined,
      golden_visa_eligible: searchParams.get('golden_visa_eligible') || undefined,
      is_featured: searchParams.get('is_featured') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      pageSize: searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : 12,
    };

    const response = await getProperties(filters);

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.status });
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
