import { NextResponse } from 'next/server';
import { getCategoryOptionsAdmin } from '@/lib/db/categories/queries';
import { withAdminApi } from '@/lib/auth/api-wrappers';

export const GET = withAdminApi(async () => {
  try {
    const response = await getCategoryOptionsAdmin();

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
