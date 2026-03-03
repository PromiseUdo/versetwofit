// ============================================
// src/middleware.ts - PROTECT ROUTES
// ============================================
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;

    const { pathname } = req.nextUrl;

    // Auth-related pages
    const isAuthPage =
      pathname.startsWith('/login') || pathname.startsWith('/register');

    // If user is authenticated and tries to access auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // If user is NOT authenticated and tries to access protected pages
    if (!isAuth && !isAuthPage) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // We handle auth logic manually above
    },
  }
);

// Apply middleware only to these routes
export const config = {
  matcher: [
    /*
      Match all routes except:
      - api/auth (NextAuth routes)
      - static files
      - public assets
    */
    '/((?!api/auth|_next/static|_next/image|favicon.png).*)',
  ],
};
