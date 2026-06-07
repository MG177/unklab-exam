const DEFAULT_FALLBACK = 'Something went wrong. Please try again.';

export function getLoginErrorMessage(error, fallback = DEFAULT_FALLBACK) {
  const data = error?.response?.data;
  if (data?.message) return data.message;

  const status = error?.response?.status;
  if (status === 429) {
    return 'Too many login attempts. Please wait a minute and try again.';
  }
  if (status === 403) {
    return 'This exam is not available right now.';
  }
  if (status === 401 || status === 404) {
    return 'Login failed. Please check your details and try again.';
  }

  return fallback;
}
