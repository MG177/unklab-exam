import Sidebar from '@/components/dashboard/Sidebar';
import { requireAdminSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }) {
  const session = await requireAdminSession();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-paper">
      <Sidebar user={session} />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
