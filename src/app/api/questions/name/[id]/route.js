import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { requireAuth } from '@/lib/auth/requireAuth';
import * as questionsService from '@/lib/services/questions.service';

export async function PATCH(request, { params }) {
  const auth = await requireAuth(request, { role: 'admin' });
  if (auth.error) return auth.error;

  await connectDB();

  const { id } = await params;
  const body = await request.json();

  try {
    const result = await questionsService.updateQuestionName(
      id,
      body.questionName
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
