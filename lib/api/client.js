import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let redirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      if (!redirecting && window.location.pathname !== '/') {
        redirecting = true;
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
