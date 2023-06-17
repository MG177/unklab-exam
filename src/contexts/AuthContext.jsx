import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    sessionStorage.getItem('access_token').replace(/"/g, '')
  );
  console.log('AuthContext1: ', user);

  useEffect(() => {
    if (sessionStorage.getItem('access_token').replace(/"/g, '')) {
      setUser(sessionStorage.getItem('access_token').replace(/"/g, ''));
    }
  }, []);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
