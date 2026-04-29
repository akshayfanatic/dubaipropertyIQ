import { NextResponse } from 'next/server';
import { getPublishedPages } from '@/lib/db/pages/queries';

export async function GET() {
  try {
    const response = await getPublishedPages();

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.status });
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
