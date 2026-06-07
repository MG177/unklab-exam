import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { requireAuth } from '@/lib/auth/requireAuth';
import * as questionsService from '@/lib/services/questions.service';

export async function PUT(request, { params }) {
  const auth = await requireAuth(request, { role: 'admin' });
  if (auth.error) return auth.error;

  await connectDB();

  const { id } = await params;
  const updateQuestionDto = await request.json();

  try {
    const verify = await questionsService.verify(updateQuestionDto.questions);
    if (verify.error != false) {
      updateQuestionDto.isVerified = false;
    } else {
      updateQuestionDto.isVerified = true;
    }
    const save = await questionsService.updateQuestions(id, updateQuestionDto);
    const res = {
      msg: verify,
      questions: save.questions,
    };

    if (res.msg.error != false) {
      return NextResponse.json(res, { status: 400 });
    }

    return NextResponse.json(res);
  } catch (error) {
    if (error instanceof questionsService.QuestionsServiceError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
