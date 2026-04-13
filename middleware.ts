import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const sessionToken = req.cookies.get('authjs.session-token')?.value || req.cookies.get('__Secure-authjs.session-token')?.value;
  const isLoggedIn = !!sessionToken;
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
  const isPublicPage = req.nextUrl.pathname === '/';

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicPage) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sentry-example-page).*)'],
}
