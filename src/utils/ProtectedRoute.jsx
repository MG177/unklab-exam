import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        setIsAuthenticated(false);
        navigate('/');
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, [user, navigate]);

  return isAuthenticated ? children : null;
}
