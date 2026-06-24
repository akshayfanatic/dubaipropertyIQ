import { NextResponse } from 'next/server';
import { getBlogCategoryOptionsAdmin } from '@/lib/db/blog-categories/queries';

export async function GET() {
  try {
    const response = await getBlogCategoryOptionsAdmin();

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
