import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin authorization check
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login?error=UnauthorizedAdmin', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Require auth for /account and /admin
        if (path.startsWith('/account') || path.startsWith('/admin')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/account/:path*', '/admin/:path*'],
};
