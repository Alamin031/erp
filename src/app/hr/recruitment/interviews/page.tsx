import { DashboardLayout } from '@/app/dashboard-layout';
import { redirect } from 'next/navigation';
import { InterviewsPageClient } from './page-client';
import { getSession } from '@/lib/auth';

export default async function InterviewsPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const userRole = (session.user as any).role;
  const allowed = ['super_admin','hr_manager','recruiter','interviewer'];
  if (!allowed.includes(userRole)) redirect('/unauthorized');

  return (
    <DashboardLayout>
      <InterviewsPageClient />
    </DashboardLayout>
  );
}
