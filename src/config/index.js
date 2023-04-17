import axios from 'axios';

const api = axios.create({
  baseURL: 'unklab-exam-api.vercel.app'
  // baseURL: 'http://localhost:8080'
  // baseURL: 'https://ed3f-36-85-216-191.ngrok-free.app'
});

export default api;
