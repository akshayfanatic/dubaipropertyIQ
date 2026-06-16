import { NextResponse } from 'next/server';
import { getCityOptionsAdmin } from '@/lib/db/cities/queries';
import { withAdminApi } from '@/lib/auth/api-wrappers';

export const GET = withAdminApi(async () => {
  try {
    const response = await getCityOptionsAdmin();

    if (!response.success) {
      return NextResponse.json({ error: response.message }, { status: response.status });
    }

    return NextResponse.json(response.data);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});
