import { requireAuth } from '@/lib/auth/requireAuth';
import { handleServiceError } from '@/lib/http/errors';
import { studentAnswer } from '@/lib/services/student.service';

export async function PATCH(request) {
  const auth = await requireAuth(request, 'student');
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const result = await studentAnswer(auth.payload, body.index, body.answer);
    return Response.json(result);
  } catch (err) {
    return handleServiceError(err);
  }
}
