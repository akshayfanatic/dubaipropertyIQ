import { NextResponse } from 'next/server';
import { withAdminApi } from '@/lib/auth/api-wrappers';
import { getBlogCategoryOptionsAdmin } from '@/lib/db/blog-categories/queries';

export const GET = withAdminApi(async () => {
  try {
    const response = await getBlogCategoryOptionsAdmin();

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
