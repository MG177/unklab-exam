import React, { createContext, useContext, useState, useMemo } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function getAllLocalData() {
  const localStorageData = {};

  localStorageData.access_token = localStorage.getItem('access_token');
  localStorageData.examId = localStorage.getItem('examId');
  localStorageData.examName = localStorage.getItem('examName');
  localStorageData.noreg = localStorage.getItem('noreg');
  localStorageData.studentId = localStorage.getItem('studentId');
  localStorageData.username = localStorage.getItem('username');

  // if localstorage has empty or null value, return null
  for (const key in localStorageData) {
    if (
      localStorageData[key] === null ||
      localStorageData[key] === '' ||
      localStorageData[key] === undefined
    ) {
      return null;
    }
  }

  return localStorageData;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getAllLocalData() || null);

  const value = useMemo(() => ({ user, setUser }), [user, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
