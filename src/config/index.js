import axios from 'axios';

// API base URL. Set REACT_APP_BACKEND_URI per environment — CRA bakes REACT_APP_*
// vars in at build time: `.env.development` points at the local API for
// `npm start`; `.env` (and `.env.production`) point at prod for `npm run build`.
// The fallback below keeps a production build working even if the var is unset.
const api = axios.create({
  baseURL:
    process.env.REACT_APP_BACKEND_URI ||
    'https://kep-unklab-exam-api-nqbkioe7dq-as.a.run.app',
});

export default api;
