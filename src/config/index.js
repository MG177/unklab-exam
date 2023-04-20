import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://unklab-exam-api.vercel.app'
  baseURL: '//localhost:8080'
});

export default api;
