import { NextResponse } from 'next/server';
import { buildSetCookieHeader } from '@/lib/auth/cookie';
import { signInStudent } from '@/lib/auth/signIn';
import {
  getClientIp,
  isRateLimited,
  loginRateLimitResponse,
} from '@/lib/rate-limit';

export async function POST(request) {
  const ip = getClientIp(request);
  if (isRateLimited(`auth:login:student:${ip}`)) {
    return NextResponse.json(loginRateLimitResponse(), { status: 429 });
  }

  const { studentId, token } = await request.json();
  const result = await signInStudent(studentId, token);

  if (result.error) {
    return NextResponse.json(
      { statusCode: result.status, message: result.message },
      { status: result.status }
    );
  }

  const { access_token, ...profile } = result.body;
  const response = NextResponse.json(profile, { status: result.status });
  response.headers.set('Set-Cookie', buildSetCookieHeader(access_token));
  return response;
}
