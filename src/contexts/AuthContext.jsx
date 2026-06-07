'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import api from '@/lib/api/client';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionLost, setConnectionLost] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const response = await api.post('/auth/verify');
        if (!cancelled) {
          setUser(response.data);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const interceptorId = api.interceptors.response.use(
      (response) => {
        setConnectionLost(false);
        return response;
      },
      (error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setUser(null);
          }
        } else {
          setConnectionLost(true);
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptorId);
  }, []);

  const value = useMemo(
    () => ({ user, setUser, loading }),
    [user, loading]
  );

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
