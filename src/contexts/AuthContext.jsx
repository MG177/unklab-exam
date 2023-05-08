import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function getAllLocalData() {
  const localStorageData = {};

  for (let i = 0; i < localStorage.length; i++) {
    try {
      const key = localStorage.key(i);
      const value = JSON.parse(localStorage.getItem(key));
      localStorageData[key] = value;
    } catch (error) {
      // Handle any errors that occur during parsing or retrieval
      console.error(`Error retrieving data for key "${key}":`, error);

      // Wait for 3 seconds before clearing local storage
      setTimeout(() => {
        localStorage.clear();
        console.log('Local storage cleared.');
      }, 3000);

      break; // Exit the loop after clearing local storage
    }
  }

  return localStorageData;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getAllLocalData() || {});

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
