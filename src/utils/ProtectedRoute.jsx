import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config';
import AuthContext from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('user from protectedRoute = ', user);
      if (typeof user === 'undefined' || user === null) {
        console.log('!!!PROTECTED PAGE!!!');
        console.log('!!!User is undefined!!!');
        setIsAuthenticated(false);
        navigate('/');
      }
      if (Object.keys(user).length === 1) {
        console.log('Getting user info from server...');
        try {
          const authData = await api.post(`auth/verify`);
          const newUser = {
            ...user,
            ...authData.data,
          };
          setUser(newUser);
        } catch (error) {
          console.log(error);
          navigate('/');
        }
      }
      // else {
      //   console.log('!!!PROTECTED PAGE!!!');
      //   console.log('!!!User access_token is undefined!!!');
      //   setIsAuthenticated(false);
      //   navigate('/');
      // }
      console.log('!!!ACCESS GRANTED!!!');
      setIsAuthenticated(true);

      setInterval(() => {
        setLoading(false);
      }, 2 * 1000);
    };

    checkAuth();
  }, [user, navigate]);
  // console.log('user.access_token = ', user);

  return loading ? (
    <div className="flex flex-col w-screen h-screen justify-center items-center">
      <div className="flex justify-center items-center text-center gap-1 scale-150">
        <i className="pi pi-spin pi-spinner h-8 w-8 text-center text-2xl font-bold text-accent1" />
        <div className="text-center">LOADING</div>
      </div>
    </div>
  ) : (
    <>{isAuthenticated ? children : null}</>
  );
}
