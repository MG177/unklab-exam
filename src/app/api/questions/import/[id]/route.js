import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { requireAuth } from '@/lib/auth/requireAuth';
import * as questionsService from '@/lib/services/questions.service';

export async function PATCH(request, { params }) {
  const auth = await requireAuth(request, { role: 'admin' });
  if (auth.error) return auth.error;

  await connectDB();

  const { id } = await params;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { message: 'No file uploaded' },
        { status: 400 }
      );
    }

    const result = await questionsService.importQuestion(file, id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof questionsService.QuestionsServiceError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: error.message || 'Bad Request' },
      { status: 400 }
    );
  }
}
