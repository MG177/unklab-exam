import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await localStorage.getItem('studentId');
      if (!user) {
        console.log(user);
        console.log('!!!PROTECTED PAGE!!!');
        setIsAuthenticated(false);
        navigate('/');
      } else {
        console.log('!!!ACCESS GRANTED!!!');
        setIsAuthenticated(true);
      }
      setLoading(false);
    };
    checkAuth();
  }, [user, navigate]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <>{isAuthenticated ? children : null}</>
  );
}
