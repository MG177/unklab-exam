import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { handleServiceError } from '@/lib/http/errors';
import {
  getStudentData,
  getStudentScore,
  extractScore,
} from '@/lib/services/student.service';

export async function GET(request) {
  const auth = await requireAuth(request, 'student');
  if (auth.error) return auth.error;

  if (!auth.payload.isShowScore) {
    return NextResponse.json(
      { statusCode: 403, message: 'Show score is turned off by admin' },
      { status: 403 }
    );
  }

  try {
    const data = {};
    const scoreDoc = await getStudentScore(auth.payload);
    if (scoreDoc) {
      data.score = extractScore(scoreDoc.score);
    }

    const { questionList } = await getStudentData(auth.payload);
    if (questionList) {
      data.questionList = questionList;
    }

    return NextResponse.json(data);
  } catch (err) {
    return handleServiceError(err);
  }
}
