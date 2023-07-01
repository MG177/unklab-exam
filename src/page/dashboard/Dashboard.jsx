import Sidebar from '../../components/dashboard/Sidebar';
import { Outlet } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="flex flex-row w-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
}
