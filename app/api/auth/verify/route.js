import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth/requireAuth';
import { verifyToken } from '@/lib/auth/verifyToken';

export async function POST(request) {
  let token = getTokenFromRequest(request);

  if (!token) {
    try {
      const body = await request.json();
      token = body?.token;
    } catch {
      // AuthContext sends cookie-only POST with no body
    }
  }

  const result = await verifyToken(token);

  if (result.error) {
    return NextResponse.json(
      { statusCode: result.status, message: result.message },
      { status: result.status }
    );
  }

  return NextResponse.json(result.payload);
}
