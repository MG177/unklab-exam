import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/lib/auth/constants';
import { hasRole, verifyJwt } from '@/lib/auth/jwt';
import { HttpError } from '@/lib/services/exam.service';

export async function requireAuth(request, { admin = false } = {}) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = await verifyJwt(token);

  if (!payload) {
    return {
      error: NextResponse.json(
        { statusCode: 401, message: 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  if (admin && !hasRole(payload, 'admin')) {
    return {
      error: NextResponse.json(
        { statusCode: 403, message: 'Forbidden' },
        { status: 403 }
      ),
    };
  }

  return { payload };
}

export function handleServiceError(error) {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { statusCode: error.status, message: error.message },
      { status: error.status }
    );
  }

  if (error?.status) {
    return NextResponse.json(
      { statusCode: error.status, message: error.message },
      { status: error.status }
    );
  }

  return NextResponse.json(
    { statusCode: 500, message: error?.message || 'Internal server error' },
    { status: 500 }
  );
}
