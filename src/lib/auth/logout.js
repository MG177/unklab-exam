import api from '@/lib/api/client';

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch {
    // still clear local state on failure
  }
  if (typeof window !== 'undefined') {
    sessionStorage.clear();
    window.location.href = '/';
  }
}
