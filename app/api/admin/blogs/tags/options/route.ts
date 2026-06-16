import { NextResponse } from 'next/server';
import { requireRoleApi } from '@/lib/auth/api-guards';
import { getBlogTagOptionsAdmin } from '@/lib/db/blog-tags/queries';

export async function GET() {
  const authError = await requireRoleApi('admin');
  if (authError) return authError;

  try {
    const response = await getBlogTagOptionsAdmin();

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
