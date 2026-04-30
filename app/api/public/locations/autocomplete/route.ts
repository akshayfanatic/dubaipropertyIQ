import { NextRequest, NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase/server';
import { PropertyListItem, City } from '@/types';

type PropertyForAutocomplete = Pick<PropertyListItem, 'id' | 'title' | 'slug' | 'city'>;
type CityForAutocomplete = Pick<City, 'id' | 'name' | 'slug'>;

type AutocompleteResult = {
  id: string;
  label: string;
  type: 'property' | 'city';
  slug: string;
  city?: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const supabase = await serverClient();

    // Search properties by title
    const { data: properties } = await supabase.from('properties').select('id, title, slug, city:cities(id, name, slug)').ilike('title', `%${query}%`).eq('status', 'available').limit(5);

    // Search cities by name
    const { data: cities } = await supabase.from('cities').select('id, name, slug').ilike('name', `%${query}%`).limit(5);

    // Combine results with type labels
    const results: AutocompleteResult[] = [
      ...(properties?.map((p: PropertyForAutocomplete) => ({
        id: p.id,
        label: p.title,
        type: 'property' as const,
        slug: p.slug,
        city: p.city?.[0]?.name ?? null,
      })) ?? []),
      ...(cities?.map((c: CityForAutocomplete) => ({
        id: c.id,
        label: c.name,
        type: 'city' as const,
        slug: c.slug,
      })) ?? []),
    ];

    return NextResponse.json({ results });
  } catch (error) {
    console.error('[Location Autocomplete] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
