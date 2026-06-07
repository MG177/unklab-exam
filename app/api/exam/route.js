import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import * as examService from '@/lib/services/exam.service';
import { handleServiceError, requireAuth } from './_lib/requireAuth';

export async function GET(request) {
  const auth = await requireAuth(request, { admin: true });
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') ?? undefined;
    const limit = searchParams.get('limit') ?? undefined;
    const result = await examService.findAll(page, limit);
    return NextResponse.json(result);
  } catch (error) {
    return handleServiceError(error);
  }
}
