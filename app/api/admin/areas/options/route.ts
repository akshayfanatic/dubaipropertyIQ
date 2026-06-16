import { NextResponse } from 'next/server';
import { getAreaOptionsAdmin } from '@/lib/db/areas/queries';
import { withAdminApi } from '@/lib/auth/api-wrappers';

export const GET = withAdminApi(async () => {
  const result = await getAreaOptionsAdmin();

  if (!result.success || !result.data) {
    return NextResponse.json({ error: result.message }, { status: result.status });
  }

  return NextResponse.json(result.data);
});
