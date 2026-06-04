import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://kep-unklab-exam-api-nqbkioe7dq-as.a.run.app',
  baseURL: '//localhost:8080', // LOCAL DEV — revert to the prod URL above before committing on Deploy
  // baseURL: 'http://localhost:8080',
  // baseURL: process.env.BACKEND_URI || '//localhost:8080',
});

export default api;
