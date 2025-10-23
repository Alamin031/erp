import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { ActivitiesPageClient } from "./page-client";

export default async function ActivitiesPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const userRole = (session.user as any).role;
  const allowedRoles = ['super_admin'];
  if (!allowedRoles.includes(userRole)) redirect('/unauthorized');

  return (
    <DashboardLayout>
      <ActivitiesPageClient />
    </DashboardLayout>
  );
}
