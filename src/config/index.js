import axios from 'axios';

const api = axios.create({
  baseURL: '//unklab-exam-api.vercel.app'
});

export default api;
