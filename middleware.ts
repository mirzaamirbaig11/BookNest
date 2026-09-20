import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SESSION_COOKIE = 'booknest_session';

const ADMIN_PREFIX = '/admin';
const USER_ONLY_PREFIXES = ['/profile', '/orders', '/favorites', '/checkout'];

async function readSession(token: string | undefined) {
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: string; role: 'USER' | 'ADMIN'; email: string };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  const needsAdmin = pathname.startsWith(ADMIN_PREFIX);
  const needsUser = USER_ONLY_PREFIXES.some((p) => pathname.startsWith(p));

  if (!needsAdmin && !needsUser) return NextResponse.next();

  const session = await readSession(token);

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (needsAdmin && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/orders/:path*', '/favorites/:path*', '/checkout/:path*'],
};
