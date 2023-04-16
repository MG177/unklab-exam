import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

export default function AuthContextLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
