import { NextResponse } from 'next/server';
import { getSavedProperties } from '@/lib/db/properties/queries';

export async function GET() {
  try {
    const response = await getSavedProperties();

    if (!response.success) {
      return NextResponse.json(response, { status: response.status });
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ success: false, status: 500, message: 'Internal server error', data: [] }, { status: 500 });
  }
}
