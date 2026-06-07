import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME } from '@/lib/auth/constants';
import { verifyJwt, hasRole } from '@/lib/auth/jwt';

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyJwt(token);
}

export async function requireAdminSession() {
  const payload = await getSession();
  if (!payload || !hasRole(payload, 'admin')) {
    redirect('/');
  }
  return payload;
}
