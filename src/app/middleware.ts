import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const loggedIn = req.cookies.get('accessToken');

  if (!loggedIn && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
