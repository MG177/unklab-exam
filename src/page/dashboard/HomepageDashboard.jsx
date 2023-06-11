import { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import { Route, Routes, useParams, Navigate } from 'react-router-dom';

export default function HomepageDashboard() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div>
        <Routes>
          <Route path="/home" element={<MenuHome />} />
          <Route path="/question" element={<MenuQuestion />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </div>
    </div>
  );
}

function MenuHome() {
  const { menu } = useParams();

  return (
    <div className="bg-green">
      <h1>Menu Home</h1>
      <p>Menu segment value: {menu}</p>
    </div>
  );
}

function MenuQuestion() {
  const { menu } = useParams();

  return (
    <div className="bg-accent1">
      <h1>Menu Question Editor</h1>
      <p>Menu segment value: {menu}</p>
    </div>
  );
}
