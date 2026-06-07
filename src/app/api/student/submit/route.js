import { requireAuth } from '@/lib/auth/requireAuth';
import { handleServiceError } from '@/lib/http/errors';
import { submitStudent } from '@/lib/services/student.service';

export async function PATCH(request) {
  const auth = await requireAuth(request, 'student');
  if (auth.error) return auth.error;

  try {
    const result = await submitStudent(auth.payload);
    return Response.json(result);
  } catch (err) {
    return handleServiceError(err);
  }
}
