import React from 'react';
import LoginForm from '../login/LoginForm';
export default function Login() {
  return (
    <div className="w-full h-screen bg-[url('./image/Background.svg')] bg-cover bg-no-repeat flex justify-center items-center">
      <LoginForm />
    </div>
  );
}
