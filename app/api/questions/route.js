import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { requireAuth } from '@/lib/auth/requireAuth';
import * as questionsService from '@/lib/services/questions.service';

export async function POST(request) {
  const auth = await requireAuth(request, { role: 'admin' });
  if (auth.error) return auth.error;

  await connectDB();

  const body = await request.json();
  const questionName = body.questionName;

  try {
    const result = await questionsService.create(questionName);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  const auth = await requireAuth(request, { role: 'admin' });
  if (auth.error) return auth.error;

  await connectDB();

  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') ?? undefined;
  const limit = searchParams.get('limit') ?? undefined;

  const result = await questionsService.findAll(page, limit);
  return NextResponse.json(result);
}
