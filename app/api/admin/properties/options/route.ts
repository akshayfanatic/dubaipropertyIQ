import { NextResponse } from 'next/server';
import { getPropertyOptionsAdmin } from '@/lib/db/properties/queries';
import { withAdminApi } from '@/lib/auth/api-wrappers';

export const GET = withAdminApi(async () => {
  const result = await getPropertyOptionsAdmin();

  if (!result.success || !result.data) {
    return NextResponse.json({ success: false, message: result.message }, { status: result.status });
  }

  return NextResponse.json({ success: true, data: result.data });
});
