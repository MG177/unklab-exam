import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://unklab-exam-api-nqbkioe7dq-as.a.run.app',
  baseURL: '//localhost:8080',
});

api.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage
  .getItem('access_token')
  .replace(/"/g, '')}`;
export default api;
