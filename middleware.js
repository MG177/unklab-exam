import { NextResponse } from 'next/server';
import {
  AUTH_COOKIE_NAME,
  STUDENT_PATHS,
  ADMIN_PATH_PREFIX,
} from '@/lib/auth/constants';
import { verifyJwt, hasRole } from '@/lib/auth/jwt';

const PUBLIC_PATHS = [
  '/',
  '/api/health',
  '/api/auth/login/student',
  '/api/auth/login/admin',
  '/api/auth/logout',
  '/api/auth/verify',
];

function isPublicPath(pathname) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith('/api/auth/login/')) return true;
  if (pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/image')) return true;
  if (pathname.match(/\.(ico|png|svg|jpg|jpeg|gif|webp)$/)) return true;
  return false;
}

function isStudentPath(pathname) {
  return STUDENT_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isAdminPath(pathname) {
  return (
    pathname === ADMIN_PATH_PREFIX ||
    pathname.startsWith(`${ADMIN_PATH_PREFIX}/`)
  );
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = await verifyJwt(token);

  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAdminPath(pathname)) {
    if (!hasRole(payload, 'admin')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  if (isStudentPath(pathname)) {
    if (!hasRole(payload, 'student')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
