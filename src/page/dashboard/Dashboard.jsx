import { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import { Route, Routes, useParams, Navigate, Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="flex flex-row w-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
}
