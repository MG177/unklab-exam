import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://unklab-exam-api-nqbkioe7dq-as.a.run.app',
  // baseURL: 'https://localhost:8080',
  baseURL: '//localhost:8080',
});

export default api;
