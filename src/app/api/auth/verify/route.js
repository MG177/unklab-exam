import { NextResponse } from 'next/server';
import { getTokenFromRequest } from '@/lib/auth/requireAuth';
import { verifyToken } from '@/lib/auth/verifyToken';
import { connectDB } from '@/lib/db/connect';
import { getConfig } from '@/lib/services/exam.service';

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

  const payload = result.payload;

  if (payload.studentId && payload.examId) {
    await connectDB();
    const config = await getConfig(payload.examId);
    payload.isShowScore = Boolean(config.isShowScore);
    payload.isShowAnswer = Boolean(config.isShowAnswer);
    payload.isRandom = Boolean(config.isRandom);
  }

  return NextResponse.json(payload);
}
