import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import api from '../config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const storedAccessToken = sessionStorage.getItem('access_token');
  const initialUser = storedAccessToken
    ? storedAccessToken.replace(/"/g, '')
    : null;
  const [user, setUser] = useState(initialUser);
  api.defaults.headers.common['Authorization'] = `Bearer ${initialUser}`;

  api.interceptors.response.use(
    (response) => response, // Return the response if it's successful
    (error) => {
      if (error.response && error.response.status === 401) {
        console.log('Token expired'); // Log "failed" when a 401 unauthorized response is received
        navigate('/');
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (storedAccessToken) {
      setUser(storedAccessToken.replace(/"/g, ''));
    } else {
      navigate('/');
    }
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
