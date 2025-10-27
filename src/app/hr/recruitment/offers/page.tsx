import { redirect } from 'next/navigation';
import { OffersPageClient } from './page-client';

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
