import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  if (isAuthPage(pathname)) return handleAuth(request, token, role);
  if (isProtectedPage(pathname)) return handleProtected(request, token, role);
  return NextResponse.next();
}

function isAuthPage(pathname: string) {
  return pathname.startsWith('/signin') || pathname.startsWith('/signup');
}

function isProtectedPage(pathname: string) {
  return pathname.startsWith('/rw') || pathname.startsWith('/kelurahan');
}

function handleAuth(request: NextRequest, token?: string, role?: string) {
  if (token && role === 'rw') return NextResponse.redirect(new URL('/rw/dashboard', request.url));
  if (token && role === 'kelurahan') return NextResponse.redirect(new URL('/kelurahan/dashboard', request.url));
  return NextResponse.next();
}

function handleProtected(request: NextRequest, token?: string, role?: string) {
  if (!token) return NextResponse.redirect(new URL('/signin', request.url));
  const pathname = request.nextUrl.pathname;
  if (pathname.startsWith('/rw') && role !== 'rw') {
    return role === 'kelurahan' 
      ? NextResponse.redirect(new URL('/kelurahan/dashboard', request.url)) 
      : NextResponse.redirect(new URL('/signin', request.url));
  }
  if (pathname.startsWith('/kelurahan') && role !== 'kelurahan') {
    return role === 'rw' 
      ? NextResponse.redirect(new URL('/rw/dashboard', request.url)) 
      : NextResponse.redirect(new URL('/signin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/rw/:path*',
    '/kelurahan/:path*',
    '/signin',
    '/signup',
  ],
};
