import Sidebar from '../../components/dashboard/Sidebar';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/dashboard/') {
      navigate('/dashboard/exams');
    }
  }, [navigate, location.pathname]);
  return (
    <div className="flex flex-row w-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
}
