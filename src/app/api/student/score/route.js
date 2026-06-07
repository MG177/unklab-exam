import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/requireAuth';
import { handleServiceError } from '@/lib/http/errors';
import { connectDB } from '@/lib/db/connect';
import { countTime, getConfig } from '@/lib/services/exam.service';
import {
  getStudentData,
  getStudentScore,
  extractScore,
} from '@/lib/services/student.service';

function sanitizeQuestionList(questionList, showAnswers) {
  if (!questionList) return [];

  return questionList.map((question) => {
    const sanitized =
      typeof question.toObject === 'function'
        ? question.toObject()
        : { ...question };

    if (!showAnswers) {
      delete sanitized.correctAnswer;
      delete sanitized.questionOrigin;
    }

    return sanitized;
  });
}

export async function GET(request) {
  const auth = await requireAuth(request, 'student');
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const config = await getConfig(auth.payload.examId);

    if (!config.isShowScore) {
      return NextResponse.json(
        { statusCode: 403, message: 'Show score is turned off by admin' },
        { status: 403 }
      );
    }

    const remaining = await countTime(auth.payload.examId);
    if (remaining > 0) {
      return NextResponse.json(
        {
          statusCode: 403,
          code: 'EXAM_NOT_ENDED',
          message: 'Score is not available until the exam ends',
        },
        { status: 403 }
      );
    }

    const data = {
      isShowScore: Boolean(config.isShowScore),
      isShowAnswer: Boolean(config.isShowAnswer),
    };

    const scoreDoc = await getStudentScore(auth.payload);
    if (scoreDoc) {
      data.score = extractScore(scoreDoc.score);
    }

    const { questionList } = await getStudentData(auth.payload);
    if (questionList) {
      data.questionList = sanitizeQuestionList(
        questionList,
        config.isShowAnswer
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return handleServiceError(err);
  }
}
