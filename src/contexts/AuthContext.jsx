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
  const [user, setUser] = useState({ access_token: initialUser });
  const [connectionLost, setConnectionLost] = useState(false);

  // Keep the default Authorization header in sync with the current token so a
  // page refresh (token re-hydrated from sessionStorage) stays authenticated.
  useEffect(() => {
    const token = user?.access_token || initialUser;
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [user, initialUser]);

  // Register ONE response interceptor and eject it on cleanup. Previously this
  // ran in the render body, leaking a new interceptor on every render.
  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => {
        setConnectionLost(false);
        return response;
      },
      (error) => {
        if (error.response) {
          // 401 -> session invalid/expired: send back to login.
          if (error.response.status === 401) {
            navigate('/');
          }
        } else {
          // No response object => network / connection failure.
          setConnectionLost(true);
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptorId);
  }, [navigate]);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return (
    <AuthContext.Provider value={value}>
      {connectionLost && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}
          className="bg-[#ff032d] text-white text-center py-2 font-semibold shadow-lg"
        >
          Connection lost — trying to reconnect…
        </div>
      )}
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
