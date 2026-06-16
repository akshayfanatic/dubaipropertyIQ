import { NextResponse } from 'next/server';
import { withAdminApi } from '@/lib/auth/api-wrappers';
import { getBlogTagOptionsAdmin } from '@/lib/db/blog-tags/queries';

export const GET = withAdminApi(async () => {
  try {
    const response = await getBlogTagOptionsAdmin();

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
