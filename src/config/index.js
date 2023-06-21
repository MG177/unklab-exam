import axios from 'axios';

const api = axios.create({
  // baseURL: 'https://unklab-exam-api-nqbkioe7dq-as.a.run.app',
  baseURL: '//localhost:8080',
});

// const storedAccessToken = sessionStorage.getItem('access_token');
// const token = storedAccessToken ? storedAccessToken.replace(/"/g, '') : null;
// console.log(token);

// api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
export default api;
