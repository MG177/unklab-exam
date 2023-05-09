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

export function getAllLocalData() {
  const localStorageData = {
    access_token: localStorage.getItem('access_token')
      ? localStorage.getItem('access_token').replace(/"/g, '')
      : null,
    examId: localStorage.getItem('examId')
      ? localStorage.getItem('examId').replace(/"/g, '')
      : null,
    examName: localStorage.getItem('examName')
      ? localStorage.getItem('examName').replace(/"/g, '')
      : null,
    noreg: localStorage.getItem('noreg')
      ? localStorage.getItem('noreg').replace(/"/g, '')
      : null,
    studentId: localStorage.getItem('studentId')
      ? localStorage.getItem('studentId').replace(/"/g, '')
      : null,
    username: localStorage.getItem('username')
      ? localStorage.getItem('username').replace(/"/g, '')
      : null,
  };

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
  console.log('localStorageData' + localStorageData);

  return localStorageData;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getAllLocalData() || null);

  useEffect(() => {
    const localStorageData = getAllLocalData();
    if (localStorageData) {
      setUser(localStorageData);
    }
  }, []);

  const value = useMemo(
    () => ({ user, setUser, getAllLocalData }),
    [user, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
