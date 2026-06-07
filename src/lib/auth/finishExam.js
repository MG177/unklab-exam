import { logout } from '@/lib/auth/logout';

/** Fallback when exam session context is unavailable (e.g. legacy navigation). */
export function redirectAfterExamEnd(user, router) {
  if (user?.isShowScore) {
    router.push('/exam');
  } else {
    logout();
  }
}
