import { NextResponse } from 'next/server';
import { requireRoleApi } from '@/lib/auth/api-guards';
import { getBlogCategoryOptionsAdmin } from '@/lib/db/blog-categories/queries';

export async function GET() {
  const authError = await requireRoleApi('admin');
  if (authError) return authError;

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
