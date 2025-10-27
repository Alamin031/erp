import { OffersPageClient } from './page-client';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { DashboardLayout } from '@/app/dashboard-layout';

export default async function OffersPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const userRole = (session.user as any).role;
  const allowed = ['super_admin','hr_manager','recruiter'];
  if (!allowed.includes(userRole)) redirect('/unauthorized');

  return (
    <DashboardLayout>
      <OffersPageClient />
    </DashboardLayout>
  );
}
