import { getSession } from "@/lib/auth";
import { DashboardLayout } from "@/app/dashboard-layout";
import { redirect } from "next/navigation";
import { CompaniesPageClient } from "./page-client";

export default async function CompaniesPage() {
  const session = await getSession();
  if (!session) redirect('/login');
  const userRole = (session.user as any).role;
  const allowedRoles = ['super_admin'];
  if (!allowedRoles.includes(userRole)) redirect('/unauthorized');

  return (
    <DashboardLayout>
      <CompaniesPageClient />
    </DashboardLayout>
  );
}
