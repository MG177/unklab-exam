import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function getAllLocalData() {
  const localStorageData = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = JSON.parse(localStorage.getItem(key));
    localStorageData[key] = value;
  }

  return localStorageData;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getAllLocalData() || {});

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
