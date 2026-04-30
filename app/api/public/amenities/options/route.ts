import { NextResponse } from 'next/server';
import { getAmenitiesOptions } from '@/lib/db/amenities/queries';

export async function GET() {
  try {
    const response = await getAmenitiesOptions();

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
