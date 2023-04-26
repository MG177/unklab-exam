import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  function getAllLocalStorage() {
    if (!localStorage.length) return null;
    const localStorageData = {};

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = JSON.parse(localStorage.getItem(key));
      localStorageData[key] = value;
    }
    console.log('AuthContext refreshed = ', localStorageData);

    return localStorageData;
  }

  const [user, setUser] = useState(getAllLocalStorage() || null);

  console.log('user from authContext = ', user);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
