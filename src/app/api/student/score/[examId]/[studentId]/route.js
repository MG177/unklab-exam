import { requireAuth } from '@/lib/auth/requireAuth';
import { handleServiceError } from '@/lib/http/errors';
import {
  getStudentData,
  getStudentScore,
  extractScore,
} from '@/lib/services/student.service';

export async function GET(request, { params }) {
  const auth = await requireAuth(request, 'admin');
  if (auth.error) return auth.error;

  const { examId, studentId } = await params;

  try {
    const user = { studentId, examId };
    const data = {};

    const scoreDoc = await getStudentScore(user);
    if (scoreDoc) {
      data.score = extractScore(scoreDoc.score);
    }

    const { questionList } = await getStudentData(user);
    if (questionList) {
      data.questionList = questionList;
    }

    return Response.json(data);
  } catch (err) {
    return handleServiceError(err);
  }
}
