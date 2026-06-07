import { requireAuth } from '@/lib/auth/requireAuth';
import { handleServiceError } from '@/lib/http/errors';
import { getStudentQuestion } from '@/lib/services/student.service';

export async function GET(request) {
  const auth = await requireAuth(request, 'student');
  if (auth.error) return auth.error;

  try {
    const questions = await getStudentQuestion(auth.payload);
    return Response.json(questions);
  } catch (err) {
    return handleServiceError(err);
  }
}
