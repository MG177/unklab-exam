import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';

export default function PageDashboard() {
  return (
    <div className='flex'>
      <Sidebar />
      <div className='container p-4'>
        <h1 className='text-xl font-bold'>Hellow</h1>
      </div>
    </div>
  );
}
