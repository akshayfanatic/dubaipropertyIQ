import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Role } from '@/lib/auth/roles';

const ROLE_DASHBOARDS: Record<Role, string> = {
  admin: '/dashboard/admin',
  agent: '/dashboard/agent',
  customer: '/customer',
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  // Do not run code between createServerClient and
  // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // IMPORTANT: If you remove getClaims() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // Not logged in → redirect to login for protected routes
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/customer'))) {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  // Logged in → check roles
  if (user) {
    const role = (user.user_role as Role) || 'customer';

    // Redirect logged-in users away from auth pages to their dashboard
    if (pathname.startsWith('/auth/')) {
      url.pathname = ROLE_DASHBOARDS[role];
      return NextResponse.redirect(url);
    }

    // Dispatcher: /dashboard redirects to role-specific dashboard
    if (pathname === '/dashboard') {
      url.pathname = ROLE_DASHBOARDS[role];
      return NextResponse.redirect(url);
    }

    // Admin routes
    if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
      url.pathname = ROLE_DASHBOARDS[role];
      return NextResponse.redirect(url);
    }

    // Customer routes
    if (pathname.startsWith('/customer') && role !== 'customer') {
      url.pathname = ROLE_DASHBOARDS[role];
      return NextResponse.redirect(url);
    }

    // Agent routes
    if (pathname.startsWith('/dashboard/agent') && role !== 'agent') {
      url.pathname = ROLE_DASHBOARDS[role];
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!
  return supabaseResponse;
}
