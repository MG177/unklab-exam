import axios from "axios";

const api = axios.create({
  // baseURL: 'https://unklab-exam-api.vercel.app'
  // baseURL: "//localhost:8080",
  baseURL: "https://unklab-exam-api-nqbkioe7dq-as.a.run.app/",
});

export default api;
