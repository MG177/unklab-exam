'use client';

import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-row w-screen">
      <Sidebar />
      <div className="flex-1 ml-16">{children}</div>
    </div>
  );
}
