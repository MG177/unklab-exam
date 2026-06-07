import { NextResponse } from 'next/server';
import { buildSetCookieHeader } from '@/lib/auth/cookie';
import { signInAdmin } from '@/lib/auth/signIn';
import {
  getClientIp,
  isRateLimited,
  loginRateLimitResponse,
} from '@/lib/rate-limit';

export async function POST(request) {
  const ip = getClientIp(request);
  if (isRateLimited(`auth:login:admin:${ip}`)) {
    return NextResponse.json(loginRateLimitResponse(), { status: 429 });
  }

  const { username, password } = await request.json();
  const result = await signInAdmin(username, password);

  if (result.error) {
    return NextResponse.json(
      { statusCode: result.status, message: result.message },
      { status: result.status }
    );
  }

  const admin = result.body.data;
  const response = NextResponse.json(
    {
      userId: admin.userId,
      name: admin.name,
      username: admin.username,
      role: admin.role,
    },
    { status: result.status }
  );
  response.headers.set('Set-Cookie', buildSetCookieHeader(admin.access_token));
  return response;
}
