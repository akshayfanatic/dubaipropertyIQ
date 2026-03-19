import { NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/error?error=no_code`);
  }

  const supabase = await serverClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/auth/error?error=verification_failed`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
