import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000'
  // baseURL: 'http://localhost:8080'
  // baseURL: 'https://ed3f-36-85-216-191.ngrok-free.app'
});

export default api;
