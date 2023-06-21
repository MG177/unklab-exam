import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import api from '../config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const storedAccessToken = sessionStorage.getItem('access_token');
  const initialUser = storedAccessToken
    ? storedAccessToken.replace(/"/g, '')
    : null;
  const [user, setUser] = useState(initialUser);
  api.defaults.headers.common['Authorization'] = `Bearer ${initialUser}`;

  useEffect(() => {
    if (storedAccessToken) {
      setUser(storedAccessToken.replace(/"/g, ''));
    }
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
