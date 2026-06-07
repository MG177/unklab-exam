import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import * as examService from '@/lib/services/exam.service';
import { handleServiceError, requireAuth } from '../../_lib/requireAuth';

export async function PATCH(request, { params }) {
  const auth = await requireAuth(request, { admin: true });
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const result = await examService.updateExamName(id, body.examName);
    return NextResponse.json(result);
  } catch (error) {
    return handleServiceError(error);
  }
}
