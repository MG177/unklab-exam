import { requireAuth } from '@/lib/auth/requireAuth';
import { handleServiceError } from '@/lib/http/errors';
import { studentBookmark } from '@/lib/services/student.service';

export async function PATCH(request) {
  const auth = await requireAuth(request, 'student');
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const result = await studentBookmark(
      auth.payload,
      body.index,
      body.isBookmark
    );
    return Response.json(result);
  } catch (err) {
    return handleServiceError(err);
  }
}
