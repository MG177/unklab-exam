export const AUTH_COOKIE_NAME = 'kep_token';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24, // 24 hours
};

export const STUDENT_PATHS = ['/started', '/exam', '/score', '/waiting'];
export const ADMIN_PATH_PREFIX = '/dashboard';
