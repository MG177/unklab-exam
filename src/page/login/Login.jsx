import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../login/LoginForm';
import AuthContext from '../../contexts/AuthContext';

export default function Login() {
  // const { user } = useContext(AuthContext);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (user) {
  //     navigate('/started');
  //   }
  // }, [user, navigate]);

  return (
    <div
      style={{ userSelect: 'none' }}
      onCopy={(event) => {
        event.preventDefault();
      }}
      className="w-full min-h-screen bg-[url('./image/Background.svg')] bg-cover bg-no-repeat flex justify-center items-center"
    >
      <LoginForm />
    </div>
  );
}
