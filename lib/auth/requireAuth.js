import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth/constants';
import { verifyJwt, hasRole } from '@/lib/auth/jwt';

export function getTokenFromRequest(request) {
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (cookieToken) {
    return cookieToken;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const [type, token] = authHeader.split(' ');
    if (type === 'Bearer' && token) {
      return token;
    }
  }

  return null;
}

export function unauthorizedResponse() {
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}

export function forbiddenResponse() {
  return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
}

/**
 * Parse JWT from cookie or Authorization header.
 * @param {Request} request
 * @param {string | { role?: string, admin?: boolean }} [options] — optional role gate
 * @returns {{ payload: object, token: string } | { error: NextResponse }}
 */
export async function requireAuth(request, options) {
  const token = getTokenFromRequest(request);
  const payload = await verifyJwt(token);

  if (!payload) {
    return { error: unauthorizedResponse() };
  }

  if (options != null) {
    const admin = typeof options === 'object' && options.admin;
    const role = typeof options === 'string' ? options : options.role;

    if (admin && !hasRole(payload, 'admin')) {
      return { error: forbiddenResponse() };
    }
    if (role && !hasRole(payload, role)) {
      return { error: forbiddenResponse() };
    }
  }

  return { payload, token };
}

/**
 * Require authenticated admin (for register and other admin-only routes).
 */
export async function requireAdmin(request) {
  const auth = await requireAuth(request);
  if (auth.error) {
    return auth;
  }

  if (!hasRole(auth.payload, 'admin')) {
    return { error: forbiddenResponse() };
  }

  return auth;
}
