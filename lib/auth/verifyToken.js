import { verifyJwt } from '@/lib/auth/jwt';

/**
 * NestJS parity: verify JWT and return a filtered student payload, or full
 * admin payload (admin tokens are not filtered in NestJS verifyToken either).
 */
export async function verifyToken(token) {
  if (!token) {
    return {
      error: 'unauthorized',
      status: 401,
      message: 'Invalid or expired token',
    };
  }

  const decoded = await verifyJwt(token);
  if (!decoded) {
    return {
      error: 'unauthorized',
      status: 401,
      message: 'Invalid or expired token',
    };
  }

  if (decoded.studentId) {
    return {
      payload: {
        studentName: decoded.studentName,
        studentId: decoded.studentId,
        examName: decoded.examName,
        examId: decoded.examId,
        role: decoded.role,
        isRandom: decoded.isRandom,
        isShowAnswer: decoded.isShowAnswer,
        isShowScore: decoded.isShowScore,
      },
    };
  }

  return { payload: decoded };
}
