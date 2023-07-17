import axios from 'axios';

const api = axios.create({
  baseURL: 'https://kep-unklab-exam-api-x5rigwkaha-as.a.run.app',
  // baseURL: '//localhost:8080',
});

export default api;
