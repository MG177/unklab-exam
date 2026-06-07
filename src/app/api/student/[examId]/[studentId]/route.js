import { requireAuth } from '@/lib/auth/requireAuth';
import { handleServiceError } from '@/lib/http/errors';
import { remove } from '@/lib/services/student.service';

export async function DELETE(request, { params }) {
  const auth = await requireAuth(request, 'admin');
  if (auth.error) return auth.error;

  const { examId, studentId } = await params;

  try {
    const result = await remove(studentId, examId);
    return Response.json(result);
  } catch (err) {
    return handleServiceError(err);
  }
}
